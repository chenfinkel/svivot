var express = require('express')
var router = express.Router();
var jwt = require('jsonwebtoken');
var fs = require('fs');
var parser = require('xml2json');
var DButilsAzure = require('../DButils');
var app = require('../server');
var secret = "YCsecret";


/**
 *Table Users:
 *    Username
 *    Password
 *    FirstName
 *    LastName
 *    City
 *    Country
 *    Email
 *    Answer1
 *    Answer2
 *    Museums
 *    Nature
 *    Food
 *    NightLife
 */

router.get('/countries', function (req, res) {
    /*fs.readFile('./countries.xml', function (err, data) {
        var json = parser.toJson(data);
        var splitJson = json.split("\"");
        var idx = 0;
        for (var i = 11; i <= splitJson.length; i = i + 8) {
            countriesArr[idx] = splitJson[i];
            idx++;
        }
        console.log(countriesArr);*/
        JSON
        res.status(200).json({ countries: app.getCountries() });
    //});
});

router.post('/register', function (req, res) {
    var username = req.body.username;
    var Password = req.body.Password;
    var error = false;
    var errors = [];
    if (username.length < 3 || username.length > 8) {
        errors[errors.length] = "Username must be 3-8 characters";
        error = true;
    }
    if (Password.length < 5 || Password.length > 10) {
        errors[errors.length] = "Password must be 5-10 characters";
        error = true;
    }
    if (!error) {
        var statement = "select * from Users where UserName = '" + username + "'";
        DButilsAzure.execQuery(statement).then(function (result) {
            if (result.length == 0) {
                var Country = req.body.Country;
                if (app.getCountries().indexOf(Country) < 0) {
                    res.status(400).json({ error: ["Country is not valid"] });
                } else {
                var Firstname = req.body.Firstname;
                var Lastname = req.body.Lastname;
                var City = req.body.City;    
                var Email = req.body.Email;
                var Answer1 = req.body.Answer1;
                var Answer2 = req.body.Answer2;
                var Museums = req.body.Museums;
                var Nature = req.body.Nature;
                var Food = req.body.Food;
                var NightLife = req.body.NightLife;
                var statement2 = "Insert Into Users (Username, Password, FirstName, LastName, City, Country, Email, Answer1, Answer2, Museums, Nature, Food, NightLife) Values ('" + username + "','" + Password + "','" + Firstname + "','" + Lastname + "','" + City + "','" + Country + "','" + Email + "','" + Answer1 + "','" + Answer2 + "'," + Museums + "," + Nature + "," + Food + "," + NightLife + ")";
                DButilsAzure.execQuery(statement2).then(function (result) {
                    JSON
                    res.status(200).send("Done");
                }).catch(function (result) {
                    res.status(400).send(result);
                })
            }
            } else {
                res.status(400).json({ error: ["Username is taken"] });
            }
        }).catch(function (result) {
            res.status(400).send(result);
        })
    } else {
        JSON
        res.status(400).json({ error: errors });
    }
});


router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var statement = "select * from Users where Username = '" + username + "' and Password = '" + password + "'";
    return DButilsAzure.execQuery(statement).then(function (result) {
        if (result.length > 0) {
            var payload = {
                userName: username,
                password: password
            }
            var token = jwt.sign(payload, secret, { expiresIn: "1d" });
            JSON
            res.status(200).json({ token: token });
        } else {
            res.status(400).send("Invalid details");
        }
    }).catch(function (result) {
        res.status(400).send(result);
    })
});


router.post('/password', function (req, res) {
    var username = req.body.userName;
    var answer = req.body.answer;
    var questionIndex = req.body.index;
    var statement = "select Password from Users where Username = '" + username + "'";
    DButilsAzure.execQuery(statement).then(function (result) {
        if (result.length > 0) {
            if (questionIndex == 1 && answer.localecompare(result[0].Answer1) ||
                questionIndex == 2 && answer.localecompare(result[0].Answer2)) {
                res.status(200).json({ result: result[0].Password });
            } else {
                res.status(400).send("Answer not correct");
            }
        } else {
            res.status(400).send("User does not exist");
        }
    }).catch(function (result) {
        res.status(400).send(result);
    })
});


module.exports = router;