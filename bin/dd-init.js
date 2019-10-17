#! /usr/bin/env node
const chalk = require('chalk')
const ora = require('ora')
const download = require('download-git-repo')
const tplObj = require(`${__dirname}/../template`)
const tplObjList = Object.keys(tplObj)
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const handlebars = require('handlebars')

// 自定义交互式命令行的问题及简单地校验
const question = [
	{
		name: "templateName",
		type: "list",
    message: "请选择模板",
    choices: tplObjList
  },
  {
		name: "projectName",
		type: "input",
    message: "projectName",
    validate(val) {
			if(!val){
        console.log()
				return 'projectName is required!'
			}else if(checkProjectExist(val)){
				return true
			}
		}
  },
  {
		name: "version",
		type: "input",
    message: "version",
    default: '1.0.0'
  },
  {
		name: "description",
		type: "input",
    message: "description",
  },
  {
		name: "author",
		type: "input",
    message: "author",
	}
]

let next = undefined

// 检验同目录下是否有同名项目存在
function checkProjectExist(projectName){
  const list = glob.sync('*')
  if (list.length) {
    const ifProjectExist = list.filter(name=> {
      const fileName = path.resolve(process.cwd(), path.join('.', name))
      return name === projectName && fs.statSync(fileName).isDirectory();
    })

    if(ifProjectExist.length !== 0){
      console.log()
      console.log(chalk.red(`项目${projectName}已经存在`))
      return false
    }
    next = Promise.resolve(projectName)
    return true
  }else {
    next = Promise.resolve(projectName)
    return true
  }
}

inquirer.prompt(question).then(answers => {
  next && go(answers)
})

function go (answers) {
  const {templateName, projectName} = answers;
  next.then(projectRoot => {
    if (projectRoot !== '.') {
      fs.mkdirSync(projectRoot)
    }
    // 出现加载图标
    const spinner = ora("Downlaoding...")
    spinner.start()
    url = tplObj[templateName]
    console.log(chalk.white('\n Start generating... \n'))
    return download(url, projectName, err => {
      if(err){
        spinner.fail();
        console.log(chalk.red(`Generation failed. ${err}`))
        return
      }
      fileUpdate(projectName, answers)
      // === 将自定义内容插入到模板中 ===

      spinner.succeed();
      console.log(chalk.green('\n ✨ Genetation Done! ✨ '))
      console.log('\n To get started')
      console.log(`\n cd ${projectName} && yarn && yarn start \n `)
		})
  })
}

// 将自定义内容渲染到模板中
function fileUpdate(filePath, answers){
  const {version, description, author} = answers;
  // 根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, (err,files) => {
      if(err){
          console.warn(err)
      }else{
          // 遍历读取到的文件列表
          files.forEach((filename) => {
              // 获取当前文件的绝对路径
              const filedir = path.join(filePath,filename);
              // 排除隐藏文件
              if(!/^\./.test(filename)){
                // 根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,(error,stats) => {
                    if(error){
                        console.warn('获取文件stats失败');
                    }else{
                      const isFile = stats.isFile();//是文件
                      const isDir = stats.isDirectory();//是文件夹
                      if(isFile){
                        const meta = {
                          projectName: filePath,
                          version,
                          description,
                          author
                        }
                        const fileName = `${filedir}`;
                        const content = fs.readFileSync(fileName).toString();
                        const result = handlebars.compile(content)(meta);
                        fs.writeFileSync(fileName, result);
                      }
                      if(isDir){
                        fileUpdate(filedir, answers); // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
                      }
                    }
                })
              }
          });
      }
  });
}