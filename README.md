# 🛒 CloudShop – Cloud-Native Online Shopping Platform

## 📌 Introduction
CloudShop is a scalable, secure, and highly available cloud-native online shopping application designed using microservices architecture. It demonstrates core cloud computing principles such as scalability, high availability, security, asynchronous communication, and modern DevOps deployment.

---

## 🏗️ Architecture Diagram

![CloudShop Architecture](./cloudshop_architecture.png)

---

## 🏗️ Architecture Overview

### System Components

- **API Gateway** – Single entry point for client requests.
- **Auth Service** – Handles user registration, login, JWT authentication, and password hashing.
- **Product Service** – Manages product creation and product listing.
- **Order Service** – Processes customer orders.
- **RabbitMQ** – Message broker for asynchronous communication.
- **MongoDB** – Database used by microservices.

### System Flow

```text
User → API Gateway → Auth Service
                 → Product Service → RabbitMQ → Order Service
                 → Order Service
```

---

## ☁️ Cloud-Native Features

### Microservices Architecture
Each major function is separated into an independent service. This improves maintainability and allows services to be scaled independently.

### Scalability
The system supports horizontal scaling by running multiple instances of services:

```bash
docker compose up --scale product=3 --scale order=2 --scale auth=2
```

### High Availability
Multiple service instances reduce the impact of service failure. RabbitMQ also helps prevent order loss by decoupling services.

### Asynchronous Communication
RabbitMQ is used to process orders asynchronously. Product-related purchase requests are published as messages, and the Order Service consumes them.

---

## 🔐 Security Features

- JWT-based authentication
- Bcrypt password hashing
- HTTP security headers using Helmet
- Rate limiting to reduce abuse
- Protected API endpoints

---

## 🔄 Communication Methods

| Communication Type | Implementation |
|---|---|
| Synchronous | REST APIs through API Gateway |
| Asynchronous | RabbitMQ using AMQP |

---

## ⚙️ Deployment & DevOps

The project is simple to deploy and demonstrates modern deployment practices:

- Docker for service containerization
- Docker Compose for local orchestration
- Kubernetes manifests for cloud deployment readiness
- Jenkinsfile / GitHub Actions for CI/CD workflow support

---

## ☁️ AWS Deployment Mapping

Although the project is demonstrated locally using Docker Compose, it is designed for deployment on AWS.

| Project Component | AWS Service Mapping |
|---|---|
| Docker containers | Amazon ECS / Amazon EKS |
| Container image registry | Amazon ECR |
| MongoDB database | Amazon DocumentDB / MongoDB Atlas |
| RabbitMQ message broker | Amazon MQ for RabbitMQ |
| Traffic routing | Application Load Balancer |
| Monitoring and logs | Amazon CloudWatch |
| Secret management | AWS Secrets Manager |

---

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd online-shop-cloud-main
```

### 2. Create environment file

```bash
cp .env.example .env
```

For Windows CMD:

```cmd
copy .env.example .env
```

### 3. Start the system

```bash
docker compose up --build
```

### 4. Access the application

- Web UI: http://localhost:3003
- RabbitMQ Dashboard: http://localhost:15672
  - Username: `guest`
  - Password: `guest`

---

## 🧪 Demo Steps

1. Register a new user.
2. Login using the registered credentials.
3. Add a product.
4. Load product list.
5. Select a product and buy it.
6. Verify asynchronous order processing using RabbitMQ dashboard.

---

## 📊 Database Design

The application follows a database-per-service approach. This improves independence, scalability, and fault isolation between services.

---

## ➕ Extensibility

New features or services can be added without breaking the existing system. For example, a payment service, notification service, or inventory service can be added and connected through the API Gateway and RabbitMQ.

---

## ⚠️ Challenges Faced

- Managing communication between multiple services
- Handling asynchronous message flow using RabbitMQ
- Containerizing and orchestrating all services
- Designing a secure authentication flow
- Preparing the system for cloud deployment

---

## 📚 Lessons Learned

- How microservices support cloud-native design
- How Docker simplifies deployment
- How RabbitMQ improves scalability and decoupling
- How JWT and bcrypt improve application security
- How local deployment can map to AWS cloud services

---

## ✅ Assignment Requirement Coverage

| Requirement | Implementation |
|---|---|
| Real-world system | Online shopping platform |
| Scalability | Horizontal service scaling |
| High availability | Multiple service instances and queue-based design |
| Synchronous communication | REST APIs |
| Asynchronous communication | RabbitMQ |
| Security | JWT, bcrypt, Helmet, rate limiting |
| Deployment tools | Docker, Docker Compose, Kubernetes, CI/CD files |
| Database selection | MongoDB per service |
| Easy deployment | `docker compose up --build` |
