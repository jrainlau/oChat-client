export const isUsername = (str) => {
  return (typeof str === 'string') && (str.length && str.length < 12)
}

export const isPassword = (psw) => {
  return /^[0-9a-zA-Z]{6,16}$/.test(psw)
}

export const isInviteCode = (code) => {
  return /^[0-9]{4}$/.test(code)
}
