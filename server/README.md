# Grain Server

## Getting Started

You can either run `docker pull davidkelley/grain:server-v0.1.0` or build the container yourself with the following command `docker build -t davidkelley/grain:server-v0.1.0 .` from inside the `server/` directory.

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

---

Alternatively, if you have Serverless (~v1.0) installed you can use the CLI to deploy the functions directly.

## Testing the functions

Tests are executed using Mocha and the Serverless plugin, `serverless-mocha-plugin`. You can run the tests using the below command.

```
docker run davidkelley/grain:server-v0.1.0 serverless invoke test
```
