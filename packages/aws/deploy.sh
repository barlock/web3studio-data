#!/usr/bin/env bash

set -e

DIRNAME="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

STACK_NAME="w3s-collector"

# Deploy our elastic search stack
aws cloudformation deploy \
  --no-fail-on-empty-changeset \
  --template-file ${DIRNAME}/stacks/elasticsearch.yaml \
  --stack-name ${STACK_NAME} \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    ElasticsearchDomainName=${STACK_NAME}

# Configure the things that Cloudformation wont let us do
node configure.js
