const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const app = express();

/* Middlewares */

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));

/* Firebase Admin Setup */
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


/* REGISTER API */

app.post("/api/register", async (req, res) => {

  const { name, email, rollNo, password, role } = req.body;

  try {

    const user = await admin.auth().createUser({
      email: email,
      password: password
    });

    await db.collection("students").doc(user.uid).set({
      name,
      email,
      rollNo,
      role
    });

    res.json({
      success: true,
      message: "User registered successfully"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});


/* LOGIN API */

app.post("/api/login", async (req, res) => {

  const { email, password, role } = req.body;

  try {

    const user = await admin.auth().getUserByEmail(email);

    res.json({
      success: true,
      message: "Login successful",
      uid: user.uid,
      role: role
    });

  } catch (err) {

    res.status(404).json({
      success: false,
      message: "User not found"
    });

  }

});


/* Start Server */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
