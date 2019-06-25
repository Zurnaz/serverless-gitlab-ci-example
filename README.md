# serverless GitLab ci example

Example CI/CD pipeline for Serverless framework based on GitLab.

![coverage](https://gitlab.com/Zurnaz/serverless-gitlab-ci-example/badges/master/coverage.svg)

![pipeline](https://gitlab.com/Zurnaz/serverless-gitlab-ci-example/badges/master/pipeline.svg)

## Features

- Linting
- Unit testing
- e2e testing against deployed APIs
- Multiple environment dev, staging, live
- Branches automatically deploy a dev branch for 24 hours that has e2e tests run against the endpoint straight away

## Configuring CI/CD

You need to build the docker image if you don't want to use the default

- check the registry tab in the project on GitLab for instructions

Requires environmental variables from IAM user created for deployments:

- AWS_ACCESS_KEY_ID with the new user’s access key
- AWS_SECRET_ACCESS_KEY with the new user’s access secret key

Requires environmental variable for monitoring (Other solutions possible as they use a similar method of being configured in the serverless.yml file)

- IOPIPE_TOKEN

## Recommendations

- Disable committing to master and only allow changes by merging via branches

## Dev

Install

```bash
yarn install
```

Run unit tests

```bash
yarn unit
```

Run linting and auto correct errors

```bash
yarn lint
```

## Notes

Main purpose of this was to try and setup a fairly feature complete serverless CI/CD pipeline for GitLab, however, there is still a lot of room for improvement.

## Contribute

Feel free.
