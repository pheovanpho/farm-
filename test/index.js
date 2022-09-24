const { prompt } = require('inquirer');
const axios = require('axios');

const login = () => {
    prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Enter your id:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your id';
                }
            }
        }
    ])
        .then((answers) => {
            const headers = {
                'Content-Type': 'application/json',
                'token': 'Njw862jbHS'
            }
            const userID = answers.id;
            axios.get('http://localhost:3000/info/' + userID, { headers })
                .then(res => {
                    console.log('==========================');
                    console.log('> Successfully Logged in <');
                    console.log('==========================');
                    callback(userID, headers);
                })
                .catch(err => {
                    if (err.response.data.message === 'Id not found') {
                        prompt([
                            {
                                type: 'list',
                                name: 'registerOrLogin',
                                message: 'ID not found, do you want to register with this id or login again?',
                                choices: [
                                    'Register',
                                    'Login'
                                ]
                            }
                        ])
                            .then((answers) => {
                                if (answers.registerOrLogin === 'Register') {
                                    register(userID, headers);
                                } else {
                                    login();
                                }
                            })
                            .catch(error => callbackError(error));
                    } else console.log(err);
                });
        })
        .catch(error => callbackError(error));
}

const register = (id, headers) => {
    prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter your name:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your name';
                }
            }
        }
    ])
        .then((answers) => {
            const body = {
                "id": id,
                "name": answers.name
            }
            console.log(body)
            axios
                .post('http://localhost:3000/create', body, { headers })
                .then(res => {
                    console.log('===========================');
                    console.log('> Successfully Registered <');
                    console.log('===========================');
                    console.log(res.data);
                    callback(id, headers);
                })
                .catch(err => {
                    console.log(err.response.data.message);
                    console.log('• An error occurred, please try again later.');
                    login();
                })
        })
        .catch(error => callbackError(error));
}

const callback = (id, headers) => {
    prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
                'Info',
                'Fields',
                'AnimalShelters',
                'Shop',
                'Steal',
                'Histories',
                'Exit'
            ]
        }
    ])
        .then((answers) => {
            switch (answers.action) {
                case 'Info': {
                    axios
                        .get('http://localhost:3000/info/' + id, { headers })
                        .then(res => {
                            console.log(JSON.stringify(res.data, null, 4));
                            callback(id, headers);
                        })
                        .catch(err => {
                            console.log(err.response.data.message);
                        });
                    break;
                }
                case 'Fields': {
                    fieldsFunction(id, headers);
                    break;
                }
                case 'AnimalShelters': {
                    animalSheltersFunction(id, headers);
                    break;
                }
                case 'Shop': {
                    shopFunction(id, headers);
                    break;
                }
                case 'Steal': {
                    stealFunction(id, headers);
                    break;
                }
                case 'Histories': {
                    historiesFunction(id, headers);
                    break;
                }
                case 'Exit': {
                    console.log('===========');
                    console.log('> Goodbye <');
                    console.log('===========');
                    break;
                }
            }
        })
        .catch(error => callbackError(error));
}

const fieldsFunction = (id, headers) => {
    prompt([
        {
            type: 'list',
            name: 'fieldAction',
            message: 'What do you want to do?',
            choices: [
                'Info',
                'Plant',
                'Harvest',
                'Back'
            ]
        }
    ])
        .then((answers) => {
            switch (answers.fieldAction) {
                case 'Info': {
                    axios.get('http://localhost:3000/fields/' + id, { headers })
                        .then(res => {
                            console.log(JSON.stringify(res.data, null, 4));
                            fieldsFunction(id, headers);
                        })
                        .catch(err => {
                            console.log(err.response.data.message);
                        });
                    break;
                }
                case 'Plant': {
                    plantFunction(id, headers);
                    break;
                }
                case 'Harvest': {
                    harvestFunction(id, headers);
                    break;
                }
                case 'Back': {
                    callback(id, headers);
                    break;
                }
            }
        })
        .catch(error => callbackError(error));
}

const plantFunction = (id, headers) => {
    axios
        .get('http://localhost:3000/crops/' + id, { headers })
        .then(res => {
            const choices = res.data.availableCrops.map(crop => {
                return crop.name + ' (' + crop.cost.buy + '$, ' + crop.harvestTime / 1000 + 's)';
            })

            prompt([
                {
                    type: 'list',
                    name: 'crops',
                    message: 'What crop do you want to plant? [ Balance: ' + res.data.money + '$ ]',
                    choices
                }
            ])
                .then((answers) => {
                    const chosenCrop = answers.crops.split(' ')[0];
                    const chosenCropIndex = res.data.availableCrops.findIndex(crop => {
                        return crop.name === chosenCrop;
                    })

                    prompt([
                        {
                            type: 'input',
                            name: 'amount',
                            message: 'How many do you want to plant? [ Balance: ' + res.data.money + '$ ]',
                            validate: function (value) {
                                if (value.length) {
                                    if (typeof parseInt(value) === 'number') {
                                        if (value * res.data.availableCrops[chosenCropIndex].cost.buy <= res.data.money) {
                                            return true;
                                        } else {
                                            return 'Insufficient balance, you need ' + (value * res.data.availableCrops[chosenCropIndex].cost.buy - res.data.money) + '$ more';
                                        }
                                    } else {
                                        return 'Please enter a number';
                                    }
                                } else {
                                    return 'Please enter the amount';
                                }
                            }
                        }
                    ])
                        .then((answers) => {
                            const body = {
                                "action": "plant",
                                "cropId": chosenCropIndex,
                                "amount": answers.amount
                            }
                            axios.put('http://localhost:3000/fields/' + id, body, { headers })
                                .then(res => {
                                    if (res.data.message != 'Plant successfully') {
                                        console.log('• ' + res.data.message);
                                    } else {
                                        console.log('========================');
                                        console.log('> Successfully planted <');
                                        console.log('========================');
                                        console.log('• Remaining Balance: ' + res.data.data.money + '$');
                                        console.log(res.data.data.fields);
                                    }

                                    fieldsFunction(id, headers);
                                })
                                .catch(err => {
                                    console.log(err.response.data.message);
                                })
                        })
                })
                .catch(error => callbackError(error));
        })
        .catch(err => {
            console.log(err.response.data.message);
        })

}

const harvestFunction = (id, headers) => {
    const body = {
        "action": "harvest"
    }
    axios
        .put('http://localhost:3000/fields/' + id, body, { headers })
        .then(res => {
            if (res.data.message != 'Harvest successfully') {
                console.log('• ' + res.data.message);
            } else {
                console.log('==========================');
                console.log('> Successfully harvested <');
                console.log('==========================');
                console.log('• Unharvetable Fields: ' + res.data.data.fields.crops.reduce((acc, curr) => acc + curr.amount, 0));
                console.log(res.data)
                console.log('• Gained Exp: ' + res.data.data.gainedExp);
                console.log('• Total Exp: ' + res.data.data.exp);
            }

            fieldsFunction(id, headers);
        })
        .catch(err => {
            console.log(err.response.data.message);
        })
}

const animalSheltersFunction = (id, headers) => {
    prompt([
        {
            type: 'list',
            name: 'animalShelterAction',
            message: 'What do you want to do?',
            choices: [
                'Info',
                'Feed',
                'Collect',
                'Back'
            ]
        }
    ])
        .then((answers) => {
            switch (answers.animalShelterAction) {
                case 'Info': {
                    axios
                        .get('http://localhost:3000/animalShelters/' + id, { headers })
                        .then(res => {
                            console.log(JSON.stringify(res.data, null, 4));
                            animalSheltersFunction(id, headers);
                        })
                        .catch(err => {
                            console.log(err.response.data.message);
                        })
                    break;
                }
                case 'Feed': {
                    feedFunction(id, headers);
                    break;
                }
                case 'Collect': {
                    collectFunction(id, headers);
                    break;
                }
                case 'Back': {
                    callback(id, headers);
                    break;
                }
            }
        })
        .catch(error => callbackError(error));
}

const feedFunction = (id, headers) => {
    axios
        .get('http://localhost:3000/animals/' + id, { headers })
        .then(res => {
            console.log(JSON.stringify(res.data, null, 4));
            let totalFeedCost = 0,
                choices = res.data.availableAnimals.map(animal => {
                    const feedCost = animal.cost.feed * animal.current;
                    totalFeedCost += feedCost;
                    return animal.name + ' (' + feedCost + '$, ' + animal.collectTime / 1000 + 's)';
                });

            choices.push(`All (${totalFeedCost}$)`, 'Back');
            prompt([
                {
                    type: 'list',
                    name: 'animals',
                    message: 'What animal do you want to feed? [ Balance: ' + res.data.money + '$ ]',
                    choices
                }
            ])
                .then((answers) => {
                    if (answers.animals == 'Back') {
                        animalSheltersFunction(id, headers);
                        return;
                    }

                    const chosenAnimal = answers.animals.split(' ')[0];
                    const chosenAnimalIndex = answers.animals == 'All' ? -1 : res.data.availableAnimals.findIndex(animal => animal.name === chosenAnimal);
                    console.log(chosenAnimal, chosenAnimalIndex);

                    const body = {
                        "action": "feed",
                        "animalId": chosenAnimalIndex
                    }

                    axios
                        .put('http://localhost:3000/animalShelters/' + id, body, { headers })
                        .then(res => {
                            if (res.data.message != 'Feed successfully') {
                                console.log('• ' + res.data.message);
                            } else {
                                console.log(JSON.stringify(res.data, null, 4));
                                console.log('====================');
                                console.log('> Successfully fed <');
                                console.log('====================');
                                console.log('• Remaining Balance: ' + res.data.data.money + '$');
                            }

                            feedFunction(id, headers);
                        })
                        .catch(err => {
                            console.log(err.response.data.message);
                            feedFunction(id, headers);
                        })

                })
                .catch(error => callbackError(error));
        })
        .catch(err => {
            console.log(err.response.data.message);
            animalSheltersFunction(id, headers);
        })
}

const collectFunction = (id, headers) => {
    let body = {
        "action": "collect"
    }
    axios
        .put('http://localhost:3000/animalShelters/' + id, body, { headers })
        .then(res => {
            if (res.data.message != 'Collect successfully') {
                console.log('• ' + res.data.message);
            } else {
                console.log(JSON.stringify(res.data, null, 4));
                console.log('==========================');
                console.log('> Successfully collected <');
                console.log('==========================');
                console.log('• Gained Exp: ' + res.data.data.gainedExp);
                console.log('• Total Exp: ' + res.data.data.exp);
            }

            animalSheltersFunction(id, headers);
        })
        .catch(err => {
            console.log(err.response.data.message);
            animalSheltersFunction(id, headers);
        })
}

const shopFunction = (id, headers) => {
    prompt([
        {
            type: 'list',
            name: 'shopAction',
            message: 'What do you want to do?',
            choices: [
                'Buy',
                'Sell',
                'Back'
            ]
        }
    ])
        .then((answers) => {
            switch (answers.shopAction) {
                case 'Buy': {
                    buyFunction(id, headers);
                    break;
                }
                case 'Sell': {
                    sellFunction(id, headers);
                    break;
                }
                case 'Back': {
                    callback(id, headers);
                    break;
                }
            }
        })
        .catch(error => callbackError(error));
}

const buyFunction = (id, headers) => {
    axios.get('http://localhost:3000/shop/' + id, { headers })
        .then(res => {
            const { pets, animals } = res.data.data;
            const choices = [];

            console.log(JSON.stringify(res.data, null, 4));

            if (pets.length > 0) {
                choices.push('Pets');
            }
            if (animals.length > 0) {
                choices.push('Animals');
            }
            choices.push('Back');
            prompt([
                {
                    type: 'list',
                    name: 'buyTarget',
                    message: 'What do you want to buy?',
                    choices
                }
            ])
                .then((answers) => {
                    switch (answers.buyTarget) {
                        case 'Animals': {
                            _buyAnimalsFunction(id, headers, res.data);
                            break;
                        }
                        case 'Pets': {
                            _buyPetsFunction(id, headers, res.data);
                            break;
                        }
                        case 'Back': {
                            shopFunction(id, headers);
                            break;
                        }
                    }
                })
                .catch(error => callbackError(error));
        })
        .catch(err => {
            console.log(err);
        })
}

const _buyAnimalsFunction = (id, headers, responseJSON) => {
    let choices = responseJSON.data.animals.map(animal => {
        return animal.name + ': ' + animal.inStock + ' left (' + animal.price + '$ each)';
    })
    choices.push('Back');

    prompt([
        {
            type: 'list',
            name: 'animal',
            message: 'What animal do you want to buy?' + ' [ Balance: ' + responseJSON.money + '$ ]',
            choices
        }
    ])
        .then((answers) => {
            if (answers.animal == 'Back') {
                buyFunction(id, headers);
                return;
            }

            const animalName = answers.animal.split(': ')[0];
            const animalIndex = responseJSON.data.animals.findIndex(animal => animal.name === animalName);

            prompt([
                {
                    type: 'number',
                    name: 'amount',
                    message: `How many ${animalName} do you want to buy? (Max: ${responseJSON.data.animals[animalIndex].inStock}, ${responseJSON.data.animals[animalIndex].price}$ each)`,
                    validate: value => {
                        if (value > 0) {
                            if (value > responseJSON.data.animals[animalIndex].inStock) {
                                return `You can't buy more than ${responseJSON.data.animals[animalIndex].inStock}`;
                            } else if (value * responseJSON.data.animals[animalIndex].price > responseJSON.data.money) {
                                return `Not enough money, have ${responseJSON.data.money}$, need ${value * responseJSON.data.animals[animalIndex].price}$`;
                            }
                            return true;
                        }
                        return 'Please enter a valid amount';
                    }
                }
            ])
                .then((answers) => {
                    const body = {
                        "action": "buy",
                        "animalId": animalIndex,
                        "amount": answers.amount
                    }

                    axios
                        .put('http://localhost:3000/others/' + id, body, { headers })
                        .then(res => {
                            if (res.data.message != 'Buy successfully') {
                                console.log('• ' + res.data.message);
                            } else {
                                console.log(JSON.stringify(res.data, null, 4));
                                console.log('=======================');
                                console.log('> Successfully bought <');
                                console.log('=======================');
                                console.log('• Remaining Balance: ' + res.data.data.money + '$');
                            }

                            buyFunction(id, headers);
                        })
                        .catch(err => {
                            console.log(err.response.data.message);
                            _buyAnimalsFunction(id, headers, responseJSON);
                        })
                })
                .catch(error => callbackError(error));
        })
        .catch(error => callbackError(error));
}

const _buyPetsFunction = (id, headers, responseJSON) => {
    let choices = responseJSON.data.pets.map(pet => {
        return pet.name + ': ' + pet.inStock + ' left (' + pet.price + '$ each)';
    })
    choices.push('Back');

    prompt([
        {
            type: 'list',
            name: 'pet',
            message: 'What pet do you want to buy?' + ' [ Balance: ' + responseJSON.money + '$ ]',
            choices
        }
    ])
        .then((answers) => {
            if (answers.pet == 'Back') {
                buyFunction(id, headers);
                return;
            }

            const petName = answers.pet.split(': ')[0];
            const petIndex = responseJSON.data.pets.findIndex(pet => pet.name === petName);

            prompt([
                {
                    type: 'number',
                    name: 'amount',
                    message: `How many ${petName} do you want to buy? (Max: ${responseJSON.data.pets[petIndex].inStock}, ${responseJSON.data.pets[petIndex].price}$ each)`,
                    validate: value => {
                        if (value > 0) {
                            if (value > responseJSON.data.pets[petIndex].inStock) {
                                return `You can't buy more than ${responseJSON.data.pets[petIndex].inStock}`;
                            } else if (value * responseJSON.data.pets[petIndex].price > responseJSON.data.money) {
                                return `Not enough money, have ${responseJSON.data.money}$, need ${value * responseJSON.data.pets[petIndex].price}$`;
                            }
                            return true;
                        }
                        return 'Please enter a valid amount';
                    }
                }
            ])
                .then((answers) => {
                    const body = {
                        "action": "buy",
                        "petId": petIndex,
                        "amount": answers.amount
                    }

                    axios
                        .put('http://localhost:3000/others/' + id, body, { headers })
                        .then(res => {
                            if (res.data.message != 'Buy successfully') {
                                console.log('• ' + res.data.message);
                            } else {
                                console.log(JSON.stringify(res.data, null, 4));
                                console.log('=======================');
                                console.log('> Successfully bought <');
                                console.log('=======================');
                                console.log('• Remaining Balance: ' + res.data.data.money + '$');
                            }

                            buyFunction(id, headers);
                        })
                        .catch(err => {
                            console.log(err.response.data.message);
                            _buyPetsFunction(id, headers, responseJSON);
                        })
                })
                .catch(error => callbackError(error));

        })
        .catch(error => callbackError(error));
}

const sellFunction = (id, headers) => {
    prompt([
        {
            type: 'list',
            name: 'sellTarget',
            message: 'What do you want to sell?',
            choices: [
                'Crops',
                'Animal Goods',
                'Back'
            ]
        }
    ])
        .then((answers) => {
            switch (answers.sellTarget) {
                case 'Crops': {
                    axios
                        .put('http://localhost:3000/others/' + id, { action: 'sell', sellTarget: 'crops' }, { headers })
                        .then(res => {
                            if (res.data.message != 'Sell successfully') {
                                console.log('• ' + res.data.message);
                            } else {
                                console.log('=====================');
                                console.log('> Successfully sold <');
                                console.log('=====================');
                                console.log('• Gained: ' + res.data.data.moneyGained + '$ (Bonus included)');
                                console.log('• Money: ' + res.data.data.money);
                                if (res.data.data.moneyBonus) {
                                    console.log('• Money Bonus: ' + res.data.data.moneyBonus) + '$';
                                }

                                console.log(res.data);
                                sellFunction(id, headers);
                            }
                        })
                        .catch(err => {
                            console.log(err.response.data.message);
                            sellFunction(id, headers);
                        })
                    break;
                }
                case 'Animal Goods': {
                    axios
                        .put('http://localhost:3000/others/' + id, { action: 'sell', sellTarget: 'goods' }, { headers })
                        .then(res => {
                            if (res.data.message != 'Sell successfully') {
                                console.log('• ' + res.data.message);
                            } else {
                                console.log('=====================');
                                console.log('> Successfully sold <');
                                console.log('=====================');
                                console.log('• Gained: ' + res.data.data.moneyGained + '$ (Bonus included)');
                                console.log('• Money: ' + res.data.data.money);
                                if (res.data.data.moneyBonus) {
                                    console.log('• Money Bonus: ' + res.data.data.moneyBonus) + '$';
                                }
                            }

                            console.log(res.data);
                            sellFunction(id, headers);
                        })
                        .catch(err => {
                            console.log(err.response.data.message);
                            sellFunction(id, headers);
                        })
                    break;
                }
                case 'Back': {
                    shopFunction(id, headers);
                    break;
                }
            }
        })
        .catch(error => callbackError(error));
}

const stealFunction = (id, headers) => {
    axios
        .put('http://localhost:3000/others/' + id, { action: 'steal' }, { headers })
        .then(res => {
            const { message, data } = res.data;
            
            if (message != 'Steal successfully' && message != 'Steal failed') {
                console.log('• ' + message);
                callback(id, headers);
            } else {
                const { money, stolen, lost } = data;

                console.log('==========================');
                console.log('> SUCCESSFULLY PERFORMED <');
                console.log('==========================');

                const responseMessage = message == 'Steal successfully' ?
                                                    `• Stolen: ${stolen}$` :
                                                    `• Failed and lost: ${lost}$`;

                console.log(responseMessage);
                console.log('• Money: ' + money);

                callback(id, headers);
            }
        })
        .catch(err => {
            console.log(err)
            console.log(err.response.data.message);
            callback(id, headers);
        })
}

const historiesFunction = (id, headers) => {
    axios
        .get('http://localhost:3000/histories/' + id, { headers })
        .then(res => {
            const { message, data } = res.data;
            const { money, steal, defend } = data;

            console.log('=============');
            console.log('> HISTORIES <');
            console.log('=============');

            console.log('• Money: ' + money);
            console.log('• Steal: ' + JSON.stringify(steal, null, 4));
            console.log('• Defend: ' + JSON.stringify(defend, null, 4));

            callback(id, headers);
        })
        .catch(err => {
            console.log(err.response.data.message);
            callback(id, headers);
        })
}

const callbackError = error => {
    if (error.isTtyError) {
        console.error('Prompt couldn\'t be rendered in the current environment');
    } else {
        console.error(error);
    }
}


login();
