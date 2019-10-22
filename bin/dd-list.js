#! /usr/bin/env node

/*
 * @Author: zhulijun
 * @LastEditors: zhulijun
 * @Date: 2019-10-22 13:39:27
 * @LastEditTime: 2019-10-22 15:35:53
 * @Descripttion: 列举模板列表的指令
 */

const template = require(`${__dirname}/../template.js`)
template().then(tplObj=> {
  console.log(tplObj)
})
