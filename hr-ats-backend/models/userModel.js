const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['candidate', 'hr', 'company'],
    required: true,
  },
  companyName: {
    type: String,
    // This field is only required if the role is 'company'
    required: function() { return this.role === 'company'; }
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;