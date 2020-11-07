module.exports = {
    client: 'postgres',
    connection: {
        port: 5432,
        host: 'localhost',
        database: 'feedibus',
        user: 'postgres',
        password: ''
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
};
