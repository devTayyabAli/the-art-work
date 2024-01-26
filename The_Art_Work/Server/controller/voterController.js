const voter = require("../models/voter");


exports.createVoter = async (req, res) => {
    try {

        const data = new voter(req.body);
        await data.save();
        res.status(201).send({
            success: true,
            msg: "Cast Vote Successfuly"
        })

    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.getVoterDetails = async (req, res) => {
    try {

        let {
            voterAddress,
            candidateAddress
        } = req.query

        const data = await voter.findOne({
            voterAddress: voterAddress, candidateAddress: candidateAddress
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