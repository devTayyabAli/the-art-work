const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userAddress: {
        type: String,

    },
    Sponsor_Address: {
        type: String,

    },
    Sponsor_name: {
        type: String,

    },
    Check_sponsor: {
        type: String,

    },


})

const Art_Sponsor = mongoose.model("Art_Sponsor", schema);
module.exports = Art_Sponsor;