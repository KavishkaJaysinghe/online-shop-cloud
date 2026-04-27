# CloudShop Assignment Document

## 1. Introduction

CloudShop is a cloud-native online shopping application designed to demonstrate scalability, high availability, security and modern deployment practices. The system models a real-world online shop where users can register, log in, add/list products and place orders. The application is intentionally designed as a set of small services instead of one large monolithic application so that each service can be developed, deployed and scaled independently.

The core cloud principles demonstrated are microservices, API gateway routing, containerized deployment, database-per-service, asynchronous communication using a message broker, JWT-based security, and horizontal scaling readiness.

## 2. Architecture

The application contains four main application services: API Gateway, Auth Service, Product Service and Order Service. MongoDB is used as the database layer and RabbitMQ is used as the asynchronous communication layer.

The user accesses the system through the API Gateway. The gateway forwards authentication requests to the Auth Service, product requests to the Product Service, and order history requests to the Order Service. This gives the client one stable endpoint and hides the internal service topology.

The Product Service and Order Service use asynchronous communication. When a user buys products, the Product Service publishes an order message to RabbitMQ. The Order Service consumes the message, saves the order and publishes a completion message back. This design avoids tight coupling and improves availability because an order request can be accepted even when downstream processing is temporarily slower.

Each major service has its own MongoDB database. This database-per-service style improves independence and allows future services to evolve without breaking other services.

## 3. Implementation Steps

First, the application was separated into microservices. The Auth Service handles user registration, password hashing with bcrypt, login and JWT issuing. The Product Service handles product creation, product listing and order request publishing. The Order Service consumes order messages, stores order records and exposes order history APIs. The API Gateway exposes a single public endpoint and routes requests to the correct internal service.

Second, security controls were added. Passwords are hashed before storage, JWT tokens protect product and order APIs, Helmet adds HTTP security headers, rate limiting reduces abuse, request body size is limited and secrets are passed through environment variables.

Third, Dockerfiles were added for each service and Docker Compose was configured to start the complete system with RabbitMQ and separate MongoDB databases. This makes the project easy to run on any machine with Docker.

Fourth, asynchronous messaging was implemented with RabbitMQ. This demonstrates event-driven design and allows order processing to scale separately from product browsing.

Finally, Kubernetes deployment files and HPA examples were added to show how the same services can be deployed to a cloud cluster and scaled horizontally.

## 4. Scalability and High Availability

The services are stateless, so multiple replicas can run at the same time. The Product Service can be scaled when product browsing or order requests increase. The Order Service can be scaled when order processing load increases. RabbitMQ provides a queue between services, which helps absorb traffic spikes.

High availability is improved by separating responsibilities. If the order processing service is temporarily slow, the product service can still accept requests and publish messages. Health endpoints are included so that container platforms can monitor service status. In Kubernetes, replicas and HPA can be used to recover failed pods and scale services based on CPU usage.

## 5. Challenges Faced

One challenge was designing communication between services without making them tightly dependent on each other. This was solved by using REST through the gateway for synchronous user actions and RabbitMQ for asynchronous order processing.

Another challenge was making the project simple to deploy while still demonstrating cloud-native ideas. Docker Compose was used for local execution, while Kubernetes files were added to show cloud deployment readiness.

Security was also a challenge because a demo system can easily expose weak defaults. The project therefore uses JWT, password hashing, rate limiting, security headers and environment variables for secrets.

## 6. Lessons Learned

This project shows that cloud-native design is not only about deploying an application to the cloud. It is about designing the application so that services can fail, scale and evolve independently. API gateways simplify client communication, message brokers support asynchronous processing, containers simplify deployment, and DevOps files make delivery repeatable.

The project also shows the importance of security from the beginning. Authentication, authorization, secure password storage and proper configuration management are essential even in small applications.
