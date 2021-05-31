import time
import chromedriver_binary 
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.common.exceptions import NoSuchElementException
import os
import signal

#固定値宣言

def game():
  try:
    #テスト用
    driver = webdriver.Chrome('D:\プログラミング\chromedriver_win32\chromedriver')

    # Optionでユーザプロファイルの場所を指定する
    options = webdriver.ChromeOptions()
    options.add_argument('--user-data-dir=' + USER_PROFILE)

    #URL取得
    driver = webdriver.Chrome(options=options)
    driver.get('https://www.bustabit.com/play')

  finally:
    os.kill(driver.service.process.pid,signal.SIGTERM)

if __name__ == "__main__":
  game()
