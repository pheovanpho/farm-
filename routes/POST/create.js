const { createData } = controllers;

module.exports = async (req, res) => {
    const { id, name } = req.body;
    try {
        const newData = {
            name,
            exp: 0,
            level: 1,
            houseLevel: 0,
            money: 500,
            silo_size: 50,
            barn_size: 50,
            fields: {
                total: 5,
                crops: new Array()
            },
            animalShelters: [
                {
                    type: "chicken",
                    max: 0,
                    current: 0,
                    data: new Array()
                },
                {
                    type: "cow",
                    max: 0,
                    current: 0,
                    data: new Array()
                },
                {
                    type: "pig",
                    max: 0,
                    current: 0,
                    data: new Array()
                },
                {
                    type: "sheep",
                    max: 0,
                    current: 0,
                    data: new Array()
                },
                {
                    type: "goat",
                    max: 0,
                    current: 0,
                    data: new Array()
                }
            ],
            silo_items: new Array(),
            barn_items: new Array(),
            pets: new Array(),
            steal: {
                succeed: 0,
                failed: 0,
                lastSteal: null,
                history: new Array()
            },
            defend: {
                succeed: 0,
                failed: 0,
                history: new Array()
            }
        }
        await createData(id, newData);
        res.status(201).json({
            message: "Create data successfully",
            data: newData
        });
        return;

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        return;
    }
}
