#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git_url="git@github.com:cheekahao"

if [ $1 == "gitee" ]
then
    git_url="git@gitee.com:cheeka"
    echo "第一个参数为：$1"
fi

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f $git_url/note.git master:gh-pages

cd -