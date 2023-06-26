if [ -d "packages/pro/src" ]; then
  cd packages/pro

  yarn
  lerna bootstrap
fi