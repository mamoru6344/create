import time
import chromedriver_binary 
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.common.exceptions import NoSuchElementException
import os
import signal
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

#固定値宣言
USER_PROFILE = 'UserData'

def login():
  try:
    
    # Optionでユーザプロファイルの場所を指定する
    options = webdriver.ChromeOptions()
    options = Options()
    options.add_argument('--user-data-dir=D:\\tmp\\User Data')
    options.add_argument('--profile-directory=Profile1')
    options.add_argument('--lang=en')

    #URL取得
    driver = driver = webdriver.Chrome(ChromeDriverManager().install(),options=options)
    driver.get('https://www.bustabit.com/play')

  finally:
    os.kill(driver.service.process.pid,signal.SIGTERM)

if __name__ == "__main__":
  login()
