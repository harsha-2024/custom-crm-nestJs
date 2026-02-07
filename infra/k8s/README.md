# Kubernetes Manifests (Skeleton)

This folder contains a minimal namespace manifest. Add Deployments, Services, Ingress, Secrets, and ConfigMaps per service.

Suggested next steps:
- Add a Helm chart to templatize per environment
- Add HorizontalPodAutoscaler (HPA) with CPU and custom metrics
- Add PodDisruptionBudget and PodSecurityPolicies (or PSA)
- Configure external PostgreSQL, Redis, Redpanda/Kafka, and OpenSearch in managed services
