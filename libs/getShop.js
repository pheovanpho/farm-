const getAnimals = require("./getAnimals");
const getPets = require("./getPets");

function getShop(level, animalShelters, pets) {
    const animalsShop = {
        animals: getAnimals(null, level)
            .map((animal, index) => {
                if (animalShelters[index]?.max > animalShelters[index]?.current) {
                    return {
                        id: animal.id,
                        name: animal.name,
                        inStock: animalShelters[index]?.max - animalShelters[index]?.current,
                        price: animal.cost.buy,
                    }
                }
            })
            .filter(animal => animal !== undefined),
        pets: getPets(null, level)
            .map((pet, index) => {
                if (pets[index]?.max > pets[index]?.current) {
                    return {
                        id: pet.id,
                        name: pet.name,
                        inStock: pets[index]?.max - pets[index]?.current,
                        price: pet.price
                    }
                }
            })
            .filter(pet => pet !== undefined)
    }

    return animalsShop;
}

module.exports = getShop;
