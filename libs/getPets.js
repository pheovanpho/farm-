const PETS = [
    {
        id: 0,
        name: "Retriever",
        buyable: 3,
        price: 2000
    },
    {
        id: 1,
        name: "TabbyCat",
        buyable: 3,
        price: 2500
    },
    {
        id: 2,
        name: "BayHorse",
        buyable: 2,
        price: 3000
    },
    {
        id: 3,
        name: "WhiteBunny",
        buyable: 2,
        price: 4000
    }
]

function getPets(id, level = 1) {
    return typeof id === 'number' ? PETS[id] : PETS.slice(0, Math.floor(level / 10));
}

module.exports = getPets;
