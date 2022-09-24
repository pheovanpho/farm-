const { getData, getAll, updateData } = controllers;

const getCrops = require("../../libs/getCrops");
const getAnimals = require("../../libs/getAnimals");
const getShop = require("../../libs/getShop");

const timeBetweenSteal = 1000 * 60 * 60 * 24;

module.exports = async (req, res) => {
    const { id } = req.params;

    req.body.amount = parseInt(req.body.amount);
    const { action, animalId, petId, amount, sellTarget } = req.body;

    const userData = await getData(id);
    const { silo_items, barn_items, animalShelters, pets, money, level } = userData;

    try {
        if (action == "buy") {
            const shopItems = getShop(level, animalShelters, pets);
            const targetShop = petId !== undefined ? shopItems.pets : shopItems.animals;
            const targetId = petId !== undefined ? petId : animalId;

            if (targetShop.length < 1) {
                res.json({
                    message: "No animal available"
                });
                return;
            } else {
                let findIndex = targetShop.findIndex(item => item.id == targetId);

                if (findIndex == -1) {
                    res.json({
                        message: "The animal you want to buy is not available"
                    });
                    return;
                } else {
                    const moneyNeeded = targetShop[findIndex].price * amount;

                    if (moneyNeeded > money) {
                        res.json({
                            message: "Not enough money"
                        });
                        return;
                    } else {
                        const newMoney = money - moneyNeeded;

                        let newAnimalShelters = false,
                            newPets = false;

                        if (petId !== undefined) {
                            newPets = pets;
                            newPets[petId].current += amount
                        } else {
                            newAnimalShelters = animalShelters;
                            newAnimalShelters[targetId].current += amount
                        }

                        let data = {
                            money: newMoney,
                            animalShelters: newAnimalShelters,
                            pets: newPets
                        };

                        if (newAnimalShelters == false) delete data.animalShelters;
                        if (newPets == false) delete data.pets;

                        await updateData(id, data);
                        res.json({
                            message: "Buy successfully",
                            data
                        });
                    }
                }
            }
        } else if (action == "sell") {
            let moneyGained = 0,
                moneyBonus = 0,
                data;

            if (sellTarget == "goods") {
                const animals = getAnimals(null, level);
                const barnItemsLength = barn_items.reduce((acc, cur) => acc + cur.amount, 0);
                if (barnItemsLength < 1) {
                    res.json({
                        message: "No item available to sell"
                    });
                    return;
                }

                barn_items.forEach(item => {
                    moneyGained += animals[item.id]?.cost?.products?.sell * item.amount;
                });

                moneyBonus = Math.floor(moneyGained * (barnItemsLength >= 100 ? 0.4 : barnItemsLength >= 50 ? 0.25 : barnItemsLength >= 20 ? 0.2 : barnItemsLength >= 10 ? 0.1 : 0));

                data = {
                    money: money + moneyGained + moneyBonus,
                    moneyGained,
                    moneyBonus,
                    barn_items: new Array()
                }

                if (moneyBonus == 0) delete data.moneyBonus;
            } else if (sellTarget == "crops") {
                const crops = getCrops(null, level);
                const siloItemsLength = silo_items.reduce((acc, cur) => acc + cur.amount, 0);
                if (siloItemsLength < 1) {
                    res.json({
                        message: "No item available to sell"
                    });
                    return;
                }

                silo_items.forEach(item => {
                    moneyGained += crops[item.id]?.cost?.sell * item.amount;
                })

                moneyBonus = Math.floor(moneyGained * (siloItemsLength >= 100 ? 0.3 : siloItemsLength >= 50 ? 0.2 : siloItemsLength >= 20 ? 0.1 : siloItemsLength >= 10 ? 0.05 : 0));

                data = {
                    money: money + moneyGained + moneyBonus,
                    moneyGained,
                    moneyBonus,
                    silo_items: new Array()
                }

                if (moneyBonus == 0) delete data.moneyBonus;
            } else {
                res.status(400).json({
                    message: "Invalid sell target, must be goods or crops"
                });
                return;
            }

            await updateData(id, data);
            res.json({
                message: "Sell successfully",
                data
            });
            return;
        } else {
            const victims = (await getAll()).filter(item => item.id != id);
            if (victims.length < 1) {
                res.json({
                    message: "No victim available"
                });
                return;
            }

            const victim = victims[Math.floor(Math.random() * victims.length)].dataValues;

            const userData = await getData(id);

            const { money: victimMoney, pets: victimPets, houseLevel: victimHouseLevel, defend } = victim.data;
            const { money, houseLevel, steal } = userData;

            if (money < 100) {
                res.json({
                    message: "Don't have money? Go earn some!"
                })
                return;
            }
            
            const msNow = Date.now();
            if (steal.lastSteal > msNow - timeBetweenSteal) {
                res.json({
                    message: "You can steal only once per " + timeBetweenSteal / 1000 + " seconds",
                    timeLeft: timeBetweenSteal - (msNow - steal.lastSteal)
                });
                return;
            }

            let attackPoint = 0,
                defendPoint = 0;

            attackPoint += houseLevel * 10;
            defendPoint += victimHouseLevel * 10;

            if (pets[0] && pets[0].current > 0) {
                attackPoint += pets[0].current * 20;
            }
            if (pets[1] && pets[1].current > 0) {
                attackPoint += pets[1].current * 10;
            }
            if (pets[3] && pets[3].current > 0) {
                attackPoint += pets[3].current * 20;
            }
            

            if (victimPets[0] && victimPets[0].current > 0) {
                defendPoint += victimPets[0].current * 20;
            }
            if (victimPets[1] && victimPets[1].current > 0) {
                defendPoint += victimPets[1].current * 10;
            }
            if (victimPets[3] && victimPets[3].current > 0) {
                defendPoint += victimPets[3].current * 20;
            }

            const randomINT = Math.floor(Math.random() * 100);

            let moneyIfStealSucceed = money > victimMoney ? Math.floor(victimMoney / 5) : Math.floor(money / 5),
                moneyIfStealFailed = randomINT < 30 ? Math.floor(moneyIfStealSucceed / 3) : Math.floor(moneyIfStealSucceed / 2);

            if (randomINT > 80) moneyIfStealSucceed *= 1.4;
            else if (randomINT < 10) moneyIfStealSucceed *= 0.5;

            moneyIfStealSucceed = Math.floor(moneyIfStealSucceed);

            let percentByPoint = 25;
            if (attackPoint > defendPoint) {
                percentByPoint = 50;
            }
            
            if (randomINT < percentByPoint) {
                const newMoney = money + moneyIfStealSucceed;
                const newVictimMoney = victimMoney - moneyIfStealSucceed;

                steal.succeed += 1;
                steal.history.push({
                    victim: victim.id,
                    time: new Date().toISOString(),
                    status: "succeed",
                    money: "+" + moneyIfStealSucceed
                });
                steal.lastSteal = Date.now();

                defend.failed += 1;
                defend.history.push({
                    thief: id,
                    time: new Date().toISOString(),
                    status: "failed",
                    money: "-" + moneyIfStealSucceed
                });

                await updateData(id, { money: newMoney, steal });
                await updateData(victim.id, { money: newVictimMoney, defend });
                res.json({
                    message: "Steal successfully",
                    data: {
                        money: newMoney,
                        stolen: moneyIfStealSucceed
                    }
                });
            } else {
                const newMoney = money - moneyIfStealFailed;
                const newVictimMoney = victimMoney + moneyIfStealFailed;

                steal.failed += 1;
                steal.history.push({
                    victim: victim.id,
                    time: new Date().toISOString(),
                    status: "failed",
                    money: "-" + moneyIfStealFailed
                });
                steal.lastSteal = Date.now();

                defend.succeed += 1;
                defend.history.push({
                    thief: id,
                    time: new Date().toISOString(),
                    status: "succeed",
                    money: "+" + moneyIfStealFailed
                });

                await updateData(id, { money: newMoney, steal });
                await updateData(victim.id, { money: newVictimMoney, defend });
                res.json({
                    message: "Steal failed",
                    data: {
                        money: newMoney,
                        lost: moneyIfStealFailed
                    }
                });
            }

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
        return;
    }
}
