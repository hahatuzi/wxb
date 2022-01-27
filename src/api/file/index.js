import request from '@/utils/request'
import qs from 'qs'
import {downloadFile} from '@/utils/exportFile'

//文件上传
export function  uploadFile(data) {
  return request({
    url:'/file/minio/upload',
    method:'post',
    data,
    headers:{
      'Content-Type': 'multipart/form-data'
    }
  })
}
//文件下载
export function download(fileId,fileName) {
  downloadFile({
    url:`/file/minio/download/${fileId}`,
    method:'get',
    fileName
  })
}

//约稿文件上传
export function  ygUploadFile(data) {
  return request({
    url:'/fileu/upload',
    method:'post',
    data,
    headers:{
      'Content-Type': 'multipart/form-data'
    }
  })
}


/*文件导出√*/
export function exportList({url,params,fileName}) {
  downloadFile({
    url,
    method:'get',
    params,
    fileName
  })
}
