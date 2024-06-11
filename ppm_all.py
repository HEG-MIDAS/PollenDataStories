import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

# Urbain : Necker
# Suburbain : Foron, Meyrin
# Rural : Passeiry

###########################################################################################
# Suburbain
###########################################################################################

df_meyrin = pd.read_csv('ppm_meyrin.csv', names=['date', 'PM2.5', 'PM10', 'NO2', 'O3'], header=0, sep=';')
df_meyrin['date'] = pd.to_datetime(df_meyrin['date'], format='%Y%m%d %H:%M:%S')

df_meyrin = df_meyrin[['date', 'PM10', 'NO2', 'O3']]

df_foron = pd.read_csv('ppm_foron.csv', names=['date', 'PM2.5', 'PM10', 'NO2', 'O3'], header=0, sep=';')
df_foron['date'] = pd.to_datetime(df_foron['date'], format='%Y%m%d %H:%M:%S')

df_foron = df_foron[['date', 'PM10', 'NO2', 'O3']]

df_merged = pd.merge(df_meyrin, df_foron, on='date')
print(df_merged)

df_mean = df_merged.resample('Y', on='date').mean().dropna(how='all')
df_mean = df_mean.reset_index()

print(df_mean)

df_mean['PM10_average'] = df_mean[['PM10_x', 'PM10_y']].mean(axis=1)
df_mean['NO2_average'] = df_mean[['NO2_x', 'NO2_y']].mean(axis=1)
df_mean['O3_average'] = df_mean[['O3_x', 'O3_y']].mean(axis=1)
df_mean['year'] = [2011+i for i in range(len(df_mean['date']))]

print(df_mean)

linear_regressor = LinearRegression()
linear_regressor.fit(df_mean['year'].values.reshape(-1, 1), df_mean['PM10_average'].values.reshape(-1, 1))
df_mean['PM10_average_pred'] = linear_regressor.predict(df_mean['year'].values.reshape(-1, 1))

print("PM10_average_pred : {}".format(linear_regressor.coef_))

linear_regressor.fit(df_mean['year'].values.reshape(-1, 1), df_mean['NO2_average'].values.reshape(-1, 1))
df_mean['NO2_average_pred'] = linear_regressor.predict(df_mean['year'].values.reshape(-1, 1))

print("NO2_average_pred : {}".format(linear_regressor.coef_))

linear_regressor.fit(df_mean['year'].values.reshape(-1, 1), df_mean['O3_average'].values.reshape(-1, 1))
df_mean['O3_average_pred'] = linear_regressor.predict(df_mean['year'].values.reshape(-1, 1))

print("O3_average_pred : {}".format(linear_regressor.coef_))

ax = df_mean.plot(x='year', y='PM10_average')
df_mean.plot(x='year', y='PM10_average_pred', ax=ax)
df_mean.plot(x='year', y='NO2_average', ax=ax)
df_mean.plot(x='year', y='NO2_average_pred', ax=ax)
df_mean.plot(x='year', y='O3_average', ax=ax)
df_mean.plot(x='year', y='O3_average_pred', ax=ax)
plt.show()



###########################################################################################
# Urbain
###########################################################################################

df_necker = pd.read_csv('ppm_necker.csv', names=['date', 'PM2.5', 'PM10', 'NO2', 'O3'], header=0, sep=';')
df_necker['date'] = pd.to_datetime(df_necker['date'], format='%Y%m%d %H:%M:%S')

df_necker = df_necker[['date', 'PM10', 'NO2', 'O3']]

print(df_necker)

df_mean = df_necker.resample('Y', on='date').mean().dropna(how='all')
df_mean = df_mean.reset_index()

df_mean['year'] = [2011+i for i in range(len(df_mean['date']))]

print(df_mean)

linear_regressor = LinearRegression()
m = ~(np.isnan(df_mean['year'].values) | np.isnan(df_mean['PM10'].values))
linear_regressor.fit(df_mean['year'].values.reshape(-1, 1)[m], df_mean['PM10'].values.reshape(-1, 1)[m])
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

###########################################################################################
# Rural
###########################################################################################

df_passeiry = pd.read_csv('ppm_passeiry.csv', names=['date', 'PM2.5', 'PM10', 'NO2', 'O3'], header=0, sep=';')
df_passeiry['date'] = pd.to_datetime(df_passeiry['date'], format='%Y%m%d %H:%M:%S')

df_passeiry = df_passeiry[['date', 'PM10', 'NO2', 'O3']]

print(df_passeiry)

df_mean = df_passeiry.resample('Y', on='date').mean().dropna(how='all')
df_mean = df_mean.reset_index()

df_mean['year'] = [2011+i for i in range(len(df_mean['date']))]

print(df_mean)

linear_regressor = LinearRegression()
m = ~(np.isnan(df_mean['year'].values) | np.isnan(df_mean['PM10'].values))
linear_regressor.fit(df_mean['year'].values.reshape(-1, 1)[m], df_mean['PM10'].values.reshape(-1, 1)[m])
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

"""
# ax = df.plot(x='date', y='PM10')
# plt.show()

# df = df.resample('d', on='date').mean().dropna(how='all')
# df = df.reset_index()
df_mean = df_meyrin.resample('Y', on='date').mean().dropna(how='all')
df_mean = df_mean.reset_index()
df_mean['year'] = [2011+i for i in range(len(df_mean['date']))]
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