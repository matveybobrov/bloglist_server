/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'blogs',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedDocument) => {
    returnedDocument.id = returnedDocument._id.toString()
    delete returnedDocument._id
    delete returnedDocument.__v
    delete returnedDocument.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
