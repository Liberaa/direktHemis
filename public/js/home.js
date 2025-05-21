function deleteImage(id) {
    fetch('/images/' + id, { method: 'DELETE' })
    .then(res => {
      if (res.ok) {
        console.log('Bild raderad')
        window.location.reload()
      } else {
        console.error('Misslyckades med att radera bild')
      }
    })
    .catch(err => {
      console.error('Fel vid radering av bild:', err)
    })
  }
  
  function updateDesc(id) {
    const newDesc = document.getElementById('desc-' + id).value
    if (!newDesc) {
      console.error('Ingen beskrivning angiven')
      return
    }
    fetch('/images/' + id + '/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: newDesc })
    })
    .then(res => {
      if (res.ok) {
        console.log('Beskrivning uppdaterad')
        window.location.reload()
      } else {
        console.error('Misslyckades med att uppdatera beskrivning')
      }
    })
    .catch(err => {
      console.error('Fel vid uppdatering av bild:', err)
    })
  }
  