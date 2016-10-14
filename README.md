# Grain

Storing AWS Keys anywhere, under any circumstance is a bad idea. At companies that use AWS, developers often store production, staging and/or development keys of varying privileges on their own machines.

I've seen different attempts to get around this "problem", like forcing developers to use cloud servers to develop on. However, when doing this you lose the efficiency of local development, like IDE tooling. Using third party applications also becomes a struggle.

Grain is an _attempt_ at solving this problem. It consists of three relatively easy-to-use components (described below) and is built upon languages and technologies that are pretty ubiquitous. All three components come together to run a mock EC2 Metadata service.

* **Grain Client**: A small docker container.
* **Grain CLI**: A simple Node.JS CLI application.
* **Grain Server**: Mock EC2 Metadata service running on Lambda.

## Requirements

On your machine you'll need:

* OS X, Linux or Windows
* Node.JS & NPM
* Docker

_For setup you'll need AWS Account Credentials._
