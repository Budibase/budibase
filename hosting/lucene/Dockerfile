# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under
# the License.

FROM openjdk:8

RUN groupadd -r couchdb && useradd -d /opt/couchdb-lucene -g couchdb couchdb

# grab gosu for easy step-down from root and tini for signal handling
RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
  && curl -o /usr/local/bin/gosu -fSL "https://github.com/tianon/gosu/releases/download/1.7/gosu-$(dpkg --print-architecture)" \
  && curl -o /usr/local/bin/gosu.asc -fSL "https://github.com/tianon/gosu/releases/download/1.7/gosu-$(dpkg --print-architecture).asc" \
  && gpg --verify /usr/local/bin/gosu.asc \
  && rm /usr/local/bin/gosu.asc \
  && chmod +x /usr/local/bin/gosu

ENV COUCHDB_LUCENE_VERSION 2.1.0

RUN apt-get update \
  && apt-get install -y maven \
  && cd /usr/src \
  && curl -L https://github.com/rnewson/couchdb-lucene/archive/v$COUCHDB_LUCENE_VERSION.tar.gz | tar -xz \
  && cd couchdb-lucene-$COUCHDB_LUCENE_VERSION \
  && mvn

RUN cd /usr/src/couchdb-lucene-$COUCHDB_LUCENE_VERSION/target \
  && unzip couchdb-lucene-$COUCHDB_LUCENE_VERSION-dist.zip \
  && mv couchdb-lucene-$COUCHDB_LUCENE_VERSION /opt/couchdb-lucene \
  && rm -rf /usr/src/couchdb-lucene-*

RUN apt-get remove --auto-remove -y maven \
  && rm -rf /var/lib/apt/lists/* \
  && sed -e 's/^host=localhost$/host=0.0.0.0/' -i /opt/couchdb-lucene/conf/couchdb-lucene.ini \
  && sed -e 's/localhost:5984/couchdb:5984/' -i /opt/couchdb-lucene/conf/couchdb-lucene.ini \
  && chown -R couchdb:couchdb /opt/couchdb-lucene

COPY ./run-lucene.sh /opt/couchdb-lucene/run-lucene.sh
RUN chmod +x /opt/couchdb-lucene/run-lucene.sh

WORKDIR /opt/couchdb-lucene
EXPOSE 5985
VOLUME ["/opt/couchdb-lucene/indexes"]
CMD ["./run-lucene.sh"]
