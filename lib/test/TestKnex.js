var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'pass',
    database: 'world'
  }
});


knex.schema.createTable('foo', function (table) {
  table.increments();
  table.string('name');
  table.timestamps();
}).catch(function(error) {
    console.error(error);
  });

/*

var v = knex.select().from('city')
              .timeout(1000)
              .then(function (rows) {
                console.log(rows);
              })
              .catch(function (error) {
                console.error(error)
            });


*/

/*

knex.transaction(function(tx){
    return each({
        terminal : false,
        input : fs.createReadStream('FOO_BAR.TXT')
    })(function(line) {
        return knex("dadosbrutos").insert({ // this table does exists
            AA_DATA : line.substring(0,8),
            BB_DATA : line.substring(8,16),
            CC_DATA : line.substring(36,44)
        }).transacting(tx);
    })
    .then(function() {
        tx.commit();
    });
});
*/

/*
function(knex, Promise) {
  return knex.schema.createTable('User',function (table){ 
      table.increments('UserId').primary();
      table.string('username');
      table.string('email',60);
      table.string('password',65);
      table.timestamps();
  })
  .then(function () {
    return knex.schema.createTable('Comment',function(table){
      table.increments('CommentId').primary();
      table.string('Comment');
      table.integer('UserId',11).unsigned().inTable('User').references('UserId');
    });     
  });
};
*/

/*
var knex = require('knex')({});
var pg = require('knex')({client: 'oracle'});

console.log(pg('table').insert({a: 'b'}).returning('*').toString());
// knex.select('*').from('users').where(knex.raw('id = ?', [1])).toSQL();

var ctine = pg.schema.createTableIfNotExists('users', function (table) {
  table.increments();
  table.string('name');
  table.timestamps();
});

console.log(ctine.toString());
*/