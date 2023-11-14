# Kubernetes + Nginx guide

For testing on local machine, I chose to use Minikube rather than Kubernetes and Nginx separately

Minikube is a tool that runs a sinle-node Kubernetes cluster in a docker container to help with deploying and testing out Kubernetes clusters easily

---

Step 1: Install Minikube on your machine

---

Step 2: Go to command line and run

```bash
sudo vim /etc/hosts

#Add the following line to the file opened in vim

127.0.0.1       peerprep.com
```

After adding the line, your file should look similar to this. Minikube has its own IP that it is assigning to peerprep.com, when we tunnel with minikube, we are assigning our 127.0.0.1 to route to the minikube IP so we can test on our localhost.
![pic](/pics/ipconfig.png)

---

Step 3: Go to command line and run

```bash
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

```bash
./cleanup

minikube stop
```

---

To view your pod logs

```bash
kubectl get all

kubectl logs [copy paste the pod name]

#Got a bunch of other useful kubectl commands also
```

---

For deployment on GKE:

On cloud console

```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace

git clone https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g56.git

cd gke-cluster

chmod +x deploy.sh

./deploy.sh
```

On your local terminal

```bash
sudo vim /etc/hosts

#Add this line
<External Load Balancer IP without the port number>   peerprep.com
```
