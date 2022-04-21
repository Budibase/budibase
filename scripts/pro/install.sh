if [[ -z "${CI}" ]]; then
  echo 'Cannot run insall.sh unless in CI'
  exit 0
fi

BRANCH=$1
BASE_BRANCH=$2

cd ../
echo "Cloning pro repo..."
git clone git@github.com:Budibase/budibase-pro.git
cd budibase-pro

# Try to checkout the matching pro branch
git checkout $BRANCH
# Try to checkout the matching pro base (master or develop) branch
git checkout $BASE_BRANCH
# If neither branch exists continue with default branch 'develop'
git pull

echo "Initializing pro repo..."
yarn setup
