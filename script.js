document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents default form submission

    const form = document.getElementById("registrationForm");
    const formData = new FormData(form); // Collect form data

    // Log form data to ensure fields are being captured
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Send the form data to the server
    fetch("https://your-backend.vercel.app/send-email", {
      method: "POST",
      body: formData, // Send form data with file attached
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error || "Failed to send email");
          });
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message); // Show success message to the user
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message || "An error occurred. Please try again.");
      });
  });
