import time
import chromedriver_binary 
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import os
import signal
import math

#固定値宣言
USER_PROFILE = 'UserProfile'
betRow = []
startBet = 1
times = 100
payout = 10

def game(startBet,times,payout):
  try:
    # Optionでユーザプロファイルの場所を指定する
    options = webdriver.ChromeOptions()
    options = Options()
    options.add_argument('--user-data-dir=D:\\tmp\\User Data')
    options.add_argument('--profile-directory=Profile1')
    options.add_argument('--lang=en')

    #URL取得
    driver = webdriver.Chrome(ChromeDriverManager().install(),options=options)
    driver.get('https://www.bustabit.com/play')

    #掛け金計算
    betRows = culBet(startBet,times,payout)

    for betFee in betRows:
      #ボタン取得
      wait = WebDriverWait(driver, 10)
      wait.until(EC.element_to_be_clickable((By.XPATH, "/html/body/div/div/div/div[5]/div/div[2]/form/button")))
      betBottonElement = driver.find_element_by_xpath("/html/body/div/div/div/div[5]/div/div[2]/form/button")

      #bet金額入力欄
      feeElement = driver.find_element_by_xpath("/html/body/div/div/div/div[5]/div/div[2]/form/div[1]/div/input")
      feeElement.send_keys(betFee.replace( '\n' , '' ))

      #倍率入力欄
      payoutElement = driver.find_element_by_xpath("/html/body/div/div/div/div[5]/div/div[2]/form/div[2]/div/input")
      payoutElement.send_keys(payout)

      #BETボタン押下
      #betBottonElement.click()

  finally:
    os.kill(driver.service.process.pid,signal.SIGTERM)


#------------------------------------------------------#
#                     掛け金計算関数                   #
#------------------------------------------------------#
def culBet(startBet,times,payout):
  #-------------------------------------#
  #           初期変数設定              #
  #-------------------------------------#
  betAmount = startBet                                 # 初期掛け金(単位：bits)
  play_cnt = times                                     # 最大プレイ回数
  pay_out = payout                                     # 倍率
  betRow = []                                          # 戻り値格納用
  currentTotalBet = startBet                           # 次回累計投資額
  exTotalBet = startBet                                # 次回予想累計投資額
  exNextBet = startBet                                 # 次回予想掛け金
  exProfit = exNextBet * payout - exTotalBet           # 次回予想利益
  currentProfit = startBet * payout - startBet         # 次回利益

  for i in range(times):

    if(i == 0):
      # スタートのベット数を追加
      betRow.append(startBet)
      continue
    else:
      pass

    #初期計算
    exNextBet = betAmount                              # 次回予想掛け金
    exTotalBet = currentTotalBet + exNextBet           # 次回予想累計投資額
    exProfit = exNextBet * payout - exTotalBet         # 次回予想利益

    if(exProfit <= 0):
      # 次回期待値(ex_val)を計算する
      exVal = abs(exProfit)

      #次回掛け金を決定する
      betAmount = exNextBet + startBet * math.ceil(exVal / (startBet * payout - startBet))
    else:
      betAmount = exNextBet

    # その他項目を再計算
    currentTotalBet = currentTotalBet + betAmount      # 次回累計投資額
    currentPayout = betAmount * payout                 # 次回回収金額
    currentProfit = currentPayout - currentTotalBet    # 次回利益

    # 利益が0だった場合
    if(currentProfit == 0):
      betAmount = betAmount + startBet
      currentTotalBet = currentTotalBet + startBet
      currentPayout = betAmount * payout
      currentProfit = currentPayout - currentTotalBet
    else:
      pass

    #配列作成
    betRow.append(betAmount)

  return betRow

if __name__ == "__main__":
  game(startBet,times,payout)
