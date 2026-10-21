#!/bin/bash
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
# 本项目固定用 Node 20（nuxt 4 要求 ^20.19），不依赖 nvm default
export PATH="/root/.nvm/versions/node/v20.19.0/bin:$PATH"
cd /home/lx/CMS/frontend || exit 1
exec ./node_modules/.bin/nuxt dev --host 127.0.0.1 --port 3000
