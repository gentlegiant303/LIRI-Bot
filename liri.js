let Twitter = require("twitter");
let Spotify = require("node-spotify-api");
let request = require('request');
let keys = require('./keys.js');
let fs = require("fs");
let nodeArgs = process.argv;

let firstFunction = function(firstArgv, secondArgv) {
  choice(firstArgv, secondArgv);
};


let choice = function(firstIndex, secondIndex) {
  switch (firstIndex) {
    case "my-tweets":
      twitter();
      break;

    case "spotify-this-song":
      spotify(secondIndex);
      break;

    case "movie-this":
      movie(secondIndex);
      break;

    case "do-what-it-says":
      readText();
      break;
  }
};


function twitter() {
  let client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });
  client.get('statuses/user_timeline', {
    q: 'gentlegiant303',
    count: 10
  }, function(error, tweets, response) {
    for (let i = 0; i < tweets.length; i++) {
      console.log(tweets[i].created_at);
      console.log(tweets[i].text);
    }
  });
}

function spotify(songName) {
  if (songName != null) {
    console.log(songName);
    let spotify = new Spotify({
      id: keys.spotifyKeys.ClientId,
      secret: keys.spotifyKeys.clientSecret
    });
    spotify
      .search({
        type: 'track',
        query: songName
      })
      .then(function(response) {
        console.log(response.tracks.items[0].artists[0].name);
        console.log(response.tracks.items[0].name);
        console.log(response.tracks.items[0].preview_url);
        console.log(response.tracks.items[0].album.name);
      })
      .catch(function(err) {
        console.log(err);
      });
  } else {
    let spotify = new Spotify({
      id: keys.spotifyKeys.ClientId,
      secret: keys.spotifyKeys.clientSecret
    });
    spotify
      .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
      .then(function(response) {
        console.log(response.artists[0].name)
        console.log(response.name);
        console.log(response.preview_url);
        console.log(response.album.name);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
};

function movie() {
  if (nodeArgs[3] != null) {
    movieName = nodeArgs[3];
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(JSON.parse(body).Title);
        console.log(JSON.parse(body).Year);
        console.log(JSON.parse(body).imdbRating);
        console.log(JSON.parse(body).Ratings[1].value);
        console.log(JSON.parse(body).Country);
        console.log(JSON.parse(body).Language);
        console.log(JSON.parse(body).Plot);
        console.log(JSON.parse(body).Actors);
      }
    })
  } else {
    request("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy", function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(JSON.parse(body).Title);
        console.log(JSON.parse(body).Year);
        console.log(JSON.parse(body).imdbRating);
        console.log(JSON.parse(body).Ratings[1].value);
        console.log(JSON.parse(body).Country);
        console.log(JSON.parse(body).Language);
        console.log(JSON.parse(body).Plot);
        console.log(JSON.parse(body).Actors);
      }
    })
  }
};

function readText() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    let dataArray = data.split(",");
    if (dataArray.length === 2) {
      choice(dataArray[0], dataArray[1]);
    } else if (dataArray.length === 1) {
      choice(dataArray[0]);
    }
  })
};

firstFunction(process.argv[2], process.argv[3])