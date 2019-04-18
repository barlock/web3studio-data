#!/usr/bin/env bash

set -e

DIRNAME="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

serverless deploy

# Configure the things that Cloudformation wont let us do
node configure.js
