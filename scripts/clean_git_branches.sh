branches=`git branch -r --merged | egrep -v "(^\*|master|develop)"`

for branch in $branches; do
  branch_name=`echo $branch | cut -d / -f 2`
  echo "deleting $branch_name"
  git push --delete origin $branch_name
done;