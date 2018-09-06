<template>
  <div class="editor" contenteditable="true" @keydown.enter.prevent="submit" @paste.prevent="onPaste"></div>
</template>

<script>
import paste from '@/utils/paste'

export default {
  methods: {
    submit (e) {
      const value = e.target.innerHTML.replace(/[\n\r]$/, '')
      if (value) {
        this.$emit('submit', value)
        e.target.innerText = ''
      }
    },
    async onPaste (e) {
      const result = await paste(e)
      const imgRegx = /^data:image\/png;base64,/
      if (imgRegx.test(result)) {
        const sel = window.getSelection()
        if (sel && sel.rangeCount === 1 && sel.isCollapsed) {
          const range = sel.getRangeAt(0)
          const img = new Image()
          img.src = result
          range.insertNode(img)
          range.collapse(false)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      } else {
        document.execCommand('insertText', false, result)
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
