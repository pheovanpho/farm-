const { getData } = controllers;
const getCrops = require('./getCrops');

function getFields(id) {
    return new Promise((resolve, reject) => {
        getData(id)
            .then(data => {
                const cropsHarvestTime = getCrops(null, data?.level).map(crop => crop.harvestTime);
                getCropsRemainingTime(data?.fields, cropsHarvestTime)
                    .then(cropsRemainingTime => {
                        resolve(cropsRemainingTime);
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

function getCropsRemainingTime(fields = {}, cropsHarvestTime) {
    const { amount, crops } = fields;
    return new Promise((resolve, reject) => {
        if (!crops) {
            resolve({
                fields: amount,
                crops: []
            });
        }
        try {
            let cropsRemainingTime = [];
            crops.forEach(crop => {
                let timeRemainingInMilliseconds = cropsHarvestTime[crop.id] - (Date.now() - crop.timeAdded),
                    percentFinished = 100 - (timeRemainingInMilliseconds / cropsHarvestTime[crop.id]) * 100;

                percentFinished = percentFinished > 100 ? 100 : percentFinished;
                cropsRemainingTime.push({
                    id: crop.id,
                    name: crop.name,
                    amount: crop.amount,
                    timeRemaining: msToTime(timeRemainingInMilliseconds),
                    percentFinished: percentFinished.toFixed(2) + "%",
                    percentFinishedGraphical: `[${"=".repeat(Math.floor(percentFinished / 5)) + " ".repeat(20 - Math.floor(percentFinished / 5))}]`
                });
            });
            resolve({
                fields: amount,
                crops: cropsRemainingTime
            });
        } catch(err) {
            reject(err);
        }
    })
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

module.exports = getFields;
