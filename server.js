var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var cors = require('cors');
var fs = require('fs');
var parser = require('xml2json');
var body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.use(cors());

var DButilsAzure = require('./DButils');
var User = require('./routes/User');
var PointsOfInterest = require('./routes/Poi');

var countriesArr = [];
var secret = "YCsecret";

const port = /*process.env.PORT ||*/ 3000;
app.listen(port, function () {
    fs.readFile('countries.xml', function (err, data) {
        var json = parser.toJson(data);
        var splitJson = json.split("\"");
        var idx = 0;
        for (var i = 11; i <= splitJson.length; i = i + 8) {
            countriesArr[idx] = splitJson[i];
            idx++;
        }
    });
    console.log('Example app listening on port ' + port);
});


app.use('/', function (req, res, next) {
    // check for token in header or in body
    const token = req.headers['x-auth-token'];
    if (token) {            
        jwt.verify(token, secret, function (err, decoded) {
            if (!err) {
                var decoded = jwt.decode(token, {complete: true});
                req.decoded = decoded;
            }
        });
    }
    next();
});

app.use('/User',User);

app.use('/Poi',PointsOfInterest);

function getCountries(){
    return countriesArr;
}

module.exports.getCountries = getCountries;






