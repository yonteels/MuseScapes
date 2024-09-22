import time
import discogs_client
import csv

client = discogs_client.Client("MuseScapes/0.1", user_token="ERrduppUslqrySKSpDkhjMBYbSvorRRCOGfmGivY")

years = range(2020, 2025)

with open("discog_music_database.csv", mode="a", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=["ID", "Album", "Artist", "Year", "Country", "Track Position", "Track Title", "Album Cover", "Genre"])
    writer.writeheader()

    for year in years:
        albums = client.search(year=year, type="release", country="US", sort="have", sort_order="desc")

        album_count = 0
        for album in albums:
            if album_count >= 100:
                break

            time.sleep(1)

            try:
                album.refresh()
                album_cover = album.images[0]["uri"] if hasattr(album, "images") and album.images else None
                genres = ", ".join(album.genres) if hasattr(album, "genres") and album.genres else "N/A"
                year = album.year if hasattr(album, "year") else "Unknown"
                country = album.country if hasattr(album, "country") else "Unknown"
                artists = ", ".join(artist.name for artist in album.artists) if hasattr(album, "artists") and album.artists else "Unknown"
                album_id = album.id

                for track in album.tracklist:
                    track_data = {
                        "Release ID": album_id,
                        "Album": album.title,
                        "Artist": artists,
                        "Year": year,
                        "Country": country,
                        "Track Position": track.position,
                        "Track Title": track.title,
                        "Album Cover": album_cover,
                        "Genre": genres
                    }

                    writer.writerow(track_data)

                album_count += 1

            except Exception as e:
                print(f"An error occurred: {e}")
