var config = {
  wager  : { value: 100, type: 'balance',    label: '賭け金額'  },
  payout : { value: 10,   type: 'multiplier', label: '払出倍率' },
  profitLoss : { value: 10, type: 'multiplier', label: '利益率(%)' },
  fincnt : { value: 100,  type: 'multiplier', label: '制限回数' }
};

var loseCnt     = 0;
var roundCnt    = 0;
var currentBet  = 0;
var sumBet      = 0;
var _stackBet   = [0, 0];
var winNumber   = 0;
var digit = config.wager.value;



if (engine.gameState === "GAME_STARTING") {
  fixBets();
}

engine.on('GAME_STARTING', onGameStarted);
engine.on('GAME_ENDED', onGameEnded);

function onGameStarted() {
  fixBets();
}

function onGameEnded() {
var lastGame = engine.history.first();
if (!lastGame.wager) {
   return;
}
if (lastGame.cashedAt) {
   var betpayout = Math.round((currentBet * config.payout.value) / 100);
   var profit    = Math.round(((currentBet * config.payout.value) - sumBet) / 100);
   log('結果：WON ,利益：', profit, 'bits, 払い出し：', betpayout, 'bits, BUST[', lastGame.bust, ']');
   currentBet  = 0;
   sumBet      = 0;
   loseCnt     = 0;
   _stackBet   = [0, 0];
   roundCnt    = 0;
   winNumber   += 1;
} else {
   _stackBet[0] = _stackBet[1];
   _stackBet[1] = currentBet;
   loseCnt += 1;
   log('結果：LOST, 損益：', Math.round(currentBet / 100), 'bits ,LOST回数：', loseCnt,', BUST[', lastGame.bust, ']');
 }
 if (config.fincnt.value <= loseCnt) {
  log('負け回数が指定の上限に達しました。スクリプトをを終了します');
  engine.removeListener('GAME_STARTING', onGameStarted);
  engine.removeListener('GAME_ENDED', onGameEnded);
 }
}

function fixBets() {
  roundCnt += 1;
  if(loseCnt == 0){
    currentBet = config.wager.value;
  }else if(100 * (currentBet * config.payout.value - (sumBet + currentBet)) / (currentBet * config.payout.value) <= config.profitLoss.value){
    currentBet = Math.ceil(Math.ceil((100 * sumBet) / (100 * config.payout.value -100 -(config.payout.value * config.profitLoss.value))) / digit ) * digit;
  }
  engine.bet(currentBet, config.payout.value);
  sumBet += currentBet;
  log('勝利数:',winNumber, ',' , 'ゲーム回数：',roundCnt, ', ', ' BET金額[現在,前々回,前回]：[', Math.round(currentBet / 100), ',',Math.round(_stackBet[0] / 100), ',', Math.round(_stackBet[1] / 100),  '], 合計支払：' , Math.round(sumBet / 100));
}
