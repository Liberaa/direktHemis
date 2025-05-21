document.addEventListener("DOMContentLoaded", () => {
    const carouselImage = document.getElementById("carousel-image")
    if (!carouselImage) return
  
    const totalImages = parseInt(carouselImage.dataset.total, 10)
    const houseId = carouselImage.dataset.houseId
    let currentIndex = 0
  
    function updateImage() {
      carouselImage.src = `/house/image/${houseId}/${currentIndex}`
    }
  
    window.nextImage = () => {
      currentIndex = (currentIndex + 1) % totalImages
      updateImage()
    }
  
    window.prevImage = () => {
      currentIndex = (currentIndex - 1 + totalImages) % totalImages
      updateImage()
    }
  
    // Lightbox modal functionality
    const modal = document.getElementById("image-modal")
    const modalImg = document.getElementById("modal-img")
    const closeBtn = modal.querySelector(".modal-close")
  
    window.openModal = function(index) {
      currentIndex = index
      modalImg.src = `/house/image/${houseId}/${currentIndex}`
      modal.classList.remove("hidden")
    }
  
    function closeModal() {
      modal.classList.add("hidden")
      modalImg.src = ""
    }
  
    closeBtn.addEventListener("click", closeModal)
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal()
    })
  
    // Keyboard navigation 
    document.addEventListener("keydown", e => {
      if (modal.classList.contains("hidden")) return
      switch (e.key) {
        case "Escape":
          closeModal()
          break
        case "ArrowRight":
          currentIndex = (currentIndex + 1) % totalImages
          modalImg.src = `/house/image/${houseId}/${currentIndex}`
          break
        case "ArrowLeft":
          currentIndex = (currentIndex - 1 + totalImages) % totalImages
          modalImg.src = `/house/image/${houseId}/${currentIndex}`
          break
      }
    })
  
    // Mouse navigation: click left or right half of image
    modalImg.addEventListener("click", e => {
      const rect = modalImg.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      if (clickX < rect.width / 2) {
        // click on left: previous
        currentIndex = (currentIndex - 1 + totalImages) % totalImages
      } else {
        // click on right: next
        currentIndex = (currentIndex + 1) % totalImages
      }
      modalImg.src = `/house/image/${houseId}/${currentIndex}`
    })
  })
  