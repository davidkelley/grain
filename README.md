# Grain

Storing AWS Keys anywhere, under any circumstance is a bad idea. At companies that use AWS, developers often store production, staging and/or development keys of varying privileges on their own machines.

I've seen different attempts to get around this "problem", like forcing developers to use cloud servers to develop on. However, when doing this you lose the efficiency of local development, like IDE tooling. Using third party applications also becomes a struggle.

In addition to this, developers are often provided with privileged login credentials in-order to access the AWS Console for development and deployment purposes.

Grain is an _attempt_ at solving this problem. Whilst also helping to lockdown access to resources, it is also aimed at making life easier for developers: Switching credential profiles, automated logging in to the AWS Console, preventing "accidents" and auto-configuration of the AWS SDK.

It consists of three relatively easy-to-use components (described below) and is built upon languages and technologies that are pretty ubiquitous and _should_ already be installed. All three components come together to run a mock EC2 Metadata service, which communicates with a simple set of Lambda functions, controlled via a CLI.

* **Grain Client**: A small docker container.
* **Grain CLI**: A simple Node.JS CLI application.
* **Grain Server**: Mock EC2 Metadata service running on Lambda.

These three components enable IT Support and team leads to provide finely-tuned access control to an account (via federated access), or to individual team members via profiles. Additionally, profiles can be configured to enable session-based access to the AWS Console, removing the need for individually-managed login credentials altogether.

## Requirements

On your machine you'll need:

* OS X, Linux or Windows
* Node.JS & NPM
* Docker

_For initial setup you'll need AWS Account Access Key ID & Secret Credentials._

## Getting Started

0. Follow instructions for deploying the Grain Server [here](server/README.md).
0. Follow instructions for setting up the Grain Client [here](client/README.md).
