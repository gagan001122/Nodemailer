const express = require('express');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
//const exphbs = require('express-handlebars');

const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// // Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.render('contact', {layout: false});
});

app.post('/send',(req,res)=>{
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>First Name: ${req.body.name}</li>
      <li>:Last Name ${req.body.lanme}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Subject</h3>
    <p>${req.body.subject}</p>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    // create reusable transporter object 
  let transporter = nodemailer.createTransport({
    name: '',
    host: '',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '',
        pass: ''
    },
  });

//   // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer contact" <>', // sender address
      to: '', // list of receivers
      html: output // html 
  };

  // send mail  with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {layout: false}, {msg:'Email has been sent'});
  });
  });

app.listen(2000, () => console.log('Server started...'));