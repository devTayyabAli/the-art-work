const { default: mongoose } = require("mongoose");
const Art_Sponsor = require("../models/sponsor_Model");
const candidates = require("../models/candidates");


exports.create_sponsor = async (req, res) => {
    try {
        let { userAddress } = req.body

        const userData = req.body;

        let user_Find = await Art_Sponsor.findOne({ userAddress: userAddress })

        if (user_Find) {
            const existingUser = await Art_Sponsor.findOneAndUpdate({ userAddress: userAddress }, userData, { new: true });
            if (!existingUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User updated successfully', user: existingUser });
        } else {
            // If userId is not present, create a new user
            const newUser = new Art_Sponsor(userData);
            let addSponsor = await newUser.save();

            let ObjectId = new mongoose.Types.ObjectId(addSponsor.id)
            console.log("ObjectId", ObjectId);
            let addData = await candidates.updateOne(
                {
                    useraddress: userAddress
                },
                {
                    $set: {
                        SponsorID: ObjectId
                    }
                },
                { upsert: false, new: true }
            )
            console.log("addData", addData);
            res.json({ message: 'User created successfully', user: newUser });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


exports.get_By_address_Sponsor = async (req, res) => {
    try {
        let {
            userAddress
        } = req.query

        const data = await Art_Sponsor.findOne({
            userAddress: userAddress
        });
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