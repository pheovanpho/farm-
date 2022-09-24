const getAnimalShelters = require("../../libs/getAnimalShelters");

module.exports = (req, res) => {
    const { id } = req.params;
    getAnimalShelters(id)
        .then(data => {
            res.json({
                message: "Get animal shelters successfully",
                data
            });
            return;
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
            return;
        });
}
