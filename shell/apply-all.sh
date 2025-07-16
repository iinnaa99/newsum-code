#!/bin/bash

echo "'site' 네임스페이스 존재 여부 확인"
kubectl get namespace site >/dev/null 2>&1 || kubectl create namespace site

echo "StorageClass 존재 여부 확인"
if ! kubectl get storageclass local-storage >/dev/null 2>&1; then
  echo "StorageClass 생성"
  kubectl apply -f storageclass.yaml
else
  echo "StorageClass 'local-storage'는 이미 존재합니다."
fi

echo "PersistentVolume 존재 여부 확인"
if ! kubectl get pv raid-pv >/dev/null 2>&1; then
  echo "PersistentVolume 생성"
  kubectl apply -f raid-pv.yaml
else
  echo "PersistentVolume 'raid-pv'는 이미 존재합니다."
fi

echo "DB용 ConfigMap 생성"
kubectl apply -f db-configmap.yaml

echo "MySQL StatefulSet 및 Service 생성"
kubectl apply -f mysql-statefulset.yaml
kubectl apply -f mysql-service.yaml

echo "웹앱 ConfigMap 생성"
kubectl apply -f newsum-configmap.yaml

echo "웹앱 Deployment, Service + HPA 생성"
kubectl apply -f newsum-deployment.yaml
kubectl apply -f newsum-service-hpa.yaml

echo "CronJob용 Secret 생성"
kubectl apply -f secret.yaml

echo "CronJob 생성"
kubectl apply -f cronjob.yaml

echo "----- 모든 리소스가 성공적으로 적용되었습니다 -----"
