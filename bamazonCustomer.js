var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    connection.query('SELECT * FROM products', function(err, data){
        if(err) throw err;
        console.table(data);
        inquirer
        .prompt([
            {
                name: "ID",
                type: "input",
                message: "Whats the ID of the item you want to purchase?"
            },
            {
                name: "Quantity",
                type: "input",
                message: "How many do you want to buy?"
            }
        ])
        .then(function(answer) {
            var query = "SELECT * FROM products WHERE item_id=?";
            connection.query(query, [Number(answer.ID)], function(err, res){
                if(answer.Quantity > res[0].stock_quantity){
                    console.log("Insufficient Quantity!");
                } else {
                    var newQuantity = res[0].stock_quantity - answer.Quantity;
                    console.log("Your total is: " + res[0].price * answer.Quantity + "$");
                    connection.query("UPDATE products SET stock_quantity = "+ newQuantity +" WHERE item_id =" + answer.ID, function(errr, ress){
                    });
                }
                connection.end();
            });
        });
    });
});
