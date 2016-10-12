FROM node:6.6

MAINTAINER David Kelley <david.james.kelley@gmail.com>

ARG ver=1.0.0-rc.2

RUN npm install -g serverless@$ver

ADD . /server

WORKDIR /server

RUN npm install
