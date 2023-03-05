require("dotenv").config();
const express = require("express");
const request = require('request');
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
http = require('http'),
server = http.createServer(app)
const multer = require("multer");
  
const PORT = 3001;

const upload = multer({
  dest: 'images'
  })

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/')));
const firebase = require("./utils/config");

const db = firebase.firestore();
const userTable = db.collection("users");

// parse application/json
app.use(bodyParser.json());
  
app.listen(process.env.PORT || PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else
    { 
        console.log("Error occurred, server can't start", error);
    }
});

app.get('/upload', (req,res)=>{
    res.sendFile(__dirname + '/upload.html');
})


app.post('/upload', (req, res)=>{
    // res.render('upload');   
    console.log(req.body);
})


app.post('/test', (req, res)=>{
    // res.render('upload');   
    console.log(req.body);
})




app.post('/home', async function(req, res) {
    // let url = 'http://127.0.0.1:5000/flask?u='+req.body.docLink;
    let cloth_link = req.body.docLink;
    let category=""
    let color=""
    var data = { // this variable contains the data you want to send 
        img: cloth_link
    }
    var options = { 
        method: 'POST', 
        uri: 'http://127.0.0.1:5000/flask', 
        body: data, 
        json: true // Automatically stringifies the body to JSON 
    }; 
    console.log("Sending REquest !!!!!")
    let d = await request(options, function(error,response,parsedBody) { 
        // console.log(error);
        console.log(response.body);
        category = response.body[0];
        color = response.body[1];
        // var data = { // this variable contains the data you want to send 
        //     cloth_link:cloth_link,
        //     category:category,
        //     color:color
        // }


        request.post(
          {
          url:'http://localhost:3001/updateDB',
          json: {
            test:"hello",
            cloth_link:cloth_link,
            category:category,
            color:color

              },
          headers: {
              'Content-Type': 'application/json'
          },
          body:data,
          },
        function(error, response, body){
          // console.log(error);
          // console.log(response);
          // console.log(body);
          res.send(body);
        });
        
        // console.log(parsedBody); // parsedBody contains the data sent back from the Flask server 
         // do something with this data, here I'm assigning it to a variable. 
    


}) 

});
app.post("/updateDB",async function(req,res){
    console.log(req.body);
    let cloth_link = req.body.cloth_link;
    let category = req.body.category;
    let color = req.body.color;
    const snapshot = await userTable
    .where("email", "==", "test@gmail.com")
    .get();
  if (snapshot.empty == false) {
    snapshot.forEach((doc) => {
      var allCategories = doc.data().clothes;
      console.log(allCategories);
      let index = 0;
      allCategories.forEach((cat) =>{
        if(cat[category] !== undefined)
        {
          // console.log(cat[category]);
            var newCloth = {}
            newCloth[cloth_link] = color;
            cat[category].push(newCloth);
            // var temp = cat[category];

            // console.log(cat[category]);

            var new_entry = {}
            new_entry[category] = cat[category];

            var updated_clothes = allCategories;
            updated_clothes[index] = new_entry;

            // console.log(new_entry);


          // temp.push(newCloth);
          db.collection("users").doc(doc.id).update({
            clothes : updated_clothes
          });
        }
        else 
          ++index
        })

        // console.log("Database");
        
      
      // const ob = {
      //   labName: labDetail.name,
      //   link: req.body.docLink,
      //   testName: req.body.testName,
      //   date: new Date().toDateString(),
      // };
      // reportsArray.push(ob);

    });
  } else {
    // res.render("uploadReport");
    console.log("no patient found");
    res.render("uploadReport", { status: "patient not found" });
  }
  res.send("");
})
    // res.send(returndata);     



app.get("/recommend",async function()
{
  let class_names = ['short_sleeve_top', 'long_sleeve_top', 'short_sleeve_outwear', 'long_sleeve_outwear',
                  'vest', 'sling', 'shorts', 'trousers', 'skirt', 'short_sleeve_dress',
                  'long_sleeve_dress', 'vest_dress', 'sling_dress']
  const snapshot = await userTable
  .where("email", "==", "test@gmail.com")
  .get();
  let location = "Vellore"
  let fields=["top","outwear","below","dress","cold","casual"]
  let values=[[0,1],[2,3],[6,7,8],[9,10,11,12],[1,3,7],[0,1,2,3,4,5,6,7,8]]
  let contrasts=[]
  // for(let i=0;i<values.length();i++)
  // {
    let row=[]
    for(let j=0;j<class_names.length;j++)
    {
      snapshot.forEach((doc) => {
        var allCategories = doc.data().clothes;
        for(let k=0;k<class_names.length;k++)
        {
          for(var x in allCategories[k][class_names[k]][0])
          {
          // console.log(contrast(allCategories[j][class_names[j]][0][x].split("$"),allCategories[k][class_names[k]][0][x].split("$")));
          // console.log(allCategories[k][class_names[k]][0][x].split("$"))
          }
        }

      } )
    }
  // }

  url="http://api.weatherapi.com/v1/current.json?key=c9557fcf2baa484ca60213502230403&q="+location+"&aqi=no";
  request.get(url,function(error,res){
    console.log(res.body);
  
  }).catch((err)=>{
    console.log(err)
  })

})


app.post('/uploadImage', upload.single('upload'), (req, res) => {
  res.send()
  })

function luminance(r, g, b) {
  var a = [r, g, b].map(function(v) {
    v /= 255;
    return v <= 0.03928 ?
      v / 12.92 :
      Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) /
    (darkest + 0.05);
}

// console.log(contrast([255, 255, 255], [255, 255, 0])); // 1.074 for yellow
// console.log(contrast([255, 255, 255], [0, 0, 255])); // 8.592 for blue
// minimal recommended contrast ratio is 4.5, or 3 for larger font-sizes