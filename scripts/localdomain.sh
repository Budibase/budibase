#!/bin/bash

enable=$1
domain=$2

if [ "$enable" = "enable" ]; then
  lerna run env:localdomain:enable -- "$domain"
  cd packages/account-portal
  yarn env:localdomain:enable "$domain"
  cd -
else
  lerna run env:localdomain:disable
  cd packages/account-portal
  yarn env:localdomain:disable
  cd -
fi