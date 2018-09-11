<template>
  <div class="page">
    <div class="register">
      <Avatar :src="avatar" @click="filePickerOnClick"></Avatar>
      <div class="register-form">
        <div class="register-form-input-box" :class="{'error': username && !validUsername}" data-error="Invalid username!">
          <input autocomplete="new-password" maxlength="12" class="register-form-input" :class="{'error': userExist}" type="text" placeholder="New name" v-model="username" @blur="presubmit">
        </div>
        <div class="register-form-input-box" :class="{'error': password && !validOldPwd}" data-error="Invalid password!">
          <input autocomplete="new-password" maxlength="12" class="register-form-input" :class="{'error': errorPassword}" type="password" placeholder="Old password" v-model="password">
        </div>
        <div class="register-form-input-box" :class="{'error': newPassword && !validNewPwd}" data-error="Invalid password!">
          <input autocomplete="new-password" maxlength="12" class="register-form-input" type="password" @keyup.enter="updateProfile" placeholder="New password" v-model="newPassword">
        </div>
        <div class="register-form-btn-box">
          <o-button class="register-form-btn" :disabled="!allowUpdate" type="success" @click="updateProfile">Update</o-button>
          <o-button class="register-form-btn logout" type="danger" @click="logout">Logout</o-button>
        </div>
      </div>
      <input type="file" ref="filePicker" accept="image/*" id="file-picker" hidden  @change="doChooseImg">
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */

import chooseImg from '@/utils/chooseImg'
import { isUsername, isPassword } from '@/utils/validator'
import { getStorage } from '@/utils'
import Button from '@/components/Button'
import Avatar from '@/components/Avatar'

export default {
  data () {
    return {
      username: '',
      password: '',
      newPassword: '',
      userExist: false,
      errorPassword: false,
      avatar: typeof getStorage('oChatAvatar') === 'string' ? getStorage('oChatAvatar') : ''
    }
  },
  computed: {
    validUsername () {
      return isUsername(this.username)
    },
    validOldPwd () {
      return isPassword(this.password)
    },
    validNewPwd () {
      return isPassword(this.newPassword)
    },
    allowUpdate () {
      return this.validUsername && this.validOldPwd && this.validNewPwd && !this.userExist
    }
  },
  async mounted () {
    const userInfo = await this.$store.dispatch('getUserInfo', {
      username: getStorage('oChatUsername')
    })
    if (!userInfo.username) {
      this.$router.replace('/')
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
      if (this.username === getStorage('oChatUsername')) {
        return false
      }

      const result = await this.$store.dispatch('preSubmit', {
        username: this.username
      })
      if (result.username) {
        this.userExist = true
        setTimeout(() => {
          this.userExist = false
          this.username = ''
        }, 1000)
      } else {
        this.userExist = false
      }
    },
    async updateProfile () {
      const userInfo = {
        username: getStorage('oChatUsername'),
        newName: this.username,
        password: this.password,
        newPassword: this.newPassword,
        newAvatar: this.avatar
      }
      const result = await this.$store.dispatch('editProfile', userInfo)
      if (result.status !== 500) {
        this.logout()
      } else {
        this.errorPassword = true
        setTimeout(() => {
          this.errorPassword = false
          this.password = ''
        }, 1000)
      }
    },
    async logout () {
      const { clearAccessToken, clearRefreshToken } = await this.$store.dispatch('doLogout')
      if (typeof clearAccessToken === 'string' && typeof clearRefreshToken === 'string') {
        this.$router.replace('/')
      } else {
        console.log({ clearAccessToken, clearRefreshToken })
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
        &.logout {
          float: left;
        }
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
