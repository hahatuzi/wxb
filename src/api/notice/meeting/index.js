import request from '@/utils/request'
import qs from 'qs'
import {downloadFile} from '@/utils/exportFile'


/*查询列表*/
export function getList(params){
  return request({
    method:'get',
    url:`/zllz/meeting/getListBs`,
    params
  })
}

//导出会议通知列表
export function exportList(params){
  downloadFile({
    url:`/zllz/meeting/exportListBs`,
    method:'get',
    params,
  })
}

/*查询会议通知详情*/
export function select(meetingUid){
  return request({
    method:'get',
    url:`/zllz/meeting/getMeetingDetailBs/${meetingUid}`
  })
}

/*查询反馈详情*/
export function feedbackDetail(meetingUid){
  return request({
    method:'get',
    url:`/zllz/meeting/getFeedbackDetailBs/${meetingUid}`
  })
}


//删除人员
export function deleteUser(meetingUserUId){
  return request({
    method:'delete',
    url:`/zllz/meeting/feedbackUser/delete/${meetingUserUId}`
  })
}

//添加上报人员
export function addUser(params){
  return request({
    method:'post',
    url:`/zllz/meeting/meetingUser/add`,
    params
  })
}




/*反馈*/
export function feedback(data){
  return request({
    method:'post',
    headers: {
      'content-type': 'application/json'
    },
    url:`/zllz/meeting/meetingFeedback`,
    data
  })
}



