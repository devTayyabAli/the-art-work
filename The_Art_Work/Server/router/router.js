const express = require("express");
const bodyParser = require("body-parser");
// const upload = require('../middleware/multer')
const upload = require('../middleware/multer')
const path = require('path');



// import router
const {getUser} = require("../controller/userController");
const { create_Candidate, get_By_id_Candidate, get_Candidate, upload_single_image, searchCandidate } = require("../controller/Candidate_Controller");
const { create_sponsor, get_By_address_Sponsor } = require("../controller/Sponsor_Controller");
const multer = require("multer");
const { createVoter, getVoterDetails } = require("../controller/voterController");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Specify the destination folder
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//     },
// });

// const upload = multer({ storage: storage });


const router = express.Router();
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());


// router.route("/getUser").get(getUser)
router.route("/create_Candidate").post(create_Candidate)
router.route("/get_By_id_Candidate").get(get_By_id_Candidate)
router.route("/get_Candidate").get(get_Candidate)
// router.route("/upload_single_image").post(upload_single_image)

////////////Sponsor/////////////////////////////////

router.route("/create_sponsor").post(create_sponsor)
router.route("/get_By_address_Sponsor").get(get_By_address_Sponsor)

// -------------------Voter-------------------
router.route("/createVoter").post(createVoter)
router.route("/getVoterDetails").get(getVoterDetails)
router.route("/searchCandidate").get(searchCandidate)





module.exports = router;