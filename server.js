const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "https://your-frontend.vercel.app", // Your deployed frontend
      "http://127.0.0.1:5500", // Local development frontend
    ],
    methods: ["GET", "POST"], // Allow only the required HTTP methods
    credentials: true, // Include this if you're working with cookies
  })
);

// Configure Multer for file uploads using in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle form submission and file upload
app.post("/send-email", upload.single("receipt"), async (req, res) => {
  console.log("Incoming request to /send-email");
  try {
    console.log("Request Body:", req.body); // Log incoming data
    console.log("Uploaded File:", req.file); // Log uploaded file

    // Handle cases where req.body is undefined
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "Request body is empty or invalid." });
    }

    // Extract form data from req.body
    const { firstName, lastName, email, country, dob, age, otherPayment } =
      req.body;

    if (!firstName || !email) {
      // Early return if required fields are missing
      return res.json({ error: "First name and email are required" });
    }

    // Nodemailer transport configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email app password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
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
        <p><strong>Other Payment:</strong> ${otherPayment}</p>
      `,
      attachments: req.file
        ? [{ filename: req.file.originalname, content: req.file.buffer }]
        : [],
    };

    // Verify transporter configuration
    await transporter.verify();

    // Send email
    await transporter.sendMail(mailOptions);

    // Send a successful response to the client
    return res.status(200).json({
      message: "Info sent successfully! We will get back to you soon!",
    });
  } catch (error) {
    console.error("Error in /send-email route:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use Vercel's assigned port or fallback to 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
