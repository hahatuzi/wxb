import request from '@/utils/request'
import qs from 'qs'


//线索添加
export function addClues(data,signHeader){
  return request({
    method:'post',
    url:'/yqgz/inform/aloneUnitClue/SaveInfoDetail',
    headers:{
      'Content-Type': 'application/json',
      "signData":signHeader
    },
    data
  })
}
//线索添加表单 签名
export function addOrUpdateCluesSign(data){
  return request({
    method:'post',
    url:'/yqgz/inform/aloneUnitClue/SaveInfoDetailSign',
    headers:{
      'Content-Type': 'application/json'
    },
    data
  })
}




//线索编辑
export function updateClues(data,signHeader){
  return request({
    url:'/yqgz/inform/aloneUnitClue/editInfoDetail',
    method:'put',
    headers:{
      'Content-Type': 'application/json',
      'signData':signHeader
    },
    data
  })
}
//线索编辑 表单签名
export function updateCluesSign(data){
  return request({
    url:'/yqgz/inform/aloneUnitClue/editInfoDetailSign',
    method:'put',
    headers:{
      'Content-Type': 'application/json'
    },
    data
  })
}


/* 查询列表 */
export function getList(url, data){
  return request({
    method: 'post',
    url: url,
    headers:{
      'Content-Type': 'application/json'
    },
    data
  })
}

/* 删除 */
export function deleteClue(params) {
  return request({
    url: '/yqgz/inform/aloneUnitClue/deleteInfoDetail',
    method: 'delete',
    params
  })
}




/* 查询详情 */
export function queryDetail(id) {
  return request({
    url: `/yqgz/inform/aloneUnitClue/queryClueDetailbs/${id}`,
    method: 'get',
  })
}


