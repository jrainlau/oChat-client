<template>
  <header class="header">
    <div class="header-info">
      <div class="header-logo">
        <img :src="require('@/assets/img/logo.png')" alt="">
      </div>
      <div class="header-search">
        <input onkeyup="value=value.replace(/[^\d]/g,'')" type="tel" maxlength="6" placeholder="Type the room ID here" class="header-search-input" v-model="roomId" @keyup.enter="onSearch">
        <button class="header-search-btn" @click="onSearch">Enter</button>
      </div>
    </div>
    <div class="header-user">
      <div class="header-user-avatar">
        <img :src="avatar" alt="">
      </div>
      <span class="header-user-name">{{username}}</span>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    avatar: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      roomId: ''
    }
  },
  methods: {
    onSearch (e) {
      this.$emit('onSearch', this.roomId)
      this.roomId = ''
    }
  }
}
</script>

<style lang="less">
.header {
  width: 100%;
  padding: 0 30px;
  background: #fff;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  cursor: default;
  &-info {
    display: flex;
    align-items: center;
  }
  &-logo {
    margin-right: 40px;
    img {
      height: 100%;
    }
  }
  &-search {
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    &-input {
      width: 240px;
      border: none;
      outline: none;
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      padding: 0 10px;
      font-size: 16px;
    }
    &-btn {
      vertical-align: top;
      border: none;
      border-left: 1px solid #ccc;
      outline: none;
      background: #fff;
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      box-sizing: border-box;
      font-size: 18px;
      &:active {
        background: #eee;
      }
    }
  }
  &-user {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-avatar {
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      overflow: hidden;
      border-radius: 40px;
      margin-right: 15px;
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
    &-name {
      font-size: 18px;
    }
  }
}
</style>
