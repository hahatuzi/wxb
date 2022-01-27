import { constantRoutes } from '@/router'
import { getRouters } from '@/api/user/user'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView';
import InnerLink from '@/layout/components/InnerLink'

const state = {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  }
const mutations = {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      // // 顶部导航菜单默认添加统计报表栏指向首页
      // const index = [{
      //   path: 'index',
      //   meta: { title: '统计报表', icon: 'dashboard'}
      // }]
      state.topbarRouters = routes.slice(0);
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  }
const actions = {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {

        let data =  [
          {
            "name": "instructionFlow",
            "path": "/instructionFlow",
            "hidden": false,
            "redirect": "/instructionFlow/bulletinBoard",
            "component": "Layout",
            "alwaysShow": true,
            "meta": {
              "title": "指令流转",
              "icon": "tree-table",
              "noCache": false,
              "link": null
            },
            "children": [
              {
                "name": "bulletinBoard",
                "path": "bulletinBoard",
                "hidden": false,
                "component": "instructionFlow/bulletinBoard/bulletinBoard",
                "meta": {
                  "title": "公告栏",
                  "icon": "",
                  "noCache": false,
                  "link": null
                }
              },
              {
                "name": "viewBulletin",
                "path": "viewBulletin",
                "hidden": true,
                "component": "instructionFlow/bulletinBoard/viewBulletin",
                "meta": {
                  "title": "查看公告",
                  "icon": "",
                  "noCache": false,
                  "link": null,
                  "activeMenu": '/instructionFlow/bulletinBoard'
                }
              },
              {
                "name": "yqReceive",
                "path": "yqReceive",
                "hidden": false,
                "component": "instructionFlow/yqReceive",
                "meta": {
                  "title": "舆情接收",
                  "icon": "",
                  "noCache": false,
                  "link": null
                }
              },
              {
                "name": "feedback",
                "path": "feedback",
                "hidden": true,
                "component": "instructionFlow/yqReceive/feedback",
                "meta": {
                  "title": "舆情接收详情",
                  "icon": "",
                  "noCache": false,
                  "link": null,
                  "activeMenu": '/instructionFlow/yqReceive'
                }
              },
              {
                "name": "yqClue",
                "path": "yqClue",
                "hidden": false,
                "component": "instructionFlow/yqClues/yqCluesComponent",
                "meta": {
                  "title": "舆情线索",
                  "icon": "",
                  "noCache": true,
                  "link": null,
                }
              },
              {
                "name": "yqClueInfo",
                "path": "yqClueInfo",
                "hidden": true,
                "component": "instructionFlow/yqClues/yqClueInfo",
                "meta": {
                  "title": "舆情线索详情",
                  "icon": "",
                  "noCache": false,
                  "link": null,
                  "activeMenu": '/instructionFlow/yqClue'
                }
              },

              {
                "name": "yg",
                "path": "yg",
                "hidden": false,
                "component": "instructionFlow/yg/index",
                "meta": {
                  "title": "约稿",
                  "icon": "",
                  "noCache": true,
                  "link": null,
                }
              },
              {
                "name": "ygFeedback",
                "path": "ygFeedback",
                "hidden": true,
                "component": "instructionFlow/yg/feedback",
                "meta": {
                  "title": "约稿详情",
                  "icon": "",
                  "noCache": false,
                  "link": null,
                  "activeMenu": '/instructionFlow/yg'
                }
              },

              {
                "name": "notice",
                "path": "notice",
                "hidden": false,
                "component": "ParentView",
                "meta": {
                  "title": "通知",
                  "icon": "",
                  "noCache": true,
                  "link": null,
                },
                "children": [
                  {
                    "name": "meetingNotice",
                    "path": "meetingNotice",
                    "hidden": false,
                    "component": "instructionFlow/notice/meeting/meetingNotice",
                    "meta": {
                      "title": "会议通知",
                      "icon": "",
                      "noCache": true,
                      "link": null,
                    }
                  },
                  {
                    "name": "meetingInfo",
                    "path": "meetingInfo",
                    "hidden": true,
                    "component": "instructionFlow/notice/meeting/meetingInfo",
                    "meta": {
                      "title": "会议通知详情",
                      "icon": "",
                      "noCache": false,
                      "link": null,
                      "activeMenu": '/instructionFlow/notice/meetingNotice'
                    }
                  },


                  {
                    "name": "otherNotice",
                    "path": "otherNotice",
                    "hidden": false,
                    "component": "instructionFlow/notice/other/otherNotice",
                    "meta": {
                      "title": "其他通知",
                      "icon": "",
                      "noCache": true,
                      "link": null,
                    }
                  },
                  {
                    "name": "otherInfo",
                    "path": "otherInfo",
                    "hidden": true,
                    "component": "instructionFlow/notice/other/otherInfo",
                    "meta": {
                      "title": "其他通知详情",
                      "icon": "",
                      "noCache": false,
                      "link": null,
                      "activeMenu": '/instructionFlow/notice/otherNotice'
                    }
                  },
                ]
              },
              {
                "name": "yqCertClues",
                "path": "yqCertClues",
                "hidden": false,
                "component": "instructionFlow/yqClues/yqCertCluesComponent",
                "meta": {
                  "title": "CERT上海舆情",
                  "icon": "",
                  "noCache": true,
                  "link": null,
                }
              },
              {
                "name": "yqCertClueInfo",
                "path": "yqCertClueInfo",
                "hidden": true,
                "component": "instructionFlow/yqClues/yqCertClueInfo",
                "meta": {
                  "title": "CERT上海舆情详情",
                  "icon": "",
                  "noCache": false,
                  "link": null,
                  "activeMenu": '/instructionFlow/yqCertClues'
                }
              },

              {
                "name": "yqSisuClues",
                "path": "yqSisuClues",
                "hidden": false,
                "component": "instructionFlow/yqClues/yqSisuCluesComponent",
                "meta": {
                  "title": "上外报送",
                  "icon": "",
                  "noCache": true,
                  "link": null,
                }
              },
              {
                "name": "yqSisuClueInfo",
                "path": "yqSisuClueInfo",
                "hidden": true,
                "component": "instructionFlow/yqClues/yqSisuClueInfo",
                "meta": {
                  "title": "上外报送详情",
                  "icon": "",
                  "noCache": false,
                  "link": null,
                  "activeMenu": '/instructionFlow/yqSisuClues'
                }
              },

              {
                "name": "yqYfClues",
                "path": "yqYfClues",
                "hidden": false,
                "component": "instructionFlow/yqClues/yqYfCluesComponent",
                "meta": {
                  "title": "蚁坊",
                  "icon": "",
                  "noCache": true,
                  "link": null,
                }
              },
              {
                "name": "yqYfClueInfo",
                "path": "yqYfClueInfo",
                "hidden": true,
                "component": "instructionFlow/yqClues/yqYfClueInfo",
                "meta": {
                  "title": "蚁坊详情",
                  "icon": "",
                  "noCache": false,
                  "link": null,
                  "activeMenu": '/instructionFlow/yqYfClues'
                }
              }
            ]
          },
          {
            "name": "linkageDisposal",
            "path": "/linkageDisposal",
            "hidden": false,
            "redirect": "noRedirect",
            "component": "Layout",
            "alwaysShow": true,
            "meta": {
              "title": "联动处置",
              "icon": "tree",
              "noCache": false,
              "link": null
            },
            "children": [
              {
                "name": "menu1",
                "path": "menu1",
                "hidden": false,
                "component": "linkageDisposal/menu1",
                "meta": {
                  "title": "联动处置",
                  "icon": "form",
                  "noCache": false,
                  "link": null
                }
              },
              {
                "name": "menu2",
                "path": "menu2",
                "hidden": false,
                "component": "linkageDisposal/menu2",
                "meta": {
                  "title": "处置过程监管",
                  "icon": "form",
                  "noCache": false,
                  "link": null
                }
              },
            ]
          },
          {
            "name": "Online",
            "path": "/online",
            "hidden": false,
            "redirect": "/online1",
            "component": "Layout",
            "alwaysShow": false,
            "meta": {
              "title": "跟踪反馈",
              "icon": "dict",
              "noCache": false,
              "link": null
            },
            "children": [
              {
                "name": "online",
                "path": "online1",
                "hidden": false,
                "component": "monitor/online/index",
                "meta": {
                  "title": "跟踪反馈",
                  "icon": "form",
                  "noCache": false,
                  "link": null
                }
              },
            ]
          },
          {
            "name": "conclusion",
            "path": "/conclusion",
            "hidden": false,
            "redirect": "noRedirect",
            "component": "Layout",
            "alwaysShow": true,
            "meta": {
              "title": "总结评估",
              "icon": "server",
              "noCache": false,
              "link": null
            },
            "children": [
              {
                "name": "index1",
                "path": "index1",
                "hidden": false,
                "component": "conclusion/index1",
                "meta": {
                  "title": "事件复盘",
                  "icon": "form",
                  "noCache": false,
                  "link": null
                }
              },
              {
                "name": "index2",
                "path": "index2",
                "hidden": false,
                "component": "conclusion/index2",
                "meta": {
                  "title": "多维事件评估",
                  "icon": "form",
                  "noCache": false,
                  "link": null
                }
              },
              {
                "name": "index3",
                "path": "index3",
                "hidden": false,
                "component": "conclusion/index3",
                "meta": {
                  "title": "总结评估报告",
                  "icon": "form",
                  "noCache": false,
                  "link": null
                }
              },
            ]
          }
        ]

        const sdata = JSON.parse(JSON.stringify(data))
        const rdata = JSON.parse(JSON.stringify(data))
        const sidebarRoutes = filterAsyncRouter(sdata)
        const rewriteRoutes = filterAsyncRouter(rdata, false, true)
        rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', rewriteRoutes)
        commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
        commit('SET_DEFAULT_ROUTES', sidebarRoutes)
        commit('SET_TOPBAR_ROUTES', sidebarRoutes)
        resolve(rewriteRoutes)



        /**
        // 向后端请求路由数据
        getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          resolve(rewriteRoutes)
        })
        **/


      })
    }
  }

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}`)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
