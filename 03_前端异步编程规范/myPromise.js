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
 * 9. all
 * 10. race
 * 11. allSettled
 * 12. any
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
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
  }

  initBind() {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  resolve(value) {
    if (this.promiseState !== 'pending') return
    this.promiseState = 'fulfilled'
    this.promiseResult = value

    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.promiseResult)
    }
  }

  reject(reason) {
    if (this.promiseState !== 'pending') return
    this.promiseState = 'rejected'
    this.promiseResult = reason

    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.promiseResult)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason
    }

    var thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        setTimeout(() => {
          try {
            const x = cb(this.promiseResult)
            if (x === thenPromise && x) {
              throw new Error('不能返回自身')
            }
            if (x instanceof MyPromise) {
              x.then(resolve, reject)
            } else {
              resolve(x)
            }
          } catch (e) {
            reject(e)
            throw new Error(e)
          }
        })
      }

      if (this.promiseState === 'fulfilled') {
        resolvePromise(onFulfilled)
      } else if (this.promiseState === 'rejected') {
        resolvePromise(onRejected)
      } else if (this.promiseState === 'pending') {
        this.onFulfilledCallbacks.push(onFulfilled.bind(this, onFulfilled))
        this.onRejectedCallbacks.push(onRejected.bind(this, onRejected))
      }
    })

    return thenPromise
  }

  static all(promises) {
    const result = []
    let count = 0
    return new MyPromise((resolve, reject) => {
      const addData = (index, value) => {
        result[index] = value
        count++
        if (count === promises.length) resolve(result)
      }
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(res => {
            addData(index, res)
          }, err => reject(err))
        } else {
          addData(index, promise)
        }
      })
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        if (promise instanceof MyPromise) {
          promise.then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        } else {
          resolve(promise)
        }
      })
    })
  }

  static allSettled(promises) {
    return new Promise((resolve, reject) => {
      const res = []
      let count = 0
      const addData = (status, value, i) => {
        res[i] = {
          status,
          value
        }
        count++
        if (count === promises.length) {
          resolve(res)
        }
      }
      promises.forEach((promise, i) => {
        if (promise instanceof MyPromise) {
          promise.then(res => {
            addData('fulfilled', res, i)
          }, err => {
            addData('rejected', err, i)
          })
        } else {
          addData('fulfilled', promise, i)
        }
      })
    })
  }

  static any(promises) {
    return new Promise((resolve, reject) => {
      let count = 0
      promises.forEach((promise) => {
        promise.then(val => {
          resolve(val)
        }, err => {
          count++
          if (count === promises.length) {
            reject(new AggregateError('All promises were rejected'))
          }
        })
      })
    })
  }
}

const test3 = new MyPromise((resolve, reject) => {
  resolve(100) // 输出 状态：success 值： 200
}).then(res => 2 * res, err => 3 * err)
  .then(res => console.log('success', res), err => console.log('fail', err))
