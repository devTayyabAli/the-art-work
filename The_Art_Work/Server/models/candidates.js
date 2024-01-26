const mongoose = require("mongoose");

const schema = mongoose.Schema({
    useraddress: {
        type: String,
    },
    id: {
        type: String,
    },
    name: {
        type: String,
    },
    company_name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    web_link: {
        type: String,
    },
    postal_address: {
        type: String,
    },
    description: {
        type: String,
    },
    job: {
        type: String,
    },
    sponsord: {
        type: String,
    },
    profile_image: {
        type: String,
    },
    date: {
        type: String,
    },
    type: {
        type: String,
        default:""
    },
    status:{
        type: String,
        default:'Active'
    },
    score:{
        type: String,
    },
    SponsorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Art_Sponsor',
      },
})
const candidates = mongoose.model("candidates", schema);
module.exports = candidates;