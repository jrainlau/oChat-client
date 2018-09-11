<template>
  <button class="button" :class="type" @click="onItemClick">
    <slot>Button</slot>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default'
    }
  },
  methods: {
    onItemClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="less">
.button {
  border: none;
  padding: 10px 15px;
  font-size: 18px;
  outline: none;
  border-radius: 4px;
  &[disabled] {
    opacity: .7;
  }
}
.default {
  color: #333;
  border: 1px solid #333;
}

.success {
  background: #00bfa5;
  color: #fff;
  &:active {
    background: #008e76;
  }
}

.danger {
  background: #ff5f52;
  color: #fff;
  &:active {
    background: #f74231;
  }
}
</style>
