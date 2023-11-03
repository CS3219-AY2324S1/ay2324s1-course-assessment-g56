#!/bin/bash

# Secrets and configmaps
kubectl delete ingress --all
kubectl delete deployment --all
kubectl delete service --all
kubectl delete configmap --all
kubectl delete secret --all
kubectl delete pod --all