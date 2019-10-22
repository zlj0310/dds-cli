#! /usr/bin/env node

/*
 * @Author: zhulijun
 * @LastEditors: zhulijun
 * @Date: 2019-10-22 13:39:27
 * @LastEditTime: 2019-10-22 14:13:24
 * @Descripttion:
 */

const program = require('commander')

// 定义当前版本
// 定义使用方法
// 定义四个指令
program
  .version(require('../package').version)
  .usage('<command> [options]')
  .command('add', 'add a new template')
  .command('delete', 'delete a template')
  .command('list', 'list all the templates')
  .alias('ls')
  .command('init', 'generate a new project from a template')
  .alias('i')


// 解析命令行参数
program.parse(process.argv)
