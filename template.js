/*
 * @Author: zhulijun
 * @LastEditors: zhulijun
 * @Date: 2019-10-21 15:57:00
 * @LastEditTime: 2019-10-21 17:37:58
 * @Descripttion:
 */
const request = require('request');
const chalk = require('chalk')

module.exports = function() {
  return new Promise((resolve, reject) => {
    request.get(`https://huijie-h5-test.oss-cn-shanghai.aliyuncs.com/dds-cli/template.json?timaStamp=${new Date().getTime()}`, (error, response, body='{}') => {
      if (!error) {
        if(response.statusCode === 200){
          return resolve(JSON.parse(body))
        }else if(response.statusCode === 404){
          return console.log(chalk.red('模板文件在 oss 上不存在'))
        }
        reject(error)
      }else {
        reject(error)
      }
    });
  })
}
