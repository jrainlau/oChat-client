<template>
  <div class="page">
    <o-header
      :avatar="avatar"
      :username="username"
      @onSearch="onSearch"></o-header>
    <section class="main">
      <o-conversation
        :currentRoom="currentRoom"
        :msgList="msgList"
        :username="username"
        @submit="submit"
        @changeRoomName="changeRoomName"
        @leaveRoom="leaveRoom"></o-conversation>
      <o-list
        ref="oList"
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
import { setAvatarsMap, getStorage, setStorage, getRoomIndex, getJoinedRoomsId, showNotice, domain, path } from '@/utils'

let socket = {}

export default {
  data () {
    return {
      avatar: '',
      username: '',
      io: {},
      currentRoom: {},
      msgList: [],
      msgHistory: {},
      notifyRoom: ''
    }
  },
  computed: {
    joinedRooms () {
      return this.$store.state.joinedRooms
    }
  },
  mounted () {
    this.onConnect()
    this.onStatus()
    this.onMessage()
    this.getUserInfo()
  },
  components: {
    'o-header': Header,
    'o-list': List,
    'o-conversation': Conversation
  },
  methods: {
    onConnect () {
      let token = sessionStorage && sessionStorage.getItem('oChatAT')
      socket = io(domain, {
        path: `${path}/socket.io`,
        query: { token }
      })
      socket.on('Connect successed', (data) => {
        console.log(data)
        if (data.code === 200 && data.message.joinedRooms.length) {
          const joinedRooms = data.message.joinedRooms.reverse()
          joinedRooms.forEach(({ roomId }) => {
            socket.emit('join', {
              roomId
            })
          })
          this.$store.dispatch('updateJoinedRooms', joinedRooms)
        } else {
          sessionStorage && sessionStorage.removeItem('oChatHistory')
        }
        console.log(data.message.status)
      })
      socket.on('Connect failed', async (data) => {
        console.log(data)
        socket.disconnect()
        const result = await this.$store.dispatch('refreshToken')
        if (result.status === 200 && result.data.message['access_token']) {
          token = result.data.message['access_token']
          setStorage('oChatAT', token)
          location.reload()
        } else {
          this.$router.replace('/')
        }
      })
    },
    onStatus () {
      socket.on('status', ({ message }) => {
        console.log(message)
        if (message.status === 'created') {
          const joinedRooms = message.joinedRooms.reverse()
          this.$store.dispatch('updateJoinedRooms', joinedRooms)
          this.$refs.oList.onItemClick(this.joinedRooms[0].roomId, 0)
          setAvatarsMap(message.user, message.avatar)
        }

        if (message.status === 'joined') {
          if (message.user === this.username) {
            const joinedRooms = message.joinedRooms.reverse()
            this.$store.dispatch('updateJoinedRooms', joinedRooms)
          } else if (!this.currentRoom['members'].includes(message.user)) {
            this.currentRoom['members'].push(message.user)
          }
          message.avatarList.forEach(({ user, avatar }) => {
            setAvatarsMap(user, avatar)
          })
        }

        if (message.status === 'rename') {
          this.joinedRooms.forEach((room) => {
            if (room.roomId === message.roomId) {
              room.roomName = message.roomName
              this.currentRoom.roomName = message.roomName
            }
          })
        }

        if (message.status === 'left') {
          if (message.user === this.username) {
            const joinedRooms = message.joinedRooms.reverse()
            this.$store.dispatch('updateJoinedRooms', joinedRooms)
            if (this.joinedRooms[0]) {
              this.$refs.oList.onItemClick(this.joinedRooms[0].roomId, 0)
            } else {
              this.currentRoom = {}
            }
            const localChatHistory = getStorage('oChatHistory')
            delete localChatHistory[message.roomId]
            setStorage('oChatHistory', localChatHistory)
          } else {
            const index = this.currentRoom['members'].findIndex(name => name === message.username)
            index && this.currentRoom['members'].splice(index, 1)
          }
        }
      })
    },
    onMessage () {
      socket.on('message', ({ message, status }) => {
        console.log(message)
        const roomIndex = getRoomIndex(this.joinedRooms, message.roomId)
        const msgObj = {
          user: message.user,
          text: message.text,
          time: message.time
        }
        this.$store.dispatch('updateChatPreview', {
          index: roomIndex,
          ...msgObj
        })
        if (getJoinedRoomsId(this.joinedRooms).includes(message.roomId)) {
          this.msgHistory = getStorage('oChatHistory')

          if (!this.msgHistory[message.roomId]) {
            this.msgHistory[message.roomId] = []
          }
          this.$store.dispatch('notifyRoom', message.roomId)
          this.msgHistory[message.roomId].push(msgObj)
          setStorage('oChatHistory', this.msgHistory)
        }
        if (message.roomId === this.currentRoom.roomId) {
          this.msgList.push(msgObj)
        } else {
          showNotice(`${message.user}: ${message.text}`)
        }
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
      socket.emit('create', {
        roomId: Math.random().toString().slice(-6),
        avatar: this.getUserInfo().avatar
      })
    },
    selectRoom (id, index) {
      this.currentRoom = this.joinedRooms[index]

      const localChatHistory = getStorage('oChatHistory')

      if (localChatHistory[id]) {
        this.msgList = localChatHistory[id]
      } else {
        this.msgList = []
      }
    },
    submit (value) {
      socket.emit('text', {
        message: value,
        roomId: this.currentRoom.roomId
      })
    },
    changeRoomName (newName) {
      socket.emit('rename', {
        newRoomName: newName,
        roomId: this.currentRoom.roomId
      })
    },
    onSearch (id) {
      socket.emit('join', {
        roomId: id
      })
    },
    leaveRoom (id) {
      socket.emit('leave', {
        roomId: id
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
