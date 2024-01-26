const mongoose = require("mongoose");

const schema = mongoose.Schema({
    useraddress: {
        type: String,
    },
    id: {
        type: String,
    },
    candidate_id: {
        type: String,
    },
    member_id: {
        type: String,
    },
    vote: {
        type: String,
    },


})
const dao_members = mongoose.model("dao_members", schema);
module.exports = dao_members;