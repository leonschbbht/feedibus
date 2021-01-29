exports.up = function (knex) {
    return knex.schema
        .createTable('user', function (table) {
            table.increments('id').primary();
            table.string('name');
            table.string('email').unique();
            table.string('password');
            table.string('salt');
        }).createTable('job', function (table) {
            table.increments('id');
            table.string('type');
            table.string('url');
        }).createTable('message', function (table) {
            table.increments('id').primary();
            table.integer('jobId').references('job.id');
            table.text('headline').nullable();
            table.text('text').nullable();
            table.text('imageUrl').nullable();
            table.string('author').nullable();
            table.text('sourceUrl').nullable();
            table.timestamp('time');
            table.text('identifier');
        }).createTable('subscription', function (table) {
            table.increments('id').primary();
            table.integer('userId').references('user.id');
            table.integer('jobId').references('job.id');
            table.string('name');
        }).createTable('tag', function (table) {
            table.increments('id').primary();
            table.integer('userId').references('user.id');
            table.string('name');
            table.string('color');
        }).createTable('categorisation', function (table) {
            table.increments('id').primary();
            table.integer('subscriptionId').references('subscription.id').onDelete('CASCADE');
            table.integer('tagId').references('tag.id').onDelete('CASCADE');
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('categorisation')
        .dropTable('tag')
        .dropTable('subscription')
        .dropTable('message')
        .dropTable('job')
        .dropTable('user')
};
