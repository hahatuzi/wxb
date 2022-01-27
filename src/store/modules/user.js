import { logout, getInfo, refreshToken } from '@/api/login'
import { getToken, setToken, setExpiresIn, removeToken } from '@/utils/auth'
import { login, getUserInfo, getUnread, getYqUnread } from '@/api/user/user'
import avatar from '@/assets/images/profile.jpg'

const state = {
    token: getToken(),
    name: '',
    avatar: avatar,
    roles: [],
    permissions: [],
    unread: {},
  }

const mutations = {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_UNREAD: (state, unread) => {
      state.unread = JSON.parse(JSON.stringify(unread))
    }
  }

const actions = {
    // 登录
    login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        // let token = '5b69b578a56d4a70b11a9776e6d6ab01'
        // 760cc4bb119e450c8bb1ebdc238798b5 cyjbs
        // 5b69b578a56d4a70b11a9776e6d6ab01 xjbs

        // setToken(token)
        // commit('SET_TOKEN', token)
        // setExpiresIn(1000)
        // commit('SET_EXPIRES_IN', 1000)
        // resolve()


        login(userInfo).then(res => {
          let data = res.data
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          setExpiresIn(data.expires_in)
          commit('SET_EXPIRES_IN', data.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {

        commit('SET_ROLES', ['ROLE_DEFAULT'])
        resolve()

        getUserInfo().then(res => {
          // let { nickName, unit: { unitname }, phonenumber} = res.data;
          let { nickName } = res.data;
          localStorage.setItem("nickName", nickName);
          // localStorage.setItem("unitName", unitname);
          // localStorage.setItem("phonenumber", phonenumber);
        })

        /**
        getInfo().then(res => {
          const user = res.user
          const avatar = user.avatar == "" ? require("@/assets/images/profile.jpg") : user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
        **/
      })
    },

    // 获取未读数
    GetUnread({commit, state}) {
      return new Promise((resolve, reject) => {
        getUnread().then(res1 => {
          let data = res1.data;
          getYqUnread().then(res2 => {
            data.yqReceive = res2.data;
            commit('SET_UNREAD', data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 刷新token
    RefreshToken({commit, state}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.token).then(res => {
          setExpiresIn(res.data)
          commit('SET_EXPIRES_IN', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {

        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        resolve()

        /**
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })

         **/
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
