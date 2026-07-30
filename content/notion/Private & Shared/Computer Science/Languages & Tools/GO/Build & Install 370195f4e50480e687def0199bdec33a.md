# Build & Install

Building = just compiling your code

Install = building and then adding the binary to your binary path

## Build

```bash
go build
```

Execute

```bash
./myExe
```

## Install

First you will need to determine were it will be installed to

```bash
go list -f '{{.Target}}'
```

Then determine which executable you want to use

```bash
# if you want to use your install dir
export PATH=$PATH:/path/to/your/install/directory

# if you want to use bin folder
go env -w GOBIN=/path/to/your/bin
```

Then install it

```bash
go install
```

Then execute

```bash
myExe
```