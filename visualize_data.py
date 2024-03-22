import matplotlib.pyplot as plt
import glob
import os
import numpy as np
import pandas as pd

climacity_path = '/home/david/Documents/HEG/MIDAS/media/transformed/Climacity/Prairie'
all_files = glob.glob(os.path.join(climacity_path, "*.csv"))

df = pd.read_csv('order_118553_data.txt', sep=';')
df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
df['kacoryd0'].replace('-', '0', inplace=True)
df["kacoryd0"]=df["kacoryd0"].astype(int)

df2 = pd.read_csv('order_118587_data.txt', sep=';')# sep='\s+')
df2['time'] = pd.to_datetime(df2['time'], format='%Y%m%d')
df2['kabetud0'].replace('-', '0', inplace=True)
df2["kabetud0"]=df2["kabetud0"].astype(int)

li = []

for filename in all_files:
    df_climacity = pd.read_csv(filename)
    df_climacity = df_climacity[['gmt*','Tamb_Avg*']]
    li.append(df_climacity)

df_climacity = pd.concat(li, axis=0)
df_climacity.sort_values(by='gmt*', inplace=True)
df_climacity.reset_index(drop=True, inplace=True)

# index_val = df_climacity.loc[df_climacity['gmt*'] == '2024-01-01 00:00:00']
index_val = df_climacity.index[df_climacity['gmt*'] == '2024-01-01 00:00:00'].tolist()[0] -1

df_climacity_truncated = df_climacity.sort_index().truncate(after=index_val)
# print(df_climacity_truncated)

mean_temp = []
for i in range(0, len(df_climacity_truncated['gmt*'])-24, 24):
    mean_temp.append([df_climacity_truncated['gmt*'].iloc[i][:-9], df_climacity_truncated[['Tamb_Avg*']].iloc[[i, i+24]].mean(axis=0).values[0]])

df_tamb = pd.DataFrame(data=mean_temp, columns=['time', 'tamb'])
df_tamb['time'] = pd.to_datetime(df_tamb['time'], format='%Y-%m-%d')

df = pd.merge(df, df2, on='time', how='right')
df = pd.merge(df, df_tamb, on='time', how='left')

# print(df)

# df['ma_kabetud0'] = df['kabetud0'].rolling(7).mean()
# df['ma_kacoryd0'] = df['kacoryd0'].rolling(7).mean()
# df['ma_tamb'] = df['tamb'].rolling(7).mean()

df['year_kacoryd0'] = np.nan
df['year_tamb'] = np.nan

for i in range(1994, 2024):
    # print(df.index[df['time'].dt.year == i][0])
    # print(df['kacoryd0'][df['time'].dt.year == i].mean())
    df['year_kacoryd0'].loc[df.index[df['time'].dt.year == i][0]] = df['kacoryd0'][df['time'].dt.year == i].mean()
    df['year_tamb'].loc[df.index[df['time'].dt.year == i][0]] = df['tamb'][df['time'].dt.year == i].mean()

# print(df['year_mean'])
# print(df.dropna(subset=['year_kacoryd0']))

df_short = df.dropna(subset=['year_kacoryd0', 'year_tamb'])

# ax = df_short.plot(x='time', y='year_kacoryd0')
df_short.plot(x='time', y='year_tamb')#, ax=ax, secondary_y=True)
# df.plot(x='time', y='ma_tamb', ax=ax, secondary_y = True)

plt.show()