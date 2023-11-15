# Kubernetes + Nginx guide

For testing on local machine, I chose to use Minikube rather than Kubernetes and Nginx separately

Minikube is a tool that runs a sinle-node Kubernetes cluster in a docker container to help with deploying and testing out Kubernetes clusters easily

---

Step 1: Install Minikube on your machine

---

Step 2: Go to command line and run

```
sudo vim /etc/hosts

#Add the following line to the file opened in vim

127.0.0.1       peerprep.com
```

After adding the line, your file should look similar to this. Minikube has its own IP that it is assigning to peerprep.com, when we tunnel with minikube, we are assigning our 127.0.0.1 to route to the minikube IP so we can test on our localhost.
![pic](/pics/ipconfig.png)

---

Step 3: Go to command line and run

```
minikube start

minikube addons enable ingress

cd [PATH_TO_THIS_FOLDER]

./deploy.sh

minikube tunnel
```

If you get warning about docker context, run `docker context use default`.

---

Step 4: Go to peerprep.com to test

---

Step 5: When you are done run

```
./cleanup

minikube stop
```

---

To view your pod logs

```
kubectl get all

kubectl logs [copy paste the pod name]

#Got a bunch of other useful kubectl commands also
```



---

For deployment on GKE:

On cloud console
```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace


git clone https://github.com/kyueran/cs3219-gke.git

cd cs3219-gke

gcloud container node-pools update default-pool --location=us-central1-c --cluster=cluster-1 --system-config-from-file=c_group_mode.yaml

gcloud container clusters update cluster-1 --gateway-api=standard --location=us-central1-a

chmod +x deploy.sh

./deploy.sh
```

On your local terminal 
```
sudo vim /etc/hosts

#Add this line
<load balancer IP>   peerprep.com
```
