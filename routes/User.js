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
        JSON
        res.status(200).json({ countries: app.getCountries() });
});

router.post('/register', function (req, res) {
    var username = req.query.username;
    var Password = req.query.Password;
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
        var statement = "select * from Users where Username = '" + username + "'";
        DButilsAzure.execQuery(statement).then(function (result) {
            if (result.length == 0) {
                var Country = req.query.Country;
                if (app.getCountries().indexOf(Country) < 0) {
                    res.status(400).json({ error: ["Country is not valid"] });
                } else {
                var Firstname = req.query.Firstname;
                var Lastname = req.query.Lastname;
                var City = req.query.City;    
                var Email = req.query.Email;
                var Answer1 = req.query.Answer1;
                var Answer2 = req.query.Answer2;
                var Museums = req.query.Museums;
                var Nature = req.query.Nature;
                var Food = req.query.Food;
                var NightLife = req.query.NightLife;
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
    var username = req.query.username;
    var answer = req.query.answer;
    var questionIndex = req.query.index;
    var statement = "select * from Users where Username = '" + username + "'";
    DButilsAzure.execQuery(statement).then(function (result) {
        if (result.length > 0) {
            console.log("Answer1 is: " + result[0].Answer1);
            console.log("Answer2 is: " + result[0].Answer2);
            console.log("User answer is: " + answer);
            console.log("Question index is: " + questionIndex);
            console.log("Username is: " + username);
            if (questionIndex == 1 && answer == result[0].Answer1 ||
                questionIndex == 2 && answer == result[0].Answer2) {
                res.status(200).json({ result: result[0].Password });
            } else {
                res.status(400).send("Answer not correct");
            }
        } else {
            res.status(400).send("User does not exist");
        }
    }).catch(function (result) {
        console.log("Error !!! " + result);
        res.status(400).send(result);
    })
});


module.exports = router;