// imageController.js - Hantering av bilddata
import { getAuth } from '@clerk/express'
import { ImageModel } from '../models/ImageModel.js'

// Ladda upp bild
export async function uploadImage(req, res) {
  const { userId } = getAuth(req)
  if (!req.file) return res.status(400).send('Ingen bild uppladdad')
  
  console.log('uploadImage: Received file with original name:', req.file.originalname)
  const imageData = req.file.buffer
  const imageContentType = req.file.mimetype
  const price = req.body.price ? Number(req.body.price) : 0
  const area = req.body.are ? Number(req.body.area) : 0


  try {
    const newImage = new ImageModel({
      userId,
      originalName: req.file.originalname,
      description: req.body.description || '',
      area,
      price, 
      image: { data: imageData, contentType: imageContentType }
    })
    await newImage.save()
    console.log('uploadImage: Image saved, ID:', newImage._id)
    res.redirect('/')
  } catch (err) {
    console.error('uploadImage: Error saving image:', err)
    res.status(500).send('Serverfel vid sparande av bild')
  }
}

// Hämtar en bild 
export async function getImageData(req, res) {
  const { id } = req.params
  try {
    const image = await ImageModel.findById(id)
    if (image && image.image && image.image.data) {
      res.contentType(image.image.contentType)
      res.send(image.image.data)
    } else {
      res.status(404).send('Ingen bild hittades')
    }
  } catch (err) {
    console.error('getImageData: Error fetching image data:', err)
    res.status(500).send('Serverfel vid hämtning av bilddata')
  }
}
