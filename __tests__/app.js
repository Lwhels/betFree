//create the DOm variables
var gameStatus = document.querySelector("#status");
var homeTeamImage = document.querySelector("#homeLogo");
var homeTeamName = document.querySelector("#homeName");
var awayTeamImage = document.querySelector("#awayLogo");
var awayTeamName = document.querySelector("#awayName");
var score = document.querySelector("#goals");
var matchTable = document.querySelector("#matchTable");

function convertOdds(odds) {
  if (odds < 2) {
    return Math.round(-100 / (odds - 1)).toFixed(0);
  } else {
    return "+" + Math.round(100 * (odds - 1)).toFixed(0);
  }
}
//make a function that will build match tiles
function addGameTile(data) {
  //create match title div
  var matchTile = document.createElement("div");
  matchTile.classList.add("match-tile");

  var homeTeam = document.createElement("div");
  homeTeam.classList.add("team");

  var homeTileLogo = document.createElement("img");
  var homeTileName = document.createElement("p");

  homeTileLogo.src = data["teams"]["home"]["logo"];
  homeTileName.innerHTML = data["teams"]["home"]["name"];

  var awayTeam = document.createElement("div");
  homeTeam.classList.add("team");

  var awayTileLogo = document.createElement("img");
  var awayTileName = document.createElement("p");

  awayTileLogo.src = data["teams"]["away"]["logo"];
  awayTileName.innerHTML = data["teams"]["away"]["name"];

  homeTeam.appendChild(homeTileLogo);
  homeTeam.appendChild(homeTileName);

  awayTeam.appendChild(awayTileLogo);
  awayTeam.appendChild(awayTileName);

  var score = document.createElement("p");
  score.innerHTML =
    data["scores"]["home"]["total"] + " - " + data["scores"]["away"]["total"];
  matchTile.appendChild(homeTeam);
  matchTile.appendChild(score);
  matchTile.appendChild(awayTeam);

  matchTable.appendChild(matchTile);
}

fetch("https://v1.basketball.api-sports.io/odds?league=12&season=2022-2023", {
  method: "GET",
  headers: {
    "x-rapidapi-host": "v1.basketball.api-sports.io",
    "x-rapidapi-key": "28fac37d23a94d5717f67963c07baa3f",
  },
})
  .then((response) =>
    response.json().then((data) => {
      var gamesList = data["response"];
      //grabbing our data
      //get information that will need for project
      //read api docs

      /*for(var i = 1; i<gamesList.length;i++){
        addGameTile(gamesList[i]['game']);
    }
    */
      console.log(gamesList);
    })
  )

  .catch((err) => {
    console.log(err);
  });
