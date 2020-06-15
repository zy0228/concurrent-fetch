<template>
  <div id="app">
    <H1>文件上传</H1>

    <input type="file" @change="upload" placeholder="请上传文件">

    <p>{{name}}</p>
  </div>
</template>

<script>
import axios from 'axios'      // eslint-disable-line
import { concurrencyFetch } from './lib'

const CHUNK_SIZE = 2 * 1024 * 1024

export default {
  name: 'App',
  data() {
    return {
      name: ''
    }
  },
  methods: {
    upload(e) {
      const file = e.target.files[0]
      const { size, name } = file
      const maxReqNum = 5
      const blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice

      let chunks = []
      let position = 0
      let length = 0

      this.name = name

      // splitChunks
      if (size < CHUNK_SIZE) {
        chunks.push(file.slice(0))
      } else {
        while (true) {
          length += CHUNK_SIZE
          const blob = blobSlice.call(file, position, length)
          position += CHUNK_SIZE

          if (!blob.size) {
            break
          }
          chunks.push(blob)
        }
      }

      // define formdata
      chunks = chunks.map((item, index) => {
        const data = new FormData()
        data.append('token', (+new Date()))
        data.append('index', index)
        data.append('file', item)
      })

      // upload
      concurrencyFetch(chunks, this.fetch, maxReqNum, this.callbackHandler)
    },
    fetch(data) {
      const url = 'https://test'
      const config = {
        header: {
          'Content-type': 'multipart/form-data'
        }
      }
      return axios.post(url, data, config).then(res => {
        return Promise.resolve()
      })
    },
    callbackHandler() {
      // upload is ok
    }
  }
}
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
