/**
 * 并发请求处理
 * @param {Array} iterators  上传列表
 * @param {Number} maxNum  最大并发数 默认 5
 * @param {Function} callback  完成回调函数
 */

export function concurrencyFetch(iterators, handler, maxNum = 5, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('the callback must be a function')
  }

  const len = iterators.length
  let id = 0
  let count = 0

  function _request() {
    while (id < len && maxNum > 0) {
      maxNum--
      handler(iterators[id++]).finally(() => {
        maxNum++
        count++
        if (count === len) {
          return callback()
        } else {
          _request()
        }
      })
    }
  }

  _request()
}
