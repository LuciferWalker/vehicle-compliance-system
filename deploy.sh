#!/bin/bash

APP_NAME="vehicle-compliance-app"
ENV_NAME="vehicle-compliance-env"
VERSION_LABEL=$(date +%Y%m%d%H%M%S)

# Create application version
aws elasticbeanstalk create-application-version \
  --application-name $APP_NAME \
  --version-label $VERSION_LABEL \
  --source-bundle S3Bucket="my-bucket",S3Key="my-app-bundle.zip"

# Deploy application version
aws elasticbeanstalk update-environment \
  --application-name $APP_NAME \
  --environment-name $ENV_NAME \
  --version-label $VERSION_LABEL
