#/bin/bash
POD=$(kubectl get pods -n db-prod --kubeconfig /root/.kube/config --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
DATE=$(date +"%Y-%m-%d-%H%M%S")
kubectl exec $POD -n db-prod --kubeconfig /root/.kube/config --  pg_dumpall -U techuser -f "taskmanager-$DATE".sql
kubectl cp db-prod/$POD:/taskmanager-$DATE.sql /postgres/files/taskmanager-$DATE.sql
