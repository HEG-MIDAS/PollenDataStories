import matplotlib.pyplot as plt
import time
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import datetime

concentration_pollen_dict = {
    'faible': 0,
    'moyenne': 10,
    'fort': 70,
    'tres_fort': 300
}

POLLEN_CONCENTRATION = concentration_pollen_dict['faible']
STARTING_YEAR = 1994

df = pd.read_csv('data/bouleau_1994_2023.txt', names=['time', 'pollen_bouleau'], header=0, sep=';')
df['time'] = pd.to_datetime(df['time'], format='%Y%m%d')
df['pollen_bouleau'].replace('-', '0', inplace=True)
df['pollen_bouleau']=df['pollen_bouleau'].astype(int)
# df['pollen_bouleau']=(df['pollen_bouleau']-df['pollen_bouleau'].min())/(df['pollen_bouleau'].max()-df['pollen_bouleau'].min())
# df['pollen_bouleau']=np.log(df['pollen_bouleau'])

ax = df.plot(x='time', y='pollen_bouleau')
plt.show()

# Compute mean of each year
pollen_avg = []
pollen_max = []

for i in range(STARTING_YEAR, 2024):
    # if i < 2023:
    mask = (df['time'] > datetime.datetime.strptime(str(i)+"-01-01", "%Y-%m-%d")) & (df['time'] <= datetime.datetime.strptime(str(i)+"-07-30", "%Y-%m-%d"))
    df_temp = df.loc[mask]
    pollen_avg.append([i, df_temp[df_temp['pollen_bouleau'] > 0].mean().values[0]])
    pollen_max.append([i, df_temp['pollen_bouleau'].max()])

################################################################################################################################
# Compute max of pollen
################################################################################################################################

df_pollen_max = pd.DataFrame(data=pollen_max, columns=['year', 'pollen_bouleau_max'])

# Compute linear regression
linear_regressor = LinearRegression()
linear_regressor.fit(df_pollen_max['year'].values.reshape(-1, 1), df_pollen_max['pollen_bouleau_max'].values.reshape(-1, 1))
df_pollen_max['pollen_bouleau_max_pred'] = linear_regressor.predict(df_pollen_max['year'].values.reshape(-1, 1))
print("Max coef : {}".format(linear_regressor.coef_))

ax = df_pollen_max.plot(x='year', y='pollen_bouleau_max')
df_pollen_max.plot(x='year', y='pollen_bouleau_max_pred', ax=ax)
plt.title("Pollen de bouleau maximum")
plt.show()

################################################################################################################################
# Compute average of pollen
################################################################################################################################

df_pollen_avg = pd.DataFrame(data=pollen_avg, columns=['year', 'pollen_bouleau_avg'])

# Compute linear regression
linear_regressor = LinearRegression()
linear_regressor.fit(df_pollen_avg['year'].values.reshape(-1, 1), df_pollen_avg['pollen_bouleau_avg'].values.reshape(-1, 1))
df_pollen_avg['pollen_bouleau_avg_pred'] = linear_regressor.predict(df_pollen_avg['year'].values.reshape(-1, 1))
# print("Average coef : {}".format(linear_regressor.coef_))

ax = df_pollen_avg.plot(x='year', y='pollen_bouleau_avg')
df_pollen_avg.plot(x='year', y='pollen_bouleau_avg_pred', ax=ax)
plt.title("Pollen de bouleau moyenne")
plt.show()

# df_pollen_avg.to_csv("pollen_bouleau.csv")

################################################################################################################################
# Compute count of pollen
################################################################################################################################

for key in concentration_pollen_dict:
    pollen_count = []
    for i in range(STARTING_YEAR, 2024):
        if i < 2023:
            mask = (df['time'] > datetime.datetime.strptime(str(i)+"-01-01", "%Y-%m-%d")) & (df['time'] <= datetime.datetime.strptime(str(i)+"-07-30", "%Y-%m-%d"))
            df_temp = df.loc[mask]
            pollen_count.append([i+1, df_temp[(df_temp['pollen_bouleau'] > concentration_pollen_dict[key])]['pollen_bouleau'].count()])

    df_pollen_count = pd.DataFrame(data=pollen_count, columns=['year', 'pollen_bouleau_count'])

    # Compute linear regression
    linear_regressor = LinearRegression()
    linear_regressor.fit(df_pollen_count['year'].values.reshape(-1, 1), df_pollen_count['pollen_bouleau_count'].values.reshape(-1, 1))
    df_pollen_count['pollen_bouleau_count_pred'] = linear_regressor.predict(df_pollen_count['year'].values.reshape(-1, 1))
    print("Pollen {} count coef : {}".format(key, linear_regressor.coef_))

    ax = df_pollen_count.plot(x='year', y='pollen_bouleau_count')
    df_pollen_count.plot(x='year', y='pollen_bouleau_count_pred', ax=ax)
    plt.title("Pollen de bouleau nombre de jours - " + str(key))
    plt.show()

################################################################################################################################
# Compute count of pollen for each intensity
################################################################################################################################

def assign_category(row):
    if row["pollen_bouleau"] > concentration_pollen_dict['faible'] and row["pollen_bouleau"] <= concentration_pollen_dict['moyenne']:
        return 'faible'
    elif row["pollen_bouleau"] > concentration_pollen_dict['moyenne'] and row["pollen_bouleau"] <= concentration_pollen_dict['fort']:
        return 'moyenne'
    elif row["pollen_bouleau"] > concentration_pollen_dict['fort'] and row["pollen_bouleau"] <= concentration_pollen_dict['tres_fort']:
        return 'fort'
    elif row["pollen_bouleau"] > concentration_pollen_dict['tres_fort']:
        return 'tres_fort'
    return 0

df['category'] = df.apply(assign_category, axis=1)

# print(df)

for key in concentration_pollen_dict:
    pollen_count = []
    for i in range(STARTING_YEAR, 2024):
        if i < 2023:
            mask = (df['time'] > datetime.datetime.strptime(str(i)+"-01-01", "%Y-%m-%d")) & (df['time'] <= datetime.datetime.strptime(str(i)+"-07-30", "%Y-%m-%d"))
            df_temp = df.loc[mask]
            pollen_count.append([i+1, df_temp[(df_temp['category'] == key)]['pollen_bouleau'].count()])

    df_pollen_count = pd.DataFrame(data=pollen_count, columns=['year', 'pollen_bouleau_count'])

    # Compute linear regression
    linear_regressor = LinearRegression()
    linear_regressor.fit(df_pollen_count['year'].values.reshape(-1, 1), df_pollen_count['pollen_bouleau_count'].values.reshape(-1, 1))
    df_pollen_count['pollen_bouleau_count_pred'] = linear_regressor.predict(df_pollen_count['year'].values.reshape(-1, 1))
    print("Pollen {} count coef : {}".format(key, linear_regressor.coef_))

    ax = df_pollen_count.plot(x='year', y='pollen_bouleau_count')
    df_pollen_count.plot(x='year', y='pollen_bouleau_count_pred', ax=ax)
    plt.title("Pollen de bouleau nombre de jours pour la categorie - " + str(key))
    plt.show()

################################################################################################################################
# Compute first day of pollen
################################################################################################################################

for key in concentration_pollen_dict:
    pollen_first_day = []
    for i in range(STARTING_YEAR, 2024):
        if i < 2023:
            mask = (df['time'] > datetime.datetime.strptime(str(i)+"-01-01", "%Y-%m-%d")) & (df['time'] <= datetime.datetime.strptime(str(i)+"-07-30", "%Y-%m-%d"))
            df_temp = df.loc[mask]
            first_day = df_temp['pollen_bouleau'].gt(concentration_pollen_dict[key]).argmax()
            # first_day = first_day if first_day < 300 else np.nan 
            pollen_first_day.append([i, first_day if first_day > 0 else np.nan])
            # if key == "faible":
            #     print(first_day)
            #     print(df_temp.to_string())

    df_pollen_first_day = pd.DataFrame(data=pollen_first_day, columns=['year', 'pollen_bouleau_first_day'])

    # Compute linear regression
    linear_regressor = LinearRegression()
    m = ~(np.isnan(df_pollen_first_day['year'].values) | np.isnan(df_pollen_first_day['pollen_bouleau_first_day'].values))
    x_m, y_m = df_pollen_first_day['year'].values.reshape(-1, 1)[m], df_pollen_first_day['pollen_bouleau_first_day'].values.reshape(-1, 1)[m]
    linear_regressor.fit(x_m, y_m)
    df_pollen_first_day['pollen_bouleau_first_day_pred'] = linear_regressor.predict(df_pollen_first_day['year'].values.reshape(-1, 1))
    print("Pollen {} first day coef : {}".format(key, linear_regressor.coef_))
    # print("Pollen first day : {}".format(df_pollen_first_day["pollen_bouleau_first_day"].iloc[0]))
    # print("Pollen first day mean : {}".format(np.mean(df_pollen_first_day["pollen_bouleau_first_day"])))

    ax = df_pollen_first_day.plot(x='year', y='pollen_bouleau_first_day', style='.-')
    df_pollen_first_day.plot(x='year', y='pollen_bouleau_first_day_pred', ax=ax)
    plt.title("Pollen de bouleau premier jour - " + str(key))
    plt.legend(loc='lower right')
    plt.show()


# tmp_pollen_first_day = []
# for i in range(STARTING_YEAR, 2024):
#     # if i < 2023:
#     mask = (df['time'] > datetime.datetime.strptime(str(i)+"-01-01", "%Y-%m-%d")) & (df['time'] <= datetime.datetime.strptime(str(i)+"-07-30", "%Y-%m-%d"))
#     df_temp = df.loc[mask]
#     first_day = df_temp['pollen_bouleau'].gt(concentration_pollen_dict["faible"]).argmax()
#     tmp_pollen_first_day.append([i, first_day if first_day > 0 else np.nan])

# tmp_df_pollen_first_day = pd.DataFrame(data=tmp_pollen_first_day, columns=['year', 'pollen_bouleau_first_day'])

# df_pollen_final = pd.merge(df_pollen_avg, tmp_df_pollen_first_day, how='inner', on=['year'])
# df_pollen_final = df_pollen_final[["year", "pollen_bouleau_avg", "pollen_bouleau_first_day"]]
# df_pollen_final.to_csv("pollen_bouleau.csv", index=False)