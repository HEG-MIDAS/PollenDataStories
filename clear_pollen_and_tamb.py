import matplotlib.pyplot as plt
import glob
import os
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

POLLEN_CONCENTRATION = 20

# df = pd.read_csv('order_118587_data.txt', sep=';')
# df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
# df['kabetud0'].replace('-', '0', inplace=True)
# df['pollen']=df['kabetud0'].astype(int)

df = pd.read_csv('data/gramine_1994_2023.txt', names=['time', 'pollen'], header=0, sep=';')
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

df.loc[df['pollen'] >= -1, 'pollen_score'] = 0
df.loc[df['pollen'] > 1, 'pollen_score'] = 1
df.loc[df['pollen'] > 10, 'pollen_score'] = 2
df.loc[df['pollen'] > 70, 'pollen_score'] = 3
df.loc[df['pollen'] > 250, 'pollen_score'] = 4

df.loc[df['pollen_score'] == 0, 'tamb'] = np.nan
df.loc[df['pollen_score'] == 0, 'ensoleillement'] = np.nan
df.loc[df['pollen_score'] == 0, 'precipitation'] = np.nan
df.loc[df['pollen_score'] == 0, 'vv_ms'] = np.nan

df.loc[df['pollen_score'] == 0, 'pollen_score'] = np.nan


# df.loc[df['tamb'] < 4, 'tamb'] = -1
# df.loc[df['tamb'] >= 5, 'tamb'] = 1
# df.loc[df['tamb'] > 6, 'tamb'] = 1
# print(df.to_string())

# df_corr = df[['time', 'pollen_score', 'tamb', 'ensoleillement']]
df = df[df['time'].dt.month >= 3]
df = df[df['time'].dt.month <= 7]
# df['ma_tamb'] = df['tamb'].rolling(3).mean()
df['pollen_score'] = df['pollen_score'].shift(0)
print(df.corr(method='pearson'))

ax = df.plot(x='time', y='pollen_score')
df.plot(x='time', y='tamb', ax=ax, secondary_y=True)
plt.show()

# Compute mean of each year
# year_pollen_tamb = []
# pollen_start = []
# pollen_duration = []
# pollen_date_max = []

# for i in range(1994, 2024):
#     year_pollen_tamb.append([i, df['pollen'][df['time'].dt.year == i].mean(), df['tamb'][df['time'].dt.year == i].mean(), df['vv_ms'][df['time'].dt.year == i].mean(), df['precipitation'][df['time'].dt.year == i].mean(), df['ensoleillement'][df['time'].dt.year == i].mean()])
#     sub_df = df[df['time'].dt.year == i]
#     pollen_start.append([df['time'].iloc[sub_df['pollen'].gt(POLLEN_CONCENTRATION).idxmax()], df['tamb'].iloc[sub_df['pollen'].gt(POLLEN_CONCENTRATION).idxmax()]])
#     pollen_duration.append([i, sub_df['pollen'][sub_df['pollen'] > POLLEN_CONCENTRATION].count(), df['tamb'][df['time'].dt.year == i].mean(), df_ensoleillement['ensoleillement'][df_ensoleillement['time'].dt.year == i].mean()])
#     pollen_date_max.append([df['time'].iloc[sub_df['pollen'].idxmax()]])

#     sub_df = sub_df[sub_df['time'].dt.month >= 1]
#     sub_df = sub_df[sub_df['time'].dt.month <= 3]
#     sub_df['ma_pollen'] = sub_df['pollen'].rolling(3, center=True).mean()
#     sub_df['ma_tamb'] = sub_df['tamb'].rolling(3, center=True).mean()
#     sub_df['pollen'] = sub_df['pollen'].shift(0)
#     # sub_df = sub_df[sub_df['pollen'] > 0]
#     # print(sub_df.to_string())
#     print(sub_df.corr(method='pearson'))

