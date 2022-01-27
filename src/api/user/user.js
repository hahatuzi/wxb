import request from '@/utils/request'
import qs from 'qs'

const client_id = 'web'
const client_secret = '123456'
const grant_type = 'password'
const scope = 'server'

const pathPrefix = ''



/*获取路由*/
export function getRouter(){
  return request({
    method:'get',
    url:`/menu/getRoutersN`,
  })
}
/*登录*/
export function login(data){
  return request({
    method:'post',
    url:'/auth/sysLogin',
    headers:{'Content-Type':'application/json;charset=utf-8'},
    data,
  })
}

/*退出登录*/
export function apiLogout(){
  return request({
    url:'/auth/logout',
    method:'delete'
  })
}

/*证书登录*/
export function loginssl(){
  return request({
    url:'/auth/sslLogin',
    method:'post'
  })
}

/*获取验证码*/
export function getVerificationCode(data){
  return request({
    url:'/auth/getVerificationCode',
    method:'post',
    headers:{'Content-Type':'application/json;charset=utf-8'},
    data
  })
}

/*获取用户信息√*/
export function getUserInfo(){
  return request({
    url:'/system/user/profile',
    method:'get'
  })
}


/*获取当前登录用户id*/
export function getCurrentUserId(){
  return request({
    url:'/system/user/getCurrentUserId',
    method:'get'
  })
}

/*获取通知、公告栏未读数量√*/
export function getUnread(){
  return request({
    url:'/yqgz/notice/bulletin/unread',
    method:'get'
  })
}

/*获取舆情接收未读数量√*/
export function getYqUnread(){
  return request({
    url:'/yqgz/inform/accept/querySentimentFeedbackCount',
    method:'get'
  })
}

// 获取路由 √
export const getRouters = () => {
  return request({
    url: '/system/menu/getRoutersN',
    method: 'get'
  })
}

