const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const utils = require("util");
const puppeteer = require("puppeteer");
const hb = require("handlebars");
dotenv.config();
const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const nodemailer = require("nodemailer");
/* const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const cors = require("cors");
 */ const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

//------Get html file--------//

const readFile = utils.promisify(fs.readFile);
async function getTemplateHtml() {
  console.log("Loading template file in memory");
  try {
    const invoicePath = path.resolve("./views/sauda-email.ejs");
    console.log(invoicePath);
    return await readFile(invoicePath, "utf8");
  } catch (err) {
    return Promise.reject("Could not load html template");
  }
}

//------Generate pdf file--------//

async function generatePdf() {
  let data = {};
  getTemplateHtml()
    .then(async (res) => {
      // Now we have the html code of our template in res object
      // you can check by logging it on console
      // console.log(res)
      console.log("Compiing the template with handlebars");
      const template = hb.compile(res, { strict: true });
      // we have compile our code with handlebars
      const result = template(data);
      // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
      const html = result;
      // we are using headless mode
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      // We set the page content as the generated html by handlebars
      await page.setContent(html);
      // We use pdf function to generate the pdf in the same folder as this file.
      await page.pdf({ path: "sauda.pdf", format: "A4" });
      await browser.close();
      console.log("PDF Generated");
    })
    .catch((err) => {
      console.error(err);
    });
}

//generatePdf(); // ------------------  generating pdf

//*********** */ mailing service

/* 
const transpoter = nodemailer.createTransport(transpoter{
    service: 'gmail',
    
})
 */

//********** */ send sms and whatsapp

sendMessage = () => {
  // Whatsapp messaging
  /*  client.messages
    .create({
      from: "whatsapp:+14155238886",
      body: "Sauda Offline web confirmation DAX Bhai",
      to: "whatsapp:+918700170691",
    })
    .then((message) => console.log(message.sid));
 */
  //SMS messaging
  /*   client.messages
  .create({
     body: 'Sauda Offline web confirmation DAX Bhai',
     from: '',
     to: '+15558675310'
   })
  .then(message => console.log(message.sid)); */
};

//sendMessage();

app.post("/sms", (req, res) => {});
app.get("/", (req, res) => {
  res.render("sauda-email.ejs");
});

/* dotenv.config();

mongoose.connect(
  process.env.MONGO_URL_TEST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected to mongo test server");
  }
);
 */
//Middleware
/* 
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors()); //for localhost machine usage only
app.use("/api/users", userRoute);

app.use("/api/auth", authRoute); */

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
