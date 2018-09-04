<template>
  <div class="list">
    <section class="list-header">
      <button class="list-header-create" @click="$emit('createRoom')"><i class="fas fa-plus"></i> Create</button>
    </section>
    <ul class="list-rooms">
      <li
        class="list-rooms-item"
        v-for="(room, index) in joinedRooms"
        :ref="room.roomId"
        :class="{'active': activeRoom === room.roomId, 'notify': notifyRoom === room.roomId && activeRoom !== room.roomId}"
        :key="room.roomId"
        @click="onItemClick(room.roomId, index)">
        <div class="avatar">
          <i class="far fa-comments"></i>
        </div>
        <div class="info">
          <div class="info-name-time">
            <span class="name">{{room.roomName}}</span>
            <span class="time">{{room['lastChat'].time | timeFilter}}</span>
          </div>
          <div class="info-preview">
            <span class="info-prevew-user">{{username === room['lastChat'].user ? 'You' : room['lastChat'].user}}: </span>
            <span class="info-prevew-text">{{room['lastChat'].text}}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { getStorage } from '@/utils'

const timeFilter = (timeStr) => {
  let type = 'today'
  let chatTime = ''
  const ymd = timeStr.split(' ')[0].split('-')
  const time = timeStr.split(' ')[1]
  const [year, month, day] = [Number(ymd[0]), Number(ymd[1]), Number(ymd[2])]

  const curYear = new Date().getFullYear()
  const curMonth = new Date().getMonth() + 1
  const curDay = new Date().getDate()

  if (curYear > year) {
    type = 'years ago'
  } else if (curYear === year && curMonth > month) {
    type = 'monthes ago'
  } else if (curYear === year && curMonth === month && curDay > day) {
    type = 'days ago'
  }

  if (type === 'today') {
    chatTime = time
  } else if (type === 'days ago') {
    chatTime = curDay - day === 1 ? `Yesterdy ${time}` : `${month}/${day} ${time}`
  } else if (type === 'monthes ago') {
    chatTime = `${month}/${day} ${time}`
  } else {
    chatTime = 'Last Year'
  }

  if (!timeStr) {
    chatTime = 'Just now'
  }

  return chatTime
}

export default {
  filters: {
    timeFilter
  },
  data () {
    return {
      activeRoom: '',
      autoJoin: true,
      notify: true,
      username: getStorage('oChatUsername')
    }
  },
  computed: {
    joinedRooms () {
      return this.$store.state.joinedRooms
    },
    notifyRoom () {
      return this.$store.state.notifyRoom
    }
  },
  updated () {
    if (this.autoJoin && this.joinedRooms[0]) {
      this.onItemClick(this.joinedRooms[0].roomId, 0)
      this.autoJoin = false
    }
  },
  methods: {
    onItemClick (id, index) {
      this.activeRoom = id
      this.$store.dispatch('notifyRoom', '')
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
      overflow: hidden;
      &.notify:after {
        content: '';
        display: block;
        width: 40px;
        height: 40px;
        background: #ff5f52;
        position: absolute;
        top: -25px;
        left: -25px;
        transform: rotate(45deg);
      }
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
