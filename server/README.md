# Grain Server

The server component of Grain is written using the [Serverless Framework](https://github.com/serverless/serverless) and provides several lambda functions that emulate an API for the EC2 Metadata service. You can deploy the functions on multiple stages, in-order to determine the level of access provided for each stage. Such stages could be named, `read-only`, `development` or `administrator`.

For example, deploying a stage `development` on the AWS Region `us-east-1` (`-s development -r us-east-1`), would create a role `development.us-east-1@grain`in IAM, that can be controlled by attaching custom or managed policies in the AWS Console.

The initial setup also creates a "master" API Key which can be used to create keys via the CLI, for users on the associated stage.

## Getting Started

**All Docker containers provided in the Grain project are signed and verified. Never trust and don't ever deploy anything to your AWS Account from an unsigned container.**

You can either run `docker pull --disable-content-trust=false davidkelley/grain:server-v0.1.0` or build the container yourself with the following command `docker build -t <username>/grain:server-v0.1.0 .` from inside the `server/` directory.

_Note: When building the container on your local machine, you can supply a `$ver` arg to configure which release of Serverless is installed globally._

## Deploying the functions

You can use the container to deploy the functions to AWS using the commands below.

```
docker run -e AWS_SECRET_ACCESS_KEY=<secret> -e AWS_ACCESS_KEY_ID=<id> davidkelley/grain:server-v0.1.0 serverless deploy -s <stage> -r <region>
```

* `<id>`: Your AWS Key ID. Preferably a Super User key.
* `<secret>`: The accompanying secret to the Key ID.
* `<stage>`: The stage to deploy the functions to.
* `<region>`: The AWS region to deploy to, for example, `us-east-1`.

**Note:** It will deploy the function to `us-east-1`.

After you have successfully deployed the functions to your account, take note of the API Key that was generated and refer back to the main [README.md](https://github.com/davidkelley/grain) for this repository.

---

Alternatively, if you have Serverless (~v1.0) installed you can clone this repository and use the CLI to deploy the functions directly.

## Testing the functions

Tests are executed using Mocha and the Serverless plugin, `serverless-mocha-plugin`. You can run the tests using the below command.

```
docker run davidkelley/grain:server-v0.1.0 serverless invoke test
```
