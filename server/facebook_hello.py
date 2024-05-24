from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
import os

current_directory = os.path.dirname(__file__)
# Construct the relative path to the WebDriver executable
driver_path = os.path.join(current_directory, '..',
                           'chromedriver-win64', 'chromedriver.exe')
service = Service(driver_path)
driver = webdriver.Chrome(service=service)

try:
    driver.get('https://www.facebook.com')

    driver.implicitly_wait(10)

    email_or_phone_field = driver.find_element(By.NAME, 'email')

    email_or_phone_field.send_keys('hello')

    password = driver.find_element(By.NAME, 'pass')
    password.send_keys('test123')

finally:
    import time
    time.sleep(5)
    driver.quit()
