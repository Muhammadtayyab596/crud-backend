const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A project must have a name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "A project must have a description"],
    trim: true,
  },
  startDate: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
    required: [true, "A project must have a image"],
  },

  techstack: {
    type: String,
    required: [true, "A project must have a teckstack"],
  },

  githubRepoLink: {
    type: String,
    required: [true, "A project must have a githubRepoLink"],
  },

  liveUrl: {
    type: String,
    required: [true, "A project must have a liveUrl"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A project must belong to a user"],
  },

  isCompleted: {
    type: Boolean,
    default: false,
  },

  isArchived: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Project", projectSchema);
