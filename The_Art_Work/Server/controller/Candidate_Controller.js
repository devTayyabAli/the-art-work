const candidates = require("../models/candidates");
const cloudinary = require("cloudinary");
const multer = require("multer");
const path = require('path');
// Route handler






exports.create_Candidate = async (req, res) => {
    try {
        let { useraddress } = req.body
        let find_data = await candidates.findOne({ useraddress: useraddress })
        // console.log("find_data", find_data);

        if (find_data == null) {
            const data = new candidates(req.body);
            await data.save();
            res.status(201).send({
                success: true,
                msg: "Data Store Successfuly"
            })
        } else {
            let count = Number(find_data?.score)
            if (req?.body?.score != undefined) {
                count += Number(req?.body?.score)

            }
            // console.log("count",count   );


            // If candidate exists, update the information (including profile_image if present)
            const existingcandidate = await candidates.findOneAndUpdate({ useraddress: useraddress }, { ...req.body, score: count }, { new: true });
            if (!existingcandidate) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(201).send({
                data: existingcandidate,
                success: true,
                msg: "Candidate Updated"
            })
        }
    } catch (error) {
        console.error("error while get user", error);
    }
}


exports.get_By_id_Candidate = async (req, res) => {
    try {

        let {
            useraddress
        } = req.query

        const data = await candidates.findOne({
            useraddress: useraddress
        })
            .populate({ path: "SponsorID" })
            .populate({
                path: "SponsorID", select: "userAddress Sponsor_Address Sponsor_name Check_sponsor"
            })

        // console.log("data", data);
        if (data !== null) {
            res.status(201).send({
                data: data,
                success: true,
            })
        } else {
            res.status(200).send({
                data: [],
                success: false,

            })
        }

    } catch (error) {
        console.error("error while get user", error);
    }
}
exports.get_Candidate = async (req, res) => {
    try {
        const { type, status, searchData } = req.query;
        let query = { SponsorID: { $exists: true } };

        if (type !== "all") {
            query.type = type;
        }

        if (status !== "all") {
            query.status = status;
        }

        if (searchData) {
            query.name = { $regex: `^${searchData}`, $options: 'i' };
        }

        const data = await candidates.find(query)
            .populate({
                path: "SponsorID",
                select: "userAddress Sponsor_Address Sponsor_name Check_sponsor"
            });

        const success = data.length > 0;

        res.status(success ? 201 : 200).json({
            data,
            success,
        });
    } catch (error) {
        console.error("Error while getting user", error);
        res.status(500).json({ error: "Internal Server Error" });
    }



}

exports.searchCandidate = async (req, res) => {
    try {
        const { searchData } = req.query;
        const data = await candidates.find({ name: { $regex: `^${searchData}`, $options: 'i' } })
            .populate({
                path: "SponsorID",
                select: "userAddress Sponsor_Address Sponsor_name Check_sponsor"
            });

        const success = data.length > 0;
        res.status(success ? 201 : 200).send({
            data,
            success,
        });
    } catch (error) {
        console.error("Error while getting user", error);
    }
}

// exports.upload_single_image = upload.single('image'), (req, res) => {

//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }
//     const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
//     res.status(200).json({ imageUrl });


// };