#!/bin/bash
id=$(docker run -t -d -p 10000:10000 budibase:latest)
docker exec -it $id bash
docker kill $id
