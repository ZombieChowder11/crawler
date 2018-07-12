"use strict";
/*
* Web Crawler
* Date: 10.7.2018
* Author: Konstantin Stanoykov
*/
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parser');
var fs = require('fs');
var csv = require('fast-csv');
var ws = fs.createWriteStream('crawlerData.csv');

/* Provided URL to crawl */
var pageToVisit = "https://www.caseblocks.com/";

  request(pageToVisit, function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }

    var serverStatus = response.statusCode; // Check status code.
    var $ = cheerio.load(body); //select the website body.
    var pageTitle = ($('title').text()); //select the page title.
    if(response.statusCode === 200) {
      // Parse the document title.
      console.log("Page title:  " + $('title').text());
    }
      // Writing to the CSV File.
      // csv comes from the 'fast-csv' module.
    csv
      .write([
        ["Page Visiting:" + pageToVisit],
        ["Response Status:" + serverStatus],
        ["Page Title:" + pageTitle]
      ],{headers:true})
      .pipe(ws);
    });
