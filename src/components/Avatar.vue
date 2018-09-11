<template>
  <div class="avatar" :class="{'unclickable': unclickable, 'small': small, 'empty': !src}" @click="onItemClick">
    <img :src="src" alt="">
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    unclickable: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onItemClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 120px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  border: 1px solid #ccc;
  background: #aaa;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  &.empty {
    &:before {
      content: '';
      display: block;
      width: 30px;
      height: 30px;
      background: #fff;
      position: absolute;
      top: 15px;
      left: 45px;
      border-radius: 100%;
    }
    &:after {
      content: '';
      display: block;
      width: 70px;
      height: 50px;
      background: #fff;
      position: absolute;
      top: 50px;
      left: 25px;
      border-radius: 100%;
    }
  }
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  &.unclickable {
    cursor: default;
  }
  &.small {
    width: 60px;
    height: 60px;
    margin-bottom: 15px;
  }
}
</style>
