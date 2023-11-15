#!/bin/bash

#Follow this order ConfigMap, PVC, Deployments, Services, Ingress

# Apply secrets and configmaps
kubectl apply -f ./secret-configs/firebase-secret.yaml
kubectl apply -f ./secret-configs/supabase-secret.yaml
kubectl apply -f ./secret-configs/backend-config.yaml
kubectl apply -f ./secret-configs/frontend-config.yaml
kubectl apply -f ./secret-configs/peerprep-com-tls-secret.yaml
kubectl apply -f ./j0/j0-db-config.yaml

# Apply PVCs
kubectl apply -f ./j0/j0-postgres-pvc.yaml
kubectl apply -f ./j0/j0-redis-pvc.yaml

#judge0
kubectl apply -f ./j0/j0-workers-deployment.yaml
kubectl apply -f ./j0/j0-server-service.yaml
kubectl apply -f ./j0/j0-postgres-service.yaml
kubectl apply -f ./j0/j0-redis-service.yaml

# Apply Deployments and Services
kubectl apply -f ./deployments-services/question-service.yaml
kubectl apply -f ./deployments-services/matching-service.yaml
kubectl apply -f ./deployments-services/user-service.yaml
kubectl apply -f ./deployments-services/room-service.yaml
kubectl apply -f ./deployments-services/video-token-service.yaml
kubectl apply -f ./deployments-services/frontend.yaml

#Apply Horizontal Pod Autoscaler
#kubectl apply -f ./hpa/j0/postgres-service-hpa.yaml
#kubectl apply -f ./hpa/j0/redis-service-hpa.yaml
#kubectl apply -f ./hpa/j0/server-service-hpa.yaml
#kubectl apply -f ./hpa/j0/workers-deployment-hpa.yaml
#kubectl apply -f ./hpa/question-service-hpa.yaml
#kubectl apply -f ./hpa/matching-service-hpa.yaml
#kubectl apply -f ./hpa/user-service-hpa.yaml
#kubectl apply -f ./hpa/room-service-hpa.yaml
#kubectl apply -f ./hpa/video-token-service-hpa.yaml

# For demonstration purposes and to adhere to our GCP budget constraints, we only apply the horizontal pod autoscaler for the frontend deployment.
kubectl apply -f ./hpa/frontend-hpa.yaml 

# Apply ingress
kubectl apply -f ./ingress/peer-prep-ingress.yaml
