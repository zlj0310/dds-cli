#! /usr/bin/env node

/*
 * @Author: zhulijun
 * @LastEditors: zhulijun
 * @Date: 2019-10-22 13:39:27
 * @LastEditTime: 2019-10-22 19:15:29
 * @Descripttion: 删除脚本的指令
 */

const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const template = require(`${__dirname}/../template.js`)
const exec = require('child_process').execSync;
const path = require('path')

template().then(tplObj=> {
	// 自定义交互式命令行的问题及简单地校验
	const question = [
		{
			name: "name",
			type: "input",
			message: "请输入要删除的模板名称",
			default: process.argv[2],
			validate(val) {
				if(!val){
					return 'Name is required!'
				}else if(!tplObj[val]){
					return 'Template does not existed!'
				}else {
					return true
				}
			}
		}
	]

	inquirer.prompt(question).then(answers => {
		const {name} = answers;
		deleteTemplate(tplObj, name)
	})
})

function deleteTemplate(tplObj,name) {
	delete tplObj[name]
	// 更新 template.json 文件
	fs.writeFile(`${__dirname}/../template/template.json`, JSON.stringify(tplObj), 'utf-8', err => {
		if(err){
			console.log(err)
			return
		}
		exec('npm run cdn', {cwd: path.resolve(__dirname, '..')});
		console.log('\n')
		console.log(chalk.green('Deleted successfully!\n'))
		console.log(chalk.grey('The latest template list is: \n'))
		console.log(tplObj)
		console.log('\n')
	})
}


