# 🚀 Future AGI | Professional Deployment Guide

This guide outlines the steps to deploy the **Future AGI** platform in a production environment using Docker and Nginx.

## 📋 Prerequisites
*   Docker Engine v24.0+
*   Docker Compose v2.20+
*   Domain Name (e.g., `agi.yourdomain.com`)
*   SSL Certificates (Optional, recommended via Certbot)

## 🛠️ Step 1: Environment Configuration
Create a `.env` file in the root directory:
```bash
ANTHROPIC_API_KEY=your_key_here
WORK_IQ_CLIENT_ID=your_client_id
DATABASE_URL=sqlite:///./data/prod.db
RETELL_API_KEY=your_key
ULTRAVOX_API_KEY=your_key
```

## 🏗️ Step 2: Build the Infrastructure
Build and start the containers in detached mode:
```bash
docker compose up -d --build
```

## 🛡️ Step 3: Verify Health Status
Check if all services are running correctly:
```bash
docker compose ps
```
The `future_agi` service should show as `(healthy)` thanks to our built-in healthcheck logic.

## 🌐 Step 4: Reverse Proxy & SSL
By default, Nginx listens on port 80. To enable SSL:
1.  Map port 443 in `docker-compose.yml`.
2.  Update `nginx.conf` with your SSL certificate paths.
3.  Restart the gateway: `docker compose restart gateway`.

## 📈 Step 5: Monitoring & Logs
Access real-time logs to ensure high-throughput processing (29k req/sec):
```bash
docker compose logs -f future_agi
```

---
*Professional Deployment Standard v2.0 | Kirov Dynamics Technology*
