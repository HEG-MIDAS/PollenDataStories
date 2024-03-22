import matplotlib.pyplot as plt
import glob
import os
import time
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

POLLEN_CONCENTRATION = 0

df = pd.read_csv('data/marronier_2004_2023.txt', names=['time', 'pollen'], header=0, sep=';')
df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
df['pollen'].replace('-', '0', inplace=True)
df['pollen']=df['pollen'].astype(int)

df_marr = pd.read_csv('data/marronier_bourgeon_1994_2023.txt', names=['time', 'eclosion'], header=0, sep=';')
df_marr['time'] = pd.to_datetime(df_marr['time'], format='%Y%m%d')
df_marr['eclosion']=df_marr['eclosion'].astype(int)

df = pd.merge(df, df_marr, on='time', how='left')
df.fillna({'eclosion':0}, inplace=True)

ax = df.plot(x='time', y='pollen')
df.plot(x='time', y='eclosion', ax=ax, secondary_y=True)
plt.show()

df_marr['year'] = df_marr['year'] = df_marr['time'].dt.year
df_marr = df_marr[df_marr['year'] < 2016]
df_marr = df_marr[df_marr['year'] > 2003]

# Compute mean of each year
year_pollen_tamb = []
pollen_start = []
pollen_duration = []
pollen_date_max = []

for i in range(2004, 2016):
    year_pollen_tamb.append([i, df['pollen'][df['time'].dt.year == i].mean()])
    sub_df = df[df['time'].dt.year == i]
    val_time_start = df['time'].iloc[sub_df['pollen'].gt(POLLEN_CONCENTRATION).idxmax()] if sub_df['pollen'].gt(POLLEN_CONCENTRATION).any() else np.nan
    pollen_start.append([val_time_start])
    pollen_duration.append([i, sub_df['pollen'][sub_df['pollen'] > POLLEN_CONCENTRATION].count()])
    pollen_date_max.append([df['time'].iloc[sub_df['pollen'].idxmax()]])

################################################################################################################################
# Compute start of pollen
################################################################################################################################
# df_pollen_start = pd.DataFrame(data=pollen_start, columns=['time', 'tamb'])

# df_pollen_start.dropna(inplace=True)

# df_pollen_start['year'] = df_pollen_start['time'].dt.year
# # df_pollen_start['month-day'] = (df_pollen_start['time'].dt.strftime('%m%d')).astype(int)
# df_pollen_start['days'] = df_pollen_start['time'].dt.dayofyear
# # print(df_pollen_start[['time', 'days']])

# # Compute linear regression
# linear_regressor = LinearRegression()
# linear_regressor.fit(df_pollen_start['year'].values.reshape(-1, 1), df_pollen_start['days'].values.reshape(-1, 1))
# print(linear_regressor.coef_)
# df_pollen_start['days_pred'] = linear_regressor.predict(df_pollen_start['year'].values.reshape(-1, 1))

# # print(df_pollen_start)

# ax = df_pollen_start.plot(x='year', y='days')
# df_pollen_start.plot(x='year', y='days_pred', ax=ax)
# plt.title("First pollen detection of the year over the years")
# plt.show()

################################################################################################################################
# Compute date of maximum pollen
################################################################################################################################
df_pollen_date_max = pd.DataFrame(data=pollen_date_max, columns=['time'])

df_pollen_date_max['year'] = df_pollen_date_max['time'].dt.year
df_pollen_date_max['days_pollen'] = df_pollen_date_max['time'].dt.dayofyear

print(df_pollen_date_max)

# Compute linear regression
# linear_regressor = LinearRegression()
# linear_regressor.fit(df_pollen_date_max['year'].values.reshape(-1, 1), df_pollen_date_max['days_pollen'].values.reshape(-1, 1))
# df_pollen_date_max['days_pollen_pred'] = linear_regressor.predict(df_pollen_date_max['year'].values.reshape(-1, 1))

df_marr['days_marronier'] = df_marr['time'].dt.dayofyear

# linear_regressor.fit(df_marr['year'].values.reshape(-1, 1), df_marr['days_marronier'].values.reshape(-1, 1))
# df_marr['days_marronier_pred'] = linear_regressor.predict(df_marr['year'].values.reshape(-1, 1))

ax = df_pollen_date_max.plot(x='year', y='days_pollen')
# df_pollen_date_max.plot(x='year', y='days_pollen_pred', ax=ax)

df_marr.plot(x='year', y='days_marronier', ax=ax)
# df_marr.plot(x='year', y='days_marronier_pred', ax=ax, secondary_y=True)

# df_merged = pd.merge(df_pollen_date_max, df_marr, on='year', how='left')
# df_merged = df_merged[['year', 'days_pollen', 'days_marronier']]
# df_merged['days_marronier_gradient'] = np.gradient(df_merged['days_marronier'].to_numpy())
# df_merged['days_pollen_gradient'] = np.gradient(df_merged['days_pollen'].to_numpy())
# df_merged['days_marronier_gradient_2'] = np.gradient(df_merged['days_marronier_gradient'].to_numpy())
# df_merged['days_pollen_gradient_2'] = np.gradient(df_merged['days_pollen_gradient'].to_numpy())
# print(df_merged)
# print(df_merged.corr(method='pearson'))

# df_merged.plot(x='year', y='days_marronier_gradient_2', ax=ax, secondary_y=True)
# df_merged.plot(x='year', y='days_pollen_gradient_2', ax=ax, secondary_y=True)

ax.grid(True, 'both')
ax.minorticks_on()
plt.title("Date of the max pollen detected of the year over the years")
plt.show()

################################################################################################################################
# Compute duration of pollen
################################################################################################################################

df_pollen_duration = pd.DataFrame(data=pollen_duration, columns=['time', 'duration'])

# print(df_pollen_duration[['time', 'duration']])

# Compute linear regression
# linear_regressor = LinearRegression()
# linear_regressor.fit(df_pollen_duration['time'].values.reshape(-1, 1), df_pollen_duration['duration'].values.reshape(-1, 1))
# df_pollen_duration['duration_pred'] = linear_regressor.predict(df_pollen_duration['time'].values.reshape(-1, 1))
# print(linear_regressor.coef_)

# linear_regressor.fit(df_pollen_duration['time'].values.reshape(-1, 1), df_pollen_duration['tamb'].values.reshape(-1, 1))
# df_pollen_duration['tamb_pred'] = linear_regressor.predict(df_pollen_duration['time'].values.reshape(-1, 1))

ax = df_pollen_duration.plot(x='time', y='duration')
# df_pollen_duration.plot(x='time', y='duration_pred', ax=ax)
df_marr.plot(x='year', y='days_marronier', ax=ax, secondary_y=True)
# df_pollen_duration.plot(x='time', y='tamb_pred', ax=ax, secondary_y=True)
plt.title("Days of pollen over the years")
plt.show()

################################################################################################################################
# Compute comparison between data
################################################################################################################################

# df2 = pd.DataFrame(data=year_pollen_tamb, columns=['time', 'pollen', 'tamb', 'vv_ms', 'precipitation', 'ensoleillement'])

# # Compute linear regression
# linear_regressor = LinearRegression()
# linear_regressor.fit(df2['time'].values.reshape(-1, 1), df2['pollen'].values.reshape(-1, 1))
# df2['pollen_pred'] = linear_regressor.predict(df2['time'].values.reshape(-1, 1))

# linear_regressor.fit(df2['time'].values.reshape(-1, 1), df2['tamb'].values.reshape(-1, 1))
# df2['tamb_pred'] = linear_regressor.predict(df2['time'].values.reshape(-1, 1))

# linear_regressor.fit(df2['time'].values.reshape(-1, 1), df2['precipitation'].values.reshape(-1, 1))
# df2['precipitation_pred'] = linear_regressor.predict(df2['time'].values.reshape(-1, 1))

# ax = df2.plot(x='time', y='pollen')
# df2.plot(x='time', y='pollen_pred', ax=ax)

# df2.plot(x='time', y='tamb', ax=ax, secondary_y=True)
# df2.plot(x='time', y='tamb_pred', ax=ax, secondary_y=True)

# # ax = df2.plot(x='time', y='pollen', color='red')
# # df2.plot(x='time', y='pollen_pred', ax=ax, color='red')
# # ax2 = ax.twinx()
# # ax2.spines['right'].set_position(('axes', 1.0))
# # df2.plot(x='time', y='tamb', ax=ax2, color='green')
# # df2.plot(x='time', y='tamb_pred', ax=ax2, color='green')
# # ax3 = ax.twinx()
# # ax3.spines['right'].set_position(('axes', 1.1))
# # df2.plot(x='time', y='vv_ms', ax=ax3, color='blue')
# # df2.plot(x='time', y='vv_ms_pred', ax=ax3, color='blue')

# plt.title("Avg pollen over the years")
# plt.show()

# # df_corr = df2[['pollen', 'tamb', 'vv_ms', 'precipitation', 'ensoleillement']]
# # # df_corr = (df_corr-df_corr.min())/(df_corr.max()-df_corr.min())
# # print(df_corr.corr(method='pearson'))
