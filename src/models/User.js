// src/models/User.js
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  profileImageUrl: { type: String, default: '/default-profile.png' }
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model('User', userSchema)
