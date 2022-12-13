FROM budibase/couchdb

ENV DATA_DIR /data
RUN mkdir /data

RUN apt-get update && \
  apt-get install -y --no-install-recommends redis-server

WORKDIR /minio
ADD scripts/install-minio.sh ./install.sh
RUN chmod +x install.sh && ./install.sh

WORKDIR /

ADD tests/runner.sh .
RUN chmod +x ./runner.sh

EXPOSE 5984
EXPOSE 9000
EXPOSE 6379

CMD ["./runner.sh"]
