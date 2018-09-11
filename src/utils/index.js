/* eslint-disable no-console */

export function setAvatarsMap (username, avatar) {
  const avatarMap = (sessionStorage && sessionStorage.getItem('oChatAvatarMap') && JSON.parse(sessionStorage.getItem('oChatAvatarMap'))) || {}
  avatarMap[username] = avatar
  sessionStorage && sessionStorage.setItem('oChatAvatarMap', JSON.stringify(avatarMap))
}

export function getAvatarMap () {
  const avatarMap = (sessionStorage && sessionStorage.getItem('oChatAvatarMap') && JSON.parse(sessionStorage.getItem('oChatAvatarMap'))) || {}
  return avatarMap
}

export function setStorage (item, val) {
  if (sessionStorage) {
    sessionStorage.setItem(item, typeof val === 'string' ? val : JSON.stringify(val))
  }
}

export function getStorage (item) {
  const storeStr = (sessionStorage && sessionStorage.getItem(item)) || '{}'
  let result
  try {
    result = JSON.parse(storeStr)
  } catch (e) {
    result = storeStr
  }
  return result
}

export function setLastChat (joinedRooms) {
  joinedRooms.map((room) => {
    if (!room.lastChat) {
      room.lastChat = {
        user: 'You',
        text: 'Entered a new room',
        time: ''
      }
    }
  })
  const chatHistory = getStorage('oChatHistory')
  if (Object.keys(chatHistory).length) {
    Object.keys(chatHistory).forEach((key) => {
      joinedRooms.map((room) => {
        if (room.roomId === key) {
          const lastChatInfo = chatHistory[key][chatHistory[key].length - 1]
          room.lastChat = {
            user: lastChatInfo.user,
            text: lastChatInfo.text,
            time: lastChatInfo.time
          }
        }
      })
    })
  }
  return joinedRooms
}

export function getRoomIndex (joinedRooms, id) {
  let roomIndex = 0
  joinedRooms.forEach((room, index) => {
    if (room.roomId === id) {
      roomIndex = index
    }
  })
  return roomIndex
}

export function getJoinedRoomsId (joinedRooms) {
  return joinedRooms.map(({ roomId }) => roomId)
}

export function showNotice (msg) {
  Notification.requestPermission((per) => {
    if (per === 'granted') {
      const notification = new Notification('oChat new message', {
        dir: 'auto',
        body: msg
      })
      return notification
    }
  })
}

// export const domain = 'https://jrainlau.com'

// export const path = '/ochat-server'

export const domain = 'http://localhost:3000'

export const path = ''
