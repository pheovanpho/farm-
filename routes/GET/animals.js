const { getData } = controllers;

const getAnimals = require("../../libs/getAnimals");

module.exports = (req, res) => {
    const { id } = req.params;
    getData(id)
        .then(data => {
            const { level, money, animalShelters } = data;
            const animalsData = getAnimals(null, level, animalShelters);
            res.json({
                message: "Get animals successfully",
                level,
                money,
                availableAnimals: animalsData
            })
            return;
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
            return;
        })
}
