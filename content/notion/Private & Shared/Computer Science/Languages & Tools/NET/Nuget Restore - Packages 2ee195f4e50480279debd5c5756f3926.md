# Nuget Restore - Packages

There are two methods to restore packages, you cannot mix them within the same project, (you can in the same solution)

Old projects store all references in a `packages.config`

- All packages are installed into `.\packages\`

New projects store all references in `csproj` in the `PackageReference` tag

- All packages are referenced after restore in `obj\project.assets.json`
- The packages are then installed within a global cache