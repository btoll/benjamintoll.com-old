<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Memory Game by benjamintoll.com</title>
<style type="text/css">
body {
  background: #eed;
}
div#cardTable {
  position: absolute;
  top: 18%;
  left: 30%;
  width: 520px;
}
div#scorer {
  color: #EED;
  font-size: 16px;
  font-weight: bold;
  margin: 20px;
  padding: 20px;
  position: absolute;
  top: 2%;
  left: 30%;
  text-align: center;
  width: 190px;
}
div#cardTable div {
  background: #eed url(../../../images/blue.gif) no-repeat;
  float: left;
  height: 66px;
  margin: 10px;
  width: 65px;
}
div#cardTable p {
  background: #FFF;
  border: 1px solid #CCC;
  display: none;
  font-size: 1.5em;
  font-weight: bold;
  height: 66px; 
  margin: 0;
  text-align: center;
  width: 65px;
}
div#cardTable p span { /*center the number within the box*/
  display: block;
  padding: 20px 0;
}
div.scorecard {
  background: #FFF;
  border: 1px solid #999;
  height: 120px;
  margin: 20px;
  padding: 10px;
  width: 120px;
}
div.scorecard h1 {
  font-size: 1em;
  margin: 2px auto;
}
div.scorecard p {
  color: blue;
  font: 4em/1.2 cursive;
  margin: 0;
  text-align: center;
}
div.scorecard p#matches { /*just change the color of the matches count*/
  color: green;
}
</style>
<?php
include_once("/home/benjamin/public_html/lib/includes/jslite_scripts.php");
?>
<script type="text/javascript">
JSLITE.ready(function () {

  var aCards = [], //an array that holds the newly created card divs;
    aSelectedCards = [], //an array that holds the 2 selected cards;
    aMatched = [], //an array that holds the cards that have been successfully matched;
    oCardTable = JSLITE.dom.get("#cardTable"),
    iTotalCards = 24, //the number to use when creating cards and seeding the values;
    iChances = 20, //total number of chances;
    aSeed = (function () {
      var arr = [], i;
      for (i = iTotalCards / 2; i--;) {
        arr.push(i);
      }
      return arr.concat(arr); //create duplicates;
    }()),
    timer = null,
    oFragment = null,
    i,
    a,

  fnResetCards = function () {
    for (i = aSelectedCards.length; i--;) {
      a = aSelectedCards;
      $(a[0][1]).style.backgroundImage = $(a[1][1]).style.backgroundImage = "url(../../../images/blue.gif)";
      $(a[0][1]).firstChild.style.display = $(a[1][1]).firstChild.style.display = "none";
    }
    aSelectedCards.length = 0; //reset the array;
    oCardTable.on("click", fnShowValue); //re-attach the event handler;
  },

  fnCompareCards = function () {
    oCardTable.un("click", fnShowValue); //remove the listener to simplify the UI while the cards are processed;
    if (parseInt(aSelectedCards[0][0], 10) === parseInt(aSelectedCards[1][0], 10)) {
      $("matches").innerHTML = parseInt($("matches").innerHTML, 10) + 1; //increment their "matches" score;
      aMatched.push(aSelectedCards[0][1], aSelectedCards[1][1]);
      //fnResetCards();
      if (aMatched.length === 24) { //all the cards have been successfully matched;
        if (confirm("Congratulations, you won! Play again?")) {
          clearTimeout(timer);
          initGame();
        }
      } else {
        JSLITE.ux.fade($("scorer"), 0, 0, 221);
        $("scorer").innerHTML = "Match!";
        aSelectedCards.length = 0; //reset the array;
        oCardTable.on("click", fnShowValue); //re-attach the event handler;
      }

    } else {
      JSLITE.ux.fade($("scorer"), 238, 0, 0);
      $("scorer").innerHTML = "Too bad, you lost a chance!";
      timer = setTimeout(function () { // there was no match so reset their backgrounds images after 1.2 seconds;
        fnResetCards();
      }, 1200);
      $("chances").innerHTML = parseInt($("chances").innerHTML, 10) - 1;
      if (parseInt($("chances").innerHTML, 10) === 0) {
        if (confirm("You lost! Play again?")) {
          clearTimeout(timer);
          initGame();
        } else {
          $("cardTable").style.display = "none";
        }
      }
    }
  },

  fnShowValue = function (e) {
    var target = e.target;
    if (/card\d{1,2}/.test(target.id)) { //since there's only one handler for the entire page we need to make sure the user actually clicked on a card and discard all other events;
      target.style.backgroundImage = "none";
      target.firstChild.style.display = "block";
      aSelectedCards.push([JSLITE.dom.get("span", target).value(), target.id]);
      if (aSelectedCards.length === 2) {
        fnCompareCards(); //send along the text from within the paragraph (it will be a number) and the div id as an array;
      }
    }
  },

  initGame = function () {
    aCards.length = 0; //reset the cards;
    $("cardTable").innerHTML = "";
    $("chances").innerHTML = iChances; //establish the total number of chances;
    $("matches").innerHTML = 0; //count the number of matches;

    aSeed.sort(function () { //randomly sort;
      return (Math.round(Math.random()) - 0.5);
    });
    for (i = iTotalCards; i--;) { //create an array that holds two of each number (array elements = [number displayed by the paragraph, div element]); REMEMBER that each div MUST have a unique id, hence the creation of an array that holds both the number and a unique id;
      aCards.push(JSLITE.dom.create({tag: "div",
        attr: {
          id: "card" + i
        },
        children: [
          JSLITE.dom.create({tag: "p",
            children: [
              JSLITE.dom.create({tag: "span",
                attr: {
                  innerHTML: aSeed[i]
                }
              })
            ]
          })
        ]
      }));
    }
    oFragment = document.createDocumentFragment(); //optimize;
    for (i = aCards.length; i--;) {
      oFragment.appendChild(aCards[i].dom);
    }
    $("cardTable").appendChild(oFragment); //only append to the dom once using a document fragment;
    oCardTable.on("click", fnShowValue); //event delegation;
    aSelectedCards.length = 0; //reset the array;
    aMatched.length = 0; //reset the array;
  };

  initGame(); //initiate the game;

});
</script>
</head>

<body>

<div class="scorecard">
  <h1>Chances</h1>
  <p id="chances"></p>
</div>

<div class="scorecard">
  <h1>Matches</h1>
  <p id="matches"></p>
</div>

<div id="scorer">
</div>

<div id="cardTable">
</div>

</body>
</html>
