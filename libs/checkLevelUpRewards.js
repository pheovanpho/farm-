const getCrops = require("./getCrops");
const getPets = require("./getPets");

function checkLevelUpRewards(data) {
    let { oldLevel, newLevel, animalShelters, fields, houseLevel, money, pets } = data,
        returnData = {};

    if (newLevel > oldLevel) {
        returnData.level = newLevel;

        returnData.money = money + 100;

        if (newLevel % 3 == 0 && newLevel > 0 && newLevel <= 150) {
            fields.total += 5;
            returnData.fields = fields;
        }

        if (newLevel % 10 === 0 && houseLevel < 7) {
            returnData.houseLevel = houseLevel + 1;
            returnData.money += 150;
        }

        let newAnimalShelters = checkForAnimalShelterLevelUp({
            oldLevel,
            newLevel,
            animalShelters
        });

        if (newAnimalShelters != null) {
            returnData.animalShelters = newAnimalShelters;
        }

        let oldCrops = getCrops(null, oldLevel),
            newCrops = getCrops(null, newLevel);

        if (newCrops.length > oldCrops.length) {
            returnData.crops = newCrops[newCrops.length - 1];
        }

        let oldPets = getPets(null, oldLevel),
            newPets = getPets(null, newLevel);

        if (newPets.length > oldPets.length) {
            pets.push({
                type: newPets[newPets.length - 1].name,
                max: newPets[newPets.length - 1].buyable,
                current: 0
            })
            returnData.pets = pets;
        }
    }

    return returnData;
}

function checkForAnimalShelterLevelUp(data) {
    let { oldLevel, newLevel, animalShelters } = data;

    if (newLevel > oldLevel) {
        if (newLevel == 5) {
            animalShelters[animalShelters.findIndex(x => x.type == "chicken")].max = 5;
        } else if (newLevel == 14) {
            animalShelters[animalShelters.findIndex(x => x.type == "chicken")].max = 10;
            animalShelters[animalShelters.findIndex(x => x.type == "cow")].max = 5;
        } else if (newLevel == 22) {
            animalShelters[animalShelters.findIndex(x => x.type == "pig")].max = 5;
        } else if (newLevel == 32) {
            animalShelters[animalShelters.findIndex(x => x.type == "cow")].max = 10;
            animalShelters[animalShelters.findIndex(x => x.type == "sheep")].max = 5;
        } else if (newLevel == 40) {
            animalShelters[animalShelters.findIndex(x => x.type == "chicken")].max = 15;
            animalShelters[animalShelters.findIndex(x => x.type == "pig")].max = 10;
            animalShelters[animalShelters.findIndex(x => x.type == "goat")].max = 5;
        } else {
            animalShelters = null;
        }
    }

    return animalShelters;
}

module.exports = checkLevelUpRewards;
