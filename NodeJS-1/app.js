
const  express = require("express");
const fileUpload = require('express-fileupload');
const {PythonShell} =require('python-shell');
var  fs = require("fs");
var app = express();
let port = '8080'
var CryptoJS = require("crypto-js");
var func = require('./function');

app.set("view engine", "ejs");
app.set("views", "NodeJS-1/pages");
app.use(express.static(__dirname + '/pages'));
app.use(express.json())
app.use(
  fileUpload({})
);

 
app.post('/uploadFile', async (req, res) => {
  
 
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const { image } = req.files;

  
 
    // If no image submitted, exit
    if (!image) return res.sendStatus(400);
  
    // Move the uploaded image to our upload folder
    image.mv(__dirname + '/pages/images_input/' + image.name);

    let options = {
      mode: 'text',
      pythonOptions: ['-u'], 
        scriptPath: '',  
       
      args: [__dirname + '/pages/images_input/' + image.name, __dirname + '/pages/images_output/' + image.name]  

  };
   
  PythonShell.run('NodeJS-1/main.py', options, function (err, result){
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        console.log('result: ', result.toString());
        res.send(result.toString())

  });
  var jsonData = await JSON.parse(fs.readFileSync('./NodeJS-1/data.json'));
  // add image name to json and add id to json
  let data = req.body;
      console.log(jsonData);
      jsonData.push(data);
      jsonID = jsonData.length;
      jsonData[jsonID-1].id = jsonID;
      jsonData[jsonID-1].imageInput = image.name;
      jsonData[jsonID-1].imageOutput = image.name;
      fs.writeFileSync('./NodeJS-1/data.json', JSON.stringify(jsonData, null, "  "));
 
    res.sendStatus(200);
});


app.get('/upload', (req, res)=> {
  res.render('upload')
})

app.get('', (req, res)=> {
  fs.readFile('./NodeJS-1/data.json', (err, data) => {const listObj= JSON.parse(data);
    if(err) {res.status(400).send('Error List not found');
  } else {
    res.render('index', {ListImages: listObj});
  }
});
});
 
app.get('/home', (req, res)=> {
  fs.readFile('./NodeJS-1/data.json', (err, data) => {const listObj= JSON.parse(data);
    if(err) {res.status(400).send('Error List not found');
  } else {
    res.render('index', {ListImages: listObj});
  }
});
});

 

app.get('/search', (req, res)=> {
  fs.readFile('./NodeJS-1/data.json', (err, data) => {const listObj= JSON.parse(data);
    if(err) {res.status(400).send('Error List not found');
  } else {
    res.render('index', {ListImages: listObj});
  }
});
});
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Web listening at http://%s:%s", host, port)
})

app.get('/success', (req, res)=> {
  res.render('../pages/alertpages/alert_status.ejs', {success: 'เพิ่มข้อมูลสำเร็จ'})
});

app.get('/search/:variable', async (req, res) => {
  var variable = req.params.variable;
  await fs.readFile('./NodeJS-1/data.json', (err, data) => {const listObj= JSON.parse(data);
    if(err) {res.status(400).send('Error List not found');
  } else {
    for (let i = 0; i < listObj.length; i++) { 
      if (listObj[i].FirstName == variable) {
        res.render('search', {ListImages: listObj[i]});
      }
      if(i == listObj.length-1) {
        res.render('../pages/alertpages/alert_status.ejs',
         {status: 'searchfail'});

      }
    }
  }
});
});

 


app.get('/user/:id', async (req, res) => {
  id = req.params.id;
  await fs.readFile('./NodeJS-1/data.json', (err, data) => {const listObj= JSON.parse(data);
    if(err) {res.status(400).send('Error List not found');
  } else {
    for (let i = 0; i < listObj.length; i++) { 
      if (listObj[i].id == id) {
        res.render('image', {ListImages: listObj[i]});
      }
    }
  }
});
})

function response(res, status, message) {
  res.status(status).json({message: message});
}


function searchData (data, searchname) {
  for (let i = 0; i < data.length; i++) {
    data[i].FirstName = data[i].FirstName.toLowerCase();
    data[i].LastName = data[i].LastName.toLowerCase();
    data[i].Email = data[i].Email.toLowerCase();
    data[i].Phone = data[i].Phone.toLowerCase();
    searchname = searchname.toLowerCase();
    if (data[i].FirstName == searchname || data[i].LastName == searchname || data[i].Email == searchname || data[i].Phone == searchname) {
      console.log('พบข้อมูล');
      return data[i];
    }
    else {
      console.log('ไม่พบข้อมูล');
    }
    return false;
}

  return false;
}
 
function stop() {
  process.exit()
}