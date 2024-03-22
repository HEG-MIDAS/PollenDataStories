import matplotlib.pyplot as plt
import glob
import os
import time
import datetime
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

POLLEN_CONCENTRATION = 0

# df = pd.read_csv('order_118587_data.txt', sep=';')
# df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
# df['kabetud0'].replace('-', '0', inplace=True)
# df['pollen']=df['kabetud0'].astype(int)

df = pd.read_csv('data/noisetier_1994_2023.txt', names=['time', 'pollen'], header=0, sep=';')
df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
df['pollen'].replace('-', '0', inplace=True)
df['pollen']=df['pollen'].astype(int)

df_temp = pd.read_csv('data/tamb_1994_2023.txt', names=['time', 'tamb'], header=0, sep=';')
df_temp['time'] = pd.to_datetime(df_temp['time'], format='%Y%m%d')
df_temp['tamb'].replace('-', 0, inplace=True)
df_temp['tamb']=df_temp['tamb'].astype(float)

df_vv_ms = pd.read_csv('data/vv_ms_1994_2023.txt', names=['time', 'vv_ms'], header=0, sep=';')
df_vv_ms['time'] = pd.to_datetime(df_vv_ms['time'], format='%Y%m%d')
df_vv_ms['vv_ms'].replace('-', 0, inplace=True)
df_vv_ms['vv_ms']=df_vv_ms['vv_ms'].astype(float)

df_precipitation = pd.read_csv('data/precipitation_1994_2023.txt', names=['time', 'precipitation'], header=0, sep=';')
df_precipitation['time'] = pd.to_datetime(df_precipitation['time'], format='%Y%m%d')
df_precipitation['precipitation'].replace('-', 0, inplace=True)
df_precipitation['precipitation']=df_precipitation['precipitation'].astype(float)

df_ensoleillement = pd.read_csv('data/ensoleillement_1994_2023.txt', names=['time', 'ensoleillement'], header=0, sep=';')
df_ensoleillement['time'] = pd.to_datetime(df_ensoleillement['time'], format='%Y%m%d')
df_ensoleillement['ensoleillement'].replace('-', 0, inplace=True)
df_ensoleillement['ensoleillement']=df_ensoleillement['ensoleillement'].astype(float)

df = pd.merge(df, df_temp, on='time', how='right')
df = pd.merge(df, df_vv_ms, on='time', how='left')
df = pd.merge(df, df_precipitation, on='time', how='left')
df = pd.merge(df, df_ensoleillement, on='time', how='left')

df_corr = df[['time', 'pollen', 'tamb', 'ensoleillement', 'vv_ms']]
df_corr = df_corr[df_corr['time'].dt.month >= 2]
df_corr = df_corr[df_corr['time'].dt.month <= 3]
df_corr['pollen'] = df_corr['pollen'].shift(0)
# df_corr = df_corr[df_corr['pollen'] > 0]
# print(df_corr.to_string())
# print(df_corr.corr(method='pearson'))

# ax = df.plot(x='time', y='pollen')
# # df.plot(x='time', y='tamb', ax=ax, secondary_y=True)
# plt.show()

# Compute mean of each year
year_pollen_tamb = []
pollen_start = []
pollen_duration = []
pollen_date_max = []
new_order = []

for i in range(1994, 2024):
    year_pollen_tamb.append([i, df['pollen'][df['time'].dt.year == i].mean(), df['tamb'][df['time'].dt.year == i].mean(), df['vv_ms'][df['time'].dt.year == i].mean(), df['precipitation'][df['time'].dt.year == i].mean(), df['ensoleillement'][df['time'].dt.year == i].mean()])
    sub_df = df[df['time'].dt.year == i]
    val_time_start = df['time'].iloc[sub_df['pollen'].gt(POLLEN_CONCENTRATION).idxmax()] if sub_df['pollen'].gt(POLLEN_CONCENTRATION).any() else np.nan
    val_tamb_start = df['tamb'].iloc[sub_df['pollen'].gt(POLLEN_CONCENTRATION).idxmax()] if sub_df['pollen'].gt(POLLEN_CONCENTRATION).any() else np.nan
    pollen_start.append([val_time_start, val_tamb_start])
    pollen_duration.append([i, sub_df['pollen'][sub_df['pollen'] > POLLEN_CONCENTRATION].count(), df['tamb'][df['time'].dt.year == i].mean(), df_ensoleillement['ensoleillement'][df_ensoleillement['time'].dt.year == i].mean()])
    pollen_date_max.append([df['time'].iloc[sub_df['pollen'].idxmax()]])

    if i < 2023:
        mask = (df['time'] > datetime.datetime.strptime(str(i)+"-10-01", "%Y-%m-%d")) & (df['time'] <= datetime.datetime.strptime(str(i+1)+"-09-30", "%Y-%m-%d"))
        df_temp = df.loc[mask]
        new_order.append([i, df_temp['precipitation'].mean(), df_temp['pollen'].mean(), df['time'].iloc[df_temp['pollen'].gt(POLLEN_CONCENTRATION).idxmax()], df['tamb'].iloc[df_temp['pollen'].gt(POLLEN_CONCENTRATION).idxmax()], df['pollen'].iloc[df_temp['pollen'].idxmax()]])

    # sub_df = sub_df[sub_df['time'].dt.month >= 1]
    # sub_df = sub_df[sub_df['time'].dt.month <= 3]
    # sub_df['ma_pollen'] = sub_df['pollen'].rolling(3, center=True).mean()
    # sub_df['ma_tamb'] = sub_df['tamb'].rolling(3, center=True).mean()
    # sub_df['pollen'] = sub_df['pollen'].shift(0)
    # # sub_df = sub_df[sub_df['pollen'] > 0]
    # # print(sub_df.to_string())
    # print(sub_df.corr(method='pearson'))

# ################################################################################################################################
# # Compute start of pollen
# ################################################################################################################################
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

# ################################################################################################################################
# # Compute date of maximum pollen
# ################################################################################################################################
# df_pollen_date_max = pd.DataFrame(data=pollen_date_max, columns=['time'])

# df_pollen_date_max['year'] = df_pollen_date_max['time'].dt.year
# # df_pollen_date_max['month-day'] = (df_pollen_date_max['time'].dt.strftime('%m%d')).astype(int)
# df_pollen_date_max['days'] = df_pollen_date_max['time'].dt.dayofyear

# # Compute linear regression
# linear_regressor = LinearRegression()
# linear_regressor.fit(df_pollen_date_max['year'].values.reshape(-1, 1), df_pollen_date_max['days'].values.reshape(-1, 1))
# df_pollen_date_max['days_pred'] = linear_regressor.predict(df_pollen_date_max['year'].values.reshape(-1, 1))

# # print(df_pollen_date_max)

# ax = df_pollen_date_max.plot(x='year', y='days')
# df_pollen_date_max.plot(x='year', y='days_pred', ax=ax)
# plt.title("Date of the max pollen detected of the year over the years")
# plt.show()

# ################################################################################################################################
# # Compute duration of pollen
# ################################################################################################################################

# df_pollen_duration = pd.DataFrame(data=pollen_duration, columns=['time', 'duration', 'tamb', 'ensoleillement'])

# # print(df_pollen_duration[['time', 'duration']])

# # Compute linear regression
# linear_regressor = LinearRegression()
# linear_regressor.fit(df_pollen_duration['time'].values.reshape(-1, 1), df_pollen_duration['duration'].values.reshape(-1, 1))
# df_pollen_duration['duration_pred'] = linear_regressor.predict(df_pollen_duration['time'].values.reshape(-1, 1))
# print(linear_regressor.coef_)

# linear_regressor.fit(df_pollen_duration['time'].values.reshape(-1, 1), df_pollen_duration['tamb'].values.reshape(-1, 1))
# df_pollen_duration['tamb_pred'] = linear_regressor.predict(df_pollen_duration['time'].values.reshape(-1, 1))

# ax = df_pollen_duration.plot(x='time', y='duration')
# df_pollen_duration.plot(x='time', y='duration_pred', ax=ax)
# df_pollen_duration.plot(x='time', y='tamb', ax=ax, secondary_y=True)
# df_pollen_duration.plot(x='time', y='tamb_pred', ax=ax, secondary_y=True)
# plt.title("Days of pollen over the years")
# plt.show()

# ################################################################################################################################
# # Compute comparison between data
# ################################################################################################################################

# df2 = pd.DataFrame(data=year_pollen_tamb, columns=['time', 'pollen', 'tamb', 'vv_ms', 'precipitation', 'ensoleillement'])

# # Compute linear regression
# linear_regressor = LinearRegression()
# linear_regressor.fit(df2['time'].values.reshape(-1, 1), df2['pollen'].values.reshape(-1, 1))
# df2['pollen_pred'] = linear_regressor.predict(df2['time'].values.reshape(-1, 1))

# linear_regressor.fit(df2['time'].values.reshape(-1, 1), df2['tamb'].values.reshape(-1, 1))
# df2['tamb_pred'] = linear_regressor.predict(df2['time'].values.reshape(-1, 1))

# linear_regressor.fit(df2['time'].values.reshape(-1, 1), df2['precipitation'].values.reshape(-1, 1))
# df2['precipitation_pred'] = linear_regressor.predict(df2['time'].values.reshape(-1, 1))

# # ax = df2.plot(x='time', y='pollen')
# # df2.plot(x='time', y='pollen_pred', ax=ax)

# # df2.plot(x='time', y='tamb', ax=ax, secondary_y=True)
# # df2.plot(x='time', y='tamb_pred', ax=ax, secondary_y=True)

# df2['tamb_gradient'] = np.gradient(df2['tamb'].to_numpy())
# df2['pollen_gradient'] = np.gradient(df2['pollen'].to_numpy())

# ax = df2.plot(x='time', y='pollen_gradient', color='red')
# df2.plot(x='time', y='tamb_gradient', ax=ax, secondary_y=True)
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

# # df_corr = df2[['pollen', 'tamb', 'tamb_gradient', 'pollen_gradient']]
# # # # df_corr = (df_corr-df_corr.min())/(df_corr.max()-df_corr.min())
# # print(df_corr.corr(method='pearson'))





df_new_order = pd.DataFrame(data=new_order, columns=['time', 'tamb', 'pollen', 'first_pollen', 'first_pollen_tamb', 'pollen_value_max'])
df_new_order['days'] = (df_new_order['first_pollen'] + pd.offsets.DateOffset(month=3)).dt.dayofyear

df_new_order['pollen_gradient'] = np.gradient(df_new_order['pollen'].to_numpy())
df_new_order['tamb_gradient'] = np.gradient(df_new_order['tamb'].to_numpy())

linear_regressor = LinearRegression()
linear_regressor.fit(df_new_order['time'].values.reshape(-1, 1), df_new_order['tamb'].values.reshape(-1, 1))
df_new_order['tamb_pred'] = linear_regressor.predict(df_new_order['time'].values.reshape(-1, 1))

ax = df_new_order.plot(x='time', y='pollen')
# df_new_order.plot(x='time', y='pollen_pred', ax=ax)

df_new_order.plot(x='time', y='tamb', ax=ax, secondary_y=True)
df_new_order.plot(x='time', y='tamb_pred', ax=ax, secondary_y=True)

plt.title("Avg pollen over the years")
plt.show()