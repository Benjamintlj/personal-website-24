# CLI Cheatsheet

## Mental map

```
Create       go mod init
Dependencies go get / go mod tidy
Run          go run
Compile      go build
Install      go install
Format       go fmt
Analyse      go vet
Test         go test
Inspect      go list / go doc / go env
Generate     go generate
Clean        go clean
Profile      go tool pprof
Workspace    go work
```

The complete command list is available through:

```bash
go help
```

For a specific command:

```bash
go help <command>
```

## Starting a project

| Command | Purpose |
| --- | --- |
| `go mod init <module>` | Create a new Go module |
| `go mod tidy` | Add missing dependencies and remove unused ones |
| `go mod download` | Download dependencies without building |
| `go mod verify` | Check downloaded dependencies have not changed |

```bash
go mod init github.com/ben/example
go mod tidy
```

A module is normally an entire project or repository. The command creates a `go.mod` file.

---

## Running and building

| Command | Purpose |
| --- | --- |
| `go run .` | Compile and run the current package |
| `go run main.go` | Run one specific file |
| `go build` | Compile the current package |
| `go build ./...` | Build every package in the module |
| `go build -o app` | Build a binary with a chosen name |
| `go install` | Compile and install the current program |

```bash
go run .
go build -o myapp
./myapp
```

`go run` uses a temporary binary. `go build` creates a binary but does not install it. ([Go Packages](https://pkg.go.dev/cmd/go?utm_source=chatgpt.com))

---

## Testing

| Command | Purpose |
| --- | --- |
| `go test` | Test the current package |
| `go test ./...` | Test all packages |
| `go test -v ./...` | Show individual test results |
| `go test -run TestName` | Run matching tests |
| `go test -count=1` | Disable cached test results |
| `go test -race ./...` | Detect data races |
| `go test -cover ./...` | Show test coverage |
| `go test -coverprofile=cover.out ./...` | Save coverage data |

```bash
go test -v -run TestWalk
```

Run one subtest:

```bash
go test -run 'TestWalk/structs'
```

Open an HTML coverage report:

```bash
go test -coverprofile=cover.out ./...
go tool cover -html=cover.out
```

### Benchmarks

```bash
go test -bench=.
go test -bench=BenchmarkWalk
go test -bench=. -benchmem
```

`benchmem` includes allocation statistics.

### Fuzz tests

```bash
go test -fuzz=FuzzName
go test -fuzz=FuzzName -fuzztime=30s
```

---

## Formatting and checking

| Command | Purpose |
| --- | --- |
| `go fmt ./...` | Format all Go packages |
| `gofmt -w .` | Format files directly |
| `go vet ./...` | Find suspicious code and likely mistakes |
| `go test ./...` | Compile, vet and test code |
| `go fix ./...` | Update code using Go’s automatic fixes |

```bash
go fmt ./...
go vet ./...
go test ./...
```

`go vet` does not prove that code is correct. It finds suspicious patterns, such as incorrect formatting arguments, broken struct tags and copied lock values. `go test` automatically runs a high-confidence subset of vet checks. ([Go Packages](https://pkg.go.dev/cmd/go?utm_source=chatgpt.com))

Inspect available vet checks:

```bash
go tool vet help
go tool vet help printf
```

---

## Dependencies

| Command | Purpose |
| --- | --- |
| `go get example.com/pkg` | Add or update a dependency |
| `go get example.com/pkg@v1.2.3` | Request a specific version |
| `go get example.com/pkg@latest` | Request the latest version |
| `go get example.com/pkg@none` | Remove a dependency |
| `go list -m all` | List all modules in the dependency graph |
| `go mod graph` | Print the module dependency graph |
| `go mod why <module>` | Explain why a dependency is required |

```bash
go get github.com/google/uuid@latest
go mod tidy
```

Use `go get` for dependencies used by your module.

Use `go install` to install command-line tools:

```bash
go install golang.org/x/tools/cmd/stringer@latest
```

Modern Go separates installing executables from changing project dependencies. ([Go](https://go.dev/doc/go-get-install-deprecation?utm_source=chatgpt.com))

---

## Listing and inspecting

| Command | Purpose |
| --- | --- |
| `go list` | List the current package |
| `go list ./...` | List every package |
| `go list -m all` | List modules |
| `go env` | Show Go environment settings |
| `go version` | Show the installed Go version |
| `go doc <name>` | Read documentation in the terminal |
| `go help <command>` | Read help for a Go command |

```bash
go doc fmt.Println
go doc http.Server
go help test
go help modules
```

Useful environment checks:

```bash
go env GOPATH
go env GOMOD
go env GOWORK
go env GOOS
go env GOARCH
```

Change a persistent Go setting:

```bash
go env -w GOPROXY=https://proxy.golang.org,direct
```

Undo it:

```bash
go env -u GOPROXY
```

---

## Installing tools

```bash
go install <module>/cmd/<tool>@<version>
```

Example:

```bash
go install golang.org/x/tools/cmd/goimports@latest
```

Installed binaries normally go into:

```bash
go env GOBIN
```

When `GOBIN` is empty, Go normally uses:

```bash
$(go env GOPATH)/bin
```

---

## Code generation

Run all `//go:generate` directives:

```bash
go generate ./...
```

Example directive:

```go
//go:generate stringer -type=Status
```

Then run:

```bash
go generate
```

`go generate` is not run automatically by `go build` or `go test`. ([Go Packages](https://pkg.go.dev/cmd/go?utm_source=chatgpt.com))

---

## Cleaning caches

| Command | Purpose |
| --- | --- |
| `go clean` | Remove generated build files |
| `go clean -cache` | Clear the build cache |
| `go clean -testcache` | Clear cached test results |
| `go clean -modcache` | Delete all downloaded modules |
| `go clean -fuzzcache` | Clear cached fuzzing results |

```bash
go clean -testcache
```

Be careful with:

```bash
go clean -modcache
```

It deletes the entire module download cache, so dependencies must be downloaded again. ([Go Packages](https://pkg.go.dev/cmd/go?utm_source=chatgpt.com))

---

## Workspaces

Workspaces allow several local modules to be developed together.

```bash
go work init ./api ./shared
```

Add another module:

```bash
go work use ./worker
```

Synchronise workspace dependency versions:

```bash
go work sync
```

Inspect whether workspace mode is active:

```bash
go env GOWORK
```

A workspace creates a `go.work` file.

---

## Cross-compilation

Build for Linux:

```bash
GOOS=linux GOARCH=amd64 go build
```

Build for Apple Silicon:

```bash
GOOS=darwin GOARCH=arm64 go build
```

Build for Windows:

```bash
GOOS=windows GOARCH=amd64 go build -o app.exe
```

Common values:

| Variable | Examples |
| --- | --- |
| `GOOS` | `linux`, `windows`, `darwin` |
| `GOARCH` | `amd64`, `arm64`, `386` |

List supported combinations:

```bash
go tool dist list
```

---

## Build flags

### Show executed commands

```bash
go build -x
```

### Print commands without running them

```bash
go build -n
```

### Force a complete rebuild

```bash
go build -a
```

### Include build tags

```bash
go build -tags integration
go test -tags integration ./...
```

### Reduce binary size

```bash
go build -ldflags="-s -w"
```

### Insert build information

```bash
go build -ldflags="-X 'main.version=1.2.3'"
```

The Go variable must exist:

```go
package main

var version = "development"
```

---

## Debugging and profiling tools

### View compiler escape analysis

```bash
go build -gcflags="-m"
```

More detail:

```bash
go build -gcflags="-m=2"
```

This explains which values escape to the heap.

### CPU profiling

```bash
go test -cpuprofile=cpu.out
go tool pprof cpu.out
```

### Memory profiling

```bash
go test -memprofile=memory.out
go tool pprof memory.out
```

Open the browser interface:

```bash
go tool pprof -http=:8080 cpu.out
```

### Inspect a binary

```bash
go tool nm ./myapp
go tool objdump ./myapp
```

Some lower-level tools are accessed through `go tool`, including `pprof`, `cover`, `vet`, `compile` and `objdump`. ([Go](https://go.dev/doc/cmd?utm_source=chatgpt.com))

---

## Vendor dependencies

Create a local `vendor` directory:

```bash
go mod vendor
```

Build using vendored dependencies:

```bash
go build -mod=vendor
```

Check vendored packages:

```bash
go list -mod=vendor all
```

This is useful for controlled or offline builds.

---

## Useful everyday sequence

### New project

```bash
mkdir my-project
cd my-project

go mod init github.com/ben/my-project
go test ./...
go run .
```

### Before committing

```bash
go fmt ./...
go vet ./...
go test -race ./...
go mod tidy
```

### Diagnose strange cached tests

```bash
go clean -testcache
go test -count=1 -v ./...
```

### Full basic health check

```bash
go mod tidy
go fmt ./...
go vet ./...
go test -race -cover ./...
go build ./...
```