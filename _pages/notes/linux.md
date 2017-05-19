---
title: Linux
---

<a href="/notes" class="back">← notes</a>

# Linux

## Packages

**Update installed packages**

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
sudo apt-get install -y <package>
```

**Search for available package**

```
apt-cache search <package>
```

**List installed packages**

```
dpkg --get-selections | grep -v deinstall
```

**Search for installed package**

```
dpkg --get-selections | grep -v deinstall | grep <package>
```

**Remove package**

```
sudo apt-get --purge remove <package>
```

**Clean up unneeded packages**

```
sudo apt-get autoremove
```

## Useful aliases

_In `~/.bashrc`_

**Clear terminal**

```
alias cls='printf "\033c"'
```

**Changing terminal prompt**

```
export PS1="\W:$ "
```

## Unmount a drive

```
umount /media/<drive>
```
