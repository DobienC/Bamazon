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

    inquirer
    .prompt({
        type: "list",
        name: "choice",
        message: "What would you like to do as a manager?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    })
    .then(function(answer){
        console.log(answer.choice);
        if(answer.choice === "View Products for Sale"){
            connection.query("SELECT * FROM products", function(err, res){
                console.table(res);
                connection.end();
            });
        } else if(answer.choice === "View Low Inventory"){
            connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
                console.table(res);
                connection.end();
            });
        } else if(answer.choice === "Add to Inventory"){
            inquirer
            .prompt([
                {
                    type: "input",
                    name: "name",
                    message: "What item do you want to restock?"
                }
                ,{
                    type: "input",
                    name: "amount",
                    message: "How much do you want to restock?"
                }
            ])
            .then(function(answer){
                connection.query("SELECT * FROM products WHERE product_name = ?", [answer.name] ,function(err, res){
                    var newStock = res[0].stock_quantity + Number(answer.amount);
                    connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                          stock_quantity: newStock
                        },
                        {
                          product_name: res[0].product_name
                        }
                    ],
                    function(errr){
                        console.log("Updated Stock!");
                        connection.end();
                    })
                });
            });
        } else if(answer.choice === "Add New Product"){
            inquirer
            .prompt([
                {
                    type: "input",
                    name: "name",
                    message: "Whats the name of the item you want to add?"
                }
                ,{
                    type: "input",
                    name: "department",
                    message: "What department is your item from?"
                }
                ,{
                    type: "input",
                    name: "price",
                    message: "How much does it cost?"
                }
                ,{
                    type: "input",
                    name: "stock",
                    message: "How many will be in stock?"
                }
            ])
            .then(function(answers){
                connection.query("INSERT INTO products SET ?",
                {
                    product_name: answers.name,
                    department_name: answers.department,
                    price: Number(answers.price),
                    stock_quantity: Number(answers.stock)
                },
                function(errr){
                    if(errr) console.error(errr);
                    console.log("Added to the database!");
                    connection.end();
                });
            });
        }
    });
});