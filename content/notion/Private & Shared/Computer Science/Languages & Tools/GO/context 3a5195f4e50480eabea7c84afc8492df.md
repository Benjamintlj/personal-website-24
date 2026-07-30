# context

[context package - context - Go Packages](https://pkg.go.dev/context)

This package helps you manage goroutines. Think of it as a cancellation token from `.net`.

You pass contexts in a chain, attaching extra information as you go. Once a parent context is cancelled all child contexts will also be cancelled.

## Interface

```go
type Context interface {
	Deadline() (time.Time, bool)
	Done() <-chan struct{}
	Err() error
	Value(key any) any
}
```

| Method | Meaning |
| --- | --- |
| `Deadline()` | Returns a time when the context must be completed by, if the time is exceeded `Done` chan will close & `Err` is set |
| `Done()` | Returns a channel, if the channel is closed that means the context is done, ether because it was cancelled or expired |
| `Err()` | Returns nil until the context is done, once done it will tell you why the context is done, either `context.Canceled` or `context.DeadlineExceeded` |
| `Value()` | Gets values based on a given key. 

It is generally considered bad practice to use value, although its sort of acceptable for `traceIds`, nothing that controls flow should be in there. The reason being its its a untyped map, so there is no type-safety, and your value may not exist. |

## Making a context

### Init

A context will start off with no data attached, no cancellation method, no time out, nothing. You will add them on as you move the context about. 

You put this at the top of your call stack.

```go
ctx := context.Background()
```

Next we will add things to it.

### Cancellation

`WithCancel` creates a new child context, and a cancellation method. Call this method to cancel that context.

```go
ctx, cancel := context.WithCancel(parent)
defer cancel()
```

### Timeout

A timeout will cancel the context after a certain duration. To do this call `WithTimeout`, this will return a child context and a cancellation method so you can cancel early. If you do not use the cancel method, the timeout will call cancel after the duration.

```go
ctx, cancel := context.WithTimeout(parent, 2*time.Second)
defer cancel()
```

### Deadline

A deadline will cancel after a certain time. To do this call `withDeadline`, this will return a child context and a cancellation method so you can cancel early. If you do not use the cancel method, the deadline will trigger at the specified time.

```go
deadline := time.Now().Add(2 * time.Second)

ctx, cancel := context.WithDeadline(parent, deadline)
defer cancel()
```

### Value

Context provides a untyped map, where your value may or may not be there. Using this is generally considered bad practice with the exception of data used for maintenance like traceIds. To create a value call `WithValue` in return you will get a child context. You then may access this data using `Value`, just remember to handle it not existing and to cast it.

```go
type contextKey string

const userIDKey contextKey = "userID"

ctx := context.WithValue(parent, userIDKey, 123)

userID, ok := ctx.Value(userIDKey).(int)
if !ok {
	// value missing or wrong type
}
```

## Watching work and cancellation

Race your cases to determine if you need to cancel

```go
select {
case result := <-results:
	return result, nil

case <-ctx.Done():
	return "", ctx.Err()
}
```