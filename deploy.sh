#! /bin/bash
#
# Script to deploy app in dist to GitHub pages

rm -rf bower_components/ scripts/ styles/
cp -rf dist/* .
git add .
git ci -am "Deploy"
git push origin gh-pages

