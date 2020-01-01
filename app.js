const express= require('express');
const app=express();
const Connection = require('tedious').Connection; 
const Request = require('tedious').Request;  
const TYPES = require('tedious').TYPES; 
app.use(express.json());
const bodyparser=require('body-parser');

//app.use(bodyparser.json);

const config = {
    authentication: {
      options: {
        userName: "testAdmin", // update me
        password: "Abcd@1234" // update me
      },
      type: "default"
    },
    server: "abcdtest.database.windows.net", // update me
    options: {
      database: "TestApi", //update me
      encrypt: true
    }
  };
  const port=process.env.PORT ||3000  ;
  const connection=new Connection(config);
  connection.config.options.rowCollectionOnRequestCompletion=true;
  app.listen(port,()=>console.log("Server is running"));
  app.get('/Api/Material',(req,res)=>{
    connection.on('connect', function(err) {  
      if (err) {  
        console.log(err);}  
    });        

var result = [{"Id" : 5,    "Name" : "sss",    "Price" : 25}];
  result.push({"Id" : 4,    "Name" : "AAA",    "Price" : 295});
res.status(200).json(result);
//console.log("AAAAAAAAA "+resultt)
  })

app.post('/Api/Material',(req,res)=>{
    connection.on('connect', function(err) {  
      if (err) {  
        console.log(err);}  
    });  
      console.log(req.body);  
  Insert(req.body.name,req.body.price);
    res.send("done");     
  })
app.delete('/Api/Material/:id',(req,res)=>{
    connection.on('connect', function(err) {  
      if (err) {  
        console.log(err);}  
    });  
      console.log(req.params);  
      Delete(req.params.id);
res.send("done");     
  })
  app.patch('/Api/Material/:id',(req,res)=>{
    connection.on('connect', function(err) {  
      if (err) {  
        console.log(err);}  
    });  
      console.log(req.params);  
      console.log(req.body);  
      Update(req.body.name,req.body.price,req.params.id);
res.send("done");     
  })

function Insert(name, price) {
    console.log("Inserting '" + name + "' into Table...");
    request = new Request(
        'INSERT INTO [dbo].[Material] (Name, Price) OUTPUT INSERTED.Id VALUES (@Name, @Price);',
        function(err, rowCount, rows) {
        if (err) {
            console.log("Error in inserting"+ err)
        } else {
            console.log(rowCount + ' row(s) inserted');
            
        }
        });
    request.addParameter('Name', TYPES.NVarChar, name);
    request.addParameter('Price', TYPES.Decimal, price);

    // Execute SQL statement
   
          //console.log('Connected');
          connection.execSql(request);             
}
function Delete(id) {
  console.log("Deleting '" + id + "' from Table...");

  // Delete the employee record requested
  request = new Request(
      'DELETE FROM [dbo].[Material] WHERE id = @id;',
      function(err, rowCount, rows) {
      if (err) {
          console.log(err);
      } else {
          console.log(rowCount + ' row(s) deleted');
         
      }
      });
  request.addParameter('id', TYPES.Int, id);

  // Execute SQL statement
  connection.execSql(request);
}
function Update(name, price ,id) {
  console.log("Updating Name and Price to '" + name +" and "+price + "' for '" + id + "'...");

  // Update the employee record requested
  request = new Request(
  'UPDATE [dbo].[Material] SET Name=@Name ,Price=@Price WHERE Id = @Id;',
  function(err, rowCount, rows) {
      if (err) {
      console.log(err);
      } else {
      console.log(rowCount + ' row(s) updated');
      }
  });
    request.addParameter('Name', TYPES.NVarChar, name);
    request.addParameter('Price', TYPES.Decimal, price);
    request.addParameter('Id', TYPES.Int, id);


  // Execute SQL statement
  connection.execSql(request);
}
function Read() {
  console.log('Reading rows from the Table...');
  var result = [{"Id" : 5,    "Name" : "sss",    "Price" : 25}];
  result.push({"Id" : 4,    "Name" : "AAA",    "Price" : 295});
  // Read all rows from table
  request = new Request(
  'SELECT  [Id]  ,[Name]  ,[Price] FROM [dbo].[Material]',
  function(err, rowCount, rows) {
  if (err) {
      console.log(err);
  } else {
     // console.log(rowCount + ' row(s) returned');
      //console.log(rows.length);
  }
  console.log("returning row");
  //return rows;
  });

  // Print the rows read
  
  request.on('row', function(columns) {
      columns.forEach(function(column) {
          if (column.value === null) {
              console.log('NULL');
          } else {
           console.log(column.metadata.colName +" : "+column.value);             
          }
         // this.result.push({"Id" : 5,    "Name" : "ssas",    "Price" : 25});
      });
     
  });

  // Execute SQL statement
  connection.execSql(request);
  return result;
//  result = "";  
}