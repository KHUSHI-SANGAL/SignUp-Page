//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });



const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));   //renders all static files like css and images


app.get("/", function(req,res){
  res.sendFile(__dirname + "//signup.html");
});


app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {   //data that we want to post to mailchimp API
    members: [  //members  is an array of objects or the users that we want to subscribe
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };


  const jsonData = JSON.stringify(data); //js object to flatpack json which we will send to mailchimp

  const url = "https://us11.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID; //last path is list id becoz in mailchimp we can have multiple lists so we have to specify which list we want to send the data to

  const options = {        //js object of options
    method: "POST",
    auth: process.env.USERNAME + ":" + process.env.KEY  //username:password
  };


  const request = https.request(url, options, function(response){ //post the data to external resource

    //if(response.statusCode === 200){
      res.sendFile(__dirname + "//success.html");
    //}
    //else{
      //res.sendFile(__dirname + "//failure.html");
    //}

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });


  request.write(jsonData);   //we specify which data we want to post to external server using request
  request.end();   //very important line

  console.log(firstName +" " + lastName + " " + email);
});




//for try again button on failure page to redirect to the home route
app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){ //dynamic port the heroku will decide on the go.
  if(process.env.PORT){
    console.log("Server listening on port " + process.env.PORT);
  }else{
    console.log("Server listening on port 3000.");
  }

});
