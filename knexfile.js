module.exports = {
    client: 'postgres',
    connection: {
        port: 5432,
        host: process.env.POSTGRES_HOSTNAME ? process.env.POSTGRES_HOSTNAME : 'localhost',
        database: 'feedibus',
        user: 'postgres',
        password: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : 'roottoor'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
};
