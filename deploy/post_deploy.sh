#!/usr/bin/env bash

npm install
npm rebuild bcrypt --build-from-source
git checkout -- package-lock.json
./node_modules/.bin/webpack
