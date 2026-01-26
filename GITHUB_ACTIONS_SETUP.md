# GitHub Actions CI/CD Setup with GHCR

## Workflows Created

### 1. **build.yml** - Build Docker Images

- Builds backend and frontend Docker images
- Pushes to GitHub Container Registry (GHCR)
- Tags with `latest` and commit SHA
- Runs on every push to `main`

### 2. **deploy.yml** - Deploy to VPS

- Pulls pre-built images from GHCR
- Deploys to your VPS
- Runs database migrations
- Only runs after build succeeds

## Setup Instructions

### Step 1: Create Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: `GHCR_PAT`
4. Select scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `delete:packages`
5. Copy the token

### Step 2: Add Secrets to Your Repository

Go to: **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret Name    | Value                                                                               |
| -------------- | ----------------------------------------------------------------------------------- |
| `DEPLOY_HOST`  | Your VPS IP address                                                                 |
| `DEPLOY_USER`  | `root`                                                                              |
| `DEPLOY_KEY`   | Private SSH key from your VPS                                                       |
| `GITHUB_TOKEN` | Personal Access Token (GitHub creates this automatically, but you can use your PAT) |

### Step 3: Grant VPS SSH Access

On your VPS:

```bash
# Make sure GitHub Actions public key is in authorized_keys
cat /root/.ssh/github_actions.pub >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
```

### Step 4: Make GHCR Images Public (Optional)

If you want to use your images in other places:

1. Go to your GitHub profile → Packages
2. Click on `money-backend` package
3. Click "Package settings"
4. Scroll down to "Danger Zone"
5. Change visibility to "Public"
6. Repeat for `money-frontend`

## How It Works

```
1. Push to main branch
        ↓
2. GitHub Actions triggers build.yml
        ↓
3. Builds Docker images for backend & frontend
        ↓
4. Pushes images to ghcr.io
        ↓
5. Deploy.yml runs after build succeeds
        ↓
6. VPS pulls pre-built images from GHCR
        ↓
7. Containers start with new images
        ↓
8. Database migrations run
```

## View Build Status

1. Go to your repo: `https://github.com/vietxuandev/money`
2. Click **Actions** tab
3. See all workflow runs and their status

## Troubleshooting

### Build fails with "authentication required"

- Check if GITHUB_TOKEN secret is set correctly
- Verify PAT has correct scopes

### Deploy fails with "cannot connect to Docker"

- Check if Docker is running on VPS
- Verify SSH key is correct

### Images not found on VPS

- Run: `docker login ghcr.io` on VPS manually
- Check if VPS can access GHCR (firewall?)

## Rollback to Previous Version

If you need to rollback:

```bash
# On VPS, pull previous image by SHA
docker pull ghcr.io/vietxuandev/money-backend:PREVIOUS_SHA

# Or just redeploy by pushing an old commit
git revert <commit_hash>
git push origin main
```

## Benefits of This Setup

✅ Faster deployments (no building on VPS)
✅ Consistent builds across environments
✅ Build cache speeds up future builds
✅ Images stored in GHCR (free with GitHub)
✅ Easy rollbacks
✅ Automated end-to-end pipeline

---

Next time you push, the entire pipeline will run automatically! 🚀
