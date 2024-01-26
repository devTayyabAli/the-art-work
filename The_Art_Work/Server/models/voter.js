const mongoose = require("mongoose");

const voterSchema = mongoose.Schema({
    candidateAddress: {
        type: String,
    },
    voterAddress: {
        type: String,
    },
    vote:{
        type: String,
    }



})
const voter = mongoose.model("voter", voterSchema);
module.exports = voter;