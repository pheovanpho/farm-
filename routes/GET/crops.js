const { getData } = controllers;
const getCrops = require("../../libs/getCrops");

module.exports = (req, res) => {
    const { id } = req.params;
    getData(id)
        .then(data => {
            const { level, money } = data;
            const cropsData = getCrops(null, level);
            res.json({
                message: "Get data successfully",
                level,
                money,
                availableCrops: cropsData
            });
            return;
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
            return;
        })
}
