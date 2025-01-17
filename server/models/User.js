const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: {
        type: String,
        enum: [
            'Anthropology',
            'Architecture',
            'Bangla',
            'Biochemistry & Molecular Biology',
            'Business Administration',
            'Chemical Engineering & Polymer Science',
            'Chemistry',
            'Civil & Environmental Engineering',
            'Computer Science & Engineering',
            'Economics',
            'Electrical & Electronics Engineering',
            'English',
            'Food & Tea Technology',
            'Foresrty and Environmental Science',
            'Genetic Engineering & Biotechnology',
            'Geography & Environment',
            'Geography & Environmental',
            'Industrial & Production Engineering',
            'Mathematics',
            'Petroleum & Georesources Engineering',
            'Physics',
            'Political Studies',
            'Public Administration',
            'Social Work',
            'Sociology',
            'Software Engineering',
            'Statistics'
        ],
        required: true
    },
    session: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            return /^\d{4}-\d{4}$/.test(v);
          },
          message: props => `${props.value} is not a valid session format! Use YYYY-YYYY format.`
        }
      },
    bloodGroup: { 
        type: String, 
        enum: ['A+', 'B+', 'O+', 'A-', 'B-', 'O-', 'AB+', 'AB-'], 
    },
    presentAddress: { type: String },
    permanentAddress: { type: String},
    profession: { type: String},
    facebookId: {
        type: String,
        validate: {
          validator: function(v) {
            return /^https?:\/\/(www\.)?facebook\.com/.test(v);
          },
          message: props => `${props.value} is not a valid Facebook URL!`
        }
      },
      linkedinId: {
        type: String,
        validate: {
          validator: function(v) {
            return /^https?:\/\/(www\.)?linkedin\.com/.test(v);
          },
          message: props => `${props.value} is not a valid LinkedIn URL!`
        }
      },
    about: { type: String },
    religiousStatus: { 
        type: String, 
        enum: ['Muslim', 'Hindu', 'Christian', 'Buddhist', 'Other'], 
        required: true 
    },
    profilePic: { 
        type: String,
        default: 'https://example.com/default-profile-picture.jpg'
    },
    schoolName: { type: String},
    collegeName: { type: String },
    member: { type: Boolean, default: false },
    alumni: { type: Boolean, default: false },
    password: { type: String, required: true },
    phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /^(?:\+88|88)?(01[3-9]\d{8})$/.test(v);
          },
          message: props => `${props.value} is not a valid Bangladeshi phone number!`
        }
      },
    designation: { 
        type: String, 
        enum: ['President', 'Vice-President', 'General Secretary','Joint General Secretary','Assistant General Secretary','Treasurer','Assistant Treasurer',
            'Organizing Secretary','IT Secretary','Assistant IT Secretary','Cultural Secretary','Assistant Cultural Secretary','Advisor','Member'
        ], 
        default: 'Member'
    },
}, 
{ 
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
