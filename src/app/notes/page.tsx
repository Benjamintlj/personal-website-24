'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

interface NavNode {
    pageId: string
    title: string
    urlPath: string | null
    children: NavNode[]
}

interface SearchEntry {
    pageId: string
    title: string
    urlPath: string
    text: string
}

function getTerms(query: string): string[] {
    return query.trim().toLowerCase().split(/\s+/).filter(t => t.length > 0)
}

function getExcerpt(text: string, terms: string[]): string {
    const tl = text.toLowerCase()
    for (const term of terms) {
        const idx = tl.indexOf(term)
        if (idx !== -1) {
            const start = Math.max(0, idx - 35)
            const end = Math.min(text.length, idx + term.length + 60)
            return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '')
        }
    }
    return text.slice(0, 90)
}

function scoreEntry(entry: SearchEntry, terms: string[]): number {
    const tl = entry.title.toLowerCase()
    const tx = entry.text.toLowerCase()
    let score = 0
    for (const t of terms) {
        if (tl.includes(t)) score += 10
    }
    // bonus when every term hits the title
    if (terms.every(t => tl.includes(t))) score += 15
    for (const t of terms) {
        let idx = 0, count = 0
        while ((idx = tx.indexOf(t, idx)) !== -1) { count++; idx += t.length }
        score += Math.min(count, 5)
    }
    return score
}

function highlightTerms(text: string, terms: string[]): React.ReactNode {
    if (terms.length === 0) return text
    const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
    return parts.map((part, i) =>
        terms.includes(part.toLowerCase())
            ? <mark key={i} className="bg-transparent font-semibold text-white">{part}</mark>
            : part
    )
}

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}

function DocIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-neutral-500">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    )
}

function FolderIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-neutral-500">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
    )
}

function MenuIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    )
}

function isAncestorOf(node: NavNode, targetPageId: string): boolean {
    if (node.pageId === targetPageId) return true
    return node.children.some(c => isAncestorOf(c, targetPageId))
}

function findInTree(node: NavNode, pageId: string): NavNode | null {
    if (node.pageId === pageId) return node
    for (const child of node.children) {
        const found = findInTree(child, pageId)
        if (found) return found
    }
    return null
}

function NavItem({
    node,
    depth,
    activePageId,
    onSelect,
}: {
    node: NavNode
    depth: number
    activePageId: string
    onSelect: (node: NavNode) => void
}) {
    const isActive = node.pageId === activePageId
    const hasChildren = node.children.length > 0
    const [open, setOpen] = useState(() => isAncestorOf(node, activePageId))

    const paddingLeft = depth === 0 ? 16 : 16 + depth * 16

    if (!hasChildren) {
        return (
            <button
                onClick={() => node.urlPath && onSelect(node)}
                className={`w-full flex items-center gap-2.5 py-1.5 pr-3 text-sm rounded-md transition-colors text-left ${
                    isActive
                        ? 'bg-neutral-700 text-white font-medium'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                style={{ paddingLeft }}
            >
                <DocIcon />
                <span className="truncate">{node.title}</span>
            </button>
        )
    }

    return (
        <div>
            <div
                className={`flex items-center gap-2.5 py-1.5 pr-1 text-sm rounded-md transition-colors ${
                    isActive
                        ? 'bg-neutral-700 text-white font-medium'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                style={{ paddingLeft }}
            >
                <button
                    onClick={() => node.urlPath && onSelect(node)}
                    className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                >
                    <FolderIcon />
                    <span className="truncate">{node.title}</span>
                </button>
                <button
                    onClick={() => setOpen(o => !o)}
                    className="flex-shrink-0 p-1.5 rounded hover:bg-neutral-700 transition-colors"
                    aria-label={open ? 'Collapse' : 'Expand'}
                >
                    <ChevronIcon className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
                </button>
            </div>
            {open && (
                <div>
                    {node.children.map(child => (
                        <NavItem
                            key={child.pageId}
                            node={child}
                            depth={depth + 1}
                            activePageId={activePageId}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

interface PageEntry {
    pageId: string | null
    title: string
    urlPath: string | null
}

interface Tab {
    id: string
    history: PageEntry[]
    historyIndex: number
}

function currentPage(tab: Tab): PageEntry {
    return tab.history[tab.historyIndex]
}

let tabCounter = 1

export default function NotesPage() {
    const [navTree, setNavTree] = useState<NavNode | null>(null)
    const [tabs, setTabs] = useState<Tab[]>([{
        id: 'tab-1',
        history: [{ pageId: null, title: 'Loading…', urlPath: null }],
        historyIndex: 0,
    }])
    const [activeTabId, setActiveTabId] = useState('tab-1')
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [darkMode, setDarkMode] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchIndex, setSearchIndex] = useState<SearchEntry[]>([])

    useEffect(() => {
        fetch('/notes-nav.json')
            .then(r => r.json())
            .then((tree: NavNode) => {
                setNavTree(tree)
                const params = new URLSearchParams(window.location.search)
                const pageId = params.get('page')
                const target = pageId ? findInTree(tree, pageId) : null
                const initialPage = target
                    ? { pageId: target.pageId, title: target.title, urlPath: target.urlPath }
                    : { pageId: tree.pageId, title: tree.title, urlPath: tree.urlPath }
                setTabs(prev => prev.map((t, i) =>
                    i === 0 ? { ...t, history: [initialPage], historyIndex: 0 } : t
                ))
            })
            .catch(console.error)
        fetch('/notes-search.json')
            .then(r => r.json())
            .then(setSearchIndex)
            .catch(console.error)
    }, [])

    const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map())

    const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0]
    const activePage = activeTab ? currentPage(activeTab) : null
    const canGoBack = !!activeTab && activeTab.historyIndex > 0
    const canGoForward = !!activeTab && activeTab.historyIndex < activeTab.history.length - 1

    const searchResults = useMemo(() => {
        const terms = getTerms(searchQuery)
        if (terms.length === 0 || searchQuery.trim().length < 2) return []
        return searchIndex
            .filter(e => {
                const tl = e.title.toLowerCase()
                const tx = e.text.toLowerCase()
                return terms.every(t => tl.includes(t) || tx.includes(t))
            })
            .map(e => ({ e, score: scoreEntry(e, terms) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(({ e }) => e)
    }, [searchQuery, searchIndex])

    useEffect(() => {
        if (activePage?.pageId) {
            window.history.replaceState(null, '', `/notes?page=${activePage.pageId}`)
        }
    }, [activePage?.pageId])

    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

    const copyMarkdown = async () => {
        const pageId = activePage?.pageId
        if (!pageId) return
        try {
            const res = await fetch(`/notes-md/${pageId}.md`)
            if (!res.ok) throw new Error('not found')
            const md = await res.text()
            await navigator.clipboard.writeText(md)
            setCopyStatus('copied')
        } catch {
            setCopyStatus('error')
        } finally {
            setTimeout(() => setCopyStatus('idle'), 2000)
        }
    }

    const toggleDarkMode = () => setDarkMode(d => !d)

    const handleSelect = (node: { pageId: string; title: string; urlPath: string | null }) => {
        setTabs(prev => prev.map(t => {
            if (t.id !== activeTabId) return t
            const newHistory = t.history.slice(0, t.historyIndex + 1).concat({
                pageId: node.pageId, title: node.title, urlPath: node.urlPath,
            })
            return { ...t, history: newHistory, historyIndex: newHistory.length - 1 }
        }))
    }

    const goBack = () => setTabs(prev => prev.map(t =>
        t.id === activeTabId && t.historyIndex > 0
            ? { ...t, historyIndex: t.historyIndex - 1 } : t
    ))

    const goForward = () => setTabs(prev => prev.map(t =>
        t.id === activeTabId && t.historyIndex < t.history.length - 1
            ? { ...t, historyIndex: t.historyIndex + 1 } : t
    ))

    const handleIframeLoad = (tabId: string) => {
        const iframe = iframeRefs.current.get(tabId)
        if (!iframe) return
        try {
            const pathname = iframe.contentWindow?.location.pathname
            if (!pathname) return
            setTabs(prev => {
                const tab = prev.find(t => t.id === tabId)
                if (!tab) return prev
                const current = currentPage(tab)
                // If the pathname matches our expected URL this was a programmatic nav — no action needed
                if (decodeURIComponent(current.urlPath ?? '') === decodeURIComponent(pathname)) return prev
                const title = iframe.contentDocument?.title ?? 'Untitled'
                const pageIdMatch = pathname.match(/([a-f0-9]{32})\.html$/i)
                const pageId = pageIdMatch?.[1]?.toLowerCase() ?? null
                const newHistory = tab.history.slice(0, tab.historyIndex + 1).concat({ pageId, title, urlPath: pathname })
                return prev.map(t => t.id === tabId ? { ...t, history: newHistory, historyIndex: newHistory.length - 1 } : t)
            })
        } catch { /* cross-origin or restricted — ignore */ }
    }

    const openNewTab = (page?: PageEntry) => {
        const id = `tab-${++tabCounter}`
        const entry = page ?? (navTree
            ? { pageId: navTree.pageId, title: navTree.title, urlPath: navTree.urlPath }
            : { pageId: null, title: 'New tab', urlPath: null })
        setTabs(prev => [...prev, { id, history: [entry], historyIndex: 0 }])
        setActiveTabId(id)
    }

    const closeTab = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setTabs(prev => {
            if (prev.length === 1) return prev
            const next = prev.filter(t => t.id !== id)
            if (activeTabId === id) {
                const idx = prev.findIndex(t => t.id === id)
                setActiveTabId((prev[idx + 1] ?? prev[idx - 1]).id)
            }
            return next
        })
    }

    return (
        <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`flex flex-col border-r border-neutral-800 bg-neutral-900 transition-all duration-200 overflow-hidden flex-shrink-0 ${
                    sidebarOpen ? 'w-64' : 'w-0'
                }`}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 flex-shrink-0">
                    <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Notes</span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-neutral-500 hover:text-white transition-colors p-1 rounded"
                        aria-label="Close sidebar"
                    >
                        <MenuIcon />
                    </button>
                </div>

                {/* Search bar */}
                <div className="px-2 py-2 border-b border-neutral-800 flex-shrink-0">
                    <div className="relative flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 text-neutral-500 pointer-events-none flex-shrink-0">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search notes…"
                            className="w-full bg-neutral-800 text-neutral-200 placeholder-neutral-500 text-sm rounded-md pl-8 pr-7 py-1.5 outline-none focus:ring-1 focus:ring-neutral-600"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2 text-neutral-500 hover:text-white"
                                aria-label="Clear search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Search results or nav tree */}
                {searchQuery.trim().length >= 2 ? (
                    <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                        {searchResults.length === 0 ? (
                            <p className="text-neutral-600 text-xs px-3 py-3">No results for &ldquo;{searchQuery}&rdquo;</p>
                        ) : searchResults.map(entry => {
                            const terms = getTerms(searchQuery)
                            const titleHit = terms.some(t => entry.title.toLowerCase().includes(t))
                            const excerpt = getExcerpt(entry.text, terms)
                            return (
                                <button
                                    key={entry.pageId}
                                    onClick={() => {
                                        handleSelect(entry as unknown as NavNode)
                                        setSearchQuery('')
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors"
                                >
                                    <p className="text-sm text-neutral-200 truncate">
                                        {titleHit ? highlightTerms(entry.title, terms) : entry.title}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                                        {highlightTerms(excerpt, terms)}
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-0.5">
                        {navTree && (
                            <>
                                {/* Root node as home link */}
                                <button
                                    onClick={() => handleSelect(navTree)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors text-left ${
                                        activePage?.pageId === navTree.pageId
                                            ? 'bg-neutral-700 text-white'
                                            : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    <span className="truncate">{navTree.title}</span>
                                </button>

                                <div className="h-px bg-neutral-800 my-1.5 mx-1" />

                                {navTree.children.map(child => (
                                    <NavItem
                                        key={child.pageId}
                                        node={child}
                                        depth={0}
                                        activePageId={activePage?.pageId ?? ''}
                                        onSelect={handleSelect}
                                    />
                                ))}
                            </>
                        )}
                        {!navTree && (
                            <p className="text-neutral-600 text-xs px-3 py-2">Loading…</p>
                        )}
                    </nav>
                )}

                {/* Sidebar footer */}
                <div className="border-t border-neutral-800 p-2 flex-shrink-0 space-y-0.5">
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                                <circle cx="12" cy="12" r="5"/>
                                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                        )}
                        <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
                    </button>
                    <a
                        href="/"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                            <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/>
                        </svg>
                        <span>Ben Lewis-Jones</span>
                    </a>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Tabs bar */}
                <div className="flex items-center border-b border-neutral-800 bg-neutral-900 flex-shrink-0 overflow-x-auto hide-scrollbar">
                    {/* Controls pinned left */}
                    <div className="flex items-center gap-0.5 px-2 flex-shrink-0">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="text-neutral-500 hover:text-white transition-colors p-1.5 rounded"
                                aria-label="Open sidebar"
                            >
                                <MenuIcon />
                            </button>
                        )}
                        <button
                            onClick={goBack}
                            disabled={!canGoBack}
                            className="p-1.5 rounded transition-colors disabled:opacity-25 disabled:cursor-default text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:hover:bg-transparent"
                            aria-label="Go back"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6"/>
                            </svg>
                        </button>
                        <button
                            onClick={goForward}
                            disabled={!canGoForward}
                            className="p-1.5 rounded transition-colors disabled:opacity-25 disabled:cursor-default text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:hover:bg-transparent"
                            aria-label="Go forward"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6"/>
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`group flex items-center gap-2 px-3 py-2.5 text-sm border-r border-neutral-800 flex-shrink-0 max-w-[160px] transition-colors ${
                                tab.id === activeTabId
                                    ? 'bg-neutral-950 text-white border-b border-b-neutral-950 -mb-px'
                                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
                            }`}
                        >
                            <span className="truncate">{currentPage(tab).title}</span>
                            {tabs.length > 1 && (
                                <span
                                    role="button"
                                    onClick={e => closeTab(tab.id, e)}
                                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-white transition-opacity leading-none"
                                    aria-label="Close tab"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </span>
                            )}
                        </button>
                    ))}

                    {/* New tab button */}
                    <button
                        onClick={() => openNewTab()}
                        className="flex-shrink-0 px-2.5 py-2.5 text-neutral-500 hover:text-white transition-colors"
                        aria-label="New tab"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </button>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Copy markdown */}
                    <button
                        onClick={copyMarkdown}
                        disabled={!activePage?.pageId}
                        title="Copy page as Markdown"
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs rounded transition-colors mr-2 disabled:opacity-30 ${
                            copyStatus === 'copied' ? 'text-green-400' :
                            copyStatus === 'error'  ? 'text-red-400'   :
                            'text-neutral-500 hover:text-white'
                        }`}
                    >
                        {copyStatus === 'copied' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        )}
                        <span>{copyStatus === 'copied' ? 'Copied!' : copyStatus === 'error' ? 'Failed' : 'Copy MD'}</span>
                    </button>
                </div>

                {/* Iframes — one per tab, only active one visible */}
                <div className={`flex-1 min-h-0 relative ${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                    {tabs.map(tab => {
                        const page = currentPage(tab)
                        return page.urlPath ? (
                            <iframe
                                key={tab.id}
                                ref={el => { if (el) iframeRefs.current.set(tab.id, el); else iframeRefs.current.delete(tab.id) }}
                                src={page.urlPath}
                                onLoad={() => handleIframeLoad(tab.id)}
                                className={`absolute inset-0 w-full h-full border-0 ${tab.id === activeTabId ? '' : 'hidden'}`}
                                style={darkMode ? { filter: 'invert(1) hue-rotate(180deg)' } : undefined}
                                title={page.title}
                                sandbox="allow-same-origin allow-scripts"
                            />
                        ) : (
                            <div
                                key={tab.id}
                                className={`absolute inset-0 flex items-center justify-center text-neutral-600 text-sm ${tab.id === activeTabId ? '' : 'hidden'}`}
                            >
                                Loading…
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
