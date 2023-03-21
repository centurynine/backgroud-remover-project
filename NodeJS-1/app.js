const express = require("express");
const fileUpload = require("express-fileupload");
const { PythonShell } = require("python-shell");
const Jimp = require("jimp");
var fs = require("fs");
var app = express();
let port = "8080";
app.set("view engine", "ejs");
app.set("views", "NodeJS-1/pages");
app.use(express.static(__dirname + "/pages"));
app.use(express.json());
app.use(fileUpload({}));

app.post("/uploadFile", async (req, res) => {
  var error = false;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
 
  const { image } = req.files;

  if (!image) return res.sendStatus(400);

  if (image.mimetype == "image/png") {
    image.mv(__dirname + "/pages/images_input/" + image.name);
  } else if (image.mimetype == "image/jpeg") {
    const imageBuffer = await Jimp.read(image.data);
    image.name = image.name.replace(/.jpg/g, ".png");
    imageBuffer.write(__dirname + "/pages/images_input/" + image.name);
  }

  let options = {
    mode: "text",
    pythonOptions: ["-u"],
    scriptPath: "",

    args: [
      __dirname + "/pages/images_input/" + image.name,
      __dirname + "/pages/images_output/" + image.name,
    ],
  };

  PythonShell.run("NodeJS-1/main.py", options, async function (err, result) {
    if (err) {
      res.render("../pages/alertpages/alert_status.ejs", { status: "fail" });
      console.log("result: ", result.toString());
      error = true;
      return;
    }
  });

  if (error == false) {
    var jsonData = await JSON.parse(fs.readFileSync("./NodeJS-1/data.json"));
    // add image name to json and add id to json
    let data = req.body;
    console.log(jsonData);
    jsonData.push(data);
    jsonID = jsonData.length;
    jsonData[jsonID - 1].id = jsonID;
    jsonData[jsonID - 1].imageInput = image.name;
    jsonData[jsonID - 1].imageOutput = image.name;
    fs.writeFileSync(
      "./NodeJS-1/data.json",
      JSON.stringify(jsonData, null, "  ")
    );
    res.render("../pages/alertpages/alert_status.ejs", { status: "success" });
  }
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.get("", (req, res) => {
  fs.readFile("./NodeJS-1/data.json", (err, data) => {
    const listObj = JSON.parse(data);
    if (err) {
      res.status(400).send("Error List not found");
    } else {
      res.render("index", { ListImages: listObj });
    }
  });
});

app.get("/home", (req, res) => {
  fs.readFile("./NodeJS-1/data.json", (err, data) => {
    const listObj = JSON.parse(data);
    if (err) {
      res.status(400).send("Error List not found");
    } else {
      res.render("index", { ListImages: listObj });
    }
  });
});

app.get("/image/:id", async (req, res) => {
  id = req.params.id;
  await fs.readFile("./NodeJS-1/data.json", (err, data) => {
    const listObj = JSON.parse(data);
    if (err) {
      res.status(400).send("Error List not found");
    } else {
      for (let i = 0; i < listObj.length; i++) {
        if (listObj[i].id == id) {
          res.render("image", { ListImages: listObj[i] });
        }
      }
    }
  });
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Web listening at http://%s:%s", host, port);
});

app.get("/success", (req, res) => {
  res.render("../pages/alertpages/alert_status.ejs", {
    success: "เพิ่มข้อมูลสำเร็จ",
  });
});

app.get("/search/:variable", async (req, res) => {
  var variable = req.params.variable;
  await fs.readFile("./NodeJS-1/data.json", (err, data) => {
    const listObj = JSON.parse(data);
    if (err) {
      res.status(400).send("Error List not found");
    } else {
      for (let i = 0; i < listObj.length; i++) {

        if (listObj[i].imageInput == variable) {
          res.render("search", { ListImages: listObj[i] });
        } else if (i == listObj.length - 1) {
          res.render("../pages/alertpages/alert_status.ejs", {
            status: "searchfail",
          });
        }
      }
    }
  });
});
