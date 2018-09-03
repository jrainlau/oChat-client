// 200 KB 对应的字节数
function toPreviewer (dataUrl, cb) {
  cb && cb(dataUrl)
}

function compress (img, fileType) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')

  const width = img.width
  const height = img.height

  canvas.width = width
  canvas.height = height

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, width, height)

  // 压缩
  const base64data = canvas.toDataURL(fileType, 0.75)
  canvas = ctx = null

  return base64data
}

function chooseImg (e, cb, maxsize = 200 * 1024) {
  const file = e.target.files[0]
  // 接受 jpeg, jpg, png 类型的图片
  if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) {
    return
  }

  const reader = new FileReader()
  reader.onload = function () {
    const result = this.result
    let img = new Image()

    // 如果图片小于 200kb，不压缩
    if (result.length <= maxsize) {
      toPreviewer(result, cb)
      return
    }

    img.onload = function () {
      const compressedDataUrl = compress(img, file.type)
      toPreviewer(compressedDataUrl, cb)
      img = null
    }

    img.src = result
  }

  reader.readAsDataURL(file)
}

export default chooseImg
