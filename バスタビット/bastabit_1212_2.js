var bet = 1;
var ratio_of_bet = 10;
var win_payout = 0;
var bet_total = 0;
var profit = 0;
var profit_rate = 10;
var number_of_traial = 100

function startBet(){
  Logger.log("1回目開始");
  var bet_ini = bet;
  gameStart(bet);
  writeSpreadSheet(bet, ratio_of_bet, win_payout, bet_total, profit, profit_rate, 1);
  for(let i = 2; i <= number_of_traial; i++){
    Logger.log(i + "回目開始");

    next_probably_total = bet_total + bet;
    next_probably_profit = bet * ratio_of_bet - next_probably_total;
    if (next_probably_profit < 0){
      multiplier = Math.ceil(Math.abs(next_probably_profit) / bet * ratio_of_bet);
      bet = bet + bet_ini * multiplier;
      gameStart(bet);
      writeSpreadSheet(bet, ratio_of_bet, win_payout, bet_total, profit, profit_rate, i);
    }else{
      gameStart(bet);
      writeSpreadSheet(bet, ratio_of_bet, win_payout, bet_total, profit, profit_rate, i);
    }
  }
}

function writeSpreadSheet(bet, ratio_of_bet, win_payout, bet_total, profit, profit_rate, i){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getActiveSheet();
  var lastRow = sh.getLastRow();
  sh.getRange(lastRow + 1, 1, 1, 6).setValues([[i, bet_total, bet, ratio_of_bet, win_payout, profit]]);
};

function gameStart(betMoney){
  win_payout = betMoney * ratio_of_bet;
  bet_total += betMoney;
  profit = win_payout - bet_total;
}

function result(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getActiveSheet();
  sh.clear();
  sh.getRange(1, 1, 1, 7).setValues([['投資回数', '累計投資額', '掛け金', '倍率', '回収金額', '利益','実行時間']]);
  startBet();
  Logger.log(profit);
}
