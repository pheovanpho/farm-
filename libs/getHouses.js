function getHouses(currentHouse, level) {
    let houses = [];
    for (let i = 0; i <= level; i+= 10) {
        if (i > currentHouse) {
            houses.push({
                level: i,
                price: i * 100
            });
        }
    }

    return houses;
}

module.exports = getHouses;
