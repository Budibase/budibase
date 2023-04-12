lerna bootstrap

if [ -d "packages/pro/src" ]; then
  cd packages/pro
  lerna bootstrap
  yarn setup
fi
