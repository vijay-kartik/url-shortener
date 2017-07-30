
var express = require('express');
var app = express();
var mongoURL = 'mongodb://sites:kartikvj2703@ds159998.mlab.com:59998/newdb';
var mongo = require('mongodb').MongoClient;


app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
//Look for shortened url
app.get('/:url', function(req, res){
  mongo.connect(mongoURL, function(err, db){
    if (err) console.error(err);
    
    var sites = db.collection('sites');
    sites.find({
    short: req.params.url 
        
    }).toArray(function(err, docs){
        if (err) console.error(err);
        res.redirect(docs[0].original);
      
    });
    db.close();
    
});
  

})

app.get('/new/:url', function(req, res){
    var doc={
      original_url : req.params.url,
      short_url : 'https://morning-bayou-65626.herokuapp.com/' + Math.floor(Math.random()*1000000)
    };
    mongo.connect(mongoURL, function(err, db) {
  if (err) throw err;
  var collection = db.collection('sites');
  collection.insert(doc, function(err, data) {
    if (err) throw err;
    console.log(JSON.stringify(data));
    
    })
      db.close();
  })
});






// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
