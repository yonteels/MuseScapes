import psycopg2
import pandas as pd
from psycopg2 import sql
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import OneHotEncoder
import numpy as np
import sys

def cosineSimilarityFunction(user_song_data, all_song):
    categorical_cols = [1, 2, 4, 5, 6] 
    numerical_cols = [3] 
    
    user_song_cat = np.array(user_song_data)[:, categorical_cols]
    user_song_num = np.array(user_song_data)[:, numerical_cols].astype(float)
    all_song_cat = np.array(all_song)[:, categorical_cols]
    all_song_num = np.array(all_song)[:, numerical_cols].astype(float)
    
    encoder = OneHotEncoder()
    combined_cat = np.vstack((user_song_cat, all_song_cat))  
    encoder.fit(combined_cat)
    user_song_cat_vectors = encoder.transform(user_song_cat).toarray()
    all_song_cat_vectors = encoder.transform(all_song_cat).toarray()

    user_song_vectors = np.hstack((user_song_cat_vectors, user_song_num))
    all_song_vectors = np.hstack((all_song_cat_vectors, all_song_num))

    similarity_matrix = cosine_similarity(user_song_vectors, all_song_vectors)

    return similarity_matrix  

userID = sys.argv[1]

conn = psycopg2.connect(
    user="admin",
    host="localhost",
    database="Musescapes",
    password="admin",
    port=5432
)

cursor = conn.cursor()

query = 'SELECT "Song ID" FROM user_song WHERE "Player ID" = %s'
cursor.execute(query, (userID,))
results = cursor.fetchall()
song_ids = [row[0] for row in results]

user_song_data = []

for song_id in song_ids:
    query = 'SELECT "Song ID", "Album", "Artist", "Year", "Country", "Track Title", "Genre" FROM music WHERE "Song ID" = %s'
    cursor.execute(query, (song_id,))
    result = cursor.fetchone()  
    if result:
        user_song_data.append(result)

cursor.execute('SELECT "Song ID", "Album", "Artist", "Year", "Country", "Track Title", "Genre" FROM music')
all_song = cursor.fetchall()

similarity_matrix = cosineSimilarityFunction(user_song_data, all_song)

threshold = 0.7
similar_songs = []
seen_artists = set()  # To track artists already added

user_song_ids = {row[0] for row in user_song_data}  # Create a set of user song IDs

for i, user_song_similarities in enumerate(similarity_matrix):
    for j, similarity in enumerate(user_song_similarities):
        if similarity > threshold:
            song_id = all_song[j][0]
            track_title = all_song[j][5]
            artist = all_song[j][2]
            album = all_song[j][1]

            # Check if the artist is already included and if the song is not in user_song_data
            if artist not in seen_artists and song_id not in user_song_ids:
                similar_song_info = {
                    "Song ID": song_id,
                    "Track Title": track_title,
                    "Artist": artist,
                    "Similarity": similarity,
                    "Album": album
                }
                similar_songs.append(similar_song_info)
                seen_artists.add(artist)  # Mark the artist as seen

# Sort the list by similarity
similar_songs = sorted(similar_songs, key=lambda x: x['Similarity'], reverse=True)

# Print the top 10 unique songs from different artists
for i in range(min(10, len(similar_songs))):
    print(f"Song ID: {similar_songs[i]['Song ID']}, Album: {similar_songs[i]['Album']}, Track Title: {similar_songs[i]['Track Title']}, Artist: {similar_songs[i]['Artist']}")

conn.commit()
conn.close()
