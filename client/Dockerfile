FROM nginx:1.11.3

MAINTAINER David Kelley <david.james.kelley@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

ENV LISTEN_ON 80

ENV SERVER_NAME localhost

ENV GRAIN_SECRET ____

ENV GRAIN_ENDPOINT ____

ENV GRAIN_IDENTIFIER ____

ENV CONFD_VERSION 0.10.0

ENV LUA_PACKAGE_PATH /nginx/lua

RUN update-ca-certificates

ADD etc/confd /etc/confd

ADD libs/confd/confd-${CONFD_VERSION}-linux-amd64 /bin/confd

WORKDIR /nginx

ADD sh/boot boot

CMD ["./boot"]
