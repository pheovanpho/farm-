const { getData, updateData } = controllers;

const getCrops = require("../../libs/getCrops");
const expToLevel = require("../../libs/expToLevel");
const checkLevelUpRewards = require("../../libs/checkLevelUpRewards");

module.exports = async (req, res) => {
    const { id } = req.params;

    req.body.amount = parseInt(req.body.amount);
    const { action, cropId, amount } = req.body;

    try {
        const userData = await getData(id);
        const { animalShelters, fields, houseLevel, silo_size, silo_items, money, exp, level, pets } = userData;
        const { total, crops } = fields;

        if (action === "plant") {
            if (getCrops(null, level).length <= cropId) {
                res.json({
                    message: "Your level is not enough to plant this crop"
                });
                return;
            }
            const leftFields = total - crops.reduce((acc, cur) => acc + cur.amount, 0);
            const growCost = amount * getCrops(cropId)?.cost?.buy;

            if (money < growCost) {
                res.json({
                    message: "Not enough money"
                });
                return;
            }

            if (leftFields < 1 || leftFields < amount) {
                res.json({
                    message: "Not enough fields available"
                });
                return;
            }

            const newCrops = {
                id: cropId,
                amount,
                timeAdded: Date.now()
            }

            const newMoney = money - growCost;

            crops.push(newCrops);
            fields.crops = crops;

            const data = {
                fields,
                money: newMoney
            }

            await updateData(id, data);

            res.json({
                message: "Plant successfully",
                data
            });
            return;

        } else if (action === "harvest") {
            const totalCrops = crops.reduce((acc, cur) => acc + cur.amount, 0);
            const siloSpaceUsed = silo_items.reduce((acc, cur) => acc + cur.amount, 0);

            if (totalCrops < 1) {
                res.json({
                    message: "No crops available"
                });
                return;
            }

            if (totalCrops + siloSpaceUsed > silo_size) {
                res.json({
                    message: "Not enough silo space"
                });
                return;
            }

            let gainedExp = 0,
                harvestedCrops = 0,
                newCrops = new Array();
            await new Promise((resolve, reject) => {
                crops.map((crop) => {
                    const harvestTime = getCrops(null, level)[crop.id]?.harvestTime || null;
                    const timeNow = Date.now();
                    const timeAdded = crop.timeAdded;
                    if (harvestTime != null) {
                        if (timeNow - timeAdded > harvestTime) {
                            if (silo_items.find(item => item.id === crop.id)) {
                                const item = silo_items.find(item => item.id === crop.id);
                                item.amount += crop.amount;
                            } else {
                                silo_items.push({
                                    id: crop.id,
                                    amount: crop.amount
                                });
                            }
                            harvestedCrops += crop.amount;
                            gainedExp += (getCrops(null, level)[crop.id]?.exp || 0) * crop.amount;
                        } else {
                            newCrops.push(crop);
                        }
                    }
                });
                resolve();
            });

            fields.crops = newCrops;

            if (harvestedCrops < 1) {
                await updateData(id, { fields });
                res.json({
                    message: "No crops available"
                });
                return;
            }

            let data = { fields, silo_items },
                newExp = exp + gainedExp,
                newLevel = expToLevel(newExp);

            while (newLevel - level > 1) {
                newExp--;
                newLevel = expToLevel(newExp);
            }


            data = Object.assign(data, { exp: newExp, gainedExp }, checkLevelUpRewards({ oldLevel: level, newLevel, animalShelters, fields, houseLevel, money, pets }));
  

            await updateData(id, data);
            res.json({
                message: "Harvest successfully",
                data
            });
            return;

        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        return;
    }
}
