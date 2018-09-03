<template>
  <div class="conversation">
    <div class="conversation-header" v-if="currentRoom.roomId">
      <span class="quite"><i class="fas fa-times-circle"></i></span>
      <div class="conversation-header-info">
        <h2><input type="text" :value="currentRoom.roomName" @keyup.enter="changeName"></h2>
        <span>No.{{currentRoom.roomId}}</span>
      </div>
      <div class="online-amount">{{currentRoom.members.length}} people online</div>
    </div>
    <ul class="conversation-chat">
      <li class="conversation-chat-msg" :class="{'self': username === Object.keys(msg)[0]}" v-for="(msg, index) in msgList" :key="index">
        <div class="avatar">
          <img :src="avatarMap[username]" alt="">
        </div>
        <div class="info">
          <span class="info-name">{{Object.keys(msg)[0]}}</span>
          <p class="info-detail">{{Object.values(msg)[0]}}</p>
        </div>
      </li>
    </ul>
    <div class="conversation-editor" ref="editor">
      <div class="tools">
        <div class="control-bar" ref="controlBar"></div>
        <span class="tools-btn"><i class="far fa-grin-alt"></i></span>
      </div>
      <div class="editor-box">
        <div class="editor" contenteditable="true" @keydown.enter.prevent="submit"></div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { getAvatarMap } from '@/utils'

export default {
  props: {
    currentRoom: {
      type: Object,
      default: () => {}
    },
    msgList: {
      type: Array,
      default: () => []
    },
    username: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      onDrag: false
    }
  },
  computed: {
    avatarMap () {
      return getAvatarMap()
    }
  },
  mounted () {
    this.resize()
  },
  methods: {
    resize (e) {
      const controlBar = this.$refs.controlBar
      const editor = this.$refs.editor
      let startY = 0
      let endY = 0
      let moveY = 0
      let startHeight = 0
      let endHeight = 0
      controlBar.addEventListener('mousedown', (e) => {
        startY = e.pageY
        startHeight = editor.offsetHeight
        this.onDrag = true
      })
      document.addEventListener('mouseup', () => {
        this.onDrag = false
      })
      document.addEventListener('click', () => {
        this.onDrag = false
      })
      document.addEventListener('mousemove', (e) => {
        if (this.onDrag) {
          endY = e.pageY
          moveY = startY - endY
          endHeight = startHeight + moveY
          if (endHeight >= 120 && endHeight <= 300) {
            editor.style.height = endHeight + 'px'
          } else if (endHeight < 120) {
            editor.style.height = '120px'
            this.onDrag = false
          } else if (endHeight > 300) {
            editor.style.height = '300px'
            this.onDrag = false
          }
        }
      })
    },
    changeName (e) {
      this.$emit('changeRoomName', e.target.value)
      e.target.blur()
    },
    submit (e) {
      const value = e.target.innerText.replace(/[\n\r]$/, '')
      e.target.innerText = ''
      this.$emit('submit', value)
    }
  }
}
</script>

<style lang="less" scoped>
@headerBackground: rgb(241, 241, 241);
@chatBackground: rgb(243, 243, 243);
@infoColor: #aaa;
@activeBackground: #b3e5fc;

.conversation {
  height: 100%;
  width: 100%;
  background: pink;
  flex: 1 1 auto;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &-header {
    background: @headerBackground;
    height: 80px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    flex: 0 0 auto;
    &-info {
      text-align: center;
      width: 33%;
      h2 {
        margin-bottom: 0;
        input {
          border: none;
          background: none;
          width: 200px;
          text-align: center;
          font-size: inherit;
        }
      }
    }
    .quite {
      font-size: 18px;
      color: #ff5f52;
      width: 33%;
    }
    .online-amount {
      width: 33%;
      text-align: right;
      font-size: 14px;
    }
  }
  &-chat {
    height: 100%;
    background: @chatBackground;
    flex: 1 1 auto;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: scroll;
    box-sizing: border-box;
    &-msg {
      padding: 15px;
      display: flex;
      &.self {
        flex-direction: row-reverse;
        .avatar {
          margin-right: 0;
          margin-left: 15px;
        }
        .info .info-name {
          display: none;
        }
        .info .info-detail {
          margin: 0;
          background: @activeBackground;
        }
      }
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 40px;
        overflow: hidden;
        margin-right: 15px;
        background: #fff;
        text-align: center;
        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      }
      .info {
        max-width: 60%;
        &-name {
          color: @infoColor;
        }
        &-detail {
          margin: 5px 0 0 0;
          padding: 15px;
          background: #fff;
          border-radius: 4px;
          word-break: break-all;
          overflow-wrap: break-word;
          max-width: 100%;
        }
      }
    }
  }
  &-editor {
    position: relative;
    height: 120px;
    background: @headerBackground;
    flex: 0 0 auto;
    border-top: 1px solid #ccc;
    box-sizing: border-box;
    padding: 5px 15px;
    .tools {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 0 10px;
      .control-bar {
        position: absolute;
        top: 0;
        width: 100%;
        height: 2px;
        cursor: row-resize;
      }
      &-btn {
        display: inline-block;
        font-size: 22px;
        width: 35px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        &:active {
          color: #0288d1;
        }
      }
    }
    .editor-box {
      height: 100%;
      padding-top: 30px;
      padding-bottom: 15px;
      box-sizing: border-box;
      .editor {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        background: #fff;
        border: 1px solid #ccc;
        box-sizing: border-box;
        overflow: scroll;
        word-break: break-all;
        overflow-wrap: break-word;
        padding: 5px;
        outline: none;
      }
    }
  }
}
</style>
