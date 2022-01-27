import request from '@/utils/request'
import qs from 'qs'
import {downloadFile} from '@/utils/exportFile'


/*查询列表*/
export function getList(params){
  return request({
    method:'get',
    url:`/zllz/otherNotice/getListBs`,
    params
  })
}


//导出其他通知列表
export function exportList(params){
  downloadFile({
    url:`/zllz/otherNotice/exportListBs`,
    method:'get',
    params,
  })
}


/*查询其他通知详情*/
export function select(informUid){
  return request({
    method:'get',
    url:`/zllz/otherNotice/selectBs/${informUid}`
  })
}


/*查询反馈详情*/
export function feedbackDetail(feedbackUid){
  return request({
    method:'get',
    url:`/zllz/otherNotice/getFeedback/${feedbackUid}`
  })
}


/*反馈*/
export function feedback(data){
  return request({
    method: 'post',
    url: `/zllz/otherNotice/feedback`,
    headers: {
      'content-type': 'application/json'
    },
    data
  })
}



