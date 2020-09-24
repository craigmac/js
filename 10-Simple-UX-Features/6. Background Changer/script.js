const btn = document.getElementById('btn')

btn.addEventListener('click', () => {
  document.body.style.background = randomBackgroundChoice()
})

function randomBackgroundChoice () {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
}
