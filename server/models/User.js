const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);




const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: {
      type: String,
      enum: [
        "Anthropology",
        "Architecture",
        "Bangla",
        "Biochemistry & Molecular Biology",
        "Business Administration",
        "Chemical Engineering & Polymer Science",
        "Chemistry",
        "Civil & Environmental Engineering",
        "Computer Science & Engineering",
        "Economics",
        "Electrical & Electronics Engineering",
        "English",
        "Food & Tea Technology",
        "Foresrty and Environmental Science",
        "Genetic Engineering & Biotechnology",
        "Geography & Environment",
        "Geography & Environmental",
        "Industrial & Production Engineering",
        "Mathematics",
        "Petroleum & Georesources Engineering",
        "Physics",
        "Political Studies",
        "Public Administration",
        "Social Work",
        "Sociology",
        "Software Engineering",
        "Statistics",
      ],
      required: true,
    },
    session: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{4}-\d{4}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid session format! Use YYYY-YYYY format.`,
      },
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "B+", "O+", "A-", "B-", "O-", "AB+", "AB-"],
    },
    presentAddress: { type: String },
    permanentAddress: { type: String },
    profession: { type: String },
    facebookId: {
      type: String,
    },
    linkedinId: {
      type: String,
    },
    about: { type: String },
    religiousStatus: {
      type: String,
      enum: ["Muslim", "Hindu", "Christian", "Buddhist", "Other"],
      required: true,
    },
    profilePic: {
      type: String,
      default: "https://res.cloudinary.com/dsd4b2lkg/image/upload/v1718475943/kxrcwdacnp1vdbrwai6k.png",
    },
    schoolName: { type: String },
    collegeName: { type: String },
    member: { type: Boolean, default: false },
    alumni: { type: Boolean, default: false },
    password: { type: String, required: true },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(?:\+88|88)?(01[3-9]\d{8})$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid Bangladeshi phone number!`,
      },
    },
    designation: {
      type: String,
      enum: [
        "President",
        "Senior Vice President",
        "Vice-President",
        "General Secretary",
        "Joint General Secretary",
        "Assistant General Secretary",
        "Treasurer",
        "Assistant Treasurer",
        "Organizing Secretary",
        "Assistant Organizing Secretary",
        "Office Secretary",
        "Assistant Office Secretary",
        "Women's Affairs Secretary",
        "Assistant Women's Affairs Secretary",
        "Sports Secretary",
        "Assistant Sports Secretary",
        "Publication Secretary",
        "Assistant Publication Secretary",
        "IT Secretary",
        "Assistant IT Secretary",
        "Cultural Secretary",
        "Assistant Cultural Secretary",
        "Advisor",
        "Member",
      ],
      default: "Member",
    },
    // NEW FIELDS for OTP-based flows
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpire: { type: Date },

    emailVerificationOTP: { type: String },
    emailVerified: { type: Boolean, default: false },
    notifications: [notificationSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
