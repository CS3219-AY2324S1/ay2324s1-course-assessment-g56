#!/bin/bash

#Follow this order ConfigMap, PVC, Deployments, Services, Ingress

# Apply secrets and configmaps
kubectl apply -f firebase-secret.yaml
kubectl apply -f supabase-secret.yaml
kubectl apply -f backend-config.yaml
kubectl apply -f frontend-config.yaml
kubectl apply -f peerprep-com-tls-secret.yaml
kubectl apply -f j0-db-config.yaml

# Apply PVCs
kubectl apply -f j0-postgres-pvc.yaml
kubectl apply -f j0-redis-pvc.yaml

# judge0
kubectl apply -f j0-workers-deployment.yaml
kubectl apply -f j0-server-service.yaml
kubectl apply -f j0-postgres-service.yaml
kubectl apply -f j0-redis-service.yaml

# Apply Deployments and Services
kubectl apply -f question-service.yaml
kubectl apply -f matching-service.yaml
kubectl apply -f user-service.yaml
kubectl apply -f room-service.yaml
kubectl apply -f video-token-service.yaml
kubectl apply -f frontend.yaml

# Apply ingress
kubectl apply -f peer-prep-ingress.yaml
