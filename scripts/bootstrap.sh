if [ -d "packages/pro/packages" ]; then
  cd packages/pro

  yarn
  lerna bootstrap
  yarn setup
else
  node scripts/updateLocalPro.js 
  yarn
fi