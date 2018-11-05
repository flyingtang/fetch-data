#!/bin/sh

docker login --username=txg5214 registry-vpc.cn-shenzhen.aliyuncs.com

# npm run build

docker build -t vinda-fetch-video -f video.Dockerfile .

docker tag vinda-fetch-video:latest registry-vpc.cn-shenzhen.aliyuncs.com/vinda/vinda-fetch-video:1.0.0

docker push registry-vpc.cn-shenzhen.aliyuncs.com/vinda/vinda-fetch-video:1.0.0