function fetchData(callback) {
  setTimeout(() => {
    const data = 'Hello World'
    callback(data)
  },2000)
}

// fetchData((data) => {
//   console.log(data)
// })


function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello World')
    },2000)
  })
}
// fetchDataPromise().then((data) => {
//   console.log(data)
// })

async function fetchDataAsync() {
  const data = await fetchDataPromise()
  const data2 = await fetchDataPromise()
  console.log(data)
  console.log(data2)
}
fetchDataAsync()
