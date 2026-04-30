import mongoose from "mongoose";


// TODO add relevant data to profile (birthday, age, cpf, adress, state, city, etc)

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['success', 'warning', 'info'], default: 'info'},
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const candidateSchema = new mongoose.Schema({
  profile: {
    email: { type: String, required: true, unique: true},
    firstName: { type: String, default:"" },
    lastNames: { type: String, default:"" },
    phone: { type: String, default:"" },
  },

  isApproved: { type: Boolean, default: false },

  passwordHash: { type: String, required: true },

  steps: {
    registration: {
      access: { type: String, enum: ['available', 'locked'], default: 'available' },
      currentStatus: { type: String, enum: ['pending', 'submitted', 'passed', 'failed'], default: 'pending' },
      updatedAt:{ type: Date, default: Date.now }
    },

    test: {
      access: { type: String, enum: ['available', 'locked'], default: 'locked' },
      currentStatus: { type: String, enum: ['unavailable', 'pending', 'submitted', 'passed', 'failed'], default: 'unavailable' },
      choices: { type: [String], default: []},
      score: { type: Number, default: 0 },
      updatedAt:{ type: Date, default: Date.now }
    },

    reflectiveQuestions: {
      access: { type: String, enum: ['available', 'locked'], default: 'locked' },
      currentStatus: { type: String, enum: ['unavailable', 'pending', 'submitted', 'passed', 'failed'], default: 'unavailable' },
      updatedAt:{ type: Date, default: Date.now }
    },

    groupDynamic: {
      access: { type: String, enum: ['available', 'locked'], default: 'locked' },
      currentStatus: { type: String, enum: ['unavailable', 'pending', 'submitted', 'passed', 'failed'], default: 'unavailable' },
      slot: { type: Date },
      updatedAt:{ type: Date, default: Date.now }
    },

    finalInterview: {
      access: { type: String, enum: ['available', 'locked'], default: 'locked' },
      currentStatus: { type: String, enum: ['unavailable', 'pending', 'submitted', 'passed', 'failed'], default: 'unavailable' },
      slot: { type: Date },
      updatedAt:{ type: Date, default: Date.now }
    }
  },

  notifications: {
    type: [notificationSchema],
    default: [
      {
        type: 'info',
        text: 'Olá, que bom te ver aqui! Complete seu cadastro para liberar a próxima etapa',
        read: false
      }
    ]
  }

}, { timestamps: true });

export default mongoose.model("Candidate", candidateSchema)
