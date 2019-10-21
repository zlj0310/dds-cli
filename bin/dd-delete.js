#! /usr/bin/env node
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const template = require(`${__dirname}/../template.js`)
const exec = require('child_process').execSync;

template().then(tplObj=> {
  // 自定义交互式命令行的问题及简单地校验
	const question = [
		{
			name: "name",
			type: "input",
			message: "请输入要删除的模板名称",
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
		let {name} = answers;
		delete tplObj[name]
		// 更新 template.json 文件
		fs.writeFile(`${__dirname}/../template/template.json`, JSON.stringify(tplObj), 'utf-8', err => {
			if(err){
				console.log(err)
				return
			}
			exec('npm run cdn', {stdio: 'inherit'});
			console.log('\n')
			console.log(chalk.green('Deleted successfully!\n'))
			console.log(chalk.grey('The latest template list is: \n'))
			console.log(tplObj)
			console.log('\n')
		})
	})
})


