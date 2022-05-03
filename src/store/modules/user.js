import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    access_token: '',
    refresh_token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_ACCESS_TOKEN: (state, token) => {
      state.access_token = token
    },
    SET_REFRESH_TOKEN: (state, token) => {
      state.refresh_token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          if (result == null) {
            throw new Error(response.message)
          }
          storage.set(ACCESS_TOKEN, result.accessToken, 7 * 24 * 60 * 60 * 1000)
          storage.set(REFRESH_TOKEN, result.refreshToken, 30 * 24 * 60 * 60 * 1000)
          commit('SET_ACCESS_TOKEN', result.accessToken)
          commit('SET_REFRESH_TOKEN', result.refreshToken)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data

          // if (result.role && result.role.permissions.length > 0) {
          //   const role = result.role
          //   role.permissions = result.role.permissions
          //   role.permissions.map(per => {
          //     if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
          //       const action = per.actionEntitySet.map(action => { return action.action })
          //       per.actionList = action
          //     }
          //   })
          //   role.permissionList = role.permissions.map(permission => { return permission.permissionId })
          //   commit('SET_ROLES', result.role)
          //   commit('SET_INFO', result)
          // } else {
          //   reject(new Error('getInfo: roles must be a non-null array !'))
          // }

          if (result.role) {
            const role = result.role
            commit('SET_ROLES', role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_ACCESS_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          storage.remove(REFRESH_TOKEN)
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          // resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
