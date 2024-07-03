function foo(num) {
  return num
}

function bar(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num)
    }, 2000)
  })
}


function* gen() {
  const res1 = yield foo(1)
  const res2 = yield bar(res1)
  return yield bar(res2)
}

// const g = gen()
// console.log(g.next())
// console.log(g.next().value.then(res => console.log(res)))
// console.log(g.next().value.then(res => console.log(res)))
// console.log(g.next())

function generatorToAsync(generatorFn) {
  const generator = generatorFn()

  function handleResult(result) {
    if (result.done) return Promise.resolve(result.value)

    return Promise.resolve(result.value)
      .then(res => handleResult(generator.next(res)))
      .catch(err => handleResult(generator.throw(err)))
  }

  try {
    return handleResult(generator.next())
  } catch (e) {
    Promise.reject(e)
  }
}

const asyncGen = generatorToAsync(gen)
asyncGen.then(res => console.log(res))
