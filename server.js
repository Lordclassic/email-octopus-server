const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"], // Allow multiple origins
  })
);

// Logging middleware to capture all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Request Body:", req.body); // Log the request body
  next();
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});
const upload = multer({ storage });

// Route to handle form submission and file upload
app.post("/send-email", upload.single("receipt"), async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log incoming data
    console.log("Uploaded File:", req.file); // Log uploaded file

    // Handle cases where req.body is undefined
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "Request body is empty or invalid." });
    }
    console.log("Request Body:", req.body);

    // Extract form data from req.body
    const { firstName, lastName, email, country, dob, age, otherPayment } =
      req.body;

    if (!firstName || !email) {
      // Early return if required fields are missing
      return res.json({ error: "First name and email are required" });
    }

    const receiptFilePath = req.file ? req.file.path : null;

    // Nodemailer transport configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email app password/ Replace with your app password
      },
    });

    // Email options
    const mailOptions = {
      from: "Skysources45@gmail.com",
      to: "Skysources45@gmail.com",
      subject: "New Registration with Receipt",
      html: `
        <h1>New Registration</h1>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Date of Birth:</strong> ${dob}</p>
        <p><strong>Age:</strong> ${age}</p>
         <p><strong>otherPayment:</strong> ${otherPayment}</p>
      `,
      attachments: receiptFilePath
        ? [{ filename: path.basename(receiptFilePath), path: receiptFilePath }]
        : [],
    };
    console.log("Uploaded File:", req.file); // Log uploaded file
    console.log("File path:", req.file ? req.file.path : "No file uploaded");

    // Send email
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error: " + error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Send a successful response to the client
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error in /send-email route:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
