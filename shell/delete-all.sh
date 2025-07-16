#!/bin/bash

echo "CronJob 삭제"
kubectl delete -f cronjob.yaml --ignore-not-found

echo "CronJob용 Secret 삭제"
kubectl delete -f secret.yaml --ignore-not-found

echo "웹앱 리소스 삭제 (HPA, Service, Deployment, ConfigMap)"
kubectl delete -f newsum-service-hpa.yaml --ignore-not-found
kubectl delete -f newsum-deployment.yaml --ignore-not-found
kubectl delete -f newsum-configmap.yaml --ignore-not-found

echo "DB 리소스 삭제 (Service, StatefulSet, ConfigMap)"
kubectl delete -f mysql-service.yaml --ignore-not-found
kubectl delete -f mysql-statefulset.yaml --ignore-not-found
kubectl delete -f db-configmap.yaml --ignore-not-found

echo "pvc, pv 삭제"
kubectl delete pvc data-mysql-db-0 -n site
kubectl delete pv raid-pv -n site

echo "----- 모든 리소스가 성공적으로 삭제되었습니다 -----"
