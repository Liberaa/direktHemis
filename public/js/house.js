function deleteHouse(id) {
    fetch('/house/' + id, { method: 'DELETE' })
    .then(res => {
      if (res.ok) {
        console.log('Fastighet raderad')
        window.location.reload()
      } else {
        console.error('Misslyckades med att radera fastighet')
      }
    })
    .catch(err => {
      console.error('Fel vid radering av fastighet:', err)
    })
  }
  