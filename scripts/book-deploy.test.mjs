import assert from 'node:assert/strict';
import { once } from 'node:events';
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import test from 'node:test';

// Exercise the real deployment script and Git submodule against local repositories.
// Only the expensive build and external upload are replaced with local stand-ins.
test('book polling publishes new commits, retries failures, and protects Notes', async (t) => {
    const root = mkdtempSync(path.join(tmpdir(), 'book-deploy-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const site = path.join(root, 'site');
    const upstream = path.join(root, 'book');
    const state = path.join(root, 'state');
    const bin = path.join(root, 'bin');
    const bookPath = 'content/building-a-storage-network';
    const marker = path.join(state, 'published-book-revision');
    const env = {
        ...process.env,
        GIT_ALLOW_PROTOCOL: 'file',
        GIT_CONFIG_NOSYSTEM: '1',
        GIT_CONFIG_GLOBAL: '/dev/null',
        GIT_AUTHOR_NAME: 'Deployment Test', GIT_COMMITTER_NAME: 'Deployment Test',
        GIT_AUTHOR_EMAIL: 'test@example.invalid', GIT_COMMITTER_EMAIL: 'test@example.invalid',
        DEPLOY_STATE_DIR: state,
        LOG_DIR: path.join(root, 'logs'),
        BOOK_TEST_ROOT: root,
        BOOK_TEST_FAIL: '',
        PATH: `${bin}:${process.env.PATH}`,
    };
    const git = (cwd, ...args) => {
        const result = spawnSync('git', args, { cwd, env, encoding: 'utf8' });
        assert.equal(result.status, 0, result.stderr);
        return result.stdout.trim();
    };
    for (const directory of [site, upstream, state, bin]) mkdirSync(directory, { recursive: true });
    git(upstream, 'init', '-b', 'main');
    const advanceBook = (label) => {
        writeFileSync(path.join(upstream, 'index.html'), label);
        git(upstream, 'add', 'index.html');
        git(upstream, 'commit', '-m', label);
        return git(upstream, 'rev-parse', 'HEAD');
    };
    const first = advanceBook('First edition');
    git(site, 'init', '-b', 'main');
    git(site, 'submodule', 'add', '-b', 'main', upstream, bookPath);
    mkdirSync(path.join(site, 'scripts'));
    copyFileSync(new URL('./deploy-daily.sh', import.meta.url), path.join(site, 'scripts/deploy-daily.sh'));
    writeFileSync(path.join(site, 'scripts/fetch-notion-notes.mjs'), '// Notes are supplied by this test fixture.\n');
    for (const directory of ['notes', 'notes-md']) {
        mkdirSync(path.join(site, 'public', directory), { recursive: true });
        writeFileSync(path.join(site, 'public', directory, 'existing-note'), 'Keep these notes');
    }
    const notesTimestamp = '{"updatedAt":"2026-09-12T03:00:00Z"}\n';
    for (const file of ['notes-nav.json', 'notes-search.json']) {
        writeFileSync(path.join(site, 'public', file), '{}');
    }
    writeFileSync(path.join(site, 'public/deployment.json'), notesTimestamp);
    git(site, 'add', '.');
    git(site, 'commit', '-m', 'Website with the first book revision');

    const standins = {
        npm: `#!/bin/sh
set -eu
echo build >> "$BOOK_TEST_ROOT/events"
[ "$BOOK_TEST_FAIL" != build ] || exit 1
mkdir -p out
git -C content/building-a-storage-network rev-parse HEAD > out/book-revision
`,
        aws: `#!/bin/sh
set -eu
[ "$1 $2" = 's3 sync' ]
echo upload >> "$BOOK_TEST_ROOT/events"
[ "$BOOK_TEST_FAIL" != upload ] || exit 1
cp "$3/book-revision" "$BOOK_TEST_ROOT/live-revision"
`,
    };
    for (const [name, content] of Object.entries(standins)) {
        const file = path.join(bin, name);
        writeFileSync(file, content);
        chmodSync(file, 0o755);
    }
    const run = (extra = {}, args = ['--book-if-changed']) => spawnSync('bash', ['scripts/deploy-daily.sh', ...args], {
        cwd: site, env: { ...env, ...extra }, encoding: 'utf8', timeout: 20000,
    });
    const successful = (revision) => {
        const result = run();
        assert.equal(result.status, 0, result.stdout + result.stderr);
        assert.equal(readFileSync(marker, 'utf8').trim(), revision);
        assert.equal(readFileSync(path.join(root, 'live-revision'), 'utf8').trim(), revision);
        assert.equal(readFileSync(path.join(site, 'public/deployment.json'), 'utf8'), notesTimestamp);
    };

    successful(first);
    const events = () => readFileSync(path.join(root, 'events'), 'utf8');
    const initialEvents = events();
    const unchanged = run();
    assert.equal(unchanged.status, 0);
    assert.equal(unchanged.stdout + unchanged.stderr, '');
    assert.equal(events(), initialEvents, 'Unchanged book must not rebuild or upload');

    const second = advanceBook('New book without a website commit');
    successful(second);
    assert.equal(git(site, 'rev-parse', `HEAD:${bookPath}`), first, 'Parent pointer deliberately stays old');

    for (const failure of ['build', 'upload']) {
        const previous = readFileSync(marker, 'utf8');
        const revision = advanceBook(`Retry after ${failure} failure`);
        const result = run({ BOOK_TEST_FAIL: failure });
        assert.notEqual(result.status, 0);
        assert.equal(readFileSync(marker, 'utf8'), previous, 'Failed publication must not advance the marker');
        successful(revision);
    }

    const latest = advanceBook('Require preserved Notes');
    renameSync(path.join(site, 'public/notes-md'), path.join(site, 'public/notes-md.saved'));
    const beforeMissingNotes = events();
    assert.notEqual(run().status, 0);
    assert.equal(events(), beforeMissingNotes, 'Missing Notes must stop the full-site sync');
    renameSync(path.join(site, 'public/notes-md.saved'), path.join(site, 'public/notes-md'));
    successful(latest);

    const bookFile = path.join(site, bookPath, 'index.html');
    const original = readFileSync(bookFile, 'utf8');
    writeFileSync(bookFile, 'Uncommitted book edit');
    assert.notEqual(run().status, 0);
    assert.equal(readFileSync(bookFile, 'utf8'), 'Uncommitted book edit');
    writeFileSync(bookFile, original);

    await t.test('the shared Pi lock excludes both polling and nightly jobs', {
        skip: spawnSync('sh', ['-c', 'command -v flock']).status !== 0,
    }, async () => {
        const holder = spawn('flock', [path.join(state, 'deploy.lock'), 'sh', '-c', 'echo ready; cat'], { env });
        const exited = once(holder, 'exit');
        t.after(() => holder.kill());
        await once(holder.stdout, 'data');
        const beforeLock = events();
        assert.equal(run().status, 0);
        const nightly = spawn('bash', ['scripts/deploy-daily.sh'], {
            cwd: site, env: { ...env, NOTION_API_KEY: 'test-only' }, stdio: 'ignore',
        });
        const nightlyExited = once(nightly, 'exit');
        t.after(() => nightly.kill());
        await new Promise((resolve) => setTimeout(resolve, 200));
        assert.equal(nightly.exitCode, null, 'The nightly refresh waits instead of being skipped');
        assert.equal(events(), beforeLock, 'Neither deployment may proceed while the lock is held');
        holder.stdin.end();
        await exited;
        const [status] = await nightlyExited;
        assert.equal(status, 0, 'The nightly refresh runs after the lock is released');
        assert.notEqual(events(), beforeLock);
    });
});
