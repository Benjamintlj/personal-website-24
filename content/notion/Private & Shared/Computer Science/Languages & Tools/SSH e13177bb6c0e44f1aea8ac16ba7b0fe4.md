# SSH

## Login

```bash
ssh username@website.com
# can also use an IP address inplace of a URL
```

## Logout

```bash
logout
```

## Create a config folder

1. create a `.ssh` folder (must be in home dir)
2. create a file called `config`

```bash
Host = nameOfConfig
	Hostname = ip
	User = userName

Host = nameOfConfig
	Hostname = ip
	User = userName
```

1. Run it with `ssh nameOfConfig`

## Copy files

```bash
# once signed in

# from their machine to your PC
scp nameOfConfig:~/fileToCopy.txt ./dir/destinationFolder

# from your PC to their machine
scp ./dir/fileToCopy.txt nameOfConfig:~/dir/destinationFolder
```

## Create a SSK key

```bash
ssh-keygen -t rsa
#             ^^^ encryption algorithm

# This will be stored in the .ssh folder
```

## Set-up of SSH Authentication

```bash
# copy across public key to remote machine
# do this step from local machine
ssh-copy-id nameOFConfig
```