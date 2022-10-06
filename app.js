require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const aboutUs="If you’re someone who watches the news every day but suddenly can’t because of personal reasons, you can visit News Nation. We have various trending articles for you to check out. Also, we have news for every topic, so you will still be updated wherever, wherever you are. "

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY=process.env.API_KEY;
app.get("/", function (req, res) {
    const userAgent = req.get('user-agent');
    const options = {
        host: 'newsapi.org',
        path: '/v2/top-headlines?country=in&sortBy=popularity&apiKey='+API_KEY,
        headers: {
            'User-Agent': userAgent
        }
    }
    https.get(options, function (response) {
        let data;
        response.on('data', function (chunk) {
            if (!data) {
                data = chunk;
            }
            else {
                data += chunk;
            }
        });
        response.on('end', function () {
            const jsonData = JSON.parse(data);
            const newsData = jsonData.articles;

            res.render("index", {
                newsData: newsData
            });

        });
    });
});

app.post("/search", (req, res) => {

    const country = req.body.select_country;
    const category = req.body.select_category;
    console.log(country + " " + category);
    const userAgent = req.get('user-agent');
    const options = {
        host: 'newsapi.org',
        path: '/v2/top-headlines?country=' + country + '&sortBy=popularity&category=' + category + '&apiKey='+API_KEY,
        headers: {
            'User-Agent': userAgent
        }
    }
    https.get(options, function (response) {
        let data;
        response.on('data', function (chunk) {
            if (!data) {
                data = chunk;
            }
            else {
                data += chunk;
            }
        });
        response.on('end', function () {
            const jsonData = JSON.parse(data);
            const newsData = jsonData.articles;

            res.render("index", {
                newsData: newsData
            });

        });
    });
});


app.get("/about",(req,res)=>{
    res.render("about",{ aboutUs:aboutUs });

});

app.get("/contact",(req,res)=>{
    res.render("contact");
});



app.listen(3000, function () {

    console.log("Server is running at port 3000");
});
