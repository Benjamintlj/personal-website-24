# Build Tools

## **.NET Framework (classic csproj) build needs**

- MSBuild (full .NET Framework MSBuild toolset)
- Visual Studio (or Visual Studio Build Tools) that provides that MSBuild toolset + targets/tasks
- .NET Framework targeting packs + reference assemblies (e.g., 4.6.2/4.8)
- Classic build targets/props files (Microsoft.Common.props, Microsoft.CSharp.targets, etc.)
- Roslyn compiler bits used by that MSBuild toolset (csc.exe + supporting targets)
- NuGet restore tooling compatible with packages.config / old-style restore (NuGet.exe / NuGetCommand + MSBuild integration)
- (Optional) Windows SDKs / other build dependencies referenced by the solution (SSDT, etc.)

```
.NET Framework (classic) build stack
Visual Studio (IDE)                           # Optional IDE; includes MSBuild + workloads
└─ Visual Studio Build Tools                  # Headless VS components for CI agents
   └─ MSBuild.exe (VS toolset: 14/15/16/17)   # The build engine that executes targets
      ├─ Toolset (targets/props/tasks)        # Microsoft.Common.props, Microsoft.CSharp.targets, etc.
      │  ├─ C# targets (CSharp*.targets)      # Hooks compilation + language pipeline
      │  └─ Tasks assemblies (*.tasks.dll)    # Implements actions MSBuild runs (Copy, Resolve, etc.)
      ├─ Roslyn (csc.exe + targets)           # Actual C# compiler invoked by targets
      ├─ .NET Framework targeting pack        # Reference assemblies for net4x builds
      └─ NuGet.exe / NuGetCommand restore     # Restores packages.config / legacy restore inputs
```

## **.NET (Core/5+/6+/7+/8+/9+/10) SDK-style build needs**

- dotnet CLI
- A specific .NET SDK version (selected by installation and optionally global.json)
- MSBuild that ships *inside* the .NET SDK (invoked via dotnet build)
- SDK targets/tasks (Microsoft.NET.Sdk + friends)
- Roslyn compiler that ships with the SDK
- NuGet restore via dotnet restore (PackageReference workflow)
- (Only if you target .NET Framework or need it) reference assemblies / targeting packs for those TFMs

```
.NET (Core/5+/6+/7+/8+/9+/10) SDK-style build stack
dotnet.exe (CLI)                              # Entry point used in modern pipelines
└─ .NET SDK (selected version)                # The installed SDK chosen (optionally by global.json)
   ├─ MSBuild (SDK-shipped)                   # MSBuild engine bundled with the SDK
   │  └─ Microsoft.NET.Sdk targets/props      # Default build logic for SDK-style projects
   │     ├─ SDK tasks assemblies              # Tasks used by SDK targets
   │     └─ NuGet restore integration         # PackageReference restore graph for dotnet restore
   ├─ Roslyn (SDK compiler toolset)           # C# compiler bundled with the SDK
   └─ Targeting packs (per TFM)               # Reference packs for net6.0/net8.0/etc (and net4x if multi-target)
```