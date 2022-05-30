echo "#/bin/bash
POD=$(kubectl get pods -n prod --kubeconfig /root/.kube/config --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
DATE=$(date +"%Y-%m-%d-%H%M%S")
kubectl exec $POD -n db-prod --kubeconfig /root/.kube/config --  pg_dumpall -U techuser -f "taskmanager-$DATE".sql" > script.sh
