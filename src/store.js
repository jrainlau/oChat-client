/* eslint-disable no-console */

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { setLastChat, getStorage, domain, path } from '@/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    joinedRooms: {},
    notifyRoom: ''
  },
  mutations: {
    UPDATE_JOINED_ROOMS (_state, obj) {
      _state.joinedRooms = setLastChat(obj)
    },
    UPDATA_CHAT_PREVIEW (_state, { index, user, text, time }) {
      _state.joinedRooms[index].lastChat.user = user
      _state.joinedRooms[index].lastChat.text = text
      _state.joinedRooms[index].lastChat.time = time
    },
    NOTIFY_ROOM (_state, id) {
      _state.notifyRoom = id
    }
  },
  actions: {
    async preSubmit ({ commit }, userInfo) {
      const result = await axios({
        method: 'post',
        url: `${domain}${path}/getUser`,
        data: userInfo
      }).then(({ data }) => {
        return data.message
      }).catch(({ response }) => {
        return {
          status: response.status,
          message: response.data.message
        }
      })
      return result
    },
    async getUserInfo ({ commit }, userInfo) {
      const result = await axios({
        method: 'post',
        url: `${domain}${path}/getUserInfo`,
        headers: {
          'Authorization': `Bearer ${getStorage('oChatAT')}`
        },
        data: userInfo
      }).then(({ data }) => {
        return data.message
      }).catch(({ response }) => {
        return {
          status: response.status,
          message: response.data.message
        }
      })
      return result
    },
    async editProfile ({ commit }, userInfo) {
      const result = await axios({
        method: 'post',
        url: `${domain}${path}/editProfile`,
        headers: {
          'Authorization': `Bearer ${getStorage('oChatAT')}`
        },
        data: userInfo
      }).then(({ data }) => {
        return data.message
      }).catch(({ response }) => {
        return {
          status: response.status,
          message: response.data.message
        }
      })
      return result
    },
    async doRegistration ({ commit }, registerInfo) {
      const result = await axios({
        method: 'post',
        url: `${domain}${path}/registration`,
        data: registerInfo
      }).then(({ data }) => {
        return data.message
      }).catch(({ response }) => {
        return {
          status: response.status,
          message: response.data.message
        }
      })
      return result
    },
    async doLogin ({ commit }, loginInfo) {
      const result = await axios({
        method: 'post',
        url: `${domain}${path}/login`,
        data: loginInfo
      }).then(({ data }) => {
        return data.message
      }).catch(({ response }) => {
        return {
          status: response.status,
          message: response.data.message
        }
      })
      return result
    },
    async refreshToken ({ commit }) {
      const result = await axios({
        method: 'post',
        url: `${domain}${path}/token/refresh`,
        headers: {
          'Authorization': `Bearer ${getStorage('oChatRT')}`
        }
      }).then(({ data }) => {
        return data.message
      }).catch(({ response }) => {
        return {
          status: response.status,
          message: response.data.message
        }
      })
      return result
    },
    async doLogout ({ commit }) {
      const clearAccessToken = await axios({
        method: 'post',
        url: `${domain}${path}/logout/access`,
        headers: {
          'Authorization': `Bearer ${getStorage('oChatAT')}`
        }
      }).then(({ data }) => {
        return data.message
      }).catch(({ response }) => {
        return {
          status: response.status,
          message: response.data.message
        }
      })
      const clearRefreshToken = await axios({
        method: 'post',
        url: `${domain}${path}/logout/refresh`,
        headers: {
          'Authorization': `Bearer ${getStorage('oChatRT')}`
        }
      }).then(({ data }) => {
        return data.message
      }).catch(({ response }) => {
        return {
          status: response.status,
          message: response.data.message
        }
      })
      return {
        clearAccessToken,
        clearRefreshToken
      }
    },
    updateJoinedRooms ({ commit }, obj) {
      commit('UPDATE_JOINED_ROOMS', obj)
    },
    updateChatPreview ({ commit }, { index, user, text, time }) {
      commit('UPDATA_CHAT_PREVIEW', { index, user, text, time })
    },
    notifyRoom ({ commit }, id) {
      commit('NOTIFY_ROOM', id)
    }
  }
})
