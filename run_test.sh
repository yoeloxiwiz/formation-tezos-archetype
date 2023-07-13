#! /bin/sh

if [ $# -eq 0 ]; then
  ts-mocha --timeout 0 --slow 99999999999999999 ./tests/*.ts
else
  ts-mocha --timeout 0 --slow 99999999999999999 ./tests/$1.ts
fi