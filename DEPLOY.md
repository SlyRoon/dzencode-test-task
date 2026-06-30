# Production deploy

Production branch: `prod`.

Every push to `prod` starts GitHub Actions workflow:

```text
.github/workflows/deploy-vps.yml
```

The workflow connects to the VPS by SSH, updates `/var/www/dzencode-test`,
rebuilds Docker containers, restarts them, and checks:

```text
http://127.0.0.1/
http://127.0.0.1/api/orders
```

Production frontend is exposed on port `80`.

## 1. GitHub Secrets

Open your repository in GitHub:

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

Add:

```text
VPS_HOST
```

Server IP or domain, for example:

```text
123.123.123.123
```

Add:

```text
VPS_USER
```

SSH user on VPS, for example:

```text
root
```

or:

```text
deploy
```

Add:

```text
VPS_SSH_KEY_B64
```

This is the private SSH key for GitHub Actions -> VPS connection, encoded as base64.

Create it on your local machine:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/dzencode_vps_actions -C "github actions dzencode"
base64 -w 0 ~/.ssh/dzencode_vps_actions
```

Copy the full output of `base64 -w 0 ...` into GitHub secret `VPS_SSH_KEY_B64`.

Copy the public key to the VPS:

```bash
ssh-copy-id -i ~/.ssh/dzencode_vps_actions.pub <VPS_USER>@<VPS_HOST>
```

Optional secret:

```text
VPS_PROJECT_DIR
```

Default:

```text
/var/www/dzencode-test
```

Set it only if you want another folder.

## 2. VPS setup

SSH into the VPS:

```bash
ssh <VPS_USER>@<VPS_HOST>
```

Install packages:

```bash
sudo apt update
sudo apt install -y git curl docker.io docker-compose-plugin
```

Allow your user to run Docker:

```bash
sudo usermod -aG docker <VPS_USER>
```

Then log out and SSH back in:

```bash
exit
ssh <VPS_USER>@<VPS_HOST>
```

Create project directory:

```bash
sudo mkdir -p /var/www/dzencode-test
sudo chown -R <VPS_USER>:<VPS_USER> /var/www/dzencode-test
```

Check Docker:

```bash
docker --version
docker compose version
```

## 3. GitHub deploy key for VPS -> GitHub

The VPS also needs access to pull the repo from GitHub.

On VPS:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/dzencode_deploy -C "dzencode-test deploy"
cat ~/.ssh/dzencode_deploy.pub
```

Copy the public key output.

In GitHub repository open:

```text
Settings -> Deploy keys -> Add deploy key
```

Set:

```text
Title: dzencode-test VPS deploy
Key: <paste public key>
Allow write access: off
```

On VPS configure SSH:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/dzencode_deploy
  IdentitiesOnly yes
EOF

chmod 600 ~/.ssh/config
ssh -T git@github.com
```

GitHub can answer with a message like:

```text
Hi <repo-owner>/<repo>! You've successfully authenticated...
```

That is fine.

## 4. First deploy

From your local project:

```bash
git switch prod
git push -u origin prod
```

Then open GitHub:

```text
Repository -> Actions -> Deploy dzencode-test to VPS
```

Open the latest workflow run and check logs.

If the run is green, open:

```text
http://<VPS_HOST>/
http://<VPS_HOST>/api/orders
```

Expected:

- `/` opens the React app.
- `/api/orders` returns JSON array.

## 5. Normal workflow after setup

Work on normal branch, for example `main`.

When ready to deploy:

```bash
git switch prod
git merge main
git push origin prod
```

Or cherry-pick only selected commits into `prod`.

Do not edit files manually on the VPS. The server should be updated only by
GitHub Actions from `prod`.

## 6. If deploy fails

Check GitHub Actions logs first:

```text
Repository -> Actions -> failed run -> Deploy on VPS via SSH
```

On VPS check containers:

```bash
cd /var/www/dzencode-test
docker compose ps
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
docker compose logs --tail=100 db
```

Restart manually only for debugging:

```bash
docker compose up -d --build --remove-orphans
```
