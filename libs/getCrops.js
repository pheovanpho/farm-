const _1MINUTE = 60000;
const _1HOUR = 3600000;

const crops = [
    {
        id: 0,
        name: "Wheat",
        harvestTime: _1MINUTE * 2,
        cost: {
            buy: 1,
            sell: 3
        },
        exp: 1
    },
    {
        id: 1,
        name: "Corn",
        harvestTime: _1MINUTE * 5,
        cost: {
            buy: 3,
            sell: 7
        },
        exp: 1
    },
    {
        id: 2,
        name: "Soybean",
        harvestTime: _1MINUTE * 20,
        cost: {
            buy: 5,
            sell: 10
        },
        exp: 2
    },
    {
        id: 3,
        name: "Suggarcane",
        harvestTime: _1MINUTE * 30,
        cost: {
            buy: 7,
            sell: 14
        },
        exp: 3
    },
    {
        id: 4,
        name: "Carrot",
        harvestTime: _1MINUTE * 10,
        cost: {
            buy: 3,
            sell: 8
        },
        exp: 2
    },
    {
        id: 5,
        name: "Indigo",
        harvestTime: _1HOUR * 2,
        cost: {
            buy: 15,
            sell: 27
        },
        exp: 5
    },
    {
        id: 6,
        name: "Pumpkin",
        harvestTime: _1HOUR * 3,
        cost: {
            buy: 18,
            sell: 32
        },
        exp: 6
    },
    {
        id: 7,
        name: "Cotton",
        harvestTime: _1HOUR * 2 + _1MINUTE * 30,
        cost: {
            buy: 16,
            sell: 28
        },
        exp: 6
    },
    {
        id: 8,
        name: "Chili pepper",
        harvestTime: _1HOUR * 4,
        cost: {
            buy: 20,
            sell: 36
        },
        exp: 4
    },
    {
        id: 9,
        name: "Tomato",
        harvestTime: _1HOUR * 6,
        cost: {
            buy: 25,
            sell: 43
        },
        exp: 8
    },
    {
        id: 10,
        name: "Strawberry",
        harvestTime: _1HOUR * 8,
        cost: {
            buy: 32,
            sell: 50
        },
        exp: 10
    },
    {
        id: 11,
        name: "Potato",
        harvestTime: _1HOUR * 3 + _1MINUTE * 40,
        cost: {
            buy: 20,
            sell: 36
        },
        exp: 7
    },
    {
        id: 12,
        name: "Sesame",
        harvestTime: _1HOUR,
        cost: {
            buy: 8,
            sell: 18
        },
        exp: 4
    },
    {
        id: 13,
        name: "Pineapple",
        harvestTime: _1MINUTE * 30,
        cost: {
            buy: 6,
            sell: 14
        },
        exp: 3
    },
    {
        id: 14,
        name: "Lily",
        harvestTime: _1HOUR + _1MINUTE * 30,
        cost: {
            buy: 10,
            sell: 21
        },
        exp: 5
    },
    {
        id: 15,
        name: "Rice",
        harvestTime: _1MINUTE * 45,
        cost: {
            buy: 8,
            sell: 18
        },
        exp: 3
    }
];


function getCrop(id, level = 1) {
    return typeof id === 'number' ? crops[id] : crops.slice(0, Math.floor(level / 3) + 1);
}

module.exports = getCrop;
