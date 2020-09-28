function createHeart () {
  // Create new div and add the content and class
  const heart = document.createElement('div')
  heart.classList.add('heart')

  // set random start
  heart.style.left = Math.random() * 100 + 'vw'
  // 1-3 second random duration
  heart.style.animationDuration = Math.random() * 2 + 3 + 's'

  heart.innerText = '💜'
  document.body.appendChild(heart)

  // remove
  setTimeout(() => {
    heart.remove()
  }, 5000)
}

setInterval(createHeart, 300)
