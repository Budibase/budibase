if [ -d "packages/pro/packages" ]; then
  cd packages/pro

  yarn
  lerna bootstrap
  yarn setup
fi