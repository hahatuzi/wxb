import request from '@/utils/request'
import qs from 'qs'


//查询列表
export function getList(params){
  return request({
    method:'get',
    url:'/yqgz/inform/draft/queryDraftListBs',
    params
  })
}

/*查询详情*/
export function select(id){
  return request({
    method:'get',
    url:`/yqgz/inform/draft/queryDraftInfoBs`,
    params:{id}
  })
}
//反馈内容
export function feedback(data){
  return request({
    method:'post',
    url:`/yqgz/inform/draft/saveDraftFkBs`,
    data:qs.stringify(data)
  })
}

