const { getData } = controllers;
const getAnimals = require('./getAnimals');

function getAnimalShelters(id) {
    return new Promise((resolve, reject) => {
        getData(id)
            .then(data => {
                const goodsCollectTime = getAnimals(null, data?.level).map(animal => animal.collectTime);
                getAnimalSheltersRemainingTime(data?.animalShelters, goodsCollectTime)
                    .then(goodsRemainingTime => {
                        resolve(goodsRemainingTime);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            });
    })
}

function getAnimalSheltersRemainingTime(shelters = [], goodsCollectTime) {
    return new Promise((resolve, reject) => {
        if (shelters.goodsCollectTime === 0) {
            resolve([]);
        }

        let goodsRemainingTime = [];
        try {
            for (let i = 0; i < goodsCollectTime.length; i++) {
                goodsRemainingTime.push({
                    id: i,
                    name: shelters[i].type,
                    data: shelters[i].data.map(animal => {
                        if (animal.collected === true) {
                            return {
                                isHungry: true
                            }
                        } else {
                            let timeRemainingInMilliseconds = goodsCollectTime[i] - (Date.now() - animal.lastFed),
                                percentFinished = 100 - (timeRemainingInMilliseconds / goodsCollectTime[i]) * 100;

                            percentFinished = percentFinished > 100 ? 100 : percentFinished;
                            return {
                                isHungry: false,
                                timeRemaining: msToTime(timeRemainingInMilliseconds),
                                percentFinished: percentFinished.toFixed(2) + "%",
                                percentFinishedGraphical: `[${"=".repeat(Math.floor(percentFinished / 5)) + " ".repeat(20 - Math.floor(percentFinished / 5))}]`
                            }
                        }
                    })
                });
            }
            resolve(goodsRemainingTime);
        } catch (err) {
            reject(err);
        }
    });
}


function msToTime(duration) {
    duration < 0 ? duration = 0 : duration;
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

module.exports = getAnimalShelters;
