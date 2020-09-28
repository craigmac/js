const btn = document.getElementById('btn')
const container = document.getElementById('container')

btn.addEventListener('click', () => {
  createNotification()
})

// creates a new div and adds class toast to it then
// runs a timer to remove itself after 3 seconds
function createNotification () {
  const toast = document.createElement('div')
  toast.classList.add('toast')

  toast.innerText = 'Very important toast message...'

  container.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}
