# AWS Deployment Target for CloudShop

This project is implemented as a portable cloud-native application using Docker, Docker Compose, Kubernetes manifests, MongoDB and RabbitMQ. For the assignment explanation, the selected cloud provider is **AWS**.

## Why AWS?

AWS is suitable because it provides managed services for container deployment, scaling, load balancing, security, monitoring and secrets management. The application can first be demonstrated locally using Docker Compose, then deployed to AWS with minimal changes.

## AWS Service Mapping

| Project Component | Local/Demo Tool | AWS Production Equivalent |
|---|---|---|
| API Gateway container | Docker/Kubernetes Service | Amazon EKS service behind AWS Application Load Balancer |
| Auth/Product/Order microservices | Docker containers | Amazon EKS Deployments or Amazon ECS Services |
| Container image storage | Local Docker images | Amazon Elastic Container Registry (ECR) |
| MongoDB databases | MongoDB containers | Amazon DocumentDB or MongoDB Atlas on AWS |
| RabbitMQ message broker | RabbitMQ container | Amazon MQ for RabbitMQ |
| Load balancing | Docker/K8s Service | AWS Application Load Balancer |
| Auto scaling | Kubernetes HPA | EKS HPA with CloudWatch metrics / Cluster Autoscaler |
| Secrets | .env file | AWS Secrets Manager / Parameter Store |
| Logs and monitoring | Console logs | Amazon CloudWatch Logs and Metrics |
| CI/CD | GitHub Actions/Jenkinsfile | GitHub Actions/Jenkins pushing images to ECR and deploying to EKS |

## AWS High-Level Architecture

```text
Users
  |
  v
AWS Application Load Balancer
  |
  v
API Gateway Pod/Service on EKS
  |
  +--> Auth Service Pods  ---> Amazon DocumentDB / MongoDB Atlas users DB
  |
  +--> Product Service Pods ---> Amazon DocumentDB / MongoDB Atlas products DB
  |          |
  |          v
  |     Amazon MQ RabbitMQ
  |          |
  |          v
  +--> Order Service Pods ---> Amazon DocumentDB / MongoDB Atlas orders DB
```

## Assignment Positioning

For the practical submission/demo, Docker Compose is used because it is easy for the examiner to run locally. For the cloud-native architecture discussion, AWS is the selected target cloud environment. This satisfies both practical deployability and cloud architecture requirements.
