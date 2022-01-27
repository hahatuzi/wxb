import request from '@/utils/request'

/*查询列表*/
export function getList(params){
  return request({
    method:'get',
    url:`/zllz/notice/listbs`,
    params
  })
}

/*查询详情*/
export function select(id){
  return request({
    method:'get',
    url:`/zllz/notice/detailbs`,
    params:{id}
  })
}




