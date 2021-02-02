module.exports = {
    client: 'postgres',
    connection: {
        port: 5432,
        host: process.env.POSTGRES_HOSTNAME ? process.env.POSTGRES_HOSTNAME : 'localhost',
        database: 'feedibus',
        user: 'postgres',
        password: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : 'rootroot'
    },
    pool: {
        min: 1,
        max: 7
    },
    migrations: {
        tableName: 'knex_migrations'
    }
};
