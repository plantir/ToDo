import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .unique()
      table.integer('pomo_duration_minutes').notNullable().defaultTo(25)
      table.integer('short_break_minutes').notNullable().defaultTo(5)
      table.integer('long_break_after').notNullable().defaultTo(5)
      table.integer('long_break_minutes').notNullable().defaultTo(15)
      table.integer('daily_pomo_limit').notNullable().defaultTo(10)
      table.jsonb('working_days').notNullable().defaultTo('[6,0,1,2,3]')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
