const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shortName: String,
  stream: {
    type: String,
    enum: ['Engineering', 'Medical', 'Management', 'Law', 'Arts', 'Science', 'Commerce', 'Design', 'Architecture', 'Pharmacy', 'Other']
  },
  degree: {
    type: String,
    enum: ['Certificate', 'Diploma', 'UG', 'PG', 'Doctorate', 'Integrated']
  },
  duration: String,
  description: String,
  
  // Eligibility
  eligibility: {
    minPercentage: Number,
    entranceExams: [String],
    subjectsRequired: [String],
    ageLimit: {
      min: Number,
      max: Number
    }
  },
  
  // Career Prospects (like Careers360 career scope)
  careerProspects: [{
    role: String,
    averageSalary: Number,
    growth: {
      type: String,
      enum: ['High', 'Medium', 'Low']
    },
    companies: [String]
  }],
  
  // Syllabus (like Careers360 syllabus)
  syllabus: [{
    year: Number,
    semesters: [{
      semester: Number,
      subjects: [{
        code: String,
        name: String,
        credits: Number,
        type: { type: String, enum: ['Theory', 'Practical', 'Project'] }
      }]
    }]
  }],
  
  // Top Colleges offering this course
  colleges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    fees: Number,
    seats: Number,
    cutoff: Number
  }],
  
  // Statistics
  popularity: { type: Number, default: 0 },
  demand: {
    type: String,
    enum: ['High', 'Medium', 'Low']
  },
  
  // Metadata
  tags: [String],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);