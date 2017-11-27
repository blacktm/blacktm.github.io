---
title: Linux
---

<a href="/notes" class="back">← notes</a>

# Linux

## Packages

```bash
# Update installed packages
sudo apt update
sudo apt full-upgrade

# Search for available package
apt search <package>

# List installed packages
apt list --installed

# Remove package
sudo apt remove <package>

# Clean up unneeded packages
sudo apt autoremove
```

## Useful aliases

Put these in `~/.bashrc`

```bash
# Clear terminal
alias cls='printf "\033c"'

# Changing terminal prompt
export PS1="\W:$ "
```

## Unmount a drive

```bash
umount /media/<drive>
```
