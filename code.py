# !pip install selenium
# !pip install chromedriver-autoinstaller

import pandas as pd
from selenium import webdriver
import chromedriver_autoinstaller
import time
from requests_html import HTMLSession
Name = []
Discription = []
URL = []
Date = []
s = HTMLSession()

chromedriver_autoinstaller.install()  # Check if the current version of chromedriver exists
                                      # and if it doesn't exist, download it automatically,
                                      # then add chromedriver to path

driver = webdriver.Chrome()
driver.get("https://www.beitberl.ac.il/about/events/pages/default.aspx")
time.sleep(10)

for link in driver.find_elements_by_xpath('//a[@class="cbs-picture3LinesLine1Link"]'):
  li = link.get_attribute('href')

  r = s.get(li)
  Name.append(r.html.xpath('(//h1)/div/text()'))
  URL.append(li)
  Date.append(r.html.xpath('//div[@data-name="שדה דף: תאריך מאמר"]/text()'))
  Dis = r.html.xpath('//div[@data-name="שדה דף: תוכן דף"]//text()')
  
  discription = (' '.join(x for x in Dis))

  Discription.append(discription)



df = pd.DataFrame(Name, columns = ['Event Name'])
df['Date'] = Date
df['Discription'] = Discription
df['URL'] = URL

print(df)

df.to_excel(r'./Data.xlsx', index = False, encoding = 'utf-8')