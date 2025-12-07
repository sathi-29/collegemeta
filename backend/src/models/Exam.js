const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  fullName: String,
  category: {
    type: String,
    enum: ['Engineering', 'Medical', 'Management', 'Law', 'Design', 'Arts', 'Science', 'Commerce', 'Defense', 'Other']
  },
  level: {
    type: String,
    enum: ['National', 'State', 'University', 'International']
  },
  conductingBody: String,
  website: String,
  
  // Eligibility (like Careers360 eligibility section)
  eligibility: {
    minAge: Number,
    maxAge: Number,
    educationalQualification: String,
    minPercentage: Number,
    subjectsRequired: [String],
    nationality: { type: String, default: 'Indian' },
    attempts: Number
  },
  
  // Exam Pattern (like Careers360 exam pattern section)
  pattern: {
    mode: {
      type: String,
      enum: ['Online', 'Offline', 'Both']
    },
    duration: Number,
    totalMarks: Number,
    markingScheme: {
      positive: Number,
      negative: Number
    },
    sections: [{
      name: String,
      questions: Number,
      marks: Number,
      duration: Number
    }],
    language: [String]
  },
  
  // Important Dates (like Careers360 important dates)
  importantDates: [{
    event: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  
  // Syllabus (like Careers360 syllabus section)
  syllabus: [{
    subject: String,
    topics: [String],
    weightage: Number
  }],
  
  // Preparation Resources (like Careers360 preparation section)
  preparationResources: {
    books: [{
      name: String,
      author: String,
      publisher: String,
      edition: String
    }],
    onlinePlatforms: [{
      name: String,
      url: String,
      features: [String]
    }],
    coachingCenters: [{
      name: String,
      locations: [String],
      contact: String
    }],
    mockTests: [{
      name: String,
      url: String,
      free: Boolean
    }]
  },
  
  // Previous Year Papers (like Careers360 papers section)
  previousYearPapers: [{
    year: Number,
    paperUrl: String,
    solutionUrl: String,
    analysisUrl: String,
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Difficult']
    }
  }],
  
  // Cutoff Trends (like Careers360 cutoff trends)
  cutoffTrends: [{
    year: Number,
    openingRank: {
      general: Number,
      obc: Number,
      sc: Number,
      st: Number,
      ews: Number
    },
    closingRank: {
      general: Number,
      obc: Number,
      sc: Number,
      st: Number,
      ews: Number
    }
  }],
  
  // Participating Colleges
  colleges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  }],
  
  // FAQs (like Careers360 FAQ section)
  faqs: [{
    question: String,
    answer: String
  }],
  
  // Statistics
  registrations: {
    year: Number,
    count: Number
  },
  
  // Metadata
  description: String,
  importance: { type: Number, default: 0 },
  tags: [String],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);