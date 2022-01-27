import request from '@/utils/request'


/*查询列表*/
export function getList(data){
  return request({
    method:'post',
    url:`/zllz/consensus-received/list`,
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}


/*查询详情*/
export function queryDetail(id){
  return request({
    method:'get',
    url:`/yqgz/inform/bulletin/queryBulletinDetailBs/${id}`,
  })
}


/*查询反馈详情*/
export function queryFeedback(params){
  return request({
    method:'get',
    url:`/yqgz/inform/accept/querySentimentFeedbackDetail`,
    params
  })
}


/*反馈*/
export function doFeedback(data) {
  return request({
    url: '/yqgz/inform/accept/SaveSentimentFeedbackDetail',
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })

}

