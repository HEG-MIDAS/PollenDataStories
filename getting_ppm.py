import requests
import ast

jeton = "?!`a(!C&.I)=6u[@':/,"
url = "https://gexplore.ch/api/search/"

starting_date = "2011-01-01 00:00:00"
ending_date = "2023-12-31 23:59:00"

body = {
    "sources": [
    "sabra"
  ],
  "stations": [
    "meyrin"
  ],
  "parameters": [
    "pm2_5",
    "pm10",
    "no2",
    "o3"
  ],
  "start_date": "2011-01-01 00:00:00",
  "end_date": "2023-12-31 23:59:00",
  "limit": 1,
  "order": "DESC"
}

x = requests.post(url, json=body)
# print(x.text)
data = ast.literal_eval(x.text)['SABRA']['Meyrin']
array_data = [["date", "PM2.5", "PM10", "NO2", "O3"]]

for d in data:
    array_data.append([d, data[d]["PM2.5*"] if "PM2.5*" in data[d] else '', data[d]["PM10*"] if "PM10*" in data[d] else '', data[d]["NO2"] if "NO2" in data[d] else '', data[d]["O3"] if "O3" in data[d] else ''])

# print(array_data)

f = open("ppm.csv", "w")
for line in array_data:
    f.write(f"{';'.join(map(str, line))}\n")
f.close()