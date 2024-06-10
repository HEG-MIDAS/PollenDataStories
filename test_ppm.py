import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

df = pd.read_csv('ppm.csv', names=['date', 'PM2.5', 'PM10', 'NO2', 'O3'], header=0, sep=';')
df['date'] = pd.to_datetime(df['date'], format='%Y%m%d %H:%M:%S')

df = df[['date', 'PM10', 'NO2', 'O3']]

# ax = df.plot(x='date', y='PM10')
# plt.show()

# df = df.resample('d', on='date').mean().dropna(how='all')
# df = df.reset_index()
df_mean = df.resample('m', on='date').mean().dropna(how='all')
df_mean = df_mean.reset_index()

ax = df_mean.plot(x='date', y='O3')
plt.show()


"""df_mean['year'] = [2011+i for i in range(len(df_mean['date']))]
# print(df_mean)

linear_regressor = LinearRegression()
linear_regressor.fit(df_mean['year'].values.reshape(-1, 1), df_mean['PM10'].values.reshape(-1, 1))
df_mean['PM10_pred'] = linear_regressor.predict(df_mean['year'].values.reshape(-1, 1))

print("PM10_pred : {}".format(linear_regressor.coef_))

linear_regressor.fit(df_mean['year'].values.reshape(-1, 1), df_mean['NO2'].values.reshape(-1, 1))
df_mean['NO2_pred'] = linear_regressor.predict(df_mean['year'].values.reshape(-1, 1))

print("NO2_pred : {}".format(linear_regressor.coef_))

linear_regressor.fit(df_mean['year'].values.reshape(-1, 1), df_mean['O3'].values.reshape(-1, 1))
df_mean['O3_pred'] = linear_regressor.predict(df_mean['year'].values.reshape(-1, 1))

print("O3_pred : {}".format(linear_regressor.coef_))

ax = df_mean.plot(x='year', y='PM10')
df_mean.plot(x='year', y='PM10_pred', ax=ax)
df_mean.plot(x='year', y='NO2', ax=ax)
df_mean.plot(x='year', y='NO2_pred', ax=ax)
df_mean.plot(x='year', y='O3', ax=ax)
df_mean.plot(x='year', y='O3_pred', ax=ax)
plt.show()




df_max = df.resample('Y', on='date').max().dropna(how='all')
df_max = df_max.reset_index()
df_max['year'] = [2011+i for i in range(len(df_max['date']))]
# print(df_max)

linear_regressor = LinearRegression()
linear_regressor.fit(df_max['year'].values.reshape(-1, 1), df_max['PM10'].values.reshape(-1, 1))
df_max['PM10_pred'] = linear_regressor.predict(df_max['year'].values.reshape(-1, 1))

print("PM10_pred : {}".format(linear_regressor.coef_))

linear_regressor.fit(df_max['year'].values.reshape(-1, 1), df_max['NO2'].values.reshape(-1, 1))
df_max['NO2_pred'] = linear_regressor.predict(df_max['year'].values.reshape(-1, 1))

print("NO2_pred : {}".format(linear_regressor.coef_))

linear_regressor.fit(df_max['year'].values.reshape(-1, 1), df_max['O3'].values.reshape(-1, 1))
df_max['O3_pred'] = linear_regressor.predict(df_max['year'].values.reshape(-1, 1))

print("O3_pred : {}".format(linear_regressor.coef_))

ax = df_max.plot(x='year', y='PM10')
df_max.plot(x='year', y='PM10_pred', ax=ax)
df_max.plot(x='year', y='NO2', ax=ax)
df_max.plot(x='year', y='NO2_pred', ax=ax)
df_max.plot(x='year', y='O3', ax=ax)
df_max.plot(x='year', y='O3_pred', ax=ax)
plt.show()"""