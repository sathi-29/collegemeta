const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortName: String,
  type: {
    type: String,
    enum: ['Government', 'Private', 'Deemed', 'Autonomous', 'Institute of National Importance'],
    required: true
  },
  establishedYear: Number,
  website: String,
  
  // Location
  location: {
    address: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Contact Information
  contact: {
    phone: [String],
    email: [String],
    fax: String,
    helpline: String
  },
  
  // Rankings (like Careers360 rankings)
  rankings: {
    nirf: {
      overall: Number,
      engineering: Number,
      management: Number,
      pharmacy: Number,
      medical: Number,
      law: Number,
      architecture: Number,
      year: Number
    },
    outlook: Number,
    indiaToday: Number,
    theWeek: Number,
    careers360Rating: {
      type: Number,
      min: 0,
      max: 10
    }
  },
  
  // Accreditation
  accreditation: {
    naacGrade: String,
    naacScore: Number,
    isUgcApproved: Boolean,
    isAicteApproved: Boolean,
    isNbaAccredited: Boolean,
    otherAccreditations: [String]
  },
  
  // Courses Offered (like Careers360 courses section)
  courses: [{
    name: String,
    degree: {
      type: String,
      enum: ['Diploma', 'UG', 'PG', 'Doctorate', 'Integrated']
    },
    duration: String,
    specialization: [String],
    fees: {
      tuition: Number,
      hostel: Number,
      other: Number,
      total: Number
    },
    seats: {
      total: Number,
      general: Number,
      obc: Number,
      sc: Number,
      st: Number,
      ews: Number,
      other: Number
    },
    eligibility: {
      exam: [String],
      minPercentage: Number,
      subjectsRequired: [String]
    },
    syllabus: [{
      semester: Number,
      subjects: [{
        code: String,
        name: String,
        credits: Number
      }]
    }]
  }],
  
  // Admission Process (like Careers360 admission section)
  admission: {
    mode: String,
    exams: [String],
    process: String,
    importantDates: [{
      event: String,
      date: Date,
      description: String
    }],
    applicationFee: {
      general: Number,
      reserved: Number
    },
    documentsRequired: [String]
  },
  
  // Cutoff Trends (like Careers360 cutoff section)
  cutoffs: [{
    exam: String,
    course: String,
    year: Number,
    round: Number,
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
  
  // Placement Statistics (like Careers360 placement section)
  placement: {
    year: Number,
    totalStudents: Number,
    placedStudents: Number,
    placementPercentage: Number,
    averagePackage: Number,
    medianPackage: Number,
    highestPackage: Number,
    topRecruiters: [String],
    internshipPercentage: Number,
    placementTrends: [{
      year: Number,
      averagePackage: Number,
      placementPercentage: Number
    }]
  },
  
  // Infrastructure (like Careers360 campus tour)
  facilities: {
    campusArea: String,
    classrooms: Number,
    labs: Number,
    library: {
      books: Number,
      journals: Number,
      digitalResources: Boolean,
      seatingCapacity: Number
    },
    hostels: {
      boys: { capacity: Number, fees: Number },
      girls: { capacity: Number, fees: Number },
      amenities: [String]
    },
    sports: {
      facilities: [String],
      achievements: [String]
    },
    medical: Boolean,
    wifi: Boolean,
    auditorium: Boolean,
    cafeteria: Boolean,
    transportation: Boolean
  },
  
  // Faculty
  faculty: {
    total: Number,
    studentFacultyRatio: Number,
    qualifications: {
      phd: Number,
      postGraduate: Number,
      graduate: Number
    },
    experience: {
      lessThan5: Number,
      '5-10': Number,
      '10-20': Number,
      moreThan20: Number
    }
  },
  
  // Student Life (like Careers360 reviews)
  studentLife: {
    clubs: [String],
    festivals: [String],
    annualEvents: [String],
    nss: Boolean,
    ncc: Boolean,
    placementTraining: Boolean,
    personalityDevelopment: Boolean
  },
  
  // Reviews & Ratings (like Careers360 reviews section)
  ratings: {
    overall: { type: Number, min: 0, max: 5, default: 0 },
    academics: Number,
    placement: Number,
    infrastructure: Number,
    faculty: Number,
    campusLife: Number,
    valueForMoney: Number,
    totalReviews: { type: Number, default: 0 }
  },
  
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: {
      overall: Number,
      academics: Number,
      placement: Number,
      infrastructure: Number,
      faculty: Number,
      campusLife: Number
    },
    title: String,
    comment: String,
    pros: [String],
    cons: [String],
    isVerifiedStudent: Boolean,
    helpful: { type: Number, default: 0 },
    report: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Images & Media (like Careers360 gallery)
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['campus', 'lab', 'hostel', 'event', 'infrastructure', 'other']
    },
    caption: String
  }],
  
  videos: [{
    url: String,
    type: {
      type: String,
      enum: ['campusTour', 'virtualTour', 'event', 'interview', 'other']
    },
    caption: String
  }],
  
  // Social Media
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String
  },
  
  // Verification & Status
  isVerified: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  verificationDate: Date,
  lastUpdated: { type: Date, default: Date.now },
  
  // Analytics
  views: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  compares: { type: Number, default: 0 },
  enquiries: { type: Number, default: 0 },
  
  // Metadata
  tags: [String],
  description: String,
  highlights: [String],
  similarColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
collegeSchema.index({ name: 'text', 'location.city': 'text', 'courses.name': 'text' });
collegeSchema.index({ 'ratings.overall': -1 });
collegeSchema.index({ 'placement.averagePackage': -1 });
collegeSchema.index({ 'rankings.nirf.overall': 1 });
collegeSchema.index({ 'location.state': 1, 'location.city': 1 });

module.exports = mongoose.model('College', collegeSchema);