import matplotlib.pyplot as plt
import time
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import datetime

concentration_pollen_dict = {
    'faible': 0,
    'moyenne': 20,
    'fort': 50,
    'tres_fort': 150
}

POLLEN_CONCENTRATION = concentration_pollen_dict['faible']
STARTING_YEAR = 1994

df = pd.read_csv('data/gramine_1994_2023.txt', names=['time', 'pollen_gramine'], header=0, sep=';')
df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
df['pollen_gramine'].replace('-', '0', inplace=True)
df['pollen_gramine']=df['pollen_gramine'].astype(int)
# df['pollen_gramine']=(df['pollen_gramine']-df['pollen_gramine'].min())/(df['pollen_gramine'].max()-df['pollen_gramine'].min())

ax = df.plot(x='time', y='pollen_gramine')
plt.show()

# Compute mean of each year
pollen_avg = []
pollen_max = []

for i in range(STARTING_YEAR, 2024):
    # pollen_avg.append([i, df['pollen_gramine'][df['time'].dt.year == i].mean()])
    # pollen_max.append([i, df['pollen_gramine'][df['time'].dt.year == i].max()])
    if i < 2023:
        mask = (df['time'] > datetime.datetime.strptime(str(i)+"-01-31", "%Y-%m-%d")) & (df['time'] <= datetime.datetime.strptime(str(i+1)+"-01-31", "%Y-%m-%d"))
        df_temp = df.loc[mask]
        pollen_avg.append([i+1, df_temp[df_temp['pollen_gramine'] > 0].mean().values[0]])
        pollen_max.append([i, df_temp['pollen_gramine'].max()])

################################################################################################################################
# Compute max of pollen
################################################################################################################################

df_pollen_max = pd.DataFrame(data=pollen_max, columns=['year', 'pollen_gramine_max'])

# Compute linear regression
linear_regressor = LinearRegression()
linear_regressor.fit(df_pollen_max['year'].values.reshape(-1, 1), df_pollen_max['pollen_gramine_max'].values.reshape(-1, 1))
df_pollen_max['pollen_gramine_max_pred'] = linear_regressor.predict(df_pollen_max['year'].values.reshape(-1, 1))
print("Max coef : {}".format(linear_regressor.coef_))

ax = df_pollen_max.plot(x='year', y='pollen_gramine_max')
df_pollen_max.plot(x='year', y='pollen_gramine_max_pred', ax=ax)
plt.title("Pollen de gramine maximum")
plt.show()

################################################################################################################################
# Compute average of pollen
################################################################################################################################

df_pollen_avg = pd.DataFrame(data=pollen_avg, columns=['year', 'pollen_gramine_avg'])

# Compute linear regression
linear_regressor = LinearRegression()
linear_regressor.fit(df_pollen_avg['year'].values.reshape(-1, 1), df_pollen_avg['pollen_gramine_avg'].values.reshape(-1, 1))
df_pollen_avg['pollen_gramine_avg_pred'] = linear_regressor.predict(df_pollen_avg['year'].values.reshape(-1, 1))
print("Average coef : {}".format(linear_regressor.coef_))

ax = df_pollen_avg.plot(x='year', y='pollen_gramine_avg')
df_pollen_avg.plot(x='year', y='pollen_gramine_avg_pred', ax=ax)
plt.title("Pollen de gramine moyenne")
plt.show()

df_pollen_avg.to_csv("pollen_graminees.csv")

################################################################################################################################
# Compute count of pollen
################################################################################################################################

for key in concentration_pollen_dict:
    pollen_count = []
    for i in range(STARTING_YEAR, 2024):
        if i < 2023:
            mask = (df['time'] > datetime.datetime.strptime(str(i)+"-01-31", "%Y-%m-%d")) & (df['time'] <= datetime.datetime.strptime(str(i+1)+"-01-31", "%Y-%m-%d"))
            df_temp = df.loc[mask]
            pollen_count.append([i, df_temp[(df_temp['pollen_gramine'] > concentration_pollen_dict[key])]['pollen_gramine'].count()])

    df_pollen_count = pd.DataFrame(data=pollen_count, columns=['year', 'pollen_gramine_count'])

    # Compute linear regression
    linear_regressor = LinearRegression()
    linear_regressor.fit(df_pollen_count['year'].values.reshape(-1, 1), df_pollen_count['pollen_gramine_count'].values.reshape(-1, 1))
    df_pollen_count['pollen_gramine_count_pred'] = linear_regressor.predict(df_pollen_count['year'].values.reshape(-1, 1))
    print("Pollen {} count coef : {}".format(key, linear_regressor.coef_))

    ax = df_pollen_count.plot(x='year', y='pollen_gramine_count')
    df_pollen_count.plot(x='year', y='pollen_gramine_count_pred', ax=ax)
    plt.title("Pollen de gramine nombre de jours - " + str(key))
    plt.show()

################################################################################################################################
# Compute count of pollen for each intensity
################################################################################################################################

def assign_category(row):
    if row["pollen_gramine"] > concentration_pollen_dict['faible'] and row["pollen_gramine"] <= concentration_pollen_dict['moyenne']:
        return 'faible'
    elif row["pollen_gramine"] > concentration_pollen_dict['moyenne'] and row["pollen_gramine"] <= concentration_pollen_dict['fort']:
        return 'moyenne'
    elif row["pollen_gramine"] > concentration_pollen_dict['fort'] and row["pollen_gramine"] <= concentration_pollen_dict['tres_fort']:
        return 'fort'
    elif row["pollen_gramine"] > concentration_pollen_dict['tres_fort']:
        return 'tres_fort'
    return 0

df['category'] = df.apply(assign_category, axis=1)

print(df)

for key in concentration_pollen_dict:
    pollen_count = []
    for i in range(STARTING_YEAR, 2024):
        if i < 2023:
            mask = (df['time'] > datetime.datetime.strptime(str(i)+"-04-30", "%Y-%m-%d")) & (df['time'] <= datetime.datetime.strptime(str(i+1)+"-04-30", "%Y-%m-%d"))
            df_temp = df.loc[mask]
            pollen_count.append([i+1, df_temp[(df_temp['category'] == key)]['pollen_gramine'].count()])

    df_pollen_count = pd.DataFrame(data=pollen_count, columns=['year', 'pollen_gramine_count'])

    # Compute linear regression
    linear_regressor = LinearRegression()
    linear_regressor.fit(df_pollen_count['year'].values.reshape(-1, 1), df_pollen_count['pollen_gramine_count'].values.reshape(-1, 1))
    df_pollen_count['pollen_gramine_count_pred'] = linear_regressor.predict(df_pollen_count['year'].values.reshape(-1, 1))
    print("Pollen {} count coef : {}".format(key, linear_regressor.coef_))

    ax = df_pollen_count.plot(x='year', y='pollen_gramine_count')
    df_pollen_count.plot(x='year', y='pollen_gramine_count_pred', ax=ax)
    plt.title("Pollen de graminees nombre de jours pour la categorie - " + str(key))
    plt.show()

################################################################################################################################
# Compute first day of pollen
################################################################################################################################

for key in concentration_pollen_dict:
    pollen_first_day = []
    for i in range(STARTING_YEAR, 2024):
        if i < 2023:
            mask = (df['time'] > datetime.datetime.strptime(str(i)+"-01-31", "%Y-%m-%d")) & (df['time'] <= datetime.datetime.strptime(str(i+1)+"-01-31", "%Y-%m-%d"))
            df_temp = df.loc[mask]
            first_day = df_temp['pollen_gramine'].gt(concentration_pollen_dict[key]).argmax()
            pollen_first_day.append([i, first_day if first_day > 0 else np.nan])

    df_pollen_first_day = pd.DataFrame(data=pollen_first_day, columns=['year', 'pollen_gramine_first_day'])

    # Compute linear regression
    linear_regressor = LinearRegression()
    m = ~(np.isnan(df_pollen_first_day['year'].values) | np.isnan(df_pollen_first_day['pollen_gramine_first_day'].values))
    x_m, y_m = df_pollen_first_day['year'].values.reshape(-1, 1)[m], df_pollen_first_day['pollen_gramine_first_day'].values.reshape(-1, 1)[m]
    linear_regressor.fit(x_m, y_m)
    df_pollen_first_day['pollen_gramine_first_day_pred'] = linear_regressor.predict(df_pollen_first_day['year'].values.reshape(-1, 1))
    print("Pollen {} first day coef : {}".format(key, linear_regressor.coef_))

    ax = df_pollen_first_day.plot(x='year', y='pollen_gramine_first_day', style='.-')
    df_pollen_first_day.plot(x='year', y='pollen_gramine_first_day_pred', ax=ax)
    plt.title("Pollen de gramine premier jour - " + str(key))
    plt.legend(loc='lower right')
    plt.show()
