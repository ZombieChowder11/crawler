"use strict";
/*
* Web Crawler
* Date: 10.7.2018
* Author: Konstantin Stanoykov
*/
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "https://caseblocks.com/";
var pageToVisit = START_URL;
var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

request(pageToVisit, function(error, response, body) {
  var serverStatus = response.statusCode; // Check status code.
  var $ = cheerio.load(body); //select the website body.

  pagesToVisit.push(START_URL);
  setInterval(crawl,5000);

  function crawl() {
    var nextPage = pagesToVisit.pop();
    if (!nextPage) {
        return;
    } else if (nextPage in pagesVisited) {
      crawl();
    } else {
      visitPage(nextPage, crawl);
    }

  }

  function visitPage(url, callback, body) {
    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    request(url, function(error, response, body) {
       // Check status code (200 is HTTP OK)
       if(response.statusCode !== 200) {
         callback();
         return;
       }else{
         console.log(error);
       }
       // Parse the document body
       var $ = cheerio.load(body);
         collectInternalLinks($);
        
         callback();

    });
  }


  function collectInternalLinks($) {
      var pageTitle = ($('title').text());
      console.log(pageTitle);
      console.log(response.statusCode);
      var relativeLinks = $("a[href^='/']");
      relativeLinks.each(function() {
          pagesToVisit.push(baseUrl + $(this).attr('href'));
      });
  }

});
