# Grain Client

This small component of the Grain Project provides a Docker Container that runs Nginx, configured as a proxy using environment variables, for a deployed Grain Server service. It enables the local emulation of the EC2 Metadata Service (http://169.254.169.254/...).

The pulling and running of this container is automatically handled via the Grain CLI. However, you can manually pull this container from the Docker Registry and run it manually for other purposes.

## Getting Started

**All Docker containers provided in the Grain project are signed and verified. Never trust and don't ever deploy anything from an unsigned container.**

You can either run `docker pull --disable-content-trust=false davidkelley/grain:client-v0.1.0` or build the container yourself with the following command `docker build -t <username>/grain:client-v0.1.0 .` from inside the `client/` directory.

## Container Usage

The container requires the presence of several environment variables. These variables will be used to configure Nginx when the container starts.

**Note:** The resulting configuration is checked for validity.

| Env  | Purpose  |
|:-----|:---------|
| `LISTEN_ON` | The port Nginx will bind itself to. Defaults to port `80`. |
| `SERVER_NAME` | The server name Nginx will recognise itself as. Defaults to `localhost` |
| `GRAIN_SECRET` | The API Key provided by API Gateway. Set as the header `X-Api-Key` |
| `GRAIN_ENDPOINT` | The HTTPS endpoint to proxy connections to. |
| `GRAIN_IDENTIFIER` | A unique identifier for the Role being assumed. Set as the header `X-Session-Identifier` |


## Brief Example

```
docker run -p 80:80 \
  -e SERVER_NAME=localhost \
  -e GRAIN_SECRET=dakokt90a09j90j2at90jt90aj \
  -e GRAIN_ENDPOINT=ii888777.execute-aws.us-east-1.amazonaws.com \
  -e GRAIN_IDENTIFIER=`hostname` \
  -d davidkelley/grain:client-v0.1.0
```
