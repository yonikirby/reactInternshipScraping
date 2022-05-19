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
const fs = require('fs')

app.use(cors());
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(favicon(__dirname + "/public/images/favicon.ico"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var reqTimer = setTimeout(function wakeUp() {
  request("https://milgot-api.herokuapp.com/", function () {
    console.log("WAKE UP DYNO");
  });
  return (reqTimer = setTimeout(wakeUp, 1200000));
}, 1200000);

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb+srv://yonatan1261:Dimoy2021@cluster0.pfw9n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  console.log("mongoose connected"),
  {
    useNewUrlParser: true,
    useFindAndModify: false,
  }
);

const MyModel = mongoose.model(
  "Milgot",
  new Schema({ name: String, adress: String, base: String, ForWho: String })
);

const UsersModel = mongoose.model(
  "Users",
  new Schema({ name: String, studies: String, number: String })
);

const TermModel = mongoose.model(
  "Terms",
  new Schema({ title: String, description: String })
);

const myEducationTerms = [];


const newspapers = [
  {
    name: "NoCamels",
    address: `https://nocamels.com/category/technology/`,
    base: "",
  },
  {
    name: "Calcalist",
    address: `https://www.calcalistech.com/ctech/home/0,7340,L-5211,00.html`,
    base: "",
  },
  {
    name: "TimesOfIsrael",
    address: `https://www.timesofisrael.com/tech-israel/`,
    base: "",
  },
  {
    name: "TimesOfIsrael",
    address: `https://www.timesofisrael.com/israel-inside/`,
    base: "",
  },
  {
    name: "Haaretz",
    address: `https://www.haaretz.com/israel-news/tech-news`,
    base: "",
  },
  {
    name: "כלכליסט",
    address: `https://www.calcalist.co.il/calcalistech`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/category/startup/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/category/development/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/channel/cloud-and-clear/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/channel/human-resources/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/channel/dev-bible/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/channel/future-of-tech/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/channel/dev-bible/`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.geektime.com/`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.geektime.com/tag/startups/`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.geektime.com/tag/investments/`,
    base: "",
  },
  {
    name: "Mako",
    address: `https://www.mako.co.il/news-business/news`,
    base: "",
  },
  {
    name: "Mako",
    address: `https://www.mako.co.il/news-business/news?page=2`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.mako.co.il/news-business/news?page=3`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.mako.co.il/news-business/news?page=4`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.mako.co.il/news-business/news?page=5`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.mako.co.il/news-business/news?page=6`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.mako.co.il/news-business/news?page=7`,
    base: "",
  },
];

const highTechTermSites = [
  {
    name: "terms-heb",
    address: `https://www.geektime.co.il/startup-and-high-tech-dictionary/`,
    base: "",
  },
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

//finished search function for this site
const methodicEducationTermSite = [
  {
    name: "methodic",
    address: `http://methodic.co.il/PublicUI/KnowledgeCenter/Dictionary.aspx?letter=`,
    base: "",
  },
];



//finished search function for this site
const brancoweissEducationTermSite = [
{
  name: 'brancoweiss',
  address: `https://brancoweiss.org.il/type/מילון-מונחים/`,
  base: ''
},
];


//gets from this site: https://brancoweiss.org.il/type/מילון-מונחים/
async function getbrancoweissEducationTerm(searchTerm) {
  const doEducationTerms = async function() { 
        var myString = searchTerm.replaceAll(" ", "-");
        //myString = reverseString(myString);
        var url = "https://brancoweiss.org.il/article/" + myString;
        
        url = encodeURI(url)    
        //return url;
        const doAxios = await axios.get(url).then((response) => {
            const html = response.data;
            

            const $ = cheerio.load(html);
            
            var description = $('[property=og:description]').attr('content');
            
            return description;


        })

        return doAxios;
        
  }
  return await doEducationTerms();//Promise.resolve()
}

function reverseString(str) {
  return str.split("").reverse().join("");
}

  

//for later development
// const englishEducationTermSites = [
//   {
//     name: "oxford-b",
//     address: `https://www.oxfordreference.com/view/10.1093/acref/9780199212064.001.0001/acref-9780199212064?btog=chap&hide=true&page=${pageNumber}&pageSize=20&skipEditions=true&sort=titlesort&source=%2F10.1093%2Facref%2F9780199212064.001.0001%2Facref-9780199212064`,
//     base: "",
//   },
  
// ];

const articles = [];
const terms = [];
const events = [];
const sadnaot = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $("a", html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});
app.get("/favicon.ico", (req, res) => res.status(204));

app.get("/", (req, res) => {
  res.json("BerlBot's API");
});

const educationTerms = [];



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

                          scrapeMethodicTermSite();


                          var file = fs.createWriteStream('./myeducationterms.txt');
                          file.on('error', function(err) { /* error handling */ });
                          educationTerms.forEach(function(v) { 
                            myEducationTerms.push(JSON.stringify(v, null, 2));
                            file.write(JSON.stringify(v, null, 2) + "\n"); });
                          file.end();
      })();
  });
  
   


  async function scrapeMethodicTermSite(){
    
    var url = methodicEducationTermSite[0].address;
  
    const hebrewLetters = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];
  
    hebrewLetters.forEach(function (letter){
          var modifiedURL = url + letter;
          modifiedURL = encodeURI(modifiedURL);
          
          var doScraping = async function() { 
            
            
              try {
                  
                  await axios.get(modifiedURL).then((response) => {
                    
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
                                
                          }
  
  
                    })
                 
                   
                  })
              }
              catch(e) {
                  console.log("error: " + e);
              }
  
          }
          doScraping();
          
  
    })
  
  
  
  
  }







highTechTermSites.forEach((term) => {
  axios.get(term.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);



    if (term.address == "https://www.geektime.co.il/startup-and-high-tech-dictionary/"){
                      $("p", html).each(function () {
                          if ($(this).has("strong")){
                                                const title = $(this).text();
                                                
                                                if(title.includes("(")){
                                                    
                                                                    var description = "";
                                                                    var itr = undefined;
                                                                    
                                                                    var continueLoop = true;
                                                                    var currentElement = $(this).next('p');
                                                                    
                                                                    while (!($.contains(currentElement.get(0), $('strong')))){  
                                                                       
                                                                        description += currentElement.text();


                                                                        currentElement = currentElement.next('p');
                                                                    }


                                                                    
                                                                    
                                                                    terms.push({
                                                                        title,
                                                                        description: description,
                                                                        source: term.name
                                                                    });
                                                                    
                                                }
                              }
                      });

                      var file = fs.createWriteStream('./myhightechterms.txt');
                      file.on('error', function(err) { /* error handling */ });
                      terms.forEach(function(v) { file.write(JSON.stringify(v, null, 2) + "\n"); });
                      file.end();
                      
        }
  });
  
});



/*highTechTermSites.forEach((term) => {
  axios.get(term.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);



    if (term.address == "https://www.geektime.co.il/startup-and-high-tech-dictionary/"){
                      $("p strong", html).each(function () {
                                  const title = $(this).text();
                                  const description = "";
                                  while(itr = $this.next("p")){
                                      if (itr.has('strong').length && itr.text().includes("(")){
                                        break;
                                      }
                                      else {
                                        description += itr.text;
                                      }
                                  }
                                  
                                  
                                    terms.push({
                                      title,
                                      description: description,
                                      source: term.name,
                                    });
                      });
                      
        }
  });
});

/*
p.foreach
if ($(this).text().includes("(")) {
                                    const title = $(this).text();
                                    const secondTitle = title.substr(0, title.indexOf("."));
                                    const description = $(this).next("p").text();
                                    terms.push({
                                      title,
                                      description: description,
                                      source: term.name,
                                    });
                                  }*/


// educationTermSites.forEach((term) => {
//   axios.get(term.address).then((response) => {
//     const html = response.data;
//     const $ = cheerio.load(html);

//     $("p", html).each(function () {
//       if ($(this).text().includes("(")) {
//         const title = $(this).text();
//         const secondTitle = title.substr(0, title.indexOf("."));
//         const description = $(this).next("p").text();
//         terms.push({
//           title,
//           description: description,
//           source: term.name,
//         });
//       }
//     });
//   });
// });

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/terms", (req, res) => {
  res.json(terms);
});

app.get("/events", (req, res) => {
  res.json(events);
});
app.get("/sadnaot", (req, res) => {
  res.json(events);
});

app.post("/term/add", async (req, res) => {
  new TermModel(req.body);

  TermModel.save;

  let termModel = new TermModel({
    title: req.body.title,
    description: req.body.description,
  });
  TermModel = await TermModel.save();
  res.send(termModel);
});

app.get("/news/:word/title", (req, res) => {
  console.log(terms);
  const word =
    req.params.word === "random"
      ? terms[Math.floor(Math.random() * terms.length)].title
      : req.params.word;
  const articleResult = articles.filter((article) =>
    article.title.includes(word)
  );
  const termResult = terms.filter((term) => term.title.includes(word));
  const example =
    articleResult.length > 0
      ? articleResult[0].title
          .replace(/ +(?= )/g, "")
          .replace(/(\r\n|\n|\r)/gm, "")
          .trim()
      : "אין דוגמה לכתבה";
  if (articleResult.length > 0) {
    const response = `${termResult[0].title} - ${termResult[0].description} - כתבה לדוגמה: משעה ${example}`;
    res.json(response);
  } else {
    const response = `${termResult[0].title} - ${termResult[0].description}`;
    res.json(response);
  }
});

app.get("/news/:word/description", (req, res) => {
  const word = req.params.word;
  const articleResult = articles.filter((article) =>
    article.title.includes(word)
  );
  const termResult = terms.filter((term) => term.title.includes(word));
  const example = articleResult[0].title
    .replace(/ +(?= )/g, "")
    .replace(/(\r\n|\n|\r)/gm, "")
    .trim();
  if (articleResult.length > 0) {
    res.json(termResult[0].description);
  } else {
    res.json(termResult);
  }
});

app.get("/news/:word/example", (req, res) => {
  const word = req.params.word;
  const articleResult = articles.filter((article) =>
    article.title.includes(word)
  );
  const termResult = terms.filter((term) => term.title.includes(word));
  const example = articleResult[0].title
    .replace(/ +(?= )/g, "")
    .replace(/(\r\n|\n|\r)/gm, "")
    .trim();
  if (articleResult.length > 0) {
    res.json(example);
  } else {
    res.json(termResult);
  }
});

// user data
app.post("/user/add", async (req, res) => {
  new UsersModel(req.body);

  UsersModel.save;

  let usersModel = new UsersModel({
    name: req.body.name,
    studies: req.body.studies,
    number: req.body.number,
  });
  usersModel = await usersModel.save();
  res.send(usersModel);
});

app.get("/users", (req, res) => {
  UsersModel.find({}, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
});

app.get("/users/:number/name", (req, res) => {
  const data = UsersModel.find(
    {
      number: req.params.number,
    },
    (err, data) => {
      if (data.length > 0) {
        res.send(data[0].name);
      } else {
        res.json(err);
      }
    }
  );
});

app.get("/users/:number/studies", (req, res) => {
  const data = UsersModel.find(
    {
      number: req.params.number,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data[0].studies);
      }
    }
  );
});

app.get("/milgot", (req, res) => {
  MyModel.find({}, (err, milgot) => {
    if (err) {
      res.send(err);
    } else {
      res.json(milgot);
    }
  });
});
app.get("/milgot/:name/:number", (req, res) => {
  const regex = new RegExp(req.params.name, "i");
  MyModel.find(
    {
      ForWho: { $regex: regex },
    },
    (err, milgot) => {
      if (err) {
        res.send(err);
      } else {
        res.json(
          milgot[req.params.number].name +
            "בלינק הבא:" +
            milgot[req.params.number].adress
        );
      }
    }
  );
});
app.get("/length/:name", (req, res) => {
  const regex = new RegExp(req.params.name, "i");
  MyModel.find(
    {
      ForWho: { $regex: regex },
    },
    (err, milgot) => {
      if (err) {
        res.send(err);
      } else {
        res.json(milgot.length);
      }
    }
  );
});

app.get("/milgot/:milgaId", (req, res) => {
  const data = MyModel.find(
    {
      base: req.params.milgaId,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    }
  );
});

app.get("/milgot/:milgaId/:forwho", (req, res) => {
  const data = MyModel.find(
    {
      base: req.params.milgaId,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        data.map((milga) => {
          if (milga.ForWho) {
            milga.ForWho.includes(req.params.forwho) && res.json(milga);
          }
        });
      }
    }
  );
});

app.get("/milgot/forwho/:data", (req, res) => {
  const data = MyModel.find(
    {
      ForWho: req.params.milgaId,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    }
  );
});

app.get("/milgot/id/:id", (req, res) => {
  const data = MyModel.findOne(
    {
      _id: req.params.id,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    }
  );
});

app.post("/milgot/add", async (req, res) => {
  new MyModel(req.body);

  MyModel.save;

  let myModel = new MyModel({
    name: req.body.name,
    adress: req.body.address,
    base: req.body.base,
    ForWho: req.body.ForWho,
  });
  myModel = await myModel.save();
  res.send(myModel);
});

app.delete("/milgot/delete/:id", (req, res) => {
  MyModel.findByIdAndRemove(req.params.id, (err, milga) => {
    app.post("/milgot/bulkupload", async (req, res) => {
      (async function () {
        for await (let milga of Milgot) {
          let myModel = new MyModel({
            name: milga.name,
            adress: milga.adress,
            base: milga.base,
            ForWho: milga.ForWho,
          });
          myModel = myModel.save();
          res.send(myModel);
        }
      })();
    });
  });
});

// google sheet

// app.get("/getQandA/:id", async (req, res) => {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: "credentials.json",
//     scopes: "https://www.googleapis.com/auth/spreadsheets",
//   });

//   //create client instance
//   const client = await auth.getClient();

//   //instance of google sheets api
//   const googlesheets = google.sheets({
//     version: "v4",
//     auth: client,
//   });

//   const id = req.params.id;

//   //get meta data about spreasheet
//   const data = await googlesheets.spreadsheets.get({
//     auth,
//     spreadsheetId: id,
//   });

//   //read rows from spreadsheet
//   const getRows = await googlesheets.spreadsheets.values.get({
//     auth,
//     spreadsheetId: id,
//     range: data.data.sheets[0].properties.title,
//   });
//   const values = getRows.data.values;
//   delete values[0];
//   let questions = [];
//   if (values.length > 0) {
//     let i = 1;
//     let questionsArray = [];
//     values.forEach((data, index) => {
//       questions.push({
//         question_id: index,
//         question: data[0],
//         answers: [
//           {
//             answer_id: 1,
//             text: data[1],
//             correct: true,
//           },
//           {
//             answer_id: 2,
//             text: data[2],
//             correct: false,
//           },
//           {
//             answer_id: 3,
//             text: data[3],
//             correct: false,
//           },
//           {
//             answer_id: 4,
//             text: data[4],
//             correct: false,
//           },
//         ],
//       });
//     });
//   }
//   // res.header('authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUa3pRamhHTTBJMU16RTVOMFpGUlRjd09ETTRRVUpCTlRFeE5UbEdOVUZGTkVZM1JEazROdyJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmNvY29odWIuYWkvIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDUxNTgxNTA2OTY2Njc1MzEyNzMiLCJhdWQiOlsiaHR0cHM6Ly9jb2NvaHViLmFpL2FwaSIsImh0dHBzOi8vZGV2LWdubjk1M3RkLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NDY3NDI4NDMsImV4cCI6MTY0NjgyOTI0MywiYXpwIjoiZkNoY3hYaXdyMzlYVzZ0b29QVmZVRm0wekhRTHE1eU8iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIn0.W9QP-YTOB3i0WCOJWstR7jsoTgbHgWaJ8F5CeEH1KdcK_1SmpFGGm5wbbM6PZ6rx2zzj5wjvzYGUhqkWC45JFtSv4mI0lHg9XKk_kK0bhv6nI12ZyMLcHD30VjMtW1lY1TygNZnBXPkCq08ibJgn_M2TNKOMicjteYYT9KIgreXeX4mXyYCeItVJVNBgpjBd3HcsiN2VARjSwQ2UXrCdPvyYhwus50IWexca1xch7xeoBWZ2SgpXZ8r6Z2tT3YxQOvddgEuBFJLFoKqx8SHcTftKrVmE3hzA5GwV3ZfEqw28WKXkQzJts5lpatAG5tqFvI8_puWpOzuB6BN3oOm5Lg')
//   const url =
//     "https://cocohub.ai/api/config/glorious-overjoyed-grammy-220-quiz_v2";
//   request(
//     {
//       url,
//       method: "POST",
//       headers: {
//         // 'content-type': 'application/json',
//         authorization:
//           "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUa3pRamhHTTBJMU16RTVOMFpGUlRjd09ETTRRVUpCTlRFeE5UbEdOVUZGTkVZM1JEazROdyJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmNvY29odWIuYWkvIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDUxNTgxNTA2OTY2Njc1MzEyNzMiLCJhdWQiOlsiaHR0cHM6Ly9jb2NvaHViLmFpL2FwaSIsImh0dHBzOi8vZGV2LWdubjk1M3RkLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NTAxODQ4MjcsImV4cCI6MTY1MDI3MTIyNywiYXpwIjoiZkNoY3hYaXdyMzlYVzZ0b29QVmZVRm0wekhRTHE1eU8iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIn0.QC4byWGcA8eO0wYXph-ybjLOCXrJDtq6EFoqcri4ihluDIzYAGlNov-XLUPwoxjKcv0aUXA3b1QQkOyUP06uCPoSj29akH4-gLZgzSB5Qd-blYUVXr8JtUq6aRZ98Oelb8N62hT2pRsQVg0xfwEBwwDlNXs4uDhTDA0D0OWP7asHqxqXwAbKG9bH-NfaKFAr75WVqEbQhG6HUUS7r77QMbAtlTSzfUJDOJMUwE1E8b4oS9gfB-nsxJQcpMb12iFYTmui86Y-V3Z5HB-HeaiQ3UXw4r1vMpj6LZrUxgkIcowRddQJysKU5RYwRj933UhxcXE7RpB7EaRI1ASKgmW-zw",
//       },
//       body: JSON.stringify(questions),
//       // json: true
//     },
//     function (error, response, body) {
//       setTimeout(
//         () => console.log("response", response.statusCode, body),
//         2000
//       );
//     }
//   );
//   res.status(200).send(JSON.stringify(questions));
// });

// app.get("/:id", async (req, res) => {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: "credentials.json",
//     scopes: "https://www.googleapis.com/auth/spreadsheets",
//   });

//   //create client instance
//   const client = await auth.getClient();

//   //instance of google sheets api
//   const googlesheets = google.sheets({
//     version: "v4",
//     auth: client,
//   });

//   const id = req.params.id;

//   //get meta data about spreasheet
//   const data = await googlesheets.spreadsheets.get({
//     auth,
//     spreadsheetId: id,
//   });

//   //read rows from spreadsheet
//   const getRows = await googlesheets.spreadsheets.values.get({
//     auth,
//     spreadsheetId: id,
//     range: data.data.sheets[0].properties.title,
//   });
//   const values = getRows.data.values;
//   delete values[0];
//   let toSend = {};
//   values.forEach((value, index) => {
//     console.log(index);
//     toSend["Question " + index] = {
//       שאלה: value[0],
//       תשובות: {
//         1: {
//           תשובה: value[1],
//           נכון: true,
//         },
//         2: {
//           תשובה: value[2],
//           נכון: false,
//         },
//         3: {
//           תשובה: value[3],
//           נכון: false,
//         },
//         4: {
//           תשובה: value[4],
//           נכון: false,
//         },
//       },
//     };
//   });

//   const url =
//     "https://cocohub.ai/api/config/glorious-overjoyed-grammy-220-quiz_v2";
//   request(
//     {
//       url,
//       method: "POST",
//       headers: {
//         "content-type": "application/json",
//         authorization:
//           "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUa3pRamhHTTBJMU16RTVOMFpGUlRjd09ETTRRVUpCTlRFeE5UbEdOVUZGTkVZM1JEazROdyJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmNvY29odWIuYWkvIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDUxNTgxNTA2OTY2Njc1MzEyNzMiLCJhdWQiOlsiaHR0cHM6Ly9jb2NvaHViLmFpL2FwaSIsImh0dHBzOi8vZGV2LWdubjk1M3RkLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NDY3NDI4NDMsImV4cCI6MTY0NjgyOTI0MywiYXpwIjoiZkNoY3hYaXdyMzlYVzZ0b29QVmZVRm0wekhRTHE1eU8iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIn0.W9QP-YTOB3i0WCOJWstR7jsoTgbHgWaJ8F5CeEH1KdcK_1SmpFGGm5wbbM6PZ6rx2zzj5wjvzYGUhqkWC45JFtSv4mI0lHg9XKk_kK0bhv6nI12ZyMLcHD30VjMtW1lY1TygNZnBXPkCq08ibJgn_M2TNKOMicjteYYT9KIgreXeX4mXyYCeItVJVNBgpjBd3HcsiN2VARjSwQ2UXrCdPvyYhwus50IWexca1xch7xeoBWZ2SgpXZ8r6Z2tT3YxQOvddgEuBFJLFoKqx8SHcTftKrVmE3hzA5GwV3ZfEqw28WKXkQzJts5lpatAG5tqFvI8_puWpOzuB6BN3oOm5Lg",
//       },
//       body: toSend,
//       json: true,
//     },
//     function (error, response, body) {
//       setTimeout(
//         () => console.log("response", response.statusCode, body),
//         2000
//       );
//     }
//   );

//   console.log(toSend);
//   res.send(toSend);
// });

// app.get('/getQandA/:id', async (req, res) => {
//   const auth = new google.auth.GoogleAuth({
//       keyFile: 'credentials.json',
//       scopes: 'https://www.googleapis.com/auth/spreadsheets'
//   })

//   //create client instance
//   const client = await auth.getClient()

//   //instance of google sheets api
//   const googlesheets = google.sheets({
//       version: 'v4',
//       auth: client
//   }) 

//   const id = req.params.id

//   //get meta data about spreasheet
//   const data = await googlesheets.spreadsheets.get({
//       auth,
//       spreadsheetId: id

//   })

//   //read rows from spreadsheet
//   const getRows = await googlesheets.spreadsheets.values.get({
//       auth, 
//       spreadsheetId: id,
//       range: data.data.sheets[0].properties.title
//   })
//   const values = getRows.data.values
//   delete values[0]
//   let questions = []
//   if(values.length > 0){
//       let i = 1;
//       let questionsArray = []
//       values.forEach((data, index) => {
//           questions.push({
//               question_id: index,
//               question: data[0],
//               answers: [
//                   {
//                       answer_id: 1,
//                       text: data[1],
//                       correct: true
//                   },
//                   {
//                       answer_id: 2, 
//                       text: data[2],
//                       correct: false
//                   },
//                   {
//                       answer_id: 3,
//                       text: data[3],
//                       correct: false
//                   },
//                   {
//                       answer_id: 4,
//                       text: data[4],
//                       correct: false
//                   }
//               ]
//           })
//       })

//   }
//   // res.header('authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUa3pRamhHTTBJMU16RTVOMFpGUlRjd09ETTRRVUpCTlRFeE5UbEdOVUZGTkVZM1JEazROdyJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmNvY29odWIuYWkvIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDUxNTgxNTA2OTY2Njc1MzEyNzMiLCJhdWQiOlsiaHR0cHM6Ly9jb2NvaHViLmFpL2FwaSIsImh0dHBzOi8vZGV2LWdubjk1M3RkLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NDY3NDI4NDMsImV4cCI6MTY0NjgyOTI0MywiYXpwIjoiZkNoY3hYaXdyMzlYVzZ0b29QVmZVRm0wekhRTHE1eU8iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIn0.W9QP-YTOB3i0WCOJWstR7jsoTgbHgWaJ8F5CeEH1KdcK_1SmpFGGm5wbbM6PZ6rx2zzj5wjvzYGUhqkWC45JFtSv4mI0lHg9XKk_kK0bhv6nI12ZyMLcHD30VjMtW1lY1TygNZnBXPkCq08ibJgn_M2TNKOMicjteYYT9KIgreXeX4mXyYCeItVJVNBgpjBd3HcsiN2VARjSwQ2UXrCdPvyYhwus50IWexca1xch7xeoBWZ2SgpXZ8r6Z2tT3YxQOvddgEuBFJLFoKqx8SHcTftKrVmE3hzA5GwV3ZfEqw28WKXkQzJts5lpatAG5tqFvI8_puWpOzuB6BN3oOm5Lg')
//   const url = 'https://cocohub.ai/api/config/glorious-overjoyed-grammy-220-quiz_v2'
//   request({
//       url,
//       method: 'POST',
//       headers: {
//           // 'content-type': 'application/json',
//           'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUa3pRamhHTTBJMU16RTVOMFpGUlRjd09ETTRRVUpCTlRFeE5UbEdOVUZGTkVZM1JEazROdyJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmNvY29odWIuYWkvIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDUxNTgxNTA2OTY2Njc1MzEyNzMiLCJhdWQiOlsiaHR0cHM6Ly9jb2NvaHViLmFpL2FwaSIsImh0dHBzOi8vZGV2LWdubjk1M3RkLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NDY3NDI4NDMsImV4cCI6MTY0NjgyOTI0MywiYXpwIjoiZkNoY3hYaXdyMzlYVzZ0b29QVmZVRm0wekhRTHE1eU8iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIn0.W9QP-YTOB3i0WCOJWstR7jsoTgbHgWaJ8F5CeEH1KdcK_1SmpFGGm5wbbM6PZ6rx2zzj5wjvzYGUhqkWC45JFtSv4mI0lHg9XKk_kK0bhv6nI12ZyMLcHD30VjMtW1lY1TygNZnBXPkCq08ibJgn_M2TNKOMicjteYYT9KIgreXeX4mXyYCeItVJVNBgpjBd3HcsiN2VARjSwQ2UXrCdPvyYhwus50IWexca1xch7xeoBWZ2SgpXZ8r6Z2tT3YxQOvddgEuBFJLFoKqx8SHcTftKrVmE3hzA5GwV3ZfEqw28WKXkQzJts5lpatAG5tqFvI8_puWpOzuB6BN3oOm5Lg'
//       },
//       body: JSON.stringify(questions),
//       // json: true
//   }, function(error, response, body){
//       setTimeout(() => console.log('response', response.statusCode, body), 2000)

//   })
//   res.status(200).send(JSON.stringify(questions))
// })

app.get('/:id', async(req, res) => {
  const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets'
  })

  //create client instance
  const client = await auth.getClient()

  //instance of google sheets api
  const googlesheets = google.sheets({
      version: 'v4',
      auth: client
  }) 

  const id = req.params.id

  //get meta data about spreasheet
  const data = await googlesheets.spreadsheets.get({
      auth,
      spreadsheetId: id

  })

  //read rows from spreadsheet
  const getRows = await googlesheets.spreadsheets.values.get({
      auth, 
      spreadsheetId: id,
      range: data.data.sheets[0].properties.title
  })
  const values = getRows.data.values
  delete values[0]
  let toSend = {}
  values.forEach((value, index) => {
      console.log(index)
      toSend['Question ' + index] = {
          שאלה: value[0],
          תשובות: { 
              1:{
                  תשובה: value[1],
                  נכון: true
              },
              2:{
                  תשובה: value[2],
                  נכון: false
              },
              3: {
                  תשובה: value[3],
                  נכון: false
              },
              4: {
                  תשובה: value[4],
                  נכון: false
              }
          }
      }
  })

  const url = 'https://cocohub.ai/api/config/glorious-overjoyed-grammy-220-quiz_v2'
  request({
      url,
      method: 'POST',
      headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUa3pRamhHTTBJMU16RTVOMFpGUlRjd09ETTRRVUpCTlRFeE5UbEdOVUZGTkVZM1JEazROdyJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmNvY29odWIuYWkvIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDUxNTgxNTA2OTY2Njc1MzEyNzMiLCJhdWQiOlsiaHR0cHM6Ly9jb2NvaHViLmFpL2FwaSIsImh0dHBzOi8vZGV2LWdubjk1M3RkLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NTAxODQ4MjcsImV4cCI6MTY1MDI3MTIyNywiYXpwIjoiZkNoY3hYaXdyMzlYVzZ0b29QVmZVRm0wekhRTHE1eU8iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIn0.QC4byWGcA8eO0wYXph-ybjLOCXrJDtq6EFoqcri4ihluDIzYAGlNov-XLUPwoxjKcv0aUXA3b1QQkOyUP06uCPoSj29akH4-gLZgzSB5Qd-blYUVXr8JtUq6aRZ98Oelb8N62hT2pRsQVg0xfwEBwwDlNXs4uDhTDA0D0OWP7asHqxqXwAbKG9bH-NfaKFAr75WVqEbQhG6HUUS7r77QMbAtlTSzfUJDOJMUwE1E8b4oS9gfB-nsxJQcpMb12iFYTmui86Y-V3Z5HB-HeaiQ3UXw4r1vMpj6LZrUxgkIcowRddQJysKU5RYwRj933UhxcXE7RpB7EaRI1ASKgmW-zw'
      },
      body: toSend,
      json: true
  }, function(error, response, body){
      setTimeout(() => console.log('response', response.statusCode, body), 2000)

  })

  console.log(toSend, "send")
  res.send(toSend)
})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));


const getbrancoweissEducationTerms = async () => {
var result;
try { 
  result = "BrancoWeiss Education Term: כשלי חשיבה" + ": " + await getbrancoweissEducationTerm("כשלי חשיבה") + "\n"
  + "BrancoWeiss Education Term: חשיבה לטראלית" + ": " + await getbrancoweissEducationTerm("חשיבה לטראלית") + "\n"
  + "BrancoWeiss Education Term: חשיבה ביקורתית במובן חזק" + ": " + await getbrancoweissEducationTerm("חשיבה ביקורתית במובן חזק") + "\n"
  + "BrancoWeiss Education Term: ידע פורה" + ": " + await getbrancoweissEducationTerm("ידע פורה") + "\n";
} catch(errorReason) { 
  // code on error
  console.log(errorReason);
}
var myString = result;

var file = fs.createWriteStream('./brancoweisstestterms.txt');
file.on('error', function(err) { /* error handling */ });
file.write(myString);
file.end();

}

getbrancoweissEducationTerms();


app.get("/educationterms", (req, res) => {
  res(myEducationTerms);
});




