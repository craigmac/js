const text = 'Hello and welcome to a typewriter-like demo....!'

let i = 0

// Relying on global 'i' here, so not the best idea. Refactor could make
// this a closure?
function writeTextSequentially() {
  document.body.innerHTML = text.slice(0, i)
  i++
  if (i > text.length - 1) {
    i = 0
  }
}

setInterval(writeTextSequentially, 100)
