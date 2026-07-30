# lsof - list open files

```yaml
# List ALL open files and network connections on the system
lsof

# List ALL network connections (TCP + UDP), numeric ports, no DNS lookups
sudo lsof -i -P -n

# See which process is listening on a specific port (e.g. 9205)
sudo lsof -i :9205 -P -n

# See all ports used by a specific process ID (PID)
sudo lsof -Pan -p <PID> -i

# See all open network connections for processes matching a name (e.g. dotnet)
sudo lsof -i -P -n | grep dotnet

# Show only listening TCP sockets (which processes are listening for connections)
sudo lsof -iTCP -sTCP:LISTEN -P -n

# List all files opened by a specific PID (logs, DLLs, configs, sockets, etc.)
sudo lsof -p <PID>

# List all open files under a specific directory (recursive)
sudo lsof +D /path/to/directory

# See which process has a specific file locked / open
sudo lsof /path/to/file

# Continuously watch for changes in open files/connections (Ctrl+C to stop)
sudo watch -n 2 "lsof -i -P -n | grep <something>"
```