/*
 * @Author: zhulijun
 * @LastEditors: zhulijun
 * @Date: 2019-10-21 16:49:55
 * @LastEditTime: 2019-10-21 16:59:12
 * @Descripttion:
 */
const OSS = require('ali-oss')
const fs = require('fs')
const path = require('path')
const ossDir = 'dds-cli'

const client = new OSS({
  region: 'img-cn-shanghai',
  accessKeyId: process.env.ACCESSID_TEST,
  accessKeySecret: process.env.ACCESSKEY_TEST,
  bucket: 'huijie-h5-test'
});

// 上传 dist 文件夹
fileUpload('template')

function fileUpload(filePath){
  // 根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, (err,files) => {
      if(err){
          console.warn(err)
      }else{
          // 遍历读取到的文件列表
          files.forEach((filename) => {
              // 获取当前文件的绝对路径
              const filedir = path.join(filePath,filename);
              // 根据文件路径获取文件信息，返回一个fs.Stats对象
              fs.stat(filedir,(error,stats) => {
                  if(error){
                      console.warn('获取文件stats失败');
                  }else{
                    const isFile = stats.isFile();//是文件
                    const isDir = stats.isDirectory();//是文件夹
                    if(isFile){
                      client.put(ossDir + filedir.replace('template', ''), filedir).then(data=> {
                        if(data.res.status === 200){
                          console.log(`✨ Update Done ${filedir}✨`)
                        }
                      })
                    }
                    if(isDir){
                      fileUpload(filedir); // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
                    }
                  }
              })
          });
      }
  });
}