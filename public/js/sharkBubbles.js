const container = document.getElementById('bubble-container')
const shark = document.getElementById('shark')
const scoreDisplay = document.getElementById('sharkScore')
let score = 0

// Create a bubble
function createBubble() {
  const bubble = document.createElement('div')
  bubble.classList.add('bubble')

  const size = Math.random() * 40 + 10
  bubble.style.width = `${size}px`
  bubble.style.height = `${size}px`
  bubble.style.left = `${Math.random() * 100}%`
  bubble.style.top = `${Math.random() * 100}%`
  bubble.style.animationDuration = `${5 + Math.random() * 5}s`

  container.appendChild(bubble)

  setTimeout(() => {
    bubble.remove()
  }, 12000)
}

// Constantly generate bubbles
setInterval(createBubble, 200)

// Detect shark eating bubbles
function checkCollisions() {
  const bubbles = document.querySelectorAll('.bubble')
  const sharkRect = shark.getBoundingClientRect()

  bubbles.forEach(bubble => {
    const rect = bubble.getBoundingClientRect()

    const eaten =
      rect.left < sharkRect.right &&
      rect.right > sharkRect.left &&
      rect.top < sharkRect.bottom &&
      rect.bottom > sharkRect.top

    if (eaten) {
      bubble.remove()
      score++
      scoreDisplay.textContent = `🦈 Bubbles eaten: ${score}`
    } 
  })
}

setInterval(checkCollisions, 150)
