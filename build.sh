#!/bin/sh

git pull
npm install
composer install
ng build --environment=prod --target=production --aot
cd dist
ln -s ../src/api
cp ../.htaccess .
