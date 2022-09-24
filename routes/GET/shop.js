const { getData } = controllers;

const getShop = require("../../libs/getShop");

module.exports = async (req, res) => {
    const { id } = req.params;

    try {
        const userData = await getData(id);
        const { level, animalShelters, pets, money } = userData;

        const shopItems = getShop(level, animalShelters, pets);

        res.json({
            message: "Get shop successfully",
            money,
            data: shopItems
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        return;
    }
}
