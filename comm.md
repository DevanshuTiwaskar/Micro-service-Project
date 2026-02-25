Perfect — here is a **clean, practical list of IMPORTANT COMMANDS** you used (and should remember) during this whole Docker + microservices setup.
You can **copy-paste this into your README or PROJECT_STATUS.md**.

---

## 🐳 Docker – Core Commands

### Check Docker is running

```bash
docker --version
docker info
```

---

### Build Docker image

```bash
docker build -t music-auth .
docker build -t music-music .
docker build -t notification-notification .
```

---

### Run a container manually

```bash
docker run -p 3000:3000 music-auth
docker run --env-file .env -p 3000:3000 music-auth
```

---

### Run container in background

```bash
docker run -d -p 3000:3000 music-auth
```

---

### List containers

```bash
docker ps
docker ps -a
```

---

### View container logs

```bash
docker logs <container_id>
docker logs -f <container_id>
```

---

### Stop / Remove containers

```bash
docker stop <container_id>
docker rm <container_id>
```

---

### Remove images

```bash
docker rmi <image_id>
```

---

## 📦 Docker Compose – MOST IMPORTANT

### Start all services

```bash
docker-compose up
```

---

### Start + rebuild images

```bash
docker-compose up --build
```

---

### Run in background (recommended)

```bash
docker-compose up -d
```

---

### Stop all services

```bash
docker-compose down
```

---

### Stop + remove volumes

```bash
docker-compose down -v
```

---

### View compose logs

```bash
docker-compose logs
docker-compose logs auth
docker-compose logs notification
```

---

## 🧠 Redis Commands

### Run Redis manually

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

---

### Connect to Redis CLI

```bash
docker exec -it redis redis-cli
```

---

### Test Redis

```bash
PING
```

---

## 🐰 RabbitMQ Commands

### RabbitMQ Management UI

```
http://localhost:15672
username: guest
password: guest
```

---

### RabbitMQ container (via compose)

```bash
rabbitmq:3-management
```

---

## 📧 Email / Notification Debugging

### Verify env variables inside container

```bash
docker exec -it notification-notification-1 sh
printenv
```

---

### Restart only notification service

```bash
docker-compose restart notification
```

---

## 🧪 Debugging / Cleanup Commands

### Remove everything (nuclear option)

```bash
docker system prune -a
```

⚠️ Removes all containers, images, networks

---

## 🗂 Git / Project Commands (Recommended)

### Save progress

```bash
git status
git add .
git commit -m "Dockerized auth, music, notification services"
```

---

## 🧠 MOST IMPORTANT RULES (REMEMBER)

### 🔹 After code change:

* **YES rebuild required**

```bash
docker-compose up --build
```

### 🔹 Only `.env` change:

* **NO rebuild needed**

```bash
docker-compose restart
```

---

## ✅ Your Current Working Stack

| Service      | Port  |
| ------------ | ----- |
| Auth         | 3000  |
| Music        | 3002  |
| Notification | 3001  |
| RabbitMQ UI  | 15672 |
| Redis        | 6379  |

---

If you want next, I can:

* Create **README.md (final version)**
* Give **next-step command list (API Gateway)**
* Prepare **production Docker tips**
* Create **.env.example for all services**

Just tell me 👍

minikube status
minikube start 
minikube dashboard
kubectl apply -f k8s/  ---> apply
kubectl get pods
kubectl get services
minikube service api-gateway --url



eval $(minikube docker-env)

docker build -t frontend:latest ./Frontend

kubectl rollout restart deployment frontend

kubectl get pods -w

minikube service frontend --url

minikube service api-gateway --url



# Check whether Minikube and Kubernetes components are running
minikube status

# Start a local Kubernetes cluster using Minikube
minikube start

# Open the Kubernetes dashboard in browser (UI to see pods, services, deployments)
minikube dashboard

# Apply all Kubernetes YAML files present inside the k8s/ folder
# (creates pods, services, deployments, config, etc.)
kubectl apply -f k8s/

# Show all running pods (containers) in the cluster
kubectl get pods

# Show all services (ways to access pods inside/outside cluster)
kubectl get services

# Get the public URL of api-gateway service to access it from browser/Postman
minikube service api-gateway --url


# Point Docker CLI to Minikube’s internal Docker
# So images are built directly inside Minikube
eval $(minikube docker-env)

# Build frontend Docker image from ./Frontend folder
# Image name: frontend, tag: latest
docker build -t frontend:latest ./Frontend

# Restart frontend deployment so it uses the new Docker image
kubectl rollout restart deployment frontend

# Watch pods live (useful to see restart, crash, or running status)
kubectl get pods -w

# Get the public URL of frontend service
minikube service frontend --url

# Get the public URL of api-gateway service again (after restart/update)
minikube service api-gateway --url
