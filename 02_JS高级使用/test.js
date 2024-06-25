function Person(name, age) {
  this.name = name
  this.age = age
}

Person.prototype.say = function () {
  console.log(this.name+this.age)
}

const p = new Person('sakura', 18)
p.say()
