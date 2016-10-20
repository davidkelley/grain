# Grain CLI

The CLI component for the [Grain Project](https://github.com/davidkelley/grain).

This small command line interface allows you to easily manage IAM Profiles for yourself, or your team. If you have not yet setup Grain, refer to the main README.md file [here](https://github.com/davidkelley/grain).

## Installation

```
npm install -g grain-cli
```

## Getting Started

By default, Grain CLI uses a "profiles" configuration file located here, `~/.grain.profiles`. The configuration file needs to be in TOML (v0.4.0 spec) format, an example file is described below. The location of the profiles file can be altered using the `--profiles-path` flag.

Below are some example profiles:

```
[development]
user=david
id="dd7y3i3faj"
key="tEGxwoxlHU2nHLqT0wJCk32Sj7dp4Nef6SrIv0EG"
region="us-east-1"
ip=127.1.34.200
port=32456
state=~/.my-custom-state-path
image=davidkelley/grain:client-v0.0.1

[staging]
id="66939faddd"
key="...."
level="staging"
ip=127.1.34.200

[production]
id="...."
key="...."
```

Here is the full list of accepted profile keys:

| Key | Description | Default |
|-----|-------------|---------|
| user | Identifying piece of information for use with an assumed session name | `default` |
| id | The ID of the API Endpoint to connect to | |
| key | Your secret key for connecting to the API Endpoint | |
| level | The level to connect with | `development` |
| region | The AWS Region to assume credentials for | `us-east-1` |
| ip | The IP to setup a local redirect for | `169.254.169.254` |
| port | The port to connect with on the local host | `43566` |
| state | Where to store the state file for this profile | `~/.grain.state` |
| image | The docker image to use for this profile | `davidkelley/grain:client-v0.1.0` |

Once you have your profiles configuration file setup, you can begin to use the CLI.

## Commands

#### `use <profile>`

This command emulates the EC2 Metadata Service locally. It creates and configures the proxy docker container, using the profile configuration you have provided. It also sets up a local redirect on the host.

**Example:** `$ grain use development`

This would configure your local EC2 metadata service to use the development profile when querying against any AWS resources.

#### `login <profile> <alias> [page]`

Use this command directly from the terminal to use a configured profile to open a browser window, automatically logging you into the AWS Console at a specific page (optional).

**Example:** `$ grain login staging qa23 cloudformation`

This command would open your default browser (as configured via `open`), logging you into the account alias (`qa23`) at the AWS Console Cloudformation page.

#### `stop <profile>`

Stops any currently running profile, started via the `use` command, tearing down any container resources and IP redirects.

#### `resume <profile>`

Resumes a previously started profile. This command is handy for when you have recently restarted your machine.

#### `admin create <profile> <user>`

Create another user. This function returns a signed URL that points to a profile that another team member or user can download. However, the URL it provides is only valid for 60 seconds. The `<user>` parameter you provide will be used to identify them when making requests using the AWS API.

#### `admin remove <profile> <user>`

Remove another user by name.

#### `env <profile>`

When you need credentials in your environment, you can use this command to export AWS CLI recognised environment variables. To setup variables quickly, use `export $(grain env development)`, for example.
