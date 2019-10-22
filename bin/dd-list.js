#! /usr/bin/env node

/*
 * @Author: zhulijun
 * @LastEditors: zhulijun
 * @Date: 2019-10-22 13:39:27
 * @LastEditTime: 2019-10-22 14:11:28
 * @Descripttion:
 */

const template = require(`${__dirname}/../template.js`)
template().then(tplObj=> {
  console.log(tplObj)
})
