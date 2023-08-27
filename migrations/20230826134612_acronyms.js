/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('acronyms', (table) => {
      table.increments('id').primary();
      table.string('acronym').unique().notNullable();
      table.string('definition').notNullable();
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('acronyms');
  };
