# Contributing to CourseMetrics using git and GitHub

This comprehensive guide will walk you through the process of using `git` and `GitHub` for the CourseMetrics project. It's designed for collaborators who are new to git and have direct access to the repository.

## Quick Reference: Common git Commands

| Command | Description |
|---------|-------------|
| `git branch -a` | Show all branches (local and remote) |
| `git fetch origin --prune` | Download changes from GitHub without merging |
| `git checkout <branch>` | Switch to a different branch |
| `git checkout -b <branch-name>` | Create a new branch and switch to it |
| `git merge origin/main` | Merge changes from GitHub's main branch into your current branch |
| `git add <files>` | Stage files for commit |
| `git commit -m "message"` | Commit staged changes with a message |
| `git push origin <branch>` | Push your local changes to GitHub |
| `git pull origin <branch>` | Fetch and merge changes from GitHub into your current branch |
| `git status` | Show the status of your working directory |
| `git log --all --graph` | View commit history as a graph for all branches |
| `git rebase main` | Rebase current branch on top of main branch |
| `git branch -d <branch-name>` | Delete a branch (if it has been merged) |
| `git branch -D <branch-name>` | Force delete a branch (even if it hasn't been merged) |
| `git checkout -B <branch-name> <commit>` | Reset a branch pointer to a specific commit |

## Detailed Workflow

This guide assumes you are already within a `shell`, where the `current working directory` is within the `CourseMetrics` git repository.

### 1. Check Your Current Branch: `git branch -a`

- **This will probably be one of your most used commands**
- It shows you what branch you're on, and _all_ (`-a`) git branches your local git repository is aware of (local and remote)
- As a tip, you _never_ want to be doing work on the `main` branch so if you see that you're on the `main` branch and that you've changed a file there, you should revert that file to how it was

### 2. Update Your Local Repository: `git fetch origin --prune`

- This command downloads changes from `GitHub` such that your local git repository is aware of these changes
- This does _not_ merge any changes from GitHub into any of your local branches, so it's always safe to run
- If a new branch was added to GitHub, run this command first, and _then_ `git branch -a` to see that your git repository is now aware of the new branches on `GitHub`

### 3. Switch Branches: `git checkout <branch>`

- This command switches the `git branch` you're currently on
- NOTE: If you're unable to switch, you most likely need to:

  1. Commit the changes you made to your current branch before switching:

     ```sh
     git add [...files]
     git commit -m "commit message"
     ```

  2. Or, if you don't want to commit any of the changes you made and need to revert them back to how they were in the most recent commit:

     ```sh
     # Reverts "files" to how they were since the most recent commit made on a particular branch
     git checkout -- [...files]
     ```

### 4. Update Your Main Branch: `git merge origin/main`

- After running `git fetch origin --prune`, you should merge the changes from GitHub such that your local _main_ branch is up-to-date
- NOTE:
  - You should _never_ be working on your main branch; you should conduct tests on separate branches
  - Your local main branch should be kept up-to-date with what's on `GitHub's main branch`
  - It's common to run these commands back-to-back when you're checked out on your main branch:

    ```sh
    # Assuming you're on the main branch...

    # Ensures your local git downloads any changes from GitHub (but doesn't merge these changes)
    git fetch origin --prune

    # Merges the changes from GitHub's main branch into your local main branch
    git merge origin/main
    ```

### 5. Rebasing Your Branch

After updating your local main branch, you should rebase your feature branch on top of the updated main branch. This keeps your branch up-to-date with the latest changes and maintains a clean project history.

1. First, make sure your main branch is up-to-date:

   ```sh
   git checkout main
   git fetch origin --prune
   git merge origin/main
   ```

2. Then, switch to your feature branch and rebase:

   ```sh
   git checkout feature/your-feature-name
   git rebase main
   ```

3. If there are conflicts during the rebase, Git will pause and allow you to resolve them. After resolving conflicts in a file:

   ```sh
   git add <resolved-file>
   git rebase --continue
   ```

4. Once the rebase is complete, you may need to force-push your branch if it's already on GitHub:

   ```sh
   git push origin feature/your-feature-name --force-with-lease
   ```

   Note: Be cautious with force pushing, especially on shared branches.

### 6. Creating New Branches

Creating a new branch allows you to work on features or fixes without affecting the main codebase. You can create a branch from the current HEAD or from a specific commit, tag, or branch.

1. Create a new branch from the current HEAD:

   ```sh
   git checkout -b <new-branch-name>
   ```

2. Create a new branch from a specific commit, tag, or branch:

   ```sh
   git checkout -b <new-branch-name> <commit-hash|tag|branch-name>
   ```

   For example:
   ```sh
   git checkout -b feature/new-login v1.2.3
   ```
   This creates a new branch called `feature/new-login` starting from the tag `v1.2.3`.

### 7. Deleting Branches

After a feature branch has been merged or is no longer needed, it's good practice to delete it to keep your repository clean.

1. Delete a branch that has been merged:

   ```sh
   git branch -d <branch-name>
   ```

2. Force delete a branch, even if it hasn't been merged:

   ```sh
   git branch -D <branch-name>
   ```

   Note: Be cautious with `-D` as it will delete the branch regardless of its merge status.

3. To delete a remote branch:

   ```sh
   git push origin --delete <branch-name>
   ```

### 8. Resetting Branch Pointers

Sometimes you may want to reset a branch to point to a different commit. This can be useful for undoing changes or starting fresh from a specific point.

1. Reset the current branch to a specific commit:

   ```sh
   git checkout -B <branch-name> <commit-hash|other-branch-name|tag>
   ```

   For example:
   ```sh
   git checkout -B feature/login-page main
   ```
   This resets the `feature/login-page` branch to point to the same commit as the `main` branch.

   Note: The `-B` option is like `-b`, but it resets the branch if it already exists.

2. If you want to reset a branch other than the current one:

   ```sh
   git branch -f <branch-name> <commit-hash|other-branch-name|tag>
   ```

   For example:
   ```sh
   git branch -f old-feature abc123
   ```
   This forces the `old-feature` branch to point to the commit with hash `abc123`.

Remember, resetting branch pointers can lead to loss of commits if not done carefully. Make sure you understand the implications before using these commands, especially on shared branches.

### 9. Make Your Changes

Edit, add, or delete files as needed for your feature or bug fix.

### 10. Stage Your Changes

Use `git add` to stage your changes:

```sh
git add <file1> <file2> ...
# Or to stage all changes:
git add .
```

### 11. Commit Your Changes

Commit your staged changes with a descriptive message:

```sh
git commit -m "Add feature X" # or "Fix bug Y"
```

### 12. Push Your Changes to GitHub

Push your branch to GitHub:

```sh
git push origin feature/your-feature-name
```

### 13. Create a Pull Request

Go to the CourseMetrics repository on GitHub and create a new Pull Request from your branch to the main branch.

### 14. Review and Merge

After your Pull Request is reviewed and approved, it can be merged into the main branch.

## Best Practices

1. **Always work on a feature branch**, never directly on main.
2. **Keep your commits small and focused** on a single change or feature.
3. **Write clear, concise commit messages** that explain what and why, not how.
4. **Pull changes from main regularly** to stay up-to-date and reduce merge conflicts.
5. **Review your changes before committing** using `git status`.
6. **Use meaningful branch names** that describe the feature or fix.
7. **Rebase your feature branches** on the latest main to maintain a clean history.
8. **Use `git log --all --graph`** to visualize the branch structure and commit history.
9. **Delete branches after they're merged** to keep your repository clean.
10. **Be cautious when resetting branch pointers**, especially on shared branches.

By following this guide, you'll be able to contribute effectively to the CourseMetrics project using git and GitHub. Remember, practice makes perfect, and don't hesitate to ask for help if you're unsure about any step in the process.
