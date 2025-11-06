
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema    
        .createTable('accounts', (table) => {
           table.integer('id').notNullable().primary();
           table.string('name').notNullable();
           table.string('description');

        })    
        .createTable('alembic_version', (table) => {
           table.string('version_num').notNullable();

        })    
        .createTable('products', (table) => {
           table.integer('id').notNullable().primary();
           table.decimal('price').notNullable();
           table.string('name').notNullable();

        })    
        .createTable('users', (table) => {
           table.integer('id').notNullable().primary();
           table.string('first_name').notNullable();
           table.string('last_name').notNullable();

        });    
}

export function down(knex) {
    return knex.schema
        .dropTable('users')
        .dropTable('products')
        .dropTable('alembic_version')
        .dropTable('accounts');
}
