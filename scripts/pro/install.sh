if [[ -z "${CI}" ]]; then
  echo 'Cannot run insall.sh unless in CI'
  exit 0
fi

BRANCH=$1

cd ../
echo "Cloning pro repo..."
git clone git@github.com:Budibase/budibase-pro.git
cd budibase-pro

echo "Checkout branch $BRANCH"
# Try to checkout the matching pro branch
# If branch does not exist we will continue with default branch 'develop'
git checkout $BRANCH
git pull

echo "Initializing pro repo..."
yarn setup
