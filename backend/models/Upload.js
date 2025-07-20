const mongoose = require("mongoose");

const uploadSchema = new  mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:  'User',
    },
   fileName : String,
     uploadedAt: {
    type: Date,
    default: Date.now,
  },
  data: Array,
});

module.exports = mongoose.model('Upload', uploadSchema);
