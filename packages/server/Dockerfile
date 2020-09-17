FROM node:12-alpine

WORKDIR /app

ENV CLOUD=1
ENV COUCH_DB_URL=https://couchdb.budi.live:5984
env BUDIBASE_ENVIRONMENT=PRODUCTION

# copy files and install dependencies
COPY . ./
RUN yarn 

EXPOSE 4001

CMD ["yarn", "run:docker"]
