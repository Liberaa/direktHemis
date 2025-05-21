document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('houseImagesInput')
    const hiddenInput = document.getElementById('houseImagesHidden')
    const previewContainer = document.getElementById('previewContainer')
  
    let filesArray = []
  
    input.addEventListener('change', (event) => {
      const selectedFiles = Array.from(event.target.files)
      filesArray = filesArray.concat(selectedFiles)
      renderPreviews()
      syncHiddenInput()
      input.value = '' // reset input so same file can be reselected
    })
  
    function renderPreviews() {
      previewContainer.innerHTML = ''
      filesArray.forEach((file, index) => {
        const reader = new FileReader()
        reader.onload = (loadEvent) => {
          const result = loadEvent?.target?.result
          if (typeof result === 'string') {
            const div = document.createElement('div')
            div.className = 'preview-image-wrapper'
            div.innerHTML = `
              <img src="${result}" class="preview-image" alt="Förhandsvisning">
              <button type="button" class="remove-btn" data-index="${index}"></button>
            `
            previewContainer.appendChild(div)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  
    previewContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-btn')) {
        const index = parseInt(e.target.dataset.index)
        filesArray.splice(index, 1)
        renderPreviews()
        syncHiddenInput()
      }
    })
  
    function syncHiddenInput() {
      const dataTransfer = new DataTransfer()
      filesArray.forEach(file => dataTransfer.items.add(file))
      hiddenInput.files = dataTransfer.files
    }
  })
  