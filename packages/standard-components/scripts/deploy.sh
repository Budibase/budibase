#!/usr/bin/env bash

aws s3 sync dist s3://prod-budi-app-assets/assets/componentlibrary/@budibase/standard-components/dist --profile budibase
