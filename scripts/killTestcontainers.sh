#!/bin/bash

# Find all Docker containers with the label "org.testcontainers=true"
containers=$(docker ps -q -f "label=org.testcontainers=true")

# Check if there are any containers to stop
if [ -z "$containers" ]; then
  echo "No containers with label 'org.testcontainers=true' found."
else
  # Stop the containers
  echo "Stopping containers..."
  docker stop $containers

  # Remove the containers
  echo "Removing containers..."
  docker rm $containers

  echo "Containers have been stopped and removed."
fi