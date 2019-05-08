#!/bin/sh -l
git pull

export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

npm install
npm run dll
npm run build

find dist -name '*.js' | xargs sed -i "s BUILD_API_HOST http://192.168.15.128 g"
find dist -name '*.js' | xargs sed -i "s BUILD_CLIENT_ID hzero-front-dev g"
find dist -name '*.js' | xargs sed -i "s BUILD_BPM_HOST http://192.168.15.128:8330 g"
find dist -name '*.js' | xargs sed -i "s BUILD_WEBSOCKET_HOST ws://192.168.15.128:8260 g"


rm -rf html
mv dist html
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

