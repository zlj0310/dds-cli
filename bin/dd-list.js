#! /usr/bin/env node

const template = require(`${__dirname}/../template.js`)
template().then(tplObj=> {
  console.log(tplObj)
})
