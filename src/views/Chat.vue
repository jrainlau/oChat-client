<template>
  <div class="page">
    <o-header :avatar="avatar" :username="username"></o-header>
    <section class="main">
      <o-conversation
        :currentRoom="currentRoom"
        :msgList="msgList"
        :username="username"
        @submit="submit"
        @changeRoomName="changeRoomName"></o-conversation>
      <o-list
        :joinedRooms="joinedRooms"
        :newMsg="newMsg"
        @createRoom="createRoom"
        @selectRoom="selectRoom"></o-list>
    </section>
  </div>
</template>

<script>
/* eslint-disable no-console */
import io from 'socket.io-client'
import Header from '@/components/Header'
import List from '@/components/List'
import Conversation from '@/components/Conversation'
import { setAvatarsMap, getStorage, setStorage, setLastChat } from '@/utils'

export default {
  data () {
    return {
      avatar: '',
      username: '',
      io: {},
      joinedRooms: [],
      currentRoom: {},
      msgList: [],
      newMsg: {}
    }
  },
  mounted () {
    this.socket()
    this.getUserInfo()
  },
  components: {
    'o-header': Header,
    'o-list': List,
    'o-conversation': Conversation
  },
  methods: {
    socket () {
      const token = sessionStorage && sessionStorage.getItem('oChatAT')
      this.io = io.connect('http://127.0.0.1:5000/chat', {
        query: { token }
      })
      this.io.on('Connect successed', (data) => {
        if (data.code === 200 && data.message.joinedRooms.length) {
          let joinedRooms = data.message.joinedRooms.reverse()
          joinedRooms = setLastChat(joinedRooms)
          this.joinedRooms = joinedRooms
        }
        console.log(data.message.status)
      })
      this.io.on('Connect failed', (data) => {
        console.log(data)
        this.io.disconnect()
      })
      this.io.on('status', ({ message }) => {
        if (message.status === 'created') {
          this.joinedRooms = message.joinedRooms.reverse()
          setAvatarsMap(message.user, message.avatar)
        }

        if (message.status === 'joined') {
          setAvatarsMap(message.user, message.avatar)
        }

        if (message.status === 'rename') {
          let joinedRooms = message.joinedRooms.reverse()
          joinedRooms = setLastChat(joinedRooms)
          this.joinedRooms = joinedRooms
        }
      })
      this.io.on('message', ({ message, status }) => {
        console.log(message)
        this.newMsg = {
          roomId: message.roomId,
          user: message.user,
          text: message.text
        }

        const msgObj = {}
        msgObj[message.user] = message.text
        this.msgList.push(msgObj)

        const storageObj = getStorage('oChatHistory')
        storageObj[message.roomId] = this.msgList
        setStorage('oChatHistory', storageObj)
      })
    },
    getUserInfo () {
      const avatar = getStorage('oChatAvatar')
      const username = getStorage('oChatUsername')
      this.avatar = avatar
      this.username = username
      return {
        avatar,
        username
      }
    },
    createRoom () {
      this.io.emit('create', {
        roomId: Math.random().toString().slice(-6),
        avatar: this.getUserInfo().avatar
      })
    },
    selectRoom (id, index) {
      this.currentRoom = this.joinedRooms[index]
      this.io.emit('join', {
        roomId: this.currentRoom.roomId
      })

      const localChatHistory = getStorage('oChatHistory')

      if (localChatHistory[id]) {
        this.msgList = localChatHistory[id]
      } else {
        this.msgList = []
      }
    },
    submit (value) {
      this.io.emit('text', {
        message: value,
        roomId: this.currentRoom.roomId
      })
    },
    changeRoomName (newName) {
      this.io.emit('rename', {
        newRoomName: newName,
        roomId: this.currentRoom.roomId
      })
    }
  }
}
</script>

<style lang="less">
.page {
  height: 100%;
  .main {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding-top: 80px;
    display: flex;
  }
}
</style>
