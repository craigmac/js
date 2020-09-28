// The container that holds the images, we transform this, not the images
const imageContainer = document.getElementById('images')
// The actual images, using nested selector syntax to grab all img elements
// below element with id #images (our image container and parent)
const images = document.querySelectorAll('#images img')

// global, we could get around by keep track of state locally by using
// closure and returning a fn that yield next currentSlide index on each call,
// but let's keep it simpler for this small example.
let currentSlide = 0

function nextSlide() {
  currentSlide++
  if (currentSlide > images.length - 1) {
    currentSlide = 0
  }
  imageContainer.style.transform = `translateX(${-currentSlide * 500}px)`
}

// every 2 seconds run a
setInterval(nextSlide, 2000)