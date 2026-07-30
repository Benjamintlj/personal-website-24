# Benchmark

# Setup

- Benchmarks should live within their own projects
- They should always execute in release mode aka `dotnet run -c Release`
- Install package **`BenchmarkDotNet`**

## Minimal Example

`Program.cs`

```csharp
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;

BenchmarkRunner.Run<StringBenchmarks>();

public class StringBenchmarks
{
    private readonly string _value = "hello world";
    
    [GlobalSetup]
    public void Setup()
    {
        // setup code if needed
    }

    [Benchmark]
    public string ToUpper()
    {
        return _value.ToUpperInvariant();
    }

    [Benchmark]
    public string ToLower()
    {
        return _value.ToLowerInvariant();
    }
}
```

## What to handle multiple benchmark classes

We can use a switcher + reflection to get all of the classes.

`program.cs`

```csharp
using BenchmarkDotNet.Running;

BenchmarkSwitcher
    .FromAssemblies([typeof(Program).Assembly])
    .Run(args);
```

### Start up

I recommend using a `Properties/LaunchSettings.json` file

```json
{
  "profiles": {
    "All benchmarks": {
      "commandName": "Project",
      "commandLineArgs": ""
    },
    "Execute a benchmark class": {
      "commandName": "Project",
      "commandLineArgs": "--filter *ClassName*" 
    },
    "Execute a benchmark method": {
      "commandName": "Project",
      "commandLineArgs": "--filter *ClassName.BenchmarkName*"
    }
  }
}
```

Run this when you want to select which class to execute

`dotnet run -c Release --project benchmarks/MyApp.Benchmarks -- --list flat`

Run this when you want to test all classes

`dotnet run -c Release --project benchmarks/MyApp.Benchmarks`

# Output

| Column | Meaning |
| --- | --- |
| Method | The benchmarked method |
| Mean | Average execution time |
| Error | Confidence interval/error estimate |
| StdDev | How variable the runs were |
| Allocated | Memory allocated, if memory diagnoser is enabled |

# Attributes

| Attribute | Meaning |
| --- | --- |
| `[Benchmark]` | Measures anything inside of it |
| `[MemoryDiagnoser]`  | Shows memory allocations |
| `[Params(...)` | Runs the bench mark with each passed value |
| `[GlobalSetup]` | Runs before each benchmark/parameter execution |
| `[GlobalCleanup]` | Runs after each benchmark/parameter execution |
| `[IterationSetup]`  | Runs before each time a benchmark is about to be tested, so if a benchmark & parameter gets tested 10 times, it will run 10 times |
| `[IterationCleanup]` | Runs after each time a benchmark is about to be tested, so if a benchmark & parameter gets tested 10 times, it will run 10 times |

## Examples

### Memory Diagnoser

Shows the memory allocation columns in the output

```csharp
using BenchmarkDotNet.Attributes;

[MemoryDiagnoser]
public class StringBenchmarks
{
    [Benchmark]
    public string CreateString()
    {
        return "hello" + " world";
    }
}
```

### Params

When you want to try different inputs (normally sizes) use params

```csharp
using BenchmarkDotNet.Attributes;

[MemoryDiagnoser]
public class ListBenchmarks
{
    [Params(10, 100, 1000, 10000)]
    public int Count { get; set; }

    private List<int> _numbers = null!;

    [GlobalSetup]
    public void Setup()
    {
        _numbers = Enumerable.Range(0, Count).ToList();
    }

    [Benchmark]
    public int Sum()
    {
        return _numbers.Sum();
    }
}
```