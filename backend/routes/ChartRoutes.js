const express = require("express");
const router = express.Router();
const Chart = require("../models/ChartModel");
const authMiddleware = require("../middleware/authMiddleware");


// save chart
router.post("/save", authMiddleware,async (req , res)=>{
    try{
        const {xAxis , yAxis , chartType , data} = req.body;
        const newChart = new Chart({
            user : req.user.id,
            xAxis,
            yAxis,
            chartType,
            data,
        });
        await newChart.save();

        
        res.status(201).json({message : "Chart saved succesfully !"});  

    }catch(err){
        res.status(500).json({message : "Failed to save chart"});
        
    }
})

module.exports=router;