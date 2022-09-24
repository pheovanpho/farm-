const { getData, updateData } = controllers;

const getAnimals = require("../../libs/getAnimals");
const expToLevel = require("../../libs/expToLevel");
const checkLevelUpRewards = require("../../libs/checkLevelUpRewards");

module.exports = async (req, res) => {
    const { id } = req.params;
    const { action, animalId } = req.body;

    try {
        const userData = await getData(id);
        const { animalShelters, fields, houseLevel, barn_size, barn_items, money, exp, level, pets } = userData;
        const availableAnimalShelters = getAnimals(null, level);

        if (action == "feed") {
            if (animalId > availableAnimalShelters.length - 1 && animalId < -1) {
                res.json({
                    message: "No animal available"
                });
                return;
            } else {
                let animalsInfo = animalId == -1 ? availableAnimalShelters : [availableAnimalShelters[animalId]],
                    animalIndex = 0,
                    feedCost = 0;

                animalsInfo.forEach((animal, index) => {
                    animalIndex = animalId == -1 ? index : animalId;
                    for (let j = 0; j < animalShelters[animalIndex].current; j++) {
                        if (
                            !animalShelters[animalIndex].data[j] ||
                            (
                                animalShelters[animalIndex].data[j].collected == true &&
                                (
                                    !animalShelters[animalIndex].data[j].hasOwnProperty("lastFed") ||
                                    animalShelters[animalIndex].data[j].lastFed < Date.now() - animalsInfo[animalIndex].collectTime
                                )
                            )
                        ) {
                            if (!animalShelters[animalIndex].data[j]) animalShelters[animalIndex].data[j] = {};
                            animalShelters[animalIndex].data[j].lastFed = Date.now();
                            animalShelters[animalIndex].data[j].collected = false;
                            feedCost += animal.cost.feed;
                        }
                    }
                });

                if (feedCost < 1) {
                    res.json({
                        message: "All animals are already fed or not yet collected"
                    });
                    return;
                }

                if (feedCost > money) {
                    res.json({
                        message: "Not enough money"
                    });
                    return;
                }

                const newMoney = money - feedCost;
                const data = {
                    animalShelters,
                    money: newMoney
                }

                await updateData(id, data);

                res.json({
                    message: "Feed successfully",
                    data
                });
                return;
            }
        } else if (action == "collect") {

            let gainedExp = 0,
                collectedItems = [];

            availableAnimalShelters.forEach((animal, index) => {
                for (let j = 0; j < animalShelters[index].data.length; j++) {
                    if (
                        animalShelters[index].data[j].collected == false &&
                        animalShelters[index].data[j].hasOwnProperty("lastFed") &&
                        animalShelters[index].data[j].lastFed < Date.now() - availableAnimalShelters[index].collectTime
                    ) {
                        animalShelters[index].data[j].collected = true;

                        let findProductIndex = collectedItems.findIndex(item => item.id === availableAnimalShelters[index].id);
                        if (findProductIndex == -1) {
                            collectedItems.push({
                                id: availableAnimalShelters[index].id,
                                amount: 1
                            });
                        } else {
                            collectedItems[findProductIndex].amount++;
                        }
                        gainedExp += availableAnimalShelters[index].exp;
                    }
                }
            });

            if (collectedItems.length < 1) {
                res.json({
                    message: "No animal available"
                });
                return;
            }

            const collectedItemsLength = collectedItems.reduce((acc, cur) => acc + cur.amount, 0);
            const barnItemsLength = barn_items.reduce((acc, cur) => acc + cur.amount, 0);

            if (collectedItemsLength + barnItemsLength > barn_size) {
                res.json({
                    message: "Not enough barn space"
                });
                return;
            }

            collectedItems.forEach(item => {
                let findProductIndex = barn_items.findIndex(item2 => item2.id === item.id);
                if (findProductIndex == -1) {
                    barn_items.push(item);
                } else {
                    barn_items[findProductIndex].amount += item.amount;
                }
            });

            let data = { animalShelters, barn_items },
                newExp = exp + gainedExp,
                newLevel = expToLevel(newExp);

            while (newLevel - level > 1) {
                newExp--;
                newLevel = expToLevel(newExp);
            }


            data = Object.assign(data, { exp: newExp, gainedExp }, checkLevelUpRewards({ oldLevel: level, newLevel, animalShelters, fields, houseLevel, money, pets }));


            await updateData(id, data);
            res.json({
                message: "Collect successfully",
                data
            });
            return;

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
        return;
    }
}
