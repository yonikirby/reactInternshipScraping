const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const serverless = require('serverless-http');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const path = require('path');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

app.use(cors())
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var reqTimer = setTimeout(function wakeUp() {
  request("https://milgot-api.herokuapp.com/", function () {
    console.log("WAKE UP DYNO");
  });
  return reqTimer = setTimeout(wakeUp, 1200000);
}, 1200000);

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://yonatan1261:Dimoy2021@cluster0.pfw9n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", console.log('mongoose connected'),
  {
    useNewUrlParser: true,
    useFindAndModify: false
  });

const MyModel = mongoose.model('Milgot', new Schema(
  { name: String, adress: String, base: String, ForWho: String }));

const UsersModel = mongoose.model('Users', new Schema(
  { name: String, studies: String, number: String }));

const TermModel = mongoose.model('Terms', new Schema(
  { title: String, description: String}));

const newspapers = [
  {
    name: 'NoCamels',
    address: `https://nocamels.com/category/technology/`,
    base: ''
  },
  {
    name: 'Calcalist',
    address: `https://www.calcalistech.com/ctech/home/0,7340,L-5211,00.html`,
    base: ''
  },
  {
    name: 'TimesOfIsrael',
    address: `https://www.timesofisrael.com/tech-israel/`,
    base: ''
  },
  {
    name: 'TimesOfIsrael',
    address: `https://www.timesofisrael.com/israel-inside/`,
    base: ''
  },
  {
    name: 'Haaretz',
    address: `https://www.haaretz.com/israel-news/tech-news`,
    base: ''
  },
  {
    name: 'כלכליסט',
    address: `https://www.calcalist.co.il/calcalistech`,
    base: ''
  },
  {
    name: 'גיקטיים',
    address: `https://www.geektime.co.il/`,
    base: ''
  },
  {
    name: 'גיקטיים',
    address: `https://www.geektime.co.il/category/startup/`,
    base: ''
  },
  {
    name: 'גיקטיים',
    address: `https://www.geektime.co.il/category/development/`,
    base: ''
  },
  {
    name: 'גיקטיים',
    address: `https://www.geektime.co.il/channel/cloud-and-clear/`,
    base: ''
  },
  {
    name: 'גיקטיים',
    address: `https://www.geektime.co.il/channel/human-resources/`,
    base: ''
  },
  {
    name: 'גיקטיים',
    address: `https://www.geektime.co.il/channel/dev-bible/`,
    base: ''
  },
  {
    name: 'גיקטיים',
    address: `https://www.geektime.co.il/channel/future-of-tech/`,
    base: ''
  },
  {
    name: 'גיקטיים',
    address: `https://www.geektime.co.il/channel/dev-bible/`,
    base: ''
  },
  {
    name: 'GeekTime',
    address: `https://www.geektime.com/`,
    base: ''
  },
  {
    name: 'GeekTime',
    address: `https://www.geektime.com/tag/startups/`,
    base: ''
  },
  {
    name: 'GeekTime',
    address: `https://www.geektime.com/tag/investments/`,
    base: ''
  },
  {
    name: 'Mako',
    address: `https://www.mako.co.il/news-business/news`,
    base: ''
  },
  {
    name: 'Mako',
    address: `https://www.mako.co.il/news-business/news?page=2`,
    base: ''
  },
  {
    name: 'GeekTime',
    address: `https://www.mako.co.il/news-business/news?page=3`,
    base: ''
  }, {
    name: 'GeekTime',
    address: `https://www.mako.co.il/news-business/news?page=4`,
    base: ''
  }, {
    name: 'GeekTime',
    address: `https://www.mako.co.il/news-business/news?page=5`,
    base: ''
  }, {
    name: 'GeekTime',
    address: `https://www.mako.co.il/news-business/news?page=6`,
    base: ''
  }, {
    name: 'GeekTime',
    address: `https://www.mako.co.il/news-business/news?page=7`,
    base: ''
  },
]

const termSites = [
  {
    name: 'terms-heb',
    address: `https://www.geektime.co.il/startup-and-high-tech-dictionary/`,
    base: ''
  },
  {
    name: 'idc-glossary',
    address: `https://www.idc.org/idc/glossary-of-terms`,
    base: ''
  },
]
const articles = []

newspapers.forEach(newspaper => {
  axios.get(newspaper.address)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      $('a', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')

        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name
        })
      })
    })
})

const terms = []

termSites.forEach(term => {
  axios.get(term.address)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      $('p', html).each(function () {
        if ($(this).text().includes('(')) {
          const title = $(this).text()
          const secondTitle = title.substr(0, title.indexOf('.'))
          const description = $(this).next('p').text()
          terms.push({
            title,
            description: description,
            source: term.name,
          })
        }
      })
    })
})

app.get('/news', (req, res) => {
  res.json(articles)
})

app.get('/terms', (req, res) => {
  res.json(terms)
})

app.post('/term/add', async (req, res) => {
  new TermModel(req.body)

  TermModel.save

  let termModel = new TermModel({ title: req.body.title, description: req.body.description});
  TermModel = await TermModel.save();
  res.send(termModel);
});


app.get('/news/:word/title', (req, res) => {
  const word = req.params.word
  const articleResult = articles.filter(article => article.title.includes(word))
  const termResult = terms.filter(term => term.title.includes(word))
  const example = articleResult.length > 0 ? (articleResult[0].title.replace(/ +(?= )/g, "").replace(/(\r\n|\n|\r)/gm, "").trim()) : ('אין דוגמה לכתבה')
  if (articleResult.length > 0) {
    const response = `${termResult[0].title} - ${termResult[0].description} - כתבה לדוגמה: משעה ${example}`
    res.json(response)
  } else {
    const response = `${termResult[0].title} - ${termResult[0].description}`
    res.json(response)
  }
})
app.get('/news/:word/description', (req, res) => {
  const word = req.params.word
  const articleResult = articles.filter(article => article.title.includes(word))
  const termResult = terms.filter(term => term.title.includes(word))
  const example = articleResult[0].title.replace(/ +(?= )/g, "").replace(/(\r\n|\n|\r)/gm, "").trim()
  if (articleResult.length > 0) {
    res.json(termResult[0].description)
  } else {
    res.json(termResult)
  }
})

app.get('/news/:word/example', (req, res) => {
  const word = req.params.word
  const articleResult = articles.filter(article => article.title.includes(word))
  const termResult = terms.filter(term => term.title.includes(word))
  const example = articleResult[0].title.replace(/ +(?= )/g, "").replace(/(\r\n|\n|\r)/gm, "").trim()
  if (articleResult.length > 0) {
    res.json(example)
  } else {
    res.json(termResult)
  }
})


// user data
app.post('/user/add', async (req, res) => {
  new UsersModel(req.body)

  UsersModel.save

  let usersModel = new UsersModel({ name: req.body.name, studies: req.body.studies, number: req.body.number });
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
  const data = UsersModel.find({
    number: req.params.number,
  }, (err, data) => {
    if (data.length > 0) {
      res.send(data[0].name);
    } else {
      res.json(err);
    }
  });
});

app.get("/users/:number/studies", (req, res) => {
  const data = UsersModel.find({
    number: req.params.number,
  }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data[0].studies);
    }
  });
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.get("/", (req, res) => {
  res.json("BerlBot's API");
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
app.get("/milgot/:name", (req, res) => {
  MyModel.find({}, (err, milgot) => {
    if (err) {
      res.send(err);
    } else {
      milgot.map(milga => {
        if(milga.name.includes(req.params.name)) {
        response = `${milga.name} בלינק הבא: ${milga.adress}`
          res.json(response);
        }
      });
    }
  });
});

app.get("/milgot/:milgaId", (req, res) => {
  const data = MyModel.find({
    base: req.params.milgaId,
  }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
});

app.get("/milgot/:milgaId/:forwho", (req, res) => {
  const data = MyModel.find({
    base: req.params.milgaId,
  }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      data.map(milga => {
        if (milga.ForWho) {
          milga.ForWho.includes(req.params.forwho) &&
            res.json(milga)
        }
      })
    }
  });
});

app.get("/milgot/forwho/:data", (req, res) => {
  const data = MyModel.find({
    ForWho: req.params.milgaId,
  }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
});

app.get("/milgot/id/:id", (req, res) => {
  const data = MyModel.findOne({
    _id: req.params.id,
  }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
});


app.post('/milgot/add', async (req, res) => {
  new MyModel(req.body)

  MyModel.save

  let myModel = new MyModel({ name: req.body.name, adress: req.body.address, base: req.body.base, ForWho: req.body.ForWho });
  myModel = await myModel.save();
  res.send(myModel);
});

app.delete('/milgot/delete/:id', (req, res) => {
  MyModel.findByIdAndRemove(req.params.id, (err, milga) => {


    app.post('/milgot/bulkupload', async (req, res) => {
      (async function () {
        for await (let milga of Milgot) {
          let myModel = new MyModel({ name: milga.name, adress: milga.adress, base: milga.base, ForWho: milga.ForWho });
          myModel = myModel.save();
          res.send(myModel);
        }
      })();

    });
  });
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));