
import request from '@/utils/request'
import qs from 'qs'

/*获取可见单位*/
export function getUnitList(modid){
  return request({
    method:'get',
    url:'/unitGroup/queryGroupByModid',
    params:{modid}
  })
}

/*获取可见单位2 - 活动下发*/
export function getUnitListHd(modid){
  return request({
    method:'get',
    url:'/unitGroup/queryUnit',
    params:{modid}
  })
}


/*获取可见单位树*/
export function getUnitTree(modid){
  return request({
    method:'get',
    url:'/unitGroup/queryUnitGroup',
    params:{modid},
  })
}

/*获取配置项 √*/
export function queryConfigManage(params){
  return request({
    method:'get',
    url:`/yqgz/system/configManage/queryConfigManage`,
    params,
  })
}



