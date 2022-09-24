module.exports = (Farm) => {
    async function createData(id, data = {}) {
        if (typeof data != 'object' && !Array.isArray(data)) throw new Error('Data must be an object');
        try {
            await Farm.findOrCreate({ where: { id }, defaults: { data } });
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    function getData(id) {
        return new Promise((resolve, reject) => {
            Farm.findOne({
                where: {
                    id: id
                }
            }).then(Farm => {
                resolve(Farm?.data || null);
            }).catch(err => {
                reject(err);
            });
        });
    }

    function getAll() {
        return new Promise((resolve, reject) => {
            Farm.findAll().then(farms => {
                resolve(farms);
            }).catch(err => {
                reject(err);
            });
        });
    }

    function setData(id, data = {}) {
        return new Promise((resolve, reject) => {
            Farm.update({
                data: data
            }, {
                where: {
                    id: id
                }
            }).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }

    function updateData(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const dataCopy = {...data};
                
                delete dataCopy.crops;
                const oldData = await getData(id);
                const newData = Object.assign(oldData, dataCopy);

                Farm.update({
                    data: newData
                }, {
                    where: {
                        id: id
                    }
                }).then(() => {
                    resolve(newData);
                }).catch(err => {
                    reject(err);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    return {
        createData,
        getData,
        getAll,
        setData,
        updateData
    };
}
