echo "Linking backend-core"
cd packages/backend-core
yarn unlink
yarn link
cd -

echo "Linking string-templates"
cd packages/string-templates
yarn unlink
yarn link
cd -

echo "Linking types"
cd packages/types
yarn unlink
yarn link
cd -

echo "Linking bbui"
cd packages/bbui
yarn unlink
yarn link
cd -

echo "Linking frontend-core"
cd packages/frontend-core
yarn unlink
yarn link
cd -

if [ -d "../budibase-pro" ]; then
  cd ../budibase-pro
  echo "Bootstrapping budibase-pro"
  yarn bootstrap

  cd packages/pro
  echo "Linking pro"
  yarn unlink
  yarn link

  echo "Linking backend-core to pro"
  yarn link '@budibase/backend-core'

  echo "Linking types to pro"
  yarn link '@budibase/types'

  cd ../../../budibase

  echo "Linking pro to worker"
  cd packages/worker && yarn link '@budibase/pro'
  cd -

  echo "Linking pro to server"
  cd packages/server && yarn link '@budibase/pro'
  cd -
fi

if [ -d "../account-portal" ]; then
  cd ../account-portal
  echo "Bootstrapping account-portal"
  yarn bootstrap
  
  cd packages/server
  echo "Linking backend-core to account-portal"
  yarn link "@budibase/backend-core"

  echo "Linking string-templates to account-portal"
  yarn link "@budibase/string-templates"

  echo "Linking types to account-portal"
  yarn link "@budibase/types"

  if [ -d "../../../budibase-pro" ]; then
    echo "Linking pro to account-portal"
    yarn link "@budibase/pro"
  fi

  cd ../ui
  echo "Linking bbui to account-portal"
  yarn link "@budibase/bbui"

   echo "Linking frontend-core to account-portal"
    yarn link "@budibase/frontend-core"
fi
