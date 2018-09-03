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
  sessionStorage && sessionStorage.setItem(item, JSON.stringify(val))
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
  const chatHistory = getStorage('oChatHistory')
  if (Object.keys(chatHistory).length) {
    Object.keys(chatHistory).forEach((key) => {
      joinedRooms.map((room) => {
        if (room.roomId === key) {
          room.lastChat = chatHistory[key][chatHistory[key].length - 1]
        }
      })
    })
  }
  return joinedRooms
}
