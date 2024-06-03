import matplotlib.pyplot as plt
import time
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

POLLEN_CONCENTRATION = 0

df = pd.read_csv('data/bouleau_1994_2023.txt', names=['time', 'pollen_bouleau'], header=0, sep=';')
df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
df['pollen_bouleau'].replace('-', '0', inplace=True)
df['pollen_bouleau']=df['pollen_bouleau'].astype(int)

df_aune = pd.read_csv('data/aune_1994_2023.txt', names=['time', 'pollen_aune'], header=0, sep=';')
df_aune['time'] = pd.to_datetime(df_aune['time'], format='%Y%m%d')
df_aune['pollen_aune'].replace('-', '0', inplace=True)
df_aune['pollen_aune']=df_aune['pollen_aune'].astype(int)

df_noisetier = pd.read_csv('data/noisetier_1994_2023.txt', names=['time', 'pollen_noisetier'], header=0, sep=';')
df_noisetier['time'] = pd.to_datetime(df_noisetier['time'], format='%Y%m%d')
df_noisetier['pollen_noisetier'].replace('-', '0', inplace=True)
df_noisetier['pollen_noisetier']=df_noisetier['pollen_noisetier'].astype(int)

df = pd.merge(df, df_aune, on='time', how='left')
df = pd.merge(df, df_noisetier, on='time', how='left')

ax = df.plot(x='time', y='pollen_bouleau')
df.plot(x='time', y='pollen_aune', ax=ax)
df.plot(x='time', y='pollen_noisetier', ax=ax)
plt.show()

# Compute mean of each year
pollen_avg = []
pollen_max = []

for i in range(1994, 2024):
    pollen_avg.append([i, df['pollen_bouleau'][df['time'].dt.year == i].mean(), df['pollen_aune'][df['time'].dt.year == i].mean(), 
                       df['pollen_noisetier'][df['time'].dt.year == i].mean()])
    pollen_max.append([i, df['pollen_bouleau'][df['time'].dt.year == i].max(), df['pollen_aune'][df['time'].dt.year == i].max(), 
                       df['pollen_noisetier'][df['time'].dt.year == i].max()])

################################################################################################################################
# Compute max of pollen
################################################################################################################################

df_pollen_max = pd.DataFrame(data=pollen_max, columns=['year', 'pollen_bouleau_max', 'pollen_aune_max', 'pollen_noisetier_max'])

# Compute linear regression
linear_regressor = LinearRegression()
linear_regressor.fit(df_pollen_max['year'].values.reshape(-1, 1), df_pollen_max['pollen_bouleau_max'].values.reshape(-1, 1))
df_pollen_max['pollen_bouleau_max_pred'] = linear_regressor.predict(df_pollen_max['year'].values.reshape(-1, 1))

linear_regressor.fit(df_pollen_max['year'].values.reshape(-1, 1), df_pollen_max['pollen_aune_max'].values.reshape(-1, 1))
df_pollen_max['pollen_aune_max_pred'] = linear_regressor.predict(df_pollen_max['year'].values.reshape(-1, 1))

linear_regressor.fit(df_pollen_max['year'].values.reshape(-1, 1), df_pollen_max['pollen_noisetier_max'].values.reshape(-1, 1))
df_pollen_max['pollen_noisetier_max_pred'] = linear_regressor.predict(df_pollen_max['year'].values.reshape(-1, 1))

ax = df_pollen_max.plot(x='year', y='pollen_bouleau_max')
df_pollen_max.plot(x='year', y='pollen_aune_max', ax=ax)
df_pollen_max.plot(x='year', y='pollen_noisetier_max', ax=ax)
df_pollen_max.plot(x='year', y='pollen_bouleau_max_pred', ax=ax)
df_pollen_max.plot(x='year', y='pollen_aune_max_pred', ax=ax)
df_pollen_max.plot(x='year', y='pollen_noisetier_max_pred', ax=ax)
plt.title("Pollen de bouleau / aune / noisetier")
plt.show()

################################################################################################################################
# Compute average of pollen
################################################################################################################################

df_pollen_avg = pd.DataFrame(data=pollen_avg, columns=['year', 'pollen_bouleau_avg', 'pollen_aune_avg', 'pollen_noisetier_avg'])

# Compute linear regression
linear_regressor = LinearRegression()
linear_regressor.fit(df_pollen_avg['year'].values.reshape(-1, 1), df_pollen_avg['pollen_bouleau_avg'].values.reshape(-1, 1))
df_pollen_avg['pollen_bouleau_avg_pred'] = linear_regressor.predict(df_pollen_avg['year'].values.reshape(-1, 1))

linear_regressor.fit(df_pollen_avg['year'].values.reshape(-1, 1), df_pollen_avg['pollen_aune_avg'].values.reshape(-1, 1))
df_pollen_avg['pollen_aune_avg_pred'] = linear_regressor.predict(df_pollen_avg['year'].values.reshape(-1, 1))

linear_regressor.fit(df_pollen_avg['year'].values.reshape(-1, 1), df_pollen_avg['pollen_noisetier_avg'].values.reshape(-1, 1))
df_pollen_avg['pollen_noisetier_avg_pred'] = linear_regressor.predict(df_pollen_avg['year'].values.reshape(-1, 1))

ax = df_pollen_avg.plot(x='year', y='pollen_bouleau_avg')
df_pollen_avg.plot(x='year', y='pollen_aune_avg', ax=ax)
df_pollen_avg.plot(x='year', y='pollen_noisetier_avg', ax=ax)
df_pollen_avg.plot(x='year', y='pollen_bouleau_avg_pred', ax=ax)
df_pollen_avg.plot(x='year', y='pollen_aune_avg_pred', ax=ax)
df_pollen_avg.plot(x='year', y='pollen_noisetier_avg_pred', ax=ax)
plt.title("Pollen de bouleau / aune / noisetier")
plt.show()

#---------------------------------------------------------------------------------------------------------------------------------


df = pd.read_csv('data/gramine_1994_2023.txt', names=['time', 'pollen_gramine'], header=0, sep=';')
df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
df['pollen_gramine'].replace('-', '0', inplace=True)
df['pollen_gramine']=df['pollen_gramine'].astype(int)

# Compute mean of each year
pollen_avg = []
pollen_max = []

for i in range(1994, 2024):
    pollen_avg.append([i, df['pollen_gramine'][df['time'].dt.year == i].mean()])
    pollen_max.append([i, df['pollen_gramine'][df['time'].dt.year == i].max()])

################################################################################################################################
# Compute max of pollen
################################################################################################################################

df_pollen_max = pd.DataFrame(data=pollen_max, columns=['year', 'pollen_gramine_max'])

# Compute linear regression
linear_regressor = LinearRegression()
linear_regressor.fit(df_pollen_max['year'].values.reshape(-1, 1), df_pollen_max['pollen_gramine_max'].values.reshape(-1, 1))
df_pollen_max['pollen_gramine_max_pred'] = linear_regressor.predict(df_pollen_max['year'].values.reshape(-1, 1))

ax = df_pollen_max.plot(x='year', y='pollen_gramine_max')
df_pollen_max.plot(x='year', y='pollen_gramine_max_pred', ax=ax)
plt.title("Pollen de Graminés")
plt.show()

################################################################################################################################
# Compute average of pollen
################################################################################################################################

df_pollen_avg = pd.DataFrame(data=pollen_avg, columns=['year', 'pollen_gramine_avg'])

# Compute linear regression
linear_regressor = LinearRegression()
linear_regressor.fit(df_pollen_avg['year'].values.reshape(-1, 1), df_pollen_avg['pollen_gramine_avg'].values.reshape(-1, 1))
df_pollen_avg['pollen_gramine_avg_pred'] = linear_regressor.predict(df_pollen_avg['year'].values.reshape(-1, 1))

ax = df_pollen_avg.plot(x='year', y='pollen_gramine_avg')
df_pollen_avg.plot(x='year', y='pollen_gramine_avg_pred', ax=ax)
plt.title("Pollen de Graminés")
plt.show()

#---------------------------------------------------------------------------------------------------------------------------------


# df = pd.read_csv('data/hetre_1994_2023.txt', names=['time', 'pollen_hetre'], header=0, sep=';')
# df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
# df['pollen_hetre'].replace('-', '0', inplace=True)
# df['pollen_hetre']=df['pollen_hetre'].astype(int)

# # Compute mean of each year
# pollen_avg = []
# pollen_max = []

# for i in range(1994, 2024):
#     pollen_avg.append([i, df['pollen_hetre'][df['time'].dt.year == i].mean()])
#     pollen_max.append([i, df['pollen_hetre'][df['time'].dt.year == i].max()])

# ################################################################################################################################
# # Compute average of pollen
# ################################################################################################################################

# df_pollen_avg = pd.DataFrame(data=pollen_avg, columns=['year', 'pollen_hetre_avg'])

# # Compute linear regression
# linear_regressor = LinearRegression()
# linear_regressor.fit(df_pollen_avg['year'].values.reshape(-1, 1), df_pollen_avg['pollen_hetre_avg'].values.reshape(-1, 1))
# df_pollen_avg['pollen_hetre_avg_pred'] = linear_regressor.predict(df_pollen_avg['year'].values.reshape(-1, 1))

# ax = df_pollen_avg.plot(x='year', y='pollen_hetre_avg')
# df_pollen_avg.plot(x='year', y='pollen_hetre_avg_pred', ax=ax)
# plt.title("Pollen de Hêtre")
# plt.show()

#---------------------------------------------------------------------------------------------------------------------------------


df = pd.read_csv('data/ambroisie_1994_2023.txt', names=['time', 'pollen_ambroisie'], header=0, sep=';')
df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
df['pollen_ambroisie'].replace('-', '0', inplace=True)
df['pollen_ambroisie']=df['pollen_ambroisie'].astype(int)

# Compute mean of each year
pollen_avg = []
pollen_max = []

for i in range(1994, 2024):
    pollen_avg.append([i, df['pollen_ambroisie'][df['time'].dt.year == i].mean()])
    pollen_max.append([i, df['pollen_ambroisie'][df['time'].dt.year == i].max()])

################################################################################################################################
# Compute max of pollen
################################################################################################################################

df_pollen_max = pd.DataFrame(data=pollen_max, columns=['year', 'pollen_ambroisie_max'])

# Compute linear regression
linear_regressor = LinearRegression()
linear_regressor.fit(df_pollen_max['year'].values.reshape(-1, 1), df_pollen_max['pollen_ambroisie_max'].values.reshape(-1, 1))
df_pollen_max['pollen_ambroisie_max_pred'] = linear_regressor.predict(df_pollen_max['year'].values.reshape(-1, 1))

ax = df_pollen_max.plot(x='year', y='pollen_ambroisie_max')
df_pollen_max.plot(x='year', y='pollen_ambroisie_max_pred', ax=ax)
plt.title("Pollen d'Ambroisie")
plt.show()

################################################################################################################################
# Compute average of pollen
################################################################################################################################

df_pollen_avg = pd.DataFrame(data=pollen_avg, columns=['year', 'pollen_ambroisie_avg'])

# Compute linear regression
linear_regressor = LinearRegression()
linear_regressor.fit(df_pollen_avg['year'].values.reshape(-1, 1), df_pollen_avg['pollen_ambroisie_avg'].values.reshape(-1, 1))
df_pollen_avg['pollen_ambroisie_avg_pred'] = linear_regressor.predict(df_pollen_avg['year'].values.reshape(-1, 1))

ax = df_pollen_avg.plot(x='year', y='pollen_ambroisie_avg')
df_pollen_avg.plot(x='year', y='pollen_ambroisie_avg_pred', ax=ax)
plt.title("Pollen d'Ambroisie")
plt.show()