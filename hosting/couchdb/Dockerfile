# Modified from https://github.com/apache/couchdb-docker/blob/main/3.3.3/Dockerfile
#
# Everything in this `base` image is adapted from the official `couchdb` image's
# Dockerfile. Only modifications related to upgrading from Debian bullseye to
# bookworm have been included. The `runner` image contains Budibase's
# customisations to the image, e.g. adding Clouseau.
FROM node:20-slim AS base

# Add CouchDB user account to make sure the IDs are assigned consistently
RUN groupadd -g 5984 -r couchdb && useradd -u 5984 -d /opt/couchdb -g couchdb couchdb

# be sure GPG and apt-transport-https are available and functional
RUN set -ex; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        apt-transport-https \
        ca-certificates \
        dirmngr \
        gnupg \
     ; \
    rm -rf /var/lib/apt/lists/*

# grab tini for signal handling and zombie reaping
# see https://github.com/apache/couchdb-docker/pull/28#discussion_r141112407
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends tini; \
    rm -rf /var/lib/apt/lists/*; \
    tini --version

# http://docs.couchdb.org/en/latest/install/unix.html#installing-the-apache-couchdb-packages
ENV GPG_COUCH_KEY \
# gpg: rsa8192 205-01-19 The Apache Software Foundation (Package repository signing key) <root@apache.org>
    390EF70BB1EA12B2773962950EE62FB37A00258D
RUN set -eux; \
    apt-get update; \
    apt-get install -y curl; \
    export GNUPGHOME="$(mktemp -d)"; \
    curl -fL -o keys.asc https://couchdb.apache.org/repo/keys.asc; \
    gpg --batch --import keys.asc; \
    gpg --batch --export "${GPG_COUCH_KEY}" > /usr/share/keyrings/couchdb-archive-keyring.gpg; \
    command -v gpgconf && gpgconf --kill all || :; \
    rm -rf "$GNUPGHOME"; \
    apt-key list; \
    apt purge -y --autoremove curl; \
    rm -rf /var/lib/apt/lists/*

ENV COUCHDB_VERSION 3.3.3

RUN . /etc/os-release; \
    echo "deb [signed-by=/usr/share/keyrings/couchdb-archive-keyring.gpg] https://apache.jfrog.io/artifactory/couchdb-deb/ ${VERSION_CODENAME} main" | \
        tee /etc/apt/sources.list.d/couchdb.list >/dev/null

# https://github.com/apache/couchdb-pkg/blob/master/debian/README.Debian
RUN set -eux; \
    apt-get update; \
    \
    echo "couchdb couchdb/mode select none" | debconf-set-selections; \
# we DO want recommends this time
    DEBIAN_FRONTEND=noninteractive apt-get install -y --allow-downgrades --allow-remove-essential --allow-change-held-packages \
            couchdb="$COUCHDB_VERSION"~bookworm \
    ; \
# Undo symlinks to /var/log and /var/lib
    rmdir /var/lib/couchdb /var/log/couchdb; \
    rm /opt/couchdb/data /opt/couchdb/var/log; \
    mkdir -p /opt/couchdb/data /opt/couchdb/var/log; \
    chown couchdb:couchdb /opt/couchdb/data /opt/couchdb/var/log; \
    chmod 777 /opt/couchdb/data /opt/couchdb/var/log; \
# Remove file that sets logging to a file
    rm /opt/couchdb/etc/default.d/10-filelog.ini; \
# Check we own everything in /opt/couchdb. Matches the command in dockerfile_entrypoint.sh
    find /opt/couchdb \! \( -user couchdb -group couchdb \) -exec chown -f couchdb:couchdb '{}' +; \
# Setup directories and permissions for config. Technically these could be 555 and 444 respectively
# but we keep them as 755 and 644 for consistency with CouchDB defaults and the dockerfile_entrypoint.sh.
    find /opt/couchdb/etc -type d ! -perm 0755 -exec chmod -f 0755 '{}' +; \
    find /opt/couchdb/etc -type f ! -perm 0644 -exec chmod -f 0644 '{}' +; \
# only local.d needs to be writable for the docker_entrypoint.sh
    chmod -f 0777 /opt/couchdb/etc/local.d; \
# apt clean-up
    rm -rf /var/lib/apt/lists/*;

# Add configuration
COPY --chown=couchdb:couchdb couch/10-docker-default.ini /opt/couchdb/etc/default.d/
# COPY --chown=couchdb:couchdb vm.args /opt/couchdb/etc/

COPY docker-entrypoint.sh /usr/local/bin
RUN ln -s usr/local/bin/docker-entrypoint.sh /docker-entrypoint.sh # backwards compat
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]

VOLUME /opt/couchdb/data

# 5984: Main CouchDB endpoint
# 4369: Erlang portmap daemon (epmd)
# 9100: CouchDB cluster communication port
EXPOSE 5984 4369 9100
CMD ["/opt/couchdb/bin/couchdb"]

FROM base as runner
ARG TARGETARCH
ENV TARGETARCH $TARGETARCH

ENV COUCHDB_USER admin
ENV COUCHDB_PASSWORD admin
EXPOSE 5984
EXPOSE 4984

RUN apt-get update && apt-get install -y --no-install-recommends software-properties-common wget unzip curl && \
    wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | apt-key add - && \
    apt-add-repository 'deb http://security.debian.org/debian-security bookworm-security/updates main' && \
    apt-add-repository 'deb http://archive.debian.org/debian stretch-backports main' && \
    apt-add-repository 'deb https://packages.adoptium.net/artifactory/deb bookworm main' && \
    apt-get update && apt-get install -y --no-install-recommends temurin-8-jdk && \
    rm -rf /var/lib/apt/lists/

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

# setup CouchDB
WORKDIR /opt/couchdb
ADD couch/vm.args couch/local.ini ./etc/

# setup SQS
WORKDIR /opt/sqs
ADD sqs ./
RUN chmod +x ./install.sh && ./install.sh

WORKDIR /
ADD runner.sh ./bbcouch-runner.sh
RUN chmod +x ./bbcouch-runner.sh /opt/clouseau/bin/clouseau /opt/sqs/sqs
CMD ["./bbcouch-runner.sh"]
