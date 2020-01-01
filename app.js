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
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


  app.get('/Api/Material',(req,res)=>{
    connection.on('connect', function(err) {  
      if (err) {  
        console.log(err);}  
    });        
// var result = [{"id" : 5,    "name" : "sss",    "price" : 25}];
//   result.push({"id" : 4,    "name" : "AAA",    "price" : 295});
  Read(function(error, results) {
    // here is the results array from the first query    
    res.json({status :200,message:0,result : results});
  });
  })
  app.get('/Api/Material/:id',(req,res)=>{
    connection.on('connect', function(err) {  
      if (err) {  
        console.log(err);}  
    });        
  ReadSingle(req.params.id,function(error, result) {
    // here is the results array from the first query    
    res.json({status :200,message:0,result : result});
  });
  })
app.post('/Api/Material',(req,res)=>{
    connection.on('connect', function(err) {  
      if (err) {  
        console.log(err);}  
    });  
      console.log(req.body);  
  Insert(req.body.name,req.body.price);
    res.json({status :200,message:0,result : "inserted"});     
  })
app.delete('/Api/Material/:id',(req,res)=>{
    connection.on('connect', function(err) {  
      if (err) {  
        console.log(err);}  
    });  
      console.log(req.params);  
      Delete(req.params.id);
      res.json({status :200,message:0,result : "Deleted"});      
  })
  app.put('/Api/Material/:id',(req,res)=>{
    connection.on('connect', function(err) {  
      if (err) {  
        console.log(err);}  
    });  
      console.log(req.params);  
      console.log(req.body);  
      Update(req.body.name,req.body.price,req.params.id);
      var result={id:req.params.id,name:req.body.name,price:req.body.price};
      res.json({status :200,message:0,result : result});   
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
function Read(callback) {
  var results = [];
  console.log('Reading rows from the Table...');
  // Read all rows from table
  request = new Request(
  'SELECT  [Id]  ,[Name]  ,[Price] FROM [dbo].[Material]',
  function(err, rowCount, rows) {
  if (err) {
      console.log(err);
  } else {
      console.log(rowCount + ' row(s) returned');
   }
  console.log("returning row");
  callback(null, results);
  });
  // Print the rows read  
 request.on('row', function(columns) {
 var rowdetails=[];
      columns.forEach(function(column) {
           if (column.value === null) {
              console.log('NULL');
           } else {
            rowdetails.push(column.value);                      
           }   
      
      });
      
        results.push({"id" : rowdetails[0],    "name" : rowdetails[1],    "price" : rowdetails[2]});     
   });
  // Execute SQL statement
  connection.execSql(request);
}
function ReadSingle(id,callback) {
  var results = [];
  console.log('Reading rows from the Table...');
  // Read all rows from table
  request = new Request(
  'SELECT  [Id]  ,[Name]  ,[Price] FROM [dbo].[Material] where id=@id',
  function(err, rowCount, rows) {
  if (err) {
      console.log(err);
  } else {
      console.log(rowCount + ' row(s) returned');
   }
  console.log("returning row");
  callback(null, results);
  });
  request.addParameter('id', TYPES.Int, id);

  // Print the rows read  
 request.on('row', function(columns) {
 var rowdetails=[];
      columns.forEach(function(column) {
           if (column.value === null) {
              console.log('NULL');
           } else {
            rowdetails.push(column.value);                      
           }   
      
      });
      
        results.push({"id" : rowdetails[0],    "name" : rowdetails[1],    "price" : rowdetails[2]});     
   });
  // Execute SQL statement
  connection.execSql(request);
}
