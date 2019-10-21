/*
 * @Author: zhulijun
 * @LastEditors: zhulijun
 * @Date: 2019-10-21 15:57:00
 * @LastEditTime: 2019-10-21 16:39:34
 * @Descripttion:
 */
const request = require('request');
module.exports = function() {
  return new Promise((resolve, reject) => {
    request.get(`https://huijie-h5-test.oss-cn-shanghai.aliyuncs.com/dds-cli/template.json?timaStamp=${new Date().getTime()}`, (error, response, body='{}') => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body))
      }else {
        reject(error)
      }
    });
  })
}
