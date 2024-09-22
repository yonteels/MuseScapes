import psycopg2
import pandas as pd
from psycopg2 import sql

conn = psycopg2.connect(
    user="admin",
    host="localhost",
    database="Musescapes",
    password="admin",
    port=5432
)

csv_file = "discog_music_database.csv"
df = pd.read_csv(csv_file)

print("Column names in DataFrame:", df.columns.tolist())
print("First few rows of the DataFrame:")
print(df.head())


table_name = "music"
columns = ["ID", "Album", "Artist", "Year", "Country", "Track Position", "Track Title", "Album Cover", "Genre"]

missing_columns = [col for col in columns if col not in df.columns]
if missing_columns:
    print(f"Warning: Missing columns in the DataFrame: {missing_columns}")
else:

    df["ID"] = pd.to_numeric(df["ID"], errors="coerce", downcast="integer")
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce", downcast="integer")
    
    values = [tuple(x) for x in df[columns].to_numpy()]

    print(f"Number of columns: {len(columns)}")
    print(f"First row of values: {values[0]}")
    print(f"Number of values in the first row: {len(values[0])}")

    cursor = conn.cursor()

    insert_query = sql.SQL("""
        INSERT INTO {} ({}) 
        VALUES ({})
        """).format(
            sql.Identifier(table_name),
            sql.SQL(", ").join(map(sql.Identifier, columns)),
            sql.SQL(", ").join([sql.Placeholder()] * len(columns))
        )

    print(insert_query.as_string(conn))

    try:
        cursor.executemany(insert_query, values)
        conn.commit()
        print("Data inserted successfully.")
    except Exception as e:
        print(f"Error occurred: {e}")

    cursor.close()

conn.close()
