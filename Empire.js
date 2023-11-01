// Settings
var startBet = 0.01;
var betMultiplier = 2.0;
var maxLoseStreak = 5;
var betOn = 0; // 0 = CT, 1 = Dice, 2 = T
var switchMode = false; // If true, script will bet on CT 2 times and then on T 2 times.

// Do not touch
var init = false;
var win = true;
var betted = false;
var messageSend = true;
var stopScriptFlag = false;
var currentLoseStreak = 0;
var currentBet = 0.0;
var profit = 0.0;
var overAllProfit = 0.0;
var startBalance = 0.0;
var loseTime = 0;
var switchCount = 0;

var btnClear, btn001, btn01, btn1, btn10, btn100, btnHalf, btnDouble, btnMax;

console.log("Empire.js loaded!");
console.log("Script coded by: Lotiny");

startBalance = getBalance();

setupBtn();
main();

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.keyCode === 27) {
    stopScript();
  }
});

function main() {
  const taskId = setInterval(function () {
    //console.log("State: " + (getState() == 0 ? "Waiting" : getState() == 1 ? "Betting" : "Finished"));

    if (stopScriptFlag) {
      overAllProfit = parseFloat(getBalance() - startBalance).toFixed(2);

      console.log("Script stopped.");
      if (overAllProfit > 0.0) {
        console.log("You have make profit " + overAllProfit + " coins!");
      } else if (overAllProfit < 0.0) {
        console.log("You have lost " + overAllProfit + " coins. :(");
      } else {
        console.log("You have not make any profit.");
      }
      clearInterval(taskId);
      return;
    }

    if (loseTime >= 3) {
      console.log("You have lost 3 times, stopping script.");
      stopScript();
      return;
    }

    if (getState() == 0) {
      return;
    }

    if (getState() == 1) {
      if (betted) {
        return;
      }

      if (win) {
        currentBet = startBet;

        if (currentLoseStreak != 0) {
          currentLoseStreak = 0;
        }
      } else {
        if (currentLoseStreak == maxLoseStreak) {
          currentBet = startBet;
          currentLoseStreak = 0;
          loseTime++;

          console.log("Max lose streak reached, reseting bet to: " + startBet);
        } else {
          currentBet *= betMultiplier;
          currentLoseStreak++;

          console.log("Lose streak: " + currentLoseStreak);
        }
      }

      let roundNum = currentBet.toFixed(2);
      currentBet = parseFloat(roundNum);

      bet();
    } else {
      betted = false;

      if (
        document.getElementsByClassName("previous-rolls-item")[9].children[0]
          .className ==
        "coin-" +
          (betOn == 0 ? "ct" : betOn == 1 ? "bonus" : "t") +
          " ml-1 inline-block h-24 w-24 rounded-full"
      ) {
        win = true;
        profit = betOn == 1 ? currentBet * 14 : currentBet * 2;
      } else {
        win = false;
        profit = 0.0;
      }

      if (!messageSend) {
        console.log("Win: " + win);
        console.log("Profit: " + profit);
        messageSend = true;
      }

      profit = 0.0;
    }
  }, 1000);
}

function getState() {
  var seconds = parseFloat(
    document.getElementsByClassName("font-numeric text-2xl font-bold")[0]
      .innerText
  );

  if (seconds <= 0.5) {
    return 0;
  } else if (seconds < 5.0) {
    return 1;
  } else if (seconds < 10.0) {
    return 2;
  }
}

function bet() {
  if (currentBet == 0.0) {
    currentBet = startBet;
  }

  if (getBalance() < currentBet) {
    console.log("Not enough balance!");
    console.log("You need more " + (currentBet - getBalance()) + " coins.");
    stopScript();
    return;
  }

  btnClear.click();

  for (let i = 0; i < currentBet * 100; i++) {
    btn001.click();
  }

  betted = true;
  messageSend = false;

  console.log(" ");
  console.log("Bet placed!");
  console.log("Placed on: " + (betOn == 0 ? "CT" : betOn == 1 ? "Dice" : "T"));
  console.log("Amount: " + currentBet);
  console.log(" ");

  setTimeout(function () {
    if (switchMode) {
      if (switchCount == 2) {
        switchCount = 0;
        if (betOn == 0) {
          betOn = 2;
        } else {
          betOn = 0;
        }
      }

      if (switchCount < 2) {
        if (betOn == 0) {
          btnBetCT.click();
        } else {
          btnBetT.click();
        }
        switchCount++;
      }
    } else {
      switch (betOn) {
        case 0:
          btnBetCT.click();
          break;
        case 1:
          btnBetDice.click();
          break;
        case 2:
          btnBetT.click();
          break;
      }
    }
  }, 1000);
}

function setupBtn() {
  // Setup bet buttons
  var betBtnContainer = document.getElementsByClassName(
    "bet-buttons mb-1 w-full lg:mb-0"
  );
  var btn = betBtnContainer[0].getElementsByClassName("bet-btn");

  for (let i = 0; i < btn.length; i++) {
    switch (i) {
      case 0:
        btnBetCT = btn[i];
        break;
      case 1:
        btnBetDice = btn[i];
        break;
      case 2:
        btnBetT = btn[i];
        break;
    }

    var betterContainer = document.getElementsByClassName(
      "bet-input__controls-inner -ml-md"
    );
    var betterBtn = betterContainer[0].getElementsByTagName("button");

    for (let i = 0; i < betterBtn.length; i++) {
      switch (i) {
        case 0:
          btnClear = betterBtn[i];
          break;
        case 1:
          btn001 = betterBtn[i];
          break;
        case 2:
          btn01 = betterBtn[i];
          break;
        case 3:
          btn1 = betterBtn[i];
          break;
        case 4:
          btn10 = betterBtn[i];
          break;
        case 5:
          btn100 = betterBtn[i];
          break;
        case 6:
          btnHalf = betterBtn[i];
          break;
        case 7:
          btnDouble = betterBtn[i];
          break;
        case 8:
          btnMax = betterBtn[i];
          break;
      }
    }

    //console.log("Binded button: " + (i == 0 ? "CT" : i == 1 ? "Dice" : "T"));
  }
}

function getBalance() {
  var balance = document.getElementsByClassName("balance")[0].innerText;
  return parseFloat(balance).toFixed(2);
}

function stopScript() {
  stopScriptFlag = true;
}
