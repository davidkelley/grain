# Grain CLI

The CLI component for the [Grain Project](https://github.com/davidkelley/grain).

This small command line interface allows you to easily manage IAM Profiles for yourself, or your team. If you have not yet setup Grain, refer to the main README.md file [here](https://github.com/davidkelley/grain).

## Installation

```
npm install -g grain-cli
```

## Getting Started

By default, Grain CLI uses a "profiles" configuration file located here, `~/.grain.profiles`. The configuration file needs to be in TOML (v0.4.0 spec) format, an example file is described below. The location of the profiles file can be altered using the `--profiles-path` flag.

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

Once you have your profiles configuration file setup, you can begin to use the CLI.

## Commands

#### `grain init`

Initialises the Grain CLI and prepares it for first-use. Performs the following:

* Ensures the profiles file can be located and parsed correctly.
* Checks to ensure that an IP alias can be setup locally.
* Pulls the configured Docker Image.
