<template>
  <div class="list">
    <section class="list-header">
      <button class="list-header-create" @click="$emit('createRoom')"><i class="fas fa-plus"></i> Create</button>
    </section>
    <ul class="list-rooms">
      <li class="list-rooms-item" :ref="room.roomId" :class="{'active': activeRoom === room.roomId}" v-for="(room, index) in joinedRooms" :key="room.roomId" @click="onItemClick(room.roomId, index)">
        <div class="avatar">
          <i class="far fa-comments"></i>
        </div>
        <div class="info">
          <div class="info-name-time">
            <span class="name">{{room.roomName}}</span>
            <span class="time">10:45 pm</span>
          </div>
          <div class="info-preview" v-if="room['lastChat']">
            <span class="info-prevew-user">{{Object.keys(room['lastChat'])[0]}}: </span>
            <span class="info-prevew-text">{{Object.values(room['lastChat'])[0]}}</span>
          </div>
          <div class="info-preview" v-if="!room['lastChat']">
            <span class="info-prevew-user"></span>
            <span class="info-prevew-text"></span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  props: {
    joinedRooms: {
      type: Array,
      default: () => []
    },
    newMsg: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      activeRoom: ''
    }
  },
  watch: {
    joinedRooms (newVal) {
      if (newVal) {
        this.onItemClick(newVal[0].roomId, 0)
      }
    },
    newMsg (newVal) {
      const previewRoom = this.$refs[newVal.roomId][0]
      const previewUser = previewRoom.querySelector('.info-prevew-user')
      const previewText = previewRoom.querySelector('.info-prevew-text')

      previewUser.innerText = newVal.user + ': '
      previewText.innerText = newVal.text
    }
  },
  methods: {
    onItemClick (id, index) {
      this.activeRoom = id
      this.$emit('selectRoom', id, index)
    }
  }
}
</script>

<style lang="less" scoped>
@listBackground: rgb(241, 239, 239);
@activeBackground: rgb(230, 236, 239);
@activeLine: rgb(0, 158, 220);
@infoColor: #aaa;

.list {
  height: 100%;
  width: 320px;
  background: #fff;
  flex: 0 0 auto;
  &-header {
    height: 80px;
    background: @listBackground;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    &-create {
      border: 1px solid #ccc;
      font-size: 18px;
      background: #fff;
      width: 220px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      outline: none;
      border-radius: 4px;
      &:active {
        background: #eee;
      }
    }
  }
  &-rooms {
    margin: 0;
    padding: 0;
    list-style: none;
    height: calc(100% - 80px);
    box-sizing: border-box;
    overflow: scroll;
    cursor: default;
    &-item {
      display: flex;
      justify-content: space-between;
      height: 120px;
      box-sizing: border-box;
      background: @listBackground;
      border-bottom: 1px solid #ccc;
      padding: 15px;
      position: relative;
      &.active {
        background: @activeBackground;
        &:before {
          content: '';
          display: block;
          position: absolute;
          height: 100%;
          width: 3px;
          background: @activeLine;
          top: 0;
          left: 0;
        }
      }
      .avatar {
        font-size: 32px;
        margin-right: 15px;
        flex: 1 1 auto;
      }
      .info {
        width: 100%;
        &-name-time {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          .name {
            color: #333;
            font-size: 16px;
          }
          .time {
            color: @infoColor;
          }
        }
        &-preview {
          padding-right: 15px;
          height: 60px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          color: @infoColor;
        }
      }
    }
  }
}
</style>
