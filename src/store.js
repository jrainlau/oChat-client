/* eslint-disable no-console */

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {
    async preSubmit ({ commit }, userInfo) {
      const result = await axios({
        method: 'post',
        url: 'http://localhost:5000/getUser',
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
        url: 'http://localhost:5000/registration',
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
        url: 'http://localhost:5000/login',
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
    }
  }
})
