var config = {
  wager  : { value: 100, type: 'balance',    label: '�q�����z'  },
  payout : { value: 10,   type: 'multiplier', label: '���o�{��' },
  profitLoss : { value: 10, type: 'multiplier', label: '���v��(%)' },
  fincnt : { value: 100,  type: 'multiplier', label: '������' }
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
   log('���ʁFWON ,���v�F', profit, 'bits, �����o���F', betpayout, 'bits, BUST[', lastGame.bust, ']');
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
   log('���ʁFLOST, ���v�F', Math.round(currentBet / 100), 'bits ,LOST�񐔁F', loseCnt,', BUST[', lastGame.bust, ']');
 }
 if (config.fincnt.value <= loseCnt) {
  log('�����񐔂��w��̏���ɒB���܂����B�X�N���v�g�����I�����܂�');
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
  log('������:',winNumber, ',' , '�Q�[���񐔁F',roundCnt, ', ', ' BET���z[����,�O�X��,�O��]�F[', Math.round(currentBet / 100), ',',Math.round(_stackBet[0] / 100), ',', Math.round(_stackBet[1] / 100),  '], ���v�x���F' , Math.round(sumBet / 100));
}
