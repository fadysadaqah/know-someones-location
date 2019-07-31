var express = require('express');
var app = express();
var pg = require('pg');
const PORT = process.env.PORT || 5000;
app.use(express.static('public'));
app.set('view engine', 'ejs')
const iplocation = require("iplocation").default;
var location;
var loc;
var city;
var reg;
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.query("create table locations (id serial , ip text,location text,redirect_url text,time timestamp default now())")
// #######################################################################
app.get('*', function (req, res) {
    var redirect_url = (req.query.redirect_url);
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
    iplocation(ip, [], (error, res) => { loc = res.country; city = res.region; reg = res.city; console.log(res); location = loc + '---' + city + '---' + reg; })

    client.query("Insert into locations (ip,location,redirect_url) values('" + ip + "','" + location + "','" + redirect_url + "')", function (err, result) {
        console.log('resulttttttttttttt : ' + result)
        console.log('errrrrrrrrrrrrrrrrrrrrrr : ' + err)

    });
    console.log(req.query.redirect_url)
    res.redirect(redirect_url)

})
// #######################################################################
app.listen(PORT);