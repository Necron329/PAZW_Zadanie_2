const express = require("express");
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

const app = express();
const port = 3000;

// Set the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Function to parse XML and return questions
const parseXML = async (filePath) => {
    const data = fs.readFileSync(filePath, "utf-8");
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(data);
    return result.quiz.question.filter((q) => q.$.type === "multichoice");
};

// Route to render the quiz questions
app.get("/", async (req, res) => {
    try {
        const questions = await parseXML(path.join(__dirname, "pytania.xml"));
        res.render("index", { questions });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Błąd serwera");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
