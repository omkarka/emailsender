
var nodemailer = require('nodemailer');
const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')
const multer = require('multer');
const { isNullOrUndefined } = require('util');
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(bodyParser.json())

var to
var subject
var Body
var path
var CC

//To store files on Local system
var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./files");
    },

// Name for the file with Date
    filename: function(req, file, callback) {
        callback(null,file.fieldname + "_" + Date.now()+ "_"+   file.originalname );
    }
});
const maxSize = 20 * 1024 * 1024;

// To select single file and store
var upload = multer({
    storage: Storage,
    limits:{ fileSize: maxSize }
}).single("files") 



//Gmail user's credentials
var Auth = {
    type: 'oauth2',
    user: 'discod748@gmail.com',
    clientId: '1061234212117-ni035rg7t3t5ccsbal06f49016ouv5to.apps.googleusercontent.com',
    clientSecret: '_Y4ag28Jhat2BVfkWAPDk2sA',
    refreshToken: '1//04MZDjy-aZR_1CgYIARAAGAQSNwF-L9IrHiRoyAl4iwNZtbXiyYlVQW5epxzczBoYvErcHb4MkZVb6mJgyupX55RnmDEhUS9Mjpk',
};


app.get('/',(req,res) => {                                  // Transfer index.html file at given path or as home page
    res.sendFile(__dirname + '/index.html')
})


function my(){
  swal("Sucssess", "Mail Send Successfully!!!!", "success")
}

//form action 
app.post('/sendmail',(req,res) => {
        upload(req,res,function(error){
        if(error){
            console.log(error)
            return res.end("Something went wrong!");
        } else{
            to = req.body.to
            subject = req.body.subject
            Body = req.body.Body
            CC= req.body.cc
            
            
            if(isNullOrUndefined(req.file)){                            
                path=null;
            }else{
                path = req.file.path
            }
            
            console.log("To: "+to)
            console.log("CC: "+CC)
            console.log("subject:"+subject)
            console.log("Body:"+Body)
            console.log("path:"+path)
            
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: Auth
              });
             
              if(path==null){                                                    // to Send Mail Without Attachment
                var mailOptions_Without_Attch = {
                    from: 'Omkar Kambli <discod748@gmail.com>',
                    to:to,
                    cc:CC,
                    subject:subject,
                    text:Body
                  };
                  
                transporter.sendMail(mailOptions_Without_Attch, function(error, info){
                if (error) {
                  console.log(error);
                } 
                else {
                  console.log('Email sent: ' + info.response);
                  return res.redirect('/result.html')
                  //alert("Email Sent")
                 
                    
                }
              });
              }        
              else{                                                         // to Send Mail With Attachment
                var mailOptions = {
                    from: 'Omkar Kambli <discod748@gmail.com>',
                    to: to,
                    cc:CC,
                    subject:subject,
                    text:Body,
                    attachments: [
                      {
                       path: path
                      }
                   ]
                  };
                   transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } 
                else {
                  console.log('Email sent: ' + info.response);
                   fs.unlink(path,function(err){              // Delete Files Using  file System 
                    if(error){
                        return res.end(error)
                    }else{
                        console.log("deleted")
                        return res.redirect('/result.html')  
                        //alert("Email Sent")    
                      
                    }
                  })
                }
              });
              }
              
              
            
        }
    })
})

app.listen(5000,() => {
    console.log("App started on Port 5000")
})