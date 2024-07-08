class EventEmitter {
  constructor() {
    this._events = {}; // 用来存放事件
  }

  // 在数组中 通过绑定name 添加回调
  on(eventName, cb) {
    const cbs = this._events[eventName] || [];
    cbs.push(cb);
    this._events[eventName] = cbs;
  }

  // args用于发布事件的参数 forEach触发
  emit(eventName, ...args) {
    const cbs = this._events[eventName] || [];
    cbs.forEach(cb => cb(...args))
  }

  // 找到对应的cb 删除
  off(eventName, cb) {
    const cbs = this._events[eventName] || [];
    const newCbs = cbs.filter(item => item !== cb);
    this._events[eventName] = newCbs;
  }

  // 触发一次后取消订阅
  once(eventName, cb) {
    const onceCb = (...args) => {
      cb(...args);
      this.off(eventName, onceCb);
    }
    this.on(eventName, onceCb)
  }
}

const emitter = new EventEmitter();
emitter.on('click', (num) => {
  console.log(num);
})
emitter.on('click', (num) => {
  console.log(num + 1);
})
emitter.emit('click', 123)
emitter.off('click', (num) => {
  console.log(num);
})
console.log(emitter._events)
