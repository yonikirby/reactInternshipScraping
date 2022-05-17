const express = require("express");
const axios = require("axios").default;
const cheerio = require("cheerio");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const path = require("path");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { google } = require("googleapis");
const request = require("request");
const { object } = require("webidl-conversions");

app.use(cors());
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(favicon(__dirname + "/public/images/favicon.ico"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const fs = require('fs')
const articles = [];
const terms = [];
const events = [];
const sadnaot = [];
//const jsdom = require('jsdom')
var DOMParser = require('xmldom').DOMParser;
var parser = new DOMParser();


var myTestTerms = [];
//const jsdom = require("jsdom");


const highTechTermSites = [
    {
      name: "terms-heb",
      address: `https://www.geektime.co.il/startup-and-high-tech-dictionary/`,
      base: "",
    }
    // {
    //   name: 'idc-glossary',
    //   address: `https://www.idc.org/idc/glossary-of-terms`,
    //   base: ''
    // },
  ];

  const educationTermSites = [
    
    {
      name: "levinsky",
      address: `https://www.levinsky.ac.il/מילון-מונחים/`,
      base: "",
    },
    {
      name: 'mcl',
      address: `https://www.mcl.org.il/---c185o`,
      base: ''
    },
    {
      name: 'kehilatmorim',
      address: `https://kehilotmorim.macam.ac.il/מילון-מונחים-קהילות-מקצועיות-לומדות/`,
      base: ''
    },
    {
      name: 'hesegim',
      address: `https://hesegim.org.il/מילון-מושגים-לאקדמיה/`,
      base: ''
    },
    {
      name: 'walla',
      address: `https://news.walla.co.il/item/2648385`,
      base: ''
    },
    
    {
      name: 'giladd',
      address: `http://www.giladd.co.il/48082/מונחון-בתחום-הפרעות-קשב-לקויות-למידה--חינוך-ופסיכולוגיה`,
      base: ''
    },
    
    {
      name: 'stemaianot',
      address: `https://www.stemaianot.com/terms`,
      base: ''
    },
    {
      name: 'eitan',
      address: `http://study.eitan.ac.il/sites/index.php?portlet_id=110546&page_id=92`,
      base: ''
    },
    
    {
      name: "cbs",
      address: `https://www.cbs.gov.il/he/Pages/כל-המונחים.aspx`,
      base: "",
    }
    
    
  ];

const educationTerms = [];

  //var doEducationTerms = async function() { 
//try {
  
    

    function strip(html){
      let doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
   }

/*
    const cbseducationTermSite = [
      {
        name: "cbs",
        address: `https://www.cbs.gov.il/he/Pages/כל-המונחים.aspx`,
        base: "",
      },
    ];*/



    function findTextAndReturnRemainder(target, variable){
      var chopFront = target.substring(target.search(variable)+variable.length,target.length);
      var result = chopFront.substring(0,chopFront.search(";"));
      return result;
  }
 
function writeToFile(){
        var fs = require('fs');

        var file = fs.createWriteStream('C:/Users/yonik/Documents/reactInternshipScraping/bina-api/myjson.txt');
        file.on('error', function(err) { /* error handling */ });
        //write file for string
        //myTestTerms.forEach(function(v) { file.write(JSON.stringify(v) + '\n'); });
        file.end();
}
//optional
const brancoweisseducationTermSite = [
  {
    name: 'brancoweiss',
    address: `https://brancoweiss.org.il/type/%D7%9E%D7%99%D7%9C%D7%95%D7%9F-%D7%9E%D7%95%D7%A0%D7%97%D7%99%D7%9D/`,
    base: ''
  },
  ];

  function reverseString(str) {
    return str.split("").reverse().join("");
  }

  async function getbrancoweissEducationTerm(searchTerm) {
    var doEducationTerms = async function() { 
          var myString = searchTerm.replaceAll(" ", "-");
          //myString = reverseString(myString);
          var url = "https://brancoweiss.org.il/article/" + myString;
          console.log(url);
          url = encodeURI(url)    
          //return url;
          await axios.get(url).then((response) => {
              const html = response.data;
              console.log("hot here")

              const $ = cheerio.load(html);
              
              var description = $('[property=og:description]').attr('content');
              console.log(description);
              return description;

/*
              $("meta", html).each(function () {
                      //if ($(this).attr("property")=="og:description"){
                        //return $(this).attr("content");
                        console.log($(this))
                      //}

              })*/

          })
          
    }
    return doEducationTerms();
  }






/*
highTechTermSites.forEach((term) => {
    axios.get(term.address).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
  
  const url = $(this).attr("href");
  
      if (term.address == "https://www.geektime.co.il/startup-and-high-tech-dictionary/"){
                        $("p", html).each(function () {
                            if ($(this).has("strong")){
                                                            const title = $(this).text();
                                                            console.log("title: " + title)
                                                            if(title.includes("(")){
                                                                console.log("inside big loop")
                                                                                var description = "";
                                                                                var itr = undefined;
                                                                                
                                                                                var continueLoop = true;
                                                                                var currentElement = $(this).next('p');
                                                                                console.log("currentElement.text: " + currentElement.text())
                                                                                while (!($.contains(currentElement.get(0), $('strong')))){  
                                                                                    console.log("in tiny loop")
                                                                                    description += currentElement.text();


                                                                                    currentElement = currentElement.next('p');
                                                                                }


                                                                                
                                                                                
                                                                                terms.push({
                                                                                    title,
                                                                                    description: description,
                                                                                    source: term.name
                                                                                });
                                                                                //console.log("once in big loop and terms: " + JSON.stringify(terms, null, 2))
                                                            }
                                }
                        });
                        console.log("at end and terms: " + JSON.stringify(terms, null, 2))
          }
    });
    
  });

  require('fs').writeFile(

    './myjson.txt',

    JSON.stringify(terms, null, 2),

    function (err) {
        if (err) {
            console.error('Crap happens');
        }
    }
);
  //fs.writeFileSync('C:/myfolder/yonikirbyoutput.txt', terms);*/

  
  /*fs.writeFile('C:/Users/yonik/Documents/reactInternshipScraping/bina-api/myjson.txt', JSON.stringify(terms, null, 2), err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
    console.log("file written successfully")
})


//var fs = require('fs');
//console.log(terms.toString())

/*
var file = fs.createWriteStream('C:/myfolder/yonikirbyoutput.txt');
file.on('error', function(err) { /* error handling  });
terms.forEach(function(v) { file.write(v.join(', ') + '\n'); });
file.end();
*/
//}

///catch {

//}


/*
async function start () {
  return doEducationTerms();
  
  //console.log(result);
}

(async() => {
  console.log('before start');

  await start();
  
  console.log('after start');
})();
*/
//doEducationTerms();






const methodicEducationTermSite = [
  {
    name: "methodic",
    address: `http://methodic.co.il/PublicUI/KnowledgeCenter/Dictionary.aspx?letter=`,
    base: "",
  },
];






async function scrapeMethodicTermSite(){
  console.log("got into scrape function")
  var url = methodicEducationTermSite[0].address;

  const hebrewLetters = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];

  hebrewLetters.forEach(function (letter){
        var modifiedURL = url + letter;//.charCodeAt(0);
        modifiedURL = encodeURI(modifiedURL);
        console.log("modifiedURL: " + modifiedURL);
        var doScraping = async function() { 
          console.log("in async")
          //view-source:http://methodic.co.il/PublicUI/KnowledgeCenter/Dictionary.aspx?letter=%D7%90
            try {
                console.log("in try")
                await axios.get(modifiedURL).then((response) => {
                  console.log("got into axios response");
                  const html = response.data;
                  const $ = cheerio.load(html);
                  
                  $("td", html).each(function () {
                        
                        if ($(this).attr("width")=="145" && $(this).hasClass("font_blue")){
                            var title = $(this).text();
                            var description = $(this).prev().text();
                            educationTerms.push({
                              title,
                              description: description,
                              source: methodicEducationTermSite[0].name
                              });
                              console.log("right after push")
                        }


                  })
                  var file = fs.createWriteStream('C:/Users/yonik/Documents/reactInternshipScraping/bina-api/myjson.txt');
                  file.on('error', function(err) { console.log("error writing file")/* error handling */ });
                  educationTerms.forEach(function(v) { file.write(JSON.stringify(v) + '\n'); });
                  file.end();
                  
                 

                 
                })
            }
            catch(e) {
                console.log("error: " + e);
            }

        }
        doScraping();
        

  })


/*
  function strip(html){
    let doc = parser.parseFromString(html, 'text/html');
    return doc.textContent || "";
 }
*/


  //console.log(JSON.stringify(educationTerms, null, 2));
  //console.log("secondaryCount: " + secondaryCount);
  /*var fs = require('fs');

  var file = fs.createWriteStream('C:/Users/yonik/Documents/reactInternshipScraping/bina-api/myjson.txt');
  file.on('error', function(err) { /* error handling */ //});
  //educationTerms.forEach(function(v) { file.write(JSON.stringify(v) + '\n'); });
  //file.end();





}

//doEducationTerms();


//console.log("אולפן המשך:" + getCBSEducationTerm("אולפן המשך"));
//console.log("ישיבה גבוהה:" + getCBSEducationTerm("ישיבה גבוהה"));
//console.log("עזיבת התלמיד את בית הספר:" + getCBSEducationTerm("עזיבת התלמיד את בית הספר"));


//getCBSEducationTerms();
//console.log(getCBSEducationTerm());

//console.log("למידה טובה:" + getbrancoweissEducationTerm("חשיבה לטראלית"));




function doEducationTermsFinal(){

  educationTermSites.forEach((term) => {
    (async() => {
      var myURL = encodeURI(term.address);
      await axios({method:'GET', url:myURL, responseType:'arraybuffer', responseEncoding: 'binary'}).then((response) => {
         var decoder;
         var html;
          if (term.name == "eitan"){
              decoder = new TextDecoder('CP1255');
              html = decoder.decode(response.data);
         }
         else {
              decoder = new TextDecoder('utf8');
              html = decoder.decode(response.data);
         }
        
  
                              const $ = cheerio.load(html);
  
  
                              
                                            if (term.name == "levinsky"){
                                                $(".elementor-heading-title", html).each(function () {
                                                    
                                                                                    const title = $(this).text();
                                                                                    var description = "";
  
                                                                                    var sibling = $(this).parent().parent().next().children(":first").children(":first").find('p');
  
                                                                                    
                                                                                    description = sibling.text();
  
                                                                                    if (description != ""){
                                                                                          educationTerms.push({
                                                                                          title,
                                                                                          description: description,
                                                                                          source: term.name
                                                                                          });
                                                                                    }
                                                                
  
                                                });
  
                                                
  
                                            }
                                            else if (term.name == "mcl"){
  
                                                            
                                                            
  
                                                            var h2Count = 0;
                                                            var richTextCount = 0;
                                                            var secondaryCount = 0;
                                                            $("div", html).each(function () {
                                                                        
                                                                        if ($(this).data("testid")=="richTextElement"){
                                                                            
                                                                            if ($(this).find('h2').length == 1){
                                                                                    h2Count++;
                                                                                   
  
                                                                                    var myContainingElement = $(this).find('h2').children(":first").children(":first").children(":first").children(":first").children(":first");
                                                                            
                                                                                    
                                                                                    
                                                                                    var title = myContainingElement.text();
  
                                                                                    var myGrandParent = $(this).closest("div");
                                                                                    var myNextElementParent = myGrandParent.next();
                                                                                    
                                                                                   
  
                                                                                    var descriptionElement = myNextElementParent.children(":first").children(":first");
                                                                                    
  
                                                                                   
                                                                                    
  
                                                                                  
                                                                                    if (descriptionElement!=null){
                                                                                        
                                                                                        secondaryCount++;
                                                                                    }
  
                                                                                    var description = descriptionElement.text();
                                                                                    
                                                                                    
                                                                                    if (description != ""){
                                                                                              educationTerms.push({
                                                                                                  title,
                                                                                                  description: description,
                                                                                                  source: term.name
                                                                                              });
                                                                                      }
                                                                                   
                                                                            }
                                                                        }
  
  
  
                                                            })
                                                            
                                            }
  
  
                                            else if (term.name == "kehilatmorim"){
                                              
  
                                                        $("li", html).each(function () {
                                                                if($(this).has('strong')){
                                                                              var myStrong = $(this).find('strong');
                                                                              var title = "";
                                                                              if (myStrong.has('a')){
                                                                                  title += myStrong.find('a').text();
                                                                              }
  
                                                                              title += myStrong.text();
                                                                              var description = $(this)
                                                                                                .clone()    //clone the element
                                                                                                .children() //select all the children
                                                                                                .remove()   //remove all the children
                                                                                                .end()  //again go back to selected element
                                                                                                .text();
  
                                                                            if(title != "" && description != ""){
                                                                                    educationTerms.push({
                                                                                      title,
                                                                                      description: description,
                                                                                      source: term.name
                                                                                    });
                                                                                    
                                                                              }
                                                                    }
                                                          
                                                        })
  
  
  
                                                   
                                          }
                                          else if (term.name == "hesegim"){
                                            
  
  
                                                  $(".elementor-heading-title", html).each(function () {
                                                                var title = $(this).text();
                                                                var description = $(this).parent().parent().next().text();
                                                                if (description != ""){
                                                                        educationTerms.push({
                                                                          title,
                                                                          description: description,
                                                                          source: term.name
                                                                        });
                                                                }
  
  
                                                   });
                                                   
                                          }
                                          else if (term.name == "walla"){
                                            
    
    
                                                  $(".css-17z1jm5", html).each(function () {
                                                                var title = $(this).text();
                                                                var description = $(this).next().text();
                                                                if (description != ""){
                                                                        educationTerms.push({
                                                                          title,
                                                                          description: description,
                                                                          source: term.name
                                                                        });
                                                                        
                                                                        
                                                                }
                                                                
    
                                                  });
                                                  
                                                  
                                          }
                                          else if (term.name == "stemaianot"){
                                            
  
  
                                                          $("span", html).each(function () {
                                                                  if($(this).css("text-decoration")=="underline"
                                                                        && $(this).children(":first").children(":first").css("font-family")=="atlas-aaa-500,sans-serif"
                                                                        && $(this).text() != "איך זה נראה?"){
                                                                            
                                                                                            var title = $(this).text();
                                                                                 
                                                                                            var description = $(this).parent().next().text().trim();
                                                                                      if (description != ""){
                                                                                                        educationTerms.push({
                                                                                                          title,
                                                                                                          description: description,
                                                                                                          source: term.name
                                                                                                        });
                                                                                                        
                                                                                                        
                                                                                      }
                                                                     
                                                                              
  
                                                                };
                                                              });
  
                                                              
                                                                
                                              }
  
                                          
                                              else if (term.name == "giladd"){
                                                
                                                
                                                
                                                var startIndex = -1;
                                                var startIndex2 = -1;
                                                var startIndex3 = -1;
                                                var endIndex = -1;
                                                var endIndex2 = -1;
                                                var title = "";
                                                var description = "";
                                                var tempDescription = "";
                                                var brStartIndex = -1;
                                                var tempDescriptionFirstPart = "";
                                                var tempDescriptionLastPart = "";
                                                var mySubString = "";
                                                var myStartArray = [];
                                                var continueLoop = true;
                                                var myVar = 0;
                                                var isLongNode = false;
                                                var myEndArray = [];
                                                var isSpecialTitleEnd = false;
  
                                                var myHtml = html.toString();
                                                
                                                while (myHtml.includes("<u><strong>") || myHtml.includes("<strong><u>") || myHtml.includes('<u style="font-size: 18px;"><strong>')){
                                                          startIndex = myHtml.indexOf("<u><strong>");
                                                          startIndex2 = myHtml.indexOf("<strong><u>");
                                                          startIndex3 = myHtml.indexOf('<u style="font-size: 18px;"><strong>');
                                                          
                                                          
                                                          
  
                                                          isLongNode = false;
  
                                                          isSpecialTitleEnd = false;
  
                                                          if (startIndex3 != -1){
                                                                if (startIndex == -1){
                                                                    if (startIndex2 == -1){
                                                                        isLongNode = true;
                                                                    }
                                                                    else{
                                                                        if (startIndex3 < startIndex2){
                                                                          isLongNode = true;
                                                                          
                                                                        }
                                                                    }
                                                                }
                                                                else if (startIndex2 == -1) {
                                                                    if (startIndex == -1){
                                                                        isLongNode = true;
                                                                    }
                                                                    else { 
                                                                      if (startIndex3 < startIndex){
                                                                        isLongNode = true;
                                                                      }
                                                                    }
  
                                                                }
                                                                else { //all three are present;
                                                                  if (startIndex3 < startIndex && startIndex3 < startIndex2){
                                                                      isLongNode = true;
                                                                  }
  
                                                                }
                                                          }
  
                                                          myStartArray = [startIndex, startIndex2, startIndex3];
                                                        
                                                          myStartArray.sort(function(a, b) {
                                                            return a - b;
                                                          });
                                                          
                                                         
                                                          
  
                                                          continueLoop = true;
                                                          myVar = 0;
                                                          while (continueLoop == true){
                                                              if (myStartArray[myVar] != -1){
                                                                startIndex = myStartArray[myVar];
                                                                break;
                                                              }
                                                              else {
                                                                myVar++;
                                                              }
                                                          }
                                                          
                                                          
                                                          
                                                          if (!isLongNode){
                                                            myHtml = myHtml.substring(startIndex + 11);
                                                          }
                                                          else {
                                                            myHtml = myHtml.substring(startIndex + 36);
                                                          }
  
                                                          endIndex = myHtml.indexOf("</strong></u><br");
                                                          endIndex2 = myHtml.indexOf("</u></strong><br");
                                                          endIndex3 = myHtml.indexOf("</strong></u></p>");
  
  
                                                          if (endIndex3 != -1){
                                                              if (endIndex != -1 && endIndex2 != -1){
                                                                  if (endIndex3 < endIndex2 && endIndex3 < endIndex){
                                                                      isSpecialTitleEnd = true;
                                                                  }
                                                                  
                                                              }
                                                              else if (endIndex != -1 && endIndex2 == -1) {
                                                                  if (endIndex3 < endIndex){
                                                                      isSpecialTitleEnd = true;
                                                                  }
                                                              }
                                                              else if (endIndex2 != -1 && endIndex == -1){
                                                                  if (endIndex3 < endIndex2){
                                                                      isSpecialTitleEnd = true;
                                                                  }
                                                              }
                                                              else {//both one and two are -1
                                                                      isSpecialTitleEnd = true;
                                                              }
  
                                                          }
  
  
                                                          myEndArray = [endIndex, endIndex2, endIndex3];
                                                          
                                                          
                                                          myEndArray.sort(function(a, b) {
                                                            return a - b;
                                                          });
                                                          
                                                          
                                                          
                                                          continueLoop = true;
                                                          myVar = 0;
                                                          while (continueLoop == true){
                                                              if (myEndArray[myVar] != -1){
                                                                endIndex = myEndArray[myVar];
                                                                break;
                                                              }
                                                              else {
                                                                myVar++;
                                                              }
                                                          }
  
                                                          title = myHtml.substring(0, endIndex);
                                                          
                                                          
  
                                                          title = title.replaceAll('&nbsp;', ' ');
                                                          title = title.replaceAll('&ndash;', '–');
                                                          title = title.replaceAll('&quot;', '"');
                                                          title = title.replaceAll('&#39', '\'');
                                                          
                                                          const regex = /(<([^>]+)>)/ig
                                                          
                                                          title = title.replace(regex, "");
  
  
                                                          if (!isSpecialTitleEnd){
                                                          myHtml = myHtml.substring(endIndex + 13);
  
                                                          }
                                                          else {
                                                            myHtml = myHtml.substring(endIndex + 13);
                                                          }
                                                          endIndex = myHtml.indexOf("<u><strong>");
                                                          
                                                          endIndex2 = myHtml.indexOf("<strong><u>");
  
                                                          endIndex3 = myHtml.indexOf('<u style="font-size: 18px;"><strong>');
  
                                                          if (endIndex == -1 && endIndex2 == -1 && endIndex3 == -1){
                                                            endIndex =  myHtml.indexOf("</span>");
                                                          }
                                                          else {
                                                                    myEndArray = [endIndex, endIndex2, endIndex3];
                                                                    
                                                                    myEndArray.sort(function(a, b) {
                                                                      return a - b;
                                                                    });
                                                                    
                                                                    
                                                                    
                                                                    continueLoop = true;
                                                                    myVar = 0;
                                                                    while (continueLoop == true){
                                                                        if (myEndArray[myVar] != -1){
                                                                          endIndex = myEndArray[myVar];
                                                                          break;
                                                                        }
                                                                        else {
                                                                          myVar++;
                                                                        }
                                                                    }
                                                            }
                                                          tempDescription = myHtml.substring(0, endIndex);
                                                          tempDescription = tempDescription.trim();
  
  
                                                          tempDescription = tempDescription.replaceAll('<br />', ' ');
                                                          tempDescription = tempDescription.replaceAll('\r', '');
                                                          tempDescription = tempDescription.replaceAll('\n', '');
                                                          tempDescription = tempDescription.replaceAll('\t', '');
                                                          tempDescription = tempDescription.replaceAll('&nbsp;', ' ');
                                                          tempDescription = tempDescription.replaceAll('&ndash;', '–');
                                                          tempDescription = tempDescription.replaceAll('&quot;', '"');
                                                          tempDescription = tempDescription.replaceAll('&#39', '\'');
                                                          
                                                          
                                                          tempDescription = tempDescription.replace(regex, "");
  
                                                          //condense multiple spaces into one
                                                          tempDescription = tempDescription.replace(/\s\s+/g, ' ');
  
                                                          tempDescription = tempDescription.trim();
                                                         
  
                                                          description = tempDescription;
  
  
                                                          educationTerms.push({
                                                            title,
                                                            description: description,
                                                            source: term.name
                                                          });
                                                          
                                                          
  
                                                  }
  
                                                        
                                                }
                                                else if (term.name == "cbs"){
                                                  var startIndexOfJSONString;
                                                  var endIndex;
                                                  
                                                  var result = [];
                                                  var myDescription;
                                                  var textArray = [];
                                                  var myNode = [];
                                                  var title = "";
                                                  var description = "";
                              
                              
                                                  $('script').each( function () {
                                                      const text = $(this).html();    
                                                     
                                                      var startIndex = text.indexOf("var DictionarydataList =");
                                                      if (startIndex != -1){
                                                        startIndexOfJSONString = startIndex + 25;
                                                        endIndex = text.indexOf("'", startIndexOfJSONString + 2);
                                                        const myJSONString = text.substring(startIndexOfJSONString, text.length - 2);//was endIndex - 1
                                                        const myJSONStringUpdated = myJSONString.replaceAll('\\\\', '\\');
                                                        
                                                        const myJSONStringUpdatedMore = myJSONStringUpdated.replaceAll('\'', '\\\'');
                                                        var myTestString = myJSONStringUpdatedMore.substring(21420,21430);
                              
                                                        result = JSON.parse(myJSONStringUpdatedMore);
                              
                                                        var myPart;
                                                        Object.keys(result).forEach(function(key) {
                                                            
                                                                    myPart = result[key];
                                                            
                                                                    title = myPart["Title"].trim();
                                                                    description = myPart["CbsTermDefinition"];
                              
                                                            
                                                                    educationTerms.push({
                                                                      title,
                                                                      description: description,
                                                                      source: term.name
                                                                    });
                                                                    
                                                                    
                              
                              
                                                                  
                                                        })
                                                        
                              
                                                        
                                                      }
                              
                                                  });
                                                  
                                                } 
                                                else if (term.name == "eitan"){
                                                  var title = "";
                                                  var description = "";
                                                  
                                                  var tempNode;
                                                  var doSecondPart = false;
                                                  var myElement;
                                                  var myCounter = 0;
                                                  var doInnerCondition = true;
                                                    $("P", html).each(function () {
                                                      
                                                        if($(this).css("MARGIN")=="0cm 0cm 0pt" || $(this).css("LINE-HEIGHT")=="150%"
                                                        
                                                        || $(this).css("MARGIN")=="0cm 0cm 0pt 36pt"
                                                          )
                                                          {
                                                            
                                                                            title = "";
                                                                            description = "";
                                                                            doSecondPart = true;
        
        
                                                                            doInnerCondition = true;
        
                                                                            
                                                                                      title = "";
                                                                                      description = "";
        
                                                                                      var continueFunction = true;
                                                                                      
                                                                                                    var alreadyIterated = false;
                                                                                                  $(this).find("strong").each(function () {
                                                                                                              
                                                                                                                              if ($(this).text().trim().length > 0){
                                                                                                                                  
                                                                                                                                  title += $(this).text().trim();
                                                                                                                                  $(this).text("");
                                                                                                                                  
                                                                                                                                  
        
                                                                                                                                  
                                                                                                                              }
                                                                                                                              if ($(this).parent()[0].name == "p"){
                                                                                                                                
                                                                                                                                description = $(this).parent().find("strong").remove().end().text();
                                                                                                                              }
                                                                                                                              
                                                                                                                              if (title.length > 0 && !alreadyIterated){
                                                                                                                        if ( $(this).parent().parent().length > 0 && $(this).parent().parent()[0].name == "span"){ 
                                                                                                                                  
                                                                                                                                  description += $(this).parent().parent().find("strong").remove().end().text();
                                                                                                                    
                                                                                                                                }
                                                                                                                        else if ($(this).parent().parent().length > 0 && $(this).parent().parent()[0].name == "p"){
                              
                              
                                                                                                                                    $(this).parent().parent().children().each(function(element){
                                                                                                                                      if ($(element).name != "strong"){description += $(this).text();}
        
                                                                                                                                    })
                                                                                                                                  }
                                                                                                                                else if ($(this).parent().length > 0 && $(this).parent()[0].name == "p"){
                                                                                                                                  
                                                                                                                                  $(this).parent().children().each(function(element){
                                                                                                                                    if ($(element).name != "strong"){description += $(this).text();}
        
                                                                                                                                  })
                                                                                                                                
                                                                                                                                }
        
        
                                                                                                                                  }
                                                                                                                      
                                                                                                             
                                                                                                          })
                                                                                                  
                                                                                                  var continueSubLoop = true;
                                                                                                  if (title.length > 0 && description.length > 0) {continueFunction = false;}
        
                                                                                                  if ($(this).find("b").length == 0){
                                                                                                  continueFunction && $(this).find("span").each(function (i, element) {
                                                                                                        if (continueSubLoop){
                                                                                                                  $(element).find("strong").each(function () {
                                                                                                                    
                                                                                                                      if ($(this).text().trim().length > 1){
                                                                                                                          title += $(this).text().trim();
                                                                                                                          
                                                                                                                          $(this).text("");
                                                                                                                          continueSubLoop = false;
                                                                                                                      }
                                                                                                                  })
                                                                                                                
                                                                                                                                if ($(element).find("strong").length == 0){
                                                                                                                                    
                                                                                                                                    description += $(element).text();
        
                                                                                                                                }
        
                                                                                                                       
                                                                                                                  }
                                                                                                         
                                                                                                                      
                                                                                                          
                                                                                                  })
                                                                                                  }
                                                                                                  if (title.length > 1 && description.length > 0) {continueFunction = false;}
                                                                                                  continueFunction && $(this).find("b").each(function (i, element) {
                                                                                                    if ($(element).text().trim().length > 0){
                                                                                                        title += $(element).text().trim();
                                                                                                        $(this).text("");
                                                                                                       
                                                                                                    }
                                                                                                   
                                                                                                    if (title.length > 0) {
                                                                                                      continueFunction = false;
                                                                                                      
                                                                                                        $(element).parent().children("b").remove().end().each(function(){
                                                                                                            description += $(this).text();
                                                                                                        })
                                                                                                    
                                                                                                    }
                                                                                                    
                                                                                                  })
                                                                                                  
                                                                                                  var alreadyDoneDescription = false;
                                                                                                  $(this).find("b").each(function (i, element) {
        
                                                                                                          $(element).find("span").each(function () {
                                                                                                              if ($(this).text().trim().length > 0){
                                                                                                                  title += $(this).text().trim();
                                                                                                                  
                                                                                                                  $(this).text("").end();
                                                                                                              }
                                                                                                              $(element).text("");
                                                                                                          })
                                                                                                          
                                                                                                          if (title.length > 0 && !alreadyDoneDescription) {
                                                                                                            
                                                                                                              continueFunction = false;
        
                                                                                                                  
                                                                                                                  if ($(element).parent()[0].name == "p"){
                                                                                                                    description = $(element).parent().find("b").remove().end().text();
                                                                                                                  }
        
                                                                                                              alreadyDoneDescription = true;
                                                                                                          
                                                                                                          }
                                                                                                          
                                                                                                  })
                                                                                                  
                                                                                  if (title.length > 1) {
        
        
                                                                                        
                                                                              
                                                                                                          educationTerms.push({
                                                                                                            title,
                                                                                                            description: description,
                                                                                                            source: term.name
                                                                                                          });
                                                                                                          
                                                                                                          
                                                                                      }
                                                          
                                                        }
                                                        });
                                                      
                                                } 
                                                    
                            });
  
                            var file = fs.createWriteStream('./myjson.txt');
                            file.on('error', function(err) { /* error handling */ });
                            educationTerms.forEach(function(v) { file.write("123451232: " + JSON.stringify(v, null, 2) + "\n"); });
                            file.end();
        })();
    });

}

 




doEducationTermsFinal();