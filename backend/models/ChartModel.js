const mongoose = require('mongoose');
 const chartSchema = new mongoose.Schema({
    user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    },

    xAxis : String,
    yAxis : String,
    chartType : String,
    data : Array,
    createdAt : {type : Date , default : Date.now}

 });

 module.exports = mongoose.model("Chart",chartSchema);
