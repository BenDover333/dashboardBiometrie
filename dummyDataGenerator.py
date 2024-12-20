import pandas as pd
import numpy as np

time = pd.date_range(start='2024-10-31 00:00', end='2024-10-31 20:00', freq='5s')

data = {
    't (s)': (time - time[0]).seconds,
    'Rf (1/min)': np.random.uniform(10, 30, size=len(time)),
    'VT (L btps)': np.random.uniform(0.3, 2.0, size=len(time)),
    'VE': np.random.uniform(10, 40, size=len(time)),
    'IV': np.random.uniform(300, 700, size=len(time)),
    'VO2': np.random.uniform(100, 600, size=len(time)),
    'VCO2': np.random.uniform(80, 500, size=len(time)),
    'RQ': np.random.uniform(0.7, 1.2, size=len(time)),
    'O2exp': np.random.uniform(60, 250, size=len(time)),
    'CO2exp': np.random.uniform(20, 100, size=len(time)),
    'VE/VO2': np.random.uniform(3, 10, size=len(time)),
    'VE/VCO2': np.random.uniform(2, 8, size=len(time)),
    'VO2/Kg': np.random.uniform(2, 6, size=len(time)),
    'METS': np.random.uniform(2, 10, size=len(time)),
    'HR': np.random.randint(60, 180, size=len(time)),
    'VO2/HR': np.random.uniform(1, 5, size=len(time)),
    'FeO2': np.random.uniform(20, 40, size=len(time)),
    'FeCO2': np.random.uniform(2, 5, size=len(time)),
    'FetO2': np.random.uniform(18, 30, size=len(time)),
    'FetCO2': np.random.uniform(1, 4, size=len(time)),
    'FiO2': np.random.uniform(20, 40, size=len(time)),
    'FiCO2': np.random.uniform(0, 5, size=len(time)),
    'PeO2': np.random.uniform(70, 100, size=len(time)),
    'PeCO2': np.random.uniform(30, 50, size=len(time)),
    'PetO2': np.random.uniform(65, 90, size=len(time)),
    'PetCO2': np.random.uniform(28, 45, size=len(time)),
    'Power': np.random.uniform(100, 500, size=len(time)),
    'PWR': np.random.uniform(50, 200, size=len(time)),
    'RPM': np.random.randint(60, 120, size=len(time)),
    'Fase': ['REST'] * len(time),
    'Marker': [''] * len(time),
    'Amb. Temp.': np.random.uniform(15, 25, size=len(time)),
    'RH Amb': np.random.uniform(30, 70, size=len(time)),
    'Analyz. Press.': np.random.uniform(700, 800, size=len(time)),
    'PB': np.random.uniform(700, 800, size=len(time)),
    'EEkc': np.random.uniform(500, 1500, size=len(time)),
    'EEh': np.random.uniform(500, 1500, size=len(time)),
    'EEm': np.random.uniform(500, 1500, size=len(time)),
    'EEtot': np.random.uniform(1500, 4500, size=len(time)),
    'EEkg': np.random.uniform(5, 15, size=len(time)),
    'PRO': np.random.uniform(20, 100, size=len(time)),
    'Vet': np.random.uniform(20, 100, size=len(time)),
    'CHO': np.random.uniform(20, 100, size=len(time)),
    'PRO%': np.random.uniform(10, 40, size=len(time)),
    'VET%': np.random.uniform(10, 40, size=len(time)),
    'CHO%': np.random.uniform(10, 40, size=len(time)),
    'npRQ': np.random.uniform(0.7, 1.2, size=len(time)),
    'La-': np.random.uniform(0, 10, size=len(time)),
    'GPS afst.': np.random.uniform(0, 100, size=len(time)),
    'Ti': np.random.uniform(0.5, 3.0, size=len(time)),
    'Te': np.random.uniform(0.5, 3.0, size=len(time)),
    'Ttot': np.random.uniform(1, 6, size=len(time)),
    'Ti/Ttot': np.random.uniform(0.1, 0.5, size=len(time)),
    'VD/VT e': np.random.uniform(0.1, 0.3, size=len(time)),
    'LogVE': np.random.uniform(1, 3, size=len(time)),
    't Rel': np.random.uniform(0, 1, size=len(time)),
    'mark snelheid': np.random.uniform(0, 20, size=len(time)),
    'mark Afstand': np.random.uniform(0, 500, size=len(time)),
    'Fase tijd': np.random.uniform(0, 60, size=len(time)),
    'VO2/Kg%Pred': np.random.uniform(50, 100, size=len(time)),
    'BR': np.random.uniform(10, 30, size=len(time)),
    'RealPower': np.random.uniform(100, 500, size=len(time)),
    'VT/Ti': np.random.uniform(1, 2, size=len(time)),
    'HRR': np.random.uniform(0, 60, size=len(time)),
    'PaCO2_e': np.random.uniform(35, 45, size=len(time)),
    'PaO2_e': np.random.uniform(75, 100, size=len(time)),
    'Te-': np.random.uniform(0.1, 1.0, size=len(time)),
}

df = pd.DataFrame(data)
def seconds_to_hhmm(seconds):
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    return f"{hours:02}:{minutes:02}"

df['t (s)'] = df['t (s)'].apply(seconds_to_hhmm)

df.to_csv('dummydata6.csv', index=False)
