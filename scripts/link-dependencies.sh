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

echo "Linking shared-core"
cd packages/shared-core
yarn unlink
yarn link
cd -

if [ -d packages/pro/packages ]; then
  pro_loaded_locally=true
else
  pro_loaded_locally=false
fi

if [ $pro_loaded_locally = true ]; then
  echo "Linking pro"
  cd packages/pro/packages/pro
  yarn unlink
  yarn link
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

  if [ $pro_loaded_locally = true ]; then
    echo "Linking pro to account-portal"
    yarn link "@budibase/pro"
  fi

  cd ../ui
  echo "Linking bbui to account-portal"
  yarn link "@budibase/bbui"

   echo "Linking frontend-core to account-portal"
    yarn link "@budibase/frontend-core"
fi
