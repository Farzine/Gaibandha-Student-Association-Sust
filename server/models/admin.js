const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

AdminSchema.pre('save', function(next) {
  const admin = this;
  
  if (!admin.isModified('passwordHash')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(admin.passwordHash, salt, (err, hash) => {
      if (err) return next(err);
      admin.passwordHash = hash;
      next();
    });
  });
});

AdminSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.passwordHash, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const Admin = mongoose.model('Admin', AdminSchema);

// Initialize the admin if not exists
const initializeAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne();
        if (!existingAdmin) {
          // Use plain password here to let the pre('save') middleware hash it
          const initialAdmin = new Admin({
            email: 'admin@example.com',
            passwordHash: 'password123', // Plain password
          });
    
          // Save the admin, triggering the middleware
          await initialAdmin.save();
          console.log('Initial admin created with email: admin@example.com and password: password123');
        } else {
          console.log('Admin already exists.');
        }
      } catch (error) {
        console.error('Error initializing admin:', error);
      }
};

module.exports = { Admin, initializeAdmin };
