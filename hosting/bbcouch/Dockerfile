FROM couchdb:3.2.1

ENV COUCHDB_USER admin
ENV COUCHDB_PASSWORD admin
EXPOSE 5984

RUN apt-get update && apt-get install -y software-properties-common wget unzip curl && \
    apt-add-repository 'deb http://security.debian.org/debian-security stretch/updates main' && \
    apt-get update && apt-get install -y openjdk-8-jdk

# setup clouseau
WORKDIR /
RUN wget https://github.com/cloudant-labs/clouseau/releases/download/2.21.0/clouseau-2.21.0-dist.zip && \
  unzip clouseau-2.21.0-dist.zip && \
  mv clouseau-2.21.0 /opt/clouseau && \
  rm clouseau-2.21.0-dist.zip

WORKDIR /opt/clouseau
RUN mkdir ./bin
ADD clouseau/clouseau ./bin/
ADD clouseau/log4j.properties clouseau/clouseau.ini ./
RUN chmod +x ./bin/clouseau

# setup CouchDB
WORKDIR /opt/couchdb
ADD couch/vm.args couch/local.ini ./etc/

WORKDIR /
ADD runner.sh ./bbcouch-runner.sh
RUN chmod +x ./bbcouch-runner.sh
ENTRYPOINT ["./bbcouch-runner.sh"]
