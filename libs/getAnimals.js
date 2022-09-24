const _1MINUTE = 60000;
const _1HOUR = 3600000;

const Animals = [
    {
        id: 0,
        name: 'Chicken',
        productName: 'Egg',
        cost: {
            buy: 50,
            feed: 7,
            products: {
                buy: 5,
                sell: 18
            }
        },
        collectTime: _1MINUTE * 20,
        exp: 2
    },
    {
        id: 1,
        name: 'Cow',
        productName: 'Milk',
        cost: {
            buy: 170,
            feed: 14,
            products: {
                buy: 10,
                sell: 32
            }
        },
        collectTime: _1HOUR,
        exp: 3
    },
    {
        id: 2,
        name: 'Pig',
        productName: 'Bacon',
        cost: {
            buy: 700,
            feed: 14,
            products: {
                buy: 20,
                sell: 50
            }
        },
        collectTime: _1HOUR * 4,
        exp: 5
    },
    {
        id: 3,
        name: 'Sheep',
        productName: 'Wool',
        cost: {
            buy: 1000,
            feed: 14,
            products: {
                buy: 30,
                sell: 54
            }
        },
        collectTime: _1HOUR * 6,
        exp: 5
    },
    {
        id: 4,
        name: 'Goat',
        productName: 'Goat Milk',
        cost: {
            buy: 3200,
            feed: 14,
            products: {
                buy: 40,
                sell: 64
            }
        },
        collectTime: _1HOUR * 8,
        exp: 6
    }
]

function getAnimals(id, level = 1, animalShelters = null) {
    const sliceTo = level >= 40 ? Animals.length :
                    level >= 32 ? Animals.length - 1 :
                    level >= 22 ? Animals.length - 2 :
                    level >= 14 ? Animals.length - 3 :
                    level >= 5  ? Animals.length - 4 :
                                  Animals.length - 5 ;

    return typeof id === 'number' ? Animals[id] : Animals.slice(0, sliceTo).map(animal => {
        if (animalShelters) {
            animal.max = animalShelters[animal.id].max;
            animal.current = animalShelters[animal.id].current;
        }
        return animal;
    });
}

module.exports = getAnimals;
