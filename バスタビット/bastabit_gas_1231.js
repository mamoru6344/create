// @ts-nocheck
/**
 * ���s
 */
function execute() {
  // �A�N�e�B�u�V�[�g�̎擾
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = sheet.getActiveSheet();

  /**
   * �����ϐ��ݒ�
   */
  bet_ini = 10; // �����|����(�P�ʁFbits)
  play_cnt = 100; // �ő�v���C��
  payout = 10;   // �{��

  // ���s�O�ɃV�[�g���N���A����
  allClear(sheetName);

  // �����ݒ�i�V�[�g�̘g���쐬�j
  setupInitiarize(sheetName);
  
  // �񐔕�������
   playCntInput(sheetName,100);

  // �Q�[���X�^�[�g
  gameStart(sheetName,bet_ini,play_cnt,payout);
}

/**
 * �����ݒ�p�֐�
 * �\�̈�ԏ�̘g�g���쐬���܂�
 */
function setupInitiarize(sheetName) {
  sheetName.getRange(1,1).setValue("��");
  sheetName.getRange(1,2).setValue("�݌v�����z");
  sheetName.getRange(1,3).setValue("�|����");
  sheetName.getRange(1,4).setValue("������z");
  sheetName.getRange(1,5).setValue("���v");
}

/**
 * �I�[���N���A�֐�
 * ���s�O�ɃV�[�g���Y��ȏ�Ԃɂ��܂�
 */
function allClear(sheetName){
  sheetName.clear();
}

/**
 * �񐔓��͊֐�
 * �񐔂̗�ɂ���1����100�̒l����͂��܂��B
 * @param {var} �V�[�g��
 * @param {int} �v���C��
 */
function playCntInput(sheetName,play_cnt){
  for(var i = 2; i <= play_cnt + 1 ; i++){
    sheetName.getRange(i,1).setValue((i-1).toString());
  }
}

/**
 * �Q�[���X�^�[�g�֐�
 * �Q�[�����X�^�[�g���A���v�v�Z�A����|�����v�Z���s���܂��B
 * @param {var} �V�[�g��
 * @param {var} �����|����
 * @param {int} �v���C��
 * @param {int} �{��
 */
function gameStart(sheetName,bet_ini,play_cnt,payout){
  /**
   * �����錾
   */
  var ex_next_bet = bet_ini;                             // ����\�z�|����
  var ex_total_bet = bet_ini;                            // ����\�z�݌v�����z
  var ex_profit = ex_next_bet * payout - ex_total_bet;   // ����\�z���v
  var ex_val = 0;                                        // ������Ғl
  var bet_amount = bet_ini;                              // ����|����
  var current_total_bet = bet_ini;                       // ����݌v�����z
  var current_payout = 0;                                // ���������z
  var current_profit = bet_ini * payout - bet_ini;       // ���񗘉v

  // �����Q�[���ɂ��āA1��ڂɓ��͂��s��
  resultInput(bet_ini,bet_ini,bet_ini * payout,bet_ini * payout - bet_ini, 2, sheetName);

  for(var i = 3; i <= play_cnt + 1 ; i++){
    // �����v�Z(ex_total_bet)���s��
    ex_next_bet = bet_amount;                       // ����\�z�|����
    ex_total_bet = current_total_bet + ex_next_bet; // ����\�z�݌v�����z
    ex_profit = ex_next_bet * payout - ex_total_bet // ����\�z���v

    if(ex_profit <= 0){
      // ������Ғl(ex_val)���v�Z����
      ex_val = Math.abs(ex_profit);
      // ����|���������肷��
      /**
       * �v�Z���@
       * ����\�z�|����(�O��|�����Ɠ���) + �����|���� * (���Ғl�̐�Βl / �����|����)
       */
      bet_amount = ex_next_bet + bet_ini * Math.ceil(ex_val / (bet_ini * payout - bet_ini));
    } else {
      bet_amount = ex_next_bet;
    }

    // ���̑����ڂ��Čv�Z����
    current_total_bet = current_total_bet + bet_amount;  // ����݌v�����z
    current_payout = bet_amount * payout;                // ���������z
    current_profit = current_payout - current_total_bet; // ���񗘉v

    // ���v��0�������ꍇ
    if(current_profit == 0){
      bet_amount = bet_amount + bet_ini;
      current_total_bet = current_total_bet + bet_ini;     // ����݌v�����z
      current_payout = bet_amount * payout;                // ���������z
      current_profit = current_payout - current_total_bet; // ���񗘉v
    }

    // ���݃Q�[�����ʂ���������
    resultInput(current_total_bet,bet_amount,current_payout,current_profit, i, sheetName);
  }
}

/**
 * �Q�[�����ʓ���
 * �Q�[�����ʂ��V�[�g�ɓ��͂��܂��B
 * @param {int} �݌v�����z
 * @param {int} �|����
 * @param {int} ������z
 * @param {int} ���v
 * @param {int} ���͍s��
 * @param {var} �V�[�g��
 */
function resultInput(total_bet,bet_amount,recov_amount,profit,input_num,sheetName){
  sheetName.getRange(input_num,2).setValue(total_bet.toString()); // �݌v�����z
  sheetName.getRange(input_num,3).setValue(bet_amount.toString()); // �|����
  sheetName.getRange(input_num,4).setValue(recov_amount.toString()); // ������z
  sheetName.getRange(input_num,5).setValue(profit.toString()); // ���v
}