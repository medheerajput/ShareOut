const express = require('express');
const connectDB=require("./config/db");
const app = express();
const mailSend = require('./services/mailService');
const multer=require("multer");
const path = require("path");
const env=require('dotenv');
const msgHtml= require('./services/emailTemplates');
env.config();
const { v4: uuidv4 } = require('uuid');
const File=require('./models/file');
const PORT = process.env.PORT || 1000;
//db
connectDB();
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));
//
const staticPath=path.join(__dirname,"./public")
//hbs page render
app.set('view engine','hbs');
const hbsPath= path.join(__dirname,'./templates/views');
app.set('views',hbsPath);
app.use(express.static(staticPath));
// app.use('/',require('./routes/index'))
app.get('/',(req,res)=>
{
    res.render("index");
})

// **************************************************
//multer for storing image/videos file data.
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images"); 
        },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName)
    },
  });
  
  const upload = multer({ storage: fileStorageEngine });
  
  // Single File Route Handler
  app.post("/api/files", upload.single("image"), async(req, res) => {
    console.log(req.file);
    if(!req.file){
        res.json({Error: "Invalid file !"})
    }
    //store into db
    const fileData= await File({
        filename:req.file.filename,
        path:req.file.path,
        size:req.file.size,
        uuid:uuidv4(),
    })
        const data=await fileData.save();
        console.log(data.uuid);
        
        return res.render("index",{
            file:` ${process.env.APP_BASE_URL}/files/${data.uuid}`,
            uuid:data.uuid,
        })
  });
// ***************************************************
app.get('/mail',(req,res)=>{
    res.render("mail");
})
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.post('/api/files/send', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
    console.log("uuid:",uuid);
    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required except expiry.'});
    }
    // Get data from db 
    try {
      const file = await File.findOne({ uuid: uuid });
      file.sender = emailFrom;
      file.receiver = emailTo;
      const response = await file.save();
      console.log(response);
      // send mail
      console.log(mailSend);
     
      const size=(file.size/1000);
      mailSend({
      from: emailFrom,
      to: emailTo,
      subject: 'Hello friend !',
      text: `${emailFrom} shared a file with you.`,
      html: msgHtml({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}` ,
                size: `${size} KB`,
                expires: '24 hours'
            })
          })
            .then(() => {
        return res.render("success");
      }).catch(err => {
        return res.status(500).json({error: 'Error in email sending.'});
      });
  } catch(err) {
    return res.status(500).send({ error: 'Something went wrong.'});
  }
})

// *******************************************************************************
function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
      res.json({
          success: 0,
          message: err.message
      })
  }
}

app.use(errHandler);
app.listen(PORT, () => {
    console.log("server up and running");
})
