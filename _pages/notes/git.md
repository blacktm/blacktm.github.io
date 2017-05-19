---
title: Git
---

<a href="/notes" class="back">← notes</a>

# Git

[Git tutorial](https://www.atlassian.com/git/tutorials)

## Create a branch

```bash
# Create, but don't checkout
git branch <branch>

# Create and checkout
git checkout -b <branch>
```

## Switch branches

```
git checkout <branch>
```

## Delete a local branch

```bash
# Safe version, use `-D` to force
git branch -d <branch>
```

## Stashing

```bash
# Save uncommitted changes
git stash

# Save untracked files
git stash -u
```

```bash
# Apply stashed changes
git stash pop

# Apply a specific stash, where <stash> could be stash@{1}
git stash pop <stash>
```

```bash
# View stashes
git stash list

# Show stash diff
git stash show

# Show a specific stash diff, where <stash> could be stash@{1}
git stash show -p <stash>
```

```bash
# Partial stash
git stash -p

# Use `?` for a full list of hunk commands. Common commands are:
#   y  stash this hunk
#   n  don't stash this hunk
#   s  split this hunk into smaller hunks
#   q  quit (already selected hunks will be stashed)
#   ?  help
```

```bash
# Delete a stash, where <stash> could be stash@{1}
git stash drop <stash>

# Delete all stashes
git stash clear
```

## Squashing commits on a branch

Start by checking out a feature branch:

```
git checkout <feature_branch>
```

Select commits on branch to rebase:

```
git rebase -i master
```

Choose commits to squash by changing `pick` to `squash` (or `s` for short), for example from this...

```
pick 305cf52 Add new feature
pick f1f8d00 Fix A
pick 3bcdab6 Fix B
pick 90469e6 Fix C
```

to...

```
pick 305cf52 Add new feature
s f1f8d00 Fix A
s 3bcdab6 Fix B
s 90469e6 Fix C
```

Then, the text editor opens to edited the message of the squashed commit:

```
# This is a combination of 4 commits.
# This is the 1st commit message:
Add new feature

# This is the commit message #2:

Fix A

# This is the commit message #3:

Fix B

# This is the commit message #4:

Fix C
```

Because the remote feature branch history has been changed, force push the branch:

```
git push --force origin <feature_branch>
```

## Rebasing

```
# Get changes from master when on a feature branch
git rebase <repo>/master
```
