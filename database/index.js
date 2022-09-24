const Sequelize = require("sequelize");
const { resolve } = require("path");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: resolve(__dirname, 'data.sqlite'),
    define: {
        underscored: false,
        freezeTableName: true,
        charset: 'utf8',
        dialectOptions: {
            collate: 'utf8_general_ci'
        }
    },
    sync: {
        force: false
    },
    logging: false,
    pool: {
        max: 20,
        min: 0,
        idle: 30000
    },
    transactionType: 'IMMEDIATE',
    retry: {
        match: [
            /SQLITE_BUSY/,
        ],
        name: 'query',
        max: 10
    }
});


async function auth() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    const Farm = sequelize.define('Farm', {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        data: {
            type: Sequelize.JSON
        }
    });

    return Farm.sync({ force: false });
}

module.exports = { auth };
