module.exports = {
    async up(knex) {
        // Create a mapping of OAuth provider ID to user ID
        await knex.schema.createTable("directus_oauth", (table) => {
            table.uuid("user_id").index();
            table.string("id").primary();
            table.foreign("user_id")
                .references("id")
                .inTable("directus_users")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
        });
    },
    async down(knex) {
        await knex.schema.dropTable("directus_oauth");
    },
};
