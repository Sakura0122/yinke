var value = 1
var foo = {
  value: 2,
  bar: function () {
    return this.value
  }
}

console.log(foo.bar())
console.log((foo.bar)())
console.log((foo.bar = foo.bar)())
console.log((false || foo.bar)())
console.log((foo.bar, foo.bar)())
