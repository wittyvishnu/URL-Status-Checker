const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).send("OK");
});
app.post("/check", async (req, res) => {

    const url = req.body?.url;

    if (!url) {
        return res.status(400).json({
            message: "URL required"
        });
    }

    try {

        const response = await axios.get(url, {
            validateStatus: () => true
        });

        if (response.status === 200) {
            return res.status(200).json({
                website_status: "UP",
                status_code: response.status
            });
        } else {
            return res.status(200).json({
                website_status: "DOWN",
                status_code: response.status
            });
        }

    } catch (error) {

        return res.status(500).json({
            website_status: "DOWN",
            message: "Unable to reach website"
        });

    }

});

module.exports = app;

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}
