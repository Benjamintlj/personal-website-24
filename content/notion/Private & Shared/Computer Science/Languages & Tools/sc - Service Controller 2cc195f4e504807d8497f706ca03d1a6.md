# sc - Service Controller

```powershell
# See if the service exists + its state
sc query "MyService"

# See the stored config (binPath, start type, account, etc.)
sc qc "MyService"

# Create (only if it doesn’t exist)
sc create "MyService" binPath= "C:\Path\MyService.exe" start= auto DisplayName= "My Service"

# Update config (use this on redeploy)
sc config "MyService" binPath= "C:\Path\MyService.exe" start= auto DisplayName= "My Service"

# Set description
sc description "MyService" "Some description here"

# Set logon account (Run As) + password
sc config "MyService" obj= "DOMAIN\svc.MyService" password= "SuperSecret"

# Start/stop
sc start "MyService"
sc stop "MyService"

# Delete (if you need to wipe and recreate)
sc delete "MyService"
```

Common problems

1. sc requires a space after the equals sign, like binPath= "..." not binPath="...". 
2. quoting matters: if your path has spaces, always quote the value.