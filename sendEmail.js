const nodemailer = require("nodemailer");

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kilashofaruq124@gmail.com", // Your Gmail address
    pass: "dzjp kfqu ucqb nvls", // Gmail App password (if you have 2-step verification enabled)
  },
});

// Set up email data
const mailOptions = {
  from: "kilashofaruq124@gmail.com", // Sender address
  to: "lovequeenmary18@gmail.com", // List of recipient
  subject: "Test Email", // Subject line
  text: "Hello, this is a test email from Nodemailer!", // Plain text body
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});
