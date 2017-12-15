/*
 * KnexHelper.js
 * @author Andrew
 */


function KnexHelper() {
    "use strict";

    var self = this;

    var knex = require('knex')({
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'pass',
            database: 'world'
        }
    });


    /*
        self.AddTable();
    
            var v = knex.select().from('city')
                  .timeout(1000)
                  .then(function (rows) {
                    console.log(rows);
                  })
                  .catch(function (error) {
                    console.error(error)
                  });
    */

    self.selectFromTable = function (vertex) {

        var knex = require('knex')({
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                user: 'root',
                password: 'pass',
                database: vertex.database
            }
        });

        return function () {

            return knex.select(...vertex.displayKeys).from(vertex.instance);
        }
    };

    self.addTable = function (vertex) {

        var columns = vertex.displayKeys;

        knex.schema.createTable(vertex.instance, function (table) {
            table.increments();
            for (var i = 0; i < columns.length; i++) {
                table.string(columns[i]);
            }
            table.timestamps();
        }).catch(function (error) {
            console.error(error);
        });;
    };
};

module.exports = KnexHelper;