import request from '@/utils/request'
import qs from 'qs'


//线索添加
export function addClues(data,signHeader){
  return request({
    method:'post',
    url:'/yqgz/inform/clue/SaveInfoDetail',
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
    url:'/yqgz/inform/clue/SaveInfoDetailSign',
    headers:{
      'Content-Type': 'application/json'
    },
    data
  })
}




//线索编辑
export function updateClues(data,signHeader){
  return request({
    url:'/yqgz/inform/clue/editInfoDetail',
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
    url:'/yqgz/inform/clue/editInfoDetailSign',
    method:'put',
    headers:{
      'Content-Type': 'application/json'
    },
    data
  })
}


// 线索列表
export function queryClueList(data, currentPage, pageSize) {
  return request({
    url: `/yqgz/inform/clue/queryClueListBS?pageNum=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    headers:{
      'Content-Type': 'application/json'
    },
    data

  })
}


// 线索详情
export function queryClue(id){
  return request({
    url:`/yqgz/inform/clue/queryClueDetailbs/${id}`,
    method:'get'
  })
}


// 删除线索
export function deleteClue(params) {
  return request({
    url:'/yqgz/inform/clue/deleteInfoDetail',
    method:'delete',
    params
  })
}
