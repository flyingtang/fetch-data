#!/bin/sh

docker login --username=txg5214 registry-vpc.cn-shenzhen.aliyuncs.com

# npm run build

docker build -t vinda-fetch-article -f article.Dockerfile . 

docker tag vinda-fetch-article:latest registry-vpc.cn-shenzhen.aliyuncs.com/vinda/vinda-fetch-article:1.0.0

docker push registry-vpc.cn-shenzhen.aliyuncs.com/vinda/vinda-fetch-article:1.0.0