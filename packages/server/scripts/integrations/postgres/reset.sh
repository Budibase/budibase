#!/bin/bash
docker-compose down
docker volume prune -f
docker volume rm postgres_pg_data
