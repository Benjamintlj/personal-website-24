# Organising a Go module

[Organizing a Go module - The Go Programming Language](https://go.dev/doc/modules/layout#)

For a server its typically

```go
project-root-directory/
  go.mod
  internal/
    auth/
      ...
    metrics/
      ...
    model/
      ...
  cmd/
    api-server/
      main.go
    metrics-analyzer/
      main.go
    ...
  ... the project's other directories with non-Go code
```