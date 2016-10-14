# Grain

_"Storing AWS Credentials anywhere, under any circumstance is a bad idea."_

At companies that use AWS, developers often store production, staging and/or development keys of varying privileges on their own machines.

I've seen different attempts to get around this "problem", like forcing developers to use cloud servers to develop on. However, when doing this you lose the efficiency of local development, like IDE tooling. Using third party applications also becomes a struggle.

In addition to this, developers are often provided with privileged login credentials in-order to access the AWS Console for development and deployment purposes.

Grain is an _attempt_ at solving this problem. Whilst also helping to lockdown access to resources, it is also aimed at making life easier for developers: Switching credential profiles, automated logging in to the AWS Console, preventing "accidents" and auto-configuration of the AWS SDK.

It consists of three relatively easy-to-use components (described below) and is built upon languages and technologies that are pretty ubiquitous and _should_ already be installed. All three components come together to run a mock EC2 Metadata service, which communicates with a simple set of Lambda functions, controlled via a CLI.

* **Grain Client**: A small docker container running Nginx acting as a proxy.
* **Grain CLI**: A simple Node.JS CLI application.
* **Grain Server**: Mock EC2 Metadata service running on Lambda.

These three components enable IT Support and team leads to provide finely-tuned access control to an account (via federated access), or to individual team members via profiles. Additionally, profiles can be configured to enable session-based access to the AWS Console, removing the need for individually-managed login credentials altogether.

## Requirements

On your machine you'll need:

* OS X, Linux or Windows
* Node.JS & NPM
* Docker (~v1.12)

_For initial setup you'll need [Docker Content Trust](https://docs.docker.com/engine/security/trust/content_trust/) enabled and administrative AWS Credentials._

## Getting Started

#### Deploying Grain Server

Before we can do anything else, we need to deploy the lambda functions that allow us to emulate the EC2 Metadata service locally. The Grain server is packaged as a [Docker container](https://hub.docker.com/r/davidkelley/grain/), that allows you to easily deploy the functions to a configured AWS Account.

Your AWS Account always needs to be secure. In order to ensure that the code you'll be deploying to your AWS Account is safe, the official container is signed and trusted. **Do not deploy with any container that is not trusted.**

As the container is signed, you'll need to enable [Docker Content Trust](https://docs.docker.com/engine/security/trust/content_trust/) inside your shell (if you haven't already). To do this, simply run:

```
export DOCKER_CONTENT_TRUST=1
```

Once this is done, lets deploy the functions using your AWS keys. In the following command, swap `<stage>` and `<region>` for a level of access (for example `"development"`) and an AWS region like `"us-east-1"`.

```
docker run -e AWS_SECRET_ACCESS_KEY=<secret> -e AWS_ACCESS_KEY_ID=<id> davidkelley/grain:server-v0.1.0 serverless deploy -s <stage> -r <region>
```

Docker will then download the container and deploy the functions to the configured AWS Account, as depicted in the image below.

![Image of terminal deploying functions](https://github.com/davidkelley/grain/raw/master/.github/images/deploy-functions-output.png)

In-order to setup the IAM Permissions for the stage you just deployed, we need to perform a one time configuration. Log into the AWS Console and attach any policies that the stage should have. As demonstrated in the screenshot below.

![Attaching an IAM Policy](https://github.com/davidkelley/grain/raw/master/.github/images/default-empty-role.png)

_TODO....._

## Contributing

Contributors are more than welcome! Please read the [Contributing Document](CONTRIBUTING.md) to learn how you can start working on the project yourself.
