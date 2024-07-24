import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Necker - Urbain
# Foron, Meyrin - Suburbain
# Passeiry - Rural

# df = pd.read_csv('ppm_necker_2015.csv', names=['date', 'PM2.5', 'PM10', 'NO2', 'O3'], header=0, sep=';')
# df['date'] = pd.to_datetime(df['date'], format='%Y%m%d %H:%M:%S')

# print(df['PM10'].mean())

df = pd.read_csv('ppm_passeiry.csv', names=['date', 'PM2.5', 'PM10', 'NO2', 'O3'], header=0, sep=';')
df['date'] = pd.to_datetime(df['date'], format='%Y%m%d %H:%M:%S')

df = df[['date', 'PM10', 'NO2', 'O3']]

# print(df['PM10'].mean())

df_mean = df.resample('Y', on='date').mean().dropna(how='all')
print(df_mean)
df_mean = df_mean.reset_index()
df_mean['year'] = [2011+i for i in range(len(df_mean['date']))]

print(df_mean)

# df = pd.read_csv('ppm_foron.csv', names=['date', 'PM2.5', 'PM10', 'NO2', 'O3'], header=0, sep=';')
# df['date'] = pd.to_datetime(df['date'], format='%Y%m%d %H:%M:%S')

# df = df[['date', 'PM10', 'NO2', 'O3']]

# df_mean = df.resample('Y', on='date').mean().dropna(how='all')
# df_mean = df_mean.reset_index()
# df_mean['year'] = [2011+i for i in range(len(df_mean['date']))]

# ax = df_mean.plot(x='year', y='PM10')
# df_mean.plot(x='year', y='NO2', ax=ax)
# df_mean.plot(x='year', y='O3', ax=ax)
# plt.show()

# df_2 = pd.read_csv('ppm_meyrin.csv', names=['date_2', 'PM2.5', 'PM10_2', 'NO2_2', 'O3_2'], header=0, sep=';')
# df_2['date_2'] = pd.to_datetime(df_2['date_2'], format='%Y%m%d %H:%M:%S')

# df_2 = df_2[['date_2', 'PM10_2', 'NO2_2', 'O3_2']]

# df_2_mean = df_2.resample('Y', on='date_2').mean().dropna(how='all')
# df_2_mean = df_2_mean.reset_index()
# df_2_mean['year'] = [2011+i for i in range(len(df_2_mean['date_2']))]

# # ax = df_2_mean.plot(x='year', y='PM10_2')
# # df_2_mean.plot(x='year', y='NO2_2', ax=ax)
# # df_2_mean.plot(x='year', y='O3_2', ax=ax)
# # plt.show()

# df_global_mean = df_mean.merge(df_2_mean, 'outer')
# print(df_global_mean)
# df_mean_final = pd.DataFrame()
# df_mean_final['year'] = df_global_mean['year']
# df_mean_final['PM10'] = df_global_mean[['PM10_2', 'PM10']].mean(axis=1)
# df_mean_final['NO2'] = df_global_mean[['NO2_2', 'NO2']].mean(axis=1)
# df_mean_final['O3'] = df_global_mean[['O3_2', 'O3']].mean(axis=1)

# print(df_mean_final)

# df_mean_final.to_csv("ppm_suburbain.csv", index=False)


df_mean[['year', 'PM10', 'NO2', 'O3']].to_csv("ppm_rural.csv", index=False)