#! /usr/bin/env node

/*
 * @Author: zhulijun
 * @LastEditors: zhulijun
 * @Date: 2019-10-22 13:39:27
 * @LastEditTime: 2019-10-22 15:35:24
 * @Descripttion: 添加模板的指令
 */

// 交互式命令行
const inquirer = require('inquirer')
// 修改控制台字符串的样式
const chalk = require('chalk')
// node 内置文件模块
const fs = require('fs')
const template = require(`${__dirname}/../template.js`)
const exec = require('child_process').execSync;

template().then(tplObj=> {
  // 自定义交互式命令行的问题及简单地校验
	const question = [
		{
			name: "name",
			type: "input",
			message: "请输入模板名称",
			default: process.argv[2],
			validate(val) {
				if(!val){
					return 'Name is required!'
				}else if(tplObj[val]){
					return 'Template has already existed!'
				}else {
					return true
				}
			}
		}, {
			name: "url",
			type: "input",
			message: "请输入模板地址",
			default: process.argv[3],
			validate(val) {
				if(!val){
					return 'The url is required!'
				}
				return true
			}
		}
	]

	inquirer.prompt(question).then(answers => {
		// answers 就是用户输入的内容，是个对象
		const {name, url} = answers;
		// 过滤 unicode 字符
		tplObj[name] = 'direct:' + url.replace(/[\u0000-\u0019]/g, '')
		// 把模板信息写入 template.json 文件中
		fs.writeFile(`${__dirname}/../template/template.json`, JSON.stringify(tplObj), 'utf-8', err => {
			if(err){
				console.log(err)
				return
			}
			exec('npm run cdn', {stdio: 'inherit'});
			console.log('\n')
			console.log(chalk.green('Added successfully!\n'))
			console.log(chalk.grey('The latest template list is: \n'))
			console.log(tplObj)
			console.log('\n')
		})
	})
})

