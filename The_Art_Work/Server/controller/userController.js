
exports.getUser = async (req, res) => {
try {
    res.status(200).send("user is herer 👥")
    
} catch (error) {
    console.error("error while get user",error);
}
}