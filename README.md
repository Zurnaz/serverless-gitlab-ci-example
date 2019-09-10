# serverless GitLab ci example

Example CI/CD pipeline for Serverless framework based on GitLab.

![coverage](https://gitlab.com/Zurnaz/serverless-gitlab-ci-example/badges/master/coverage.svg)

![pipeline](https://gitlab.com/Zurnaz/serverless-gitlab-ci-example/badges/master/pipeline.svg)

## Features

- Linting
- Unit testing
- e2e testing against deployed APIs
- Multiple environment dev, staging, live
- Dev environments deployed per branch
- Destroy old environments via the Operations > Environments
- Security dependency scanning
- Static application security testing
- Test coverage metrics
- Monitoring
- Middy middleware for input validation and helpers

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

### Setup

Prereq:

Make sure you have these two installed before you start.

```bash
nodejs
yarn
```

You also needserverless installed.

```bash
yarn global add serverless
```

Install:

```bash
yarn install
```

Run unit tests:

```bash
yarn unit
```

Run linting and auto correct errors:

```bash
yarn lint
```

### Usage/Useful commands for dev

Deploy to the environment at the stage dev:

```bash
sls deploy -s dev
```

Shutdown the environment at the stage dev

```bash
sls remove -s dev
```

Build a webpack complied version into the dist folder but do nothing with it, useful for debugging webpack issues and checking builds are correct:

```bash
sls webpack -out dist
```

Get cloudwatch logs via command line for a specific function:

```bash
sls logs -f featureOne -s dev
```

### Notes on environmental variables

If you want to run builds locally to test you need to configure environmental variables for DYNAMODB_TABLE_NAME and IOPIPE_TOKEN

```bash
export DYNAMODB_TABLE_NAME=AnyTableName
export IOPIPE_TOKEN=DoesNotHaveToBeValidUnlessDeploying
```

Note: On the todo list to improve handling of configuration variables

## Notes

Main purpose of this was to try and setup a fairly feature complete serverless CI/CD pipeline for GitLab, however, there is still a lot of room for improvement.

## Contribute

Feel free.
