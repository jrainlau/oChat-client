<template>
  <div class="emoji">
    <div class="emoji-list">
      <section v-for="(key, keyIndex) in Object.keys(emoji)" :key="keyIndex">
        <span class="emoji-list-item" v-for="(item, index) in emoji[key]" :key="index" @click="selectEmoji(item)">
          {{item}}
        </span>
      </section>
    </div>
  </div>
</template>

<script>
import emoji from '@/assets/emoji'

export default {
  data () {
    return {
      emoji
    }
  },
  methods: {
    selectEmoji (emoji) {
      this.$emit('selectEmoji', emoji)
    }
  }
}
</script>

<style lang="less" scoped>
.emoji {
  position: absolute;
  top: -395px;
  width: 460px;
  height: 375px;
  background: #fff;
  box-shadow: 0 1px 1px 0 rgba(60,64,67,.08), 0 1px 3px 1px rgba(60,64,67,.16);
  border-radius: 4px;
  box-sizing: border-box;
  padding-top: 15px;
  &-list {
    height: 340px;
    overflow: scroll;
    box-sizing: border-box;
    padding: 0 15px;
    section {
      margin-bottom: 15px;
      .emoji-list-item {
        display: inline-block;
        font-size: 24px;
        padding: 5px 5px 0 5px;
        -webkit-user-select: none;
        cursor: default;
        &:hover {
          background: #eee;
        }
        &:active {
          background: #ddd;
        }
      }
    }
  }
}
</style>
