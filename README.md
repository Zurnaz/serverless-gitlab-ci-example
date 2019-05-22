# serverless gitlab ci example

Example ci/cd pipeline for serverless framework based on gitlab.

## Features

- Linting
- Unit testing
- e2e testing against deployed APIs
- Multiple evironments dev, staging, live
- Branches automatically deploy a dev branch for 24 hours that has e2e tests run against the endpoint straight away

## Configuring CI/CD

You need to build the docker image if you don't want to use the default

- check the registry tab in the project on gitlab for instructions

Requires environmental variables from IAM user created for deployments:

- AWS_ACCESS_KEY_ID with the new user’s access key
- AWS_SECRET_ACCESS_KEY with the new user’s access secret key

## Notes

Main purpose of this was to try and setup a fairly feature complete serverless CI/CD pipeline for gitlab, however, there is still a lot of room for improvement.

## TODOs

- Restructure folders
- Use middy middleware
- Remove unneeded dependencies
- Handle table names and references better
- Look into adding a code quality scan
- Look into adding a security scan
- Would it be better to use a different docker image for cypress?
- Would it be better to break down the severless file into multiple pieces by feature and combine it back together?
