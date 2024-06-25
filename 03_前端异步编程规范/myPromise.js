/**
 * 规范
 * 0. 初始状态pending
 * 1. 执行了resolve promise状态变为resolved
 * 2. 执行了reject promise状态变为rejected
 * 3. 状态不可逆
 * 4. Promise 中有throw => reject
 * 5. then 方法接收两个回调 成功 fulfilled 失败 rejected
 * 6. then 方法返回一个新的promise
 * 7. 存在定时器 需要等到定时器结束再执行then
 * 8. then 方法可以链式调用 下一次then接收的是上一个then的返回值
 */
class MyPromise {
  constructor(executor) {
    // 初始化值
    this.initValue()
    this.initBind()

    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  initValue() {
    this.promiseState = 'pending'
    this.promiseResult = null
  }

  initBind() {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  resolve(value) {
    if (this.promiseState !== 'pending') return
    this.promiseState = 'fulfilled'
    this.promiseResult = value
  }

  reject(reason) {
    if (this.promiseState !== 'pending') return
    this.promiseState = 'rejected'
    this.promiseResult = reason
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => reason

    if (this.promiseState === 'fulfilled') {
      onFulfilled(this.promiseResult)
    } else if (this.promiseState === 'rejected') {
      onRejected(this.promiseResult)
    }
  }
}

new MyPromise((resolve, reject) => {
  reject('err')
}).then(res => {
  console.log(res)
})
