import { react } from 'react'

const hello = 'hello world'
let x = 1

const lol = 'lol'
function salute(msg) {
  alert(msg)
  debugger
  console.log(msg)
}

salute(hello)

setTimeout(() => {
  
}, 2000)
debugger

const dog = {
  bark: function () {
    console.log('woof, woof')
  },
  lol : lol
}

function sum (a, b, c){
  return a + b + c
}

const arr = [0, 1]

arr[10] = 10

console.log(...arr)