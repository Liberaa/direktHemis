// ImageModel.js - Modell för bilder
import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  originalName: { type: String },
  description: { type: String, default: '' },
  image: { data: Buffer, contentType: String },
  price: { type: Number, default: 0 },
  area: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now }
})

export const ImageModel = mongoose.model('Image', imageSchema)
