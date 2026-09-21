import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

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
        .index()
      table
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
        .index()
      table
        .integer('parent_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('tasks')
        .onDelete('CASCADE')
        .index()
      table.string('title', 200).notNullable()
      table.integer('priority').notNullable().defaultTo(3)
      table.integer('estimated_pomodoros').notNullable().defaultTo(1)
      table.boolean('is_completed').notNullable().defaultTo(false)
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
