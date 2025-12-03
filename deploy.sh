#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vitepress/dist

# 创建CNAME文件用于自定义域名
echo "note.haozhenjia.com" > CNAME

git init
git add -A
git commit -m 'deploy'

git_url="git@github.com:cheekahao"

# 检查参数是否存在，避免语法错误
if [ "$1" == "gitee" ]
then
    git_url="git@gitee.com:cheeka"
    echo "第一个参数为：$1"
fi

# 获取当前分支名称
current_branch=$(git symbolic-ref --short HEAD 2>/dev/null || echo "main")

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f $git_url/note.git $current_branch:gh-pages

cd -