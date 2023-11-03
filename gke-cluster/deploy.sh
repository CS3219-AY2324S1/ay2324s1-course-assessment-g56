#!/bin/bash

# Apply secrets and configmaps
kubectl apply -f firebase-secret.yaml
kubectl apply -f supabase-secret.yaml
kubectl apply -f main-config.yaml

# Apply Deployments and Services
kubectl apply -f question-service.yaml
kubectl apply -f matching-service.yaml
kubectl apply -f user-service.yaml
kubectl apply -f frontend.yaml

# Apply ingress
kubectl apply -f peer-prep-ingress.yaml
