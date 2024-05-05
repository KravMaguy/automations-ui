import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Load actions
with open('actions.json', 'r') as f:
    actions = json.load(f)

# Set up the driver
options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(service=Service(
    ChromeDriverManager().install()), options=options)

# Perform actions
for action in actions:
    if action['type'] == 'click':
        element = driver.find_element(By.XPATH, action['xpath'])
        element.click()
    elif action['type'] == 'input':
        element = driver.find_element(By.XPATH, action['xpath'])
        element.send_keys(action['value'])

driver.quit()
