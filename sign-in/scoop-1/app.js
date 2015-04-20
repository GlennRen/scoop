var express = require('express'),
  mongoose = require("mongoose"),
  User = require("./models/User"),
  passport = require("passport"),
  session = require('express-session'),
  TwitterStrategy = require('passport-twitter').Strategy,
  Twitter = require("twitter");

var app = express();
app.use(session({
  secret: 'keyboard cat'
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  if (typeof req.user === 'undefined')
    req.user = {};
  req.user.access_token = "1142696359-2KqfXuqRYmNr5ZMbyaM6QvCzI7pSvr6UWbcClUC";
  req.user.access_token_secret = "uZmtibvGx3zFYjLlK8JWxCQbZyP5y1uWhe5KeeSMo3hFa";
  next();
})
var port = process.env.VCAP_APP_PORT || 3000;
var mongo = "mongodb://scoop:password@c835.candidate.43.mongolayer.com:10835,c933.candidate.32.mongolayer.com:10933/scoop?replicaSet=set-5529e3e759218b282b000220";
passport.use(new TwitterStrategy({
    consumerKey: "ZoXpMH2i7SSXHndCjg3biNvHH",
    consumerSecret: "5FUEOLy8GlJIpzDYDl3w1dhzK5dH0euJ2GVX2zngJXjS3Ct3vT",
    callbackURL: "https://605f443e.ngrok.com/twitter"
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    var userObj = new User({
      user_id: profile["id"],
      user_name: profile["displayName"],
      user_username: profile["username"],
      user_image: profile["photos"][0]["value"],
      access_token: token,
      access_token_secret: tokenSecret
    });
    userObj.save(userObj, function(err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.user_id);
});

passport.deserializeUser(function(user, done) {
  User.findOne({
    user_id: user
  }, function(err, userObj) {
    done(null, userObj);
  })
});
var db = mongoose.connection;
mongoose.connect(mongo);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log("connected")
});
var server = app.listen(port, function() {
  console.log("Listening on " + port);
});
app.get("/me", function(req, res) {
  res.send('<script type="text/javascript">chrome.runtime.sendMessage({authData: document.location.search}, function(response) {console.log(response);});</script>');
})
app.get("/oops", function(req, res) {
  res.json({
    error: true
  });
})
app.get("/findTweets", function(req, res) {
  if (typeof req.user === 'undefined')
    return res.send({
      error: true
    });
  User.find({}, function(err, users) {
    var http = require('http');

    var options = {
      host: 'access.alchemyapi.com',
      port: 80,
      path: '/calls/url/URLGetRankedKeywords?url=' + encodeURIComponent(req.param("url")) + '&apikey=7703b58eb701f4de14f01fc1fbe3665df83f6828&keywordExtractMode=strict&outputMode=json'
    };

    http.get(options, function(resp) {
      var keywordData = "";
      resp.setEncoding('utf8');
      resp.on('data', function(chunk) {
        keywordData += chunk;
      });
      resp.on('end', function() {
        var keywords = JSON.parse(keywordData)["keywords"];
        var keywords = [{
          text: "twitter discover"
        }]
        if (typeof keywords === 'undefined')
          keywords = {};
        var searchString = '"';
        for (var i = 0; i < Math.min(keywords.length, 4); i++) {
          searchString += keywords[i]["text"] + '" ';
          console.log(i, Math.min(keywords.length, 4));
          if (Math.min(keywords.length, 4) != i + 1)
            searchString += 'OR "';
        }
        searchString += " -filter:links";
        console.log(searchString);
        var client = new Twitter({
          consumer_key: "ZoXpMH2i7SSXHndCjg3biNvHH",
          consumer_secret: "5FUEOLy8GlJIpzDYDl3w1dhzK5dH0euJ2GVX2zngJXjS3Ct3vT",
          access_token_key: req.user.access_token,
          access_token_secret: req.user.access_token_secret
        });
        var params = {
          q: searchString,
          result_type: 'popular', // popular, mixed, recent
          count: 20
        };
        client.get('search/tweets.json', params, function(error, tweets, response) {
          if (!error) {
            console.log(tweets);
          }
          var toSend = [];
          for (var i = 0; i < tweets["statuses"].length; i++) {
            var tweet = tweets["statuses"][i];
            if (typeof tweet.entities === 'undefined' || ((typeof tweet.entities.media === 'undefined' || tweet.entities.media.length != 0) && (typeof tweet.entities.urls === 'undefined' || tweet.entities.urls.length == 0)))
              toSend.push({
                id: tweet.id_str,
                text: tweet.text,
                favorites: tweet.favorite_count,
                favorited: tweet.favorited,
                author_name: tweet.user.name,
                author_image: tweet.user.profile_image_url,
                author_username: tweet.user.screen_name,
                query: searchString
              });
          }
          res.json(toSend);
        });
      });
      resp.on("error", function(e) {
        console.log("Got error: " + e.message);
      });
    })
  });
});
app.get("/favorite", function(req, res) {
  if (!req.user)
    return res.json({
      error: true
    })
  var client = new Twitter({
    consumer_key: "ZoXpMH2i7SSXHndCjg3biNvHH",
    consumer_secret: "5FUEOLy8GlJIpzDYDl3w1dhzK5dH0euJ2GVX2zngJXjS3Ct3vT",
    access_token_key: req.user.access_token,
    access_token_secret: req.user.access_token_secret
  });
  var params = {
    id: req.param("id")
  };
  console.log(params);
  client.post('favorites/' + req.param("action") + '.json', params, function(error, tweet, response) {
    if (!error) {
      console.log(tweet);
    }
    res.json(tweet);
  });
});
app.get("/reply", function(req, res) {
  if (!req.user)
    return res.json({
      error: true
    })
  var client = new Twitter({
    consumer_key: "ZoXpMH2i7SSXHndCjg3biNvHH",
    consumer_secret: "5FUEOLy8GlJIpzDYDl3w1dhzK5dH0euJ2GVX2zngJXjS3Ct3vT",
    access_token_key: req.user.access_token,
    access_token_secret: req.user.access_token_secret
  });
  var params = {
    in_reply_to_status_id: req.param("id"),
    status: req.param("text")
  };
  console.log(params);
  client.post('statusses/update', params, function(error, status, response) {
    if (!error) {
      console.log(status);
    }
    res.json(status);
  });
});
app.get("/logout", function(req, res) {
  req.logout();
  res.send("peace out girlscout");
});
app.get("/login", passport.authenticate('twitter'));
app.get('/twitter', passport.authenticate('twitter', {
  successRedirect: '/me',
  failureRedirect: '/oops'
}));