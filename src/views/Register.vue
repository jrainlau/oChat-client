<template>
  <div class="page">
    <div class="register">
      <Avatar :src="avatar" @click="filePickerOnClick"></Avatar>
      <div class="register-form">
        <div class="register-form-input-box" :class="{'error': username && !validUsername}" data-error="Invalid username!">
          <input autocomplete="new-password" maxlength="12" class="register-form-input" type="text" placeholder="Name" v-model="username" @blur="presubmit">
        </div>
        <div class="register-form-input-box" :class="{'error': password && !validPassword}" data-error="Invalid password!">
          <input autocomplete="new-password" maxlength="12" class="register-form-input" :class="{'error': errorPassword}" type="password" @keyup.enter="login" placeholder="Password" v-model="password">
        </div>
        <div class="register-form-input-box" v-if="!userExist" :class="{'error': inviteCode && !validInviteCode}" data-error="Invalid invite code!">
          <input autocomplete="new-password" maxlength="4" class="register-form-input" :class="{'error': errorInviteCode}" type="text"  @keyup.enter="register" placeholder="Invite code" v-model="inviteCode">
        </div>
        <div class="register-form-btn-box">
          <o-button class="register-form-btn" v-if="userExist" :disabled="!allowLogin" type="success" @click="login">Login</o-button>
          <o-button class="register-form-btn" v-if="!userExist" :disabled="!allowRegister" type="success" @click="register">Register</o-button>
        </div>
      </div>
      <input type="file" ref="filePicker" accept="image/*" id="file-picker" hidden  @change="doChooseImg">
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */

import chooseImg from '@/utils/chooseImg'
import { isUsername, isPassword, isInviteCode } from '@/utils/validator'
import { setStorage } from '@/utils'
import Button from '@/components/Button'
import Avatar from '@/components/Avatar'

export default {
  data () {
    return {
      username: '',
      password: '',
      inviteCode: '',
      userExist: false,
      errorPassword: false,
      errorInviteCode: false,
      avatar: null
    }
  },
  computed: {
    validUsername () {
      return isUsername(this.username)
    },
    validPassword () {
      return isPassword(this.password)
    },
    validInviteCode () {
      return isInviteCode(this.inviteCode)
    },
    allowRegister () {
      return this.validUsername && this.validPassword && this.validInviteCode
    },
    allowLogin () {
      return this.validUsername && this.validPassword
    }
  },
  methods: {
    filePickerOnClick () {
      this.$refs.filePicker.click()
    },
    doChooseImg (e) {
      chooseImg(e, (dataUrl) => {
        this.avatar = dataUrl
      })
    },
    async presubmit () {
      const result = await this.$store.dispatch('preSubmit', {
        username: this.username
      })
      if (result.username) {
        this.userExist = true
        this.avatar = result.avatar
      } else {
        this.userExist = false
      }
    },
    async login () {
      const loginInfo = {
        username: this.username,
        password: this.password
      }
      const result = await this.$store.dispatch('doLogin', loginInfo)
      if (!result.username) {
        this.errorPassword = true
        setTimeout(() => {
          this.errorPassword = false
        }, 1000)
      } else {
        setStorage('oChatAvatar', result.avatar)
        setStorage('oChatUsername', this.username)
        this.saveToken(result['access_token'], result['refresh_token'])
        this.$router.replace('/chat')
      }
    },
    async register () {
      const registerInfo = {
        username: this.username,
        password: this.password,
        inviteCode: this.inviteCode,
        avatar: this.avatar
      }
      const result = await this.$store.dispatch('doRegistration', registerInfo)
      if (result.message === 'Invite code error!') {
        this.errorInviteCode = true
        setTimeout(() => {
          this.errorInviteCode = false
        }, 1000)
      } else {
        setStorage('oChatAvatar', result.avatar)
        setStorage('oChatUsername', this.username)
        this.saveToken(result['access_token'], result['refresh_token'])
        this.$router.replace('/chat')
      }
    },
    saveToken (accessToken, refreshToken) {
      if (sessionStorage) {
        sessionStorage.setItem('oChatAT', accessToken)
        sessionStorage.setItem('oChatRT', refreshToken)
      }
    }
  },
  components: {
    'o-button': Button,
    Avatar
  }
}
</script>

<style lang="less">
.page {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .register {
    width: 320px;
    height: 460px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    box-shadow: 0 1px 1px 0 rgba(60,64,67,.08), 0 1px 3px 1px rgba(60,64,67,.16);
    &-form {
      padding: 0 25px;
      width: 100%;
      box-sizing: border-box;
      &-input {
        width: 100%;
        border: none;
        outline: none;
        box-sizing: border-box;
        font-size: 16px;
        height: 26px;
        line-height: 26px;
        &.error {
          animation: shake 0.8s 1;
        }
      }
      &-btn {
        float: right;
      }
    }
  }
}

.register-form-input-box {
  position: relative;
  width: 100%;
  height: 32px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ccc;
  overflow: hidden;
  &.error:after {
    content: attr(data-error);
    color: red;
    position: absolute;
    right: 0;
    top: 10px;
    font-size: 14px;
  }
}
.register-form-btn-box {
  padding-top: 30px;
}

@keyframes shake {
  from,
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
}
</style>
