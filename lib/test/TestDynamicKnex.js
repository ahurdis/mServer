/*This function serves as the core of our DB layer
This will generate a SQL query and execute it whilest returning the response prematurely
@param obj:{Object} this is the options object that contain all of the query options
@return Promise{Object}: returns a promise that will be reject or resolved based on the outcome of the query
The reasoning behind this kind of logic is that we want to abstract our layer as much as possible, if evne the slightest 
sytnax change occurs in the near future, we can easily update all our code by updating this one
We are using knex as a query builder and are thus relying on Knex to communicate with our DB*/
/*Can also be used to build custom query functions from a data.service. This way our database service will remain
unpolluted from many different functions and logic will be contained in a BLL*/
/* All available options
var options = {
    table:'table',
    where:{operand:'=',value:'value',valueToEqual:'val2'},
    andWhere:[{operand:'=',value:'value',valueToEqual:'val2'}],
    orWhere:[{operand:'=',value:'value',valueToEqual:'val2'}],
    select:{value:['*']},
    insert:{data:{}},
    innerJoin:[{table:'tableName',value:'value',valueToEqual:'val2'}],
    update:{data:{}}
}*/
/*Test object*/
/*var testobj = {
    table:'advantage',
    where:{operand:'>',value:'id',valueToEqual:'3'},
    select:{value:['*']},
    innerJoin:{table:'User_Advantage',value:'User_Advantage.Advantageid',valueToEqual:'id'}
}
var testobj = {
    table:'advantage',
    where:{operand:'>',value:'id',valueToEqual:'3'},
    select:{value:['*']},
    innerJoin:{table:'User_Advantage',value:'User_Advantage.Advantageid',valueToEqual:'id'}
}
queryBuilder(testobj)*/


var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'sa',
    password : 'pass',
    database : 'world'
  }
});

exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists("payment_paypal_status", function (table) {
            table.increments(); // integer id

            // name
            table.string('name');

            //description
            table.string('description');
        }).then(function () {
                return knex("payment_paypal_status").insert([
                    {name: "A", description: "A"},
                    {name: "B", description: "BB"},
                    {name: "C", description: "CCC"},
                    {name: "D", description: "DDDD"}
                ]);
            }
        ),
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists("payment_paypal_status")
    ]);
};


function queryBuilder(options){
 var promise = new Promise(function (resolve, reject) {
    var query;
    for (var prop in options) {
        /*logger.info(prop)*/
        if (options.hasOwnProperty(prop)) {
            switch (prop) {
                case 'table':
                query = knex(options[prop]);
                break;
                case 'where':
                query[prop](options[prop].value, options[prop].operand, options[prop].valueToEqual);
                break;
                /*andWhere and orWhere share the same syntax*/
                case 'andWhere':
                case 'orWhere': 
                for(let i=0, len=options[prop].length;i<len;i++){
                    query[prop](options[prop][i].value, options[prop][i].operand, options[prop][i].valueToEqual);
                }
                break;
                case 'select':
                query[prop](options[prop].value);
                break;
                /*Same syntax for update and insert -- switch fallthrough*/
                case 'insert':
                case 'update':
                query[prop](options[prop].data);
                break;
                case 'innerJoin':
                for(let i=0, len=options[prop].length;i<len;i++){
                    query[prop](options[prop][i].table, options[prop][i].value, options[prop][i].valueToEqual);
                }
                break;
            }
        }
    }
    return query
    .then(function (res) {
        return resolve(res);
    }, function (error) {
        logger.error(error)
        return reject(error);
    })
    return reject('Options wrongly formatted');
});
 return promise
}



/*Will return all values from a certain table
@param: table{String}: string of the table to query
@param: select{Array[String]}: Array of strings of columns to be select -- defaults to ['*'] */
function getAll(table,select) {
    /*Select * from table as default*/
    var selectVal=select||['*']
    var options={
        table:table,
        select:{value:selectVal}
    }
    return queryBuilder(options)
}
