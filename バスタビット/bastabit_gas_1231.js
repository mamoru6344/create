// @ts-nocheck
/**
 * 実行
 */
function execute() {
  // アクティブシートの取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = sheet.getActiveSheet();

  /**
   * 初期変数設定
   */
  bet_ini = 10; // 初期掛け金(単位：bits)
  play_cnt = 100; // 最大プレイ回数
  payout = 10;   // 倍率

  // 実行前にシートをクリアする
  allClear(sheetName);

  // 初期設定（シートの枠を作成）
  setupInitiarize(sheetName);
  
  // 回数部分入力
   playCntInput(sheetName,100);

  // ゲームスタート
  gameStart(sheetName,bet_ini,play_cnt,payout);
}

/**
 * 初期設定用関数
 * 表の一番上の枠組を作成します
 */
function setupInitiarize(sheetName) {
  sheetName.getRange(1,1).setValue("回数");
  sheetName.getRange(1,2).setValue("累計投資額");
  sheetName.getRange(1,3).setValue("掛け金");
  sheetName.getRange(1,4).setValue("回収金額");
  sheetName.getRange(1,5).setValue("利益");
}

/**
 * オールクリア関数
 * 実行前にシートを綺麗な状態にします
 */
function allClear(sheetName){
  sheetName.clear();
}

/**
 * 回数入力関数
 * 回数の列について1から100の値を入力します。
 * @param {var} シート名
 * @param {int} プレイ回数
 */
function playCntInput(sheetName,play_cnt){
  for(var i = 2; i <= play_cnt + 1 ; i++){
    sheetName.getRange(i,1).setValue((i-1).toString());
  }
}

/**
 * ゲームスタート関数
 * ゲームをスタートし、利益計算、次回掛け金計算を行います。
 * @param {var} シート名
 * @param {var} 初期掛け金
 * @param {int} プレイ回数
 * @param {int} 倍率
 */
function gameStart(sheetName,bet_ini,play_cnt,payout){
  /**
   * 初期宣言
   */
  var ex_next_bet = bet_ini;                             // 次回予想掛け金
  var ex_total_bet = bet_ini;                            // 次回予想累計投資額
  var ex_profit = ex_next_bet * payout - ex_total_bet;   // 次回予想利益
  var ex_val = 0;                                        // 次回期待値
  var bet_amount = bet_ini;                              // 次回掛け金
  var current_total_bet = bet_ini;                       // 次回累計投資額
  var current_payout = 0;                                // 次回回収金額
  var current_profit = bet_ini * payout - bet_ini;       // 次回利益

  // 初期ゲームについて、1列目に入力を行う
  resultInput(bet_ini,bet_ini,bet_ini * payout,bet_ini * payout - bet_ini, 2, sheetName);

  for(var i = 3; i <= play_cnt + 1 ; i++){
    // 初期計算(ex_total_bet)を行う
    ex_next_bet = bet_amount;                       // 次回予想掛け金
    ex_total_bet = current_total_bet + ex_next_bet; // 次回予想累計投資額
    ex_profit = ex_next_bet * payout - ex_total_bet // 次回予想利益

    if(ex_profit <= 0){
      // 次回期待値(ex_val)を計算する
      ex_val = Math.abs(ex_profit);
      // 次回掛け金を決定する
      /**
       * 計算方法
       * 次回予想掛け金(前回掛け金と同じ) + 初期掛け金 * (期待値の絶対値 / 初期掛け金)
       */
      bet_amount = ex_next_bet + bet_ini * Math.ceil(ex_val / (bet_ini * payout - bet_ini));
    } else {
      bet_amount = ex_next_bet;
    }

    // その他項目を再計算する
    current_total_bet = current_total_bet + bet_amount;  // 次回累計投資額
    current_payout = bet_amount * payout;                // 次回回収金額
    current_profit = current_payout - current_total_bet; // 次回利益

    // 利益が0だった場合
    if(current_profit == 0){
      bet_amount = bet_amount + bet_ini;
      current_total_bet = current_total_bet + bet_ini;     // 次回累計投資額
      current_payout = bet_amount * payout;                // 次回回収金額
      current_profit = current_payout - current_total_bet; // 次回利益
    }

    // 現在ゲーム結果を書き込む
    resultInput(current_total_bet,bet_amount,current_payout,current_profit, i, sheetName);
  }
}

/**
 * ゲーム結果入力
 * ゲーム結果をシートに入力します。
 * @param {int} 累計投資額
 * @param {int} 掛け金
 * @param {int} 回収金額
 * @param {int} 利益
 * @param {int} 入力行数
 * @param {var} シート名
 */
function resultInput(total_bet,bet_amount,recov_amount,profit,input_num,sheetName){
  sheetName.getRange(input_num,2).setValue(total_bet.toString()); // 累計投資額
  sheetName.getRange(input_num,3).setValue(bet_amount.toString()); // 掛け金
  sheetName.getRange(input_num,4).setValue(recov_amount.toString()); // 回収金額
  sheetName.getRange(input_num,5).setValue(profit.toString()); // 利益
}