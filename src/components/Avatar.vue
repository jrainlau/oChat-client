<template>
  <div class="avatar" :class="{'unclickable': unclickable, 'small': small}">
    <img :src="src" alt="" @click="onItemClick">
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
  width: 120px;
  height: 120px;
  border-radius: 120px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
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
