import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import PgSession from 'connect-pg-simple';
import { execFile } from 'child_process';

const { Pool } = pkg;

const app = express();
const port = 5000;

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL pool setup
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'Musescapes',
  password: 'admin',
  port: 5432
});

// Session setup
app.use(session({
  store: new (PgSession(session))({
    pool: pool,
    tableName: 'session'
  }),
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,  // 24 hours
    secure: false
  }
}));

// Register route
app.post('/register', async (req, res) => {
  const { email, userName, hashPassword, salt } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (email, username, hashed_password, salt) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, userName, hashPassword, salt]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting user into database:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const storedHashedPassword = user.hashed_password;
    const isPasswordValid = bcrypt.compareSync(password, storedHashedPassword);

    if (isPasswordValid) {
      req.session.userId = user.id;  // Set session userId
      res.status(200).json({ message: 'Login successful', user: { email: user.email, username: user.username } });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout error' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Auth check route
app.get('/check-auth', async (req, res) => {
  if (req.session.userId) {
    try {
      const result = await pool.query('SELECT username FROM users WHERE id = $1', [req.session.userId]);

      if (result.rows.length > 0) {
        const username = result.rows[0].username;
        res.status(200).json({ authenticated: true, username: username });
      } else {
        res.status(200).json({ authenticated: false });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(200).json({ authenticated: false });
  }
});

//get music based on genre

app.get('/api/type/:type/genre/:genre', async (req, res) => {
  const { type, genre } = req.params;
  const parsedGenre = genre.replace("-", " ");


  try {
    let result, countQuery, dataQuery;
  //remove dyokucatre
    if (type === "albums") {  
      dataQuery = genre === "All_Album" 
        ? 'SELECT DISTINCT ON ("ID") "ID", "Album", "Artist", "Year", "Country", "Album Cover", "Song ID" FROM music GROUP BY "ID", "Album", "Artist", "Year", "Country", "Album Cover", "Song ID"'
        : 'SELECT DISTINCT ON ("ID") "ID","Album", "Artist", "Year", "Country", "Album Cover", "Song ID" FROM music WHERE "Genre" ILIKE $1 GROUP BY "ID", "Album", "Artist", "Year", "Country", "Album Cover", "Song ID"';

      countQuery = genre === "All_Album"
        ? 'SELECT COUNT(DISTINCT "Album") AS total FROM music'
        : 'SELECT COUNT(DISTINCT "Album") AS total FROM music WHERE "Genre" ILIKE $1';

    } else {
      dataQuery = genre === "All_Music" 
        ? 'SELECT "ID","Album", "Artist", "Year", "Country", "Track Position", "Track Title", "Album Cover", "Song ID" FROM music'
        : 'SELECT "ID","Album", "Artist", "Year", "Country", "Track Position", "Track Title", "Album Cover", "Song ID" FROM music WHERE "Genre" ILIKE $1';

      countQuery = genre === "All_Music"
        ? 'SELECT COUNT(*) AS total FROM music'
        : 'SELECT COUNT(*) AS total FROM music WHERE "Genre" ILIKE $1';
    }

    const countResult = genre === "All_Album" || genre === "All_Music"
      ? await pool.query(countQuery)
      : await pool.query(countQuery, [`%${parsedGenre}%`]);

    result = genre === "All_Album" || genre === "All_Music"
      ? await pool.query(dataQuery)
      : await pool.query(dataQuery, [`%${parsedGenre}%`]);

    res.json({ total: countResult.rows[0].total, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



app.get('/api/album_details/albumid/:albumid', async (req, res) => {
  const { albumid } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM music WHERE "ID" = $1', [albumid]);
    if (result.rows.length > 0) {
      res.json(result.rows); 
    } else {
      res.status(404).json({ message: 'No songs found for this album' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Get favorite songs
app.get('/api/favourite', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }
    const result = await pool.query('SELECT * FROM user_song WHERE "Player ID" = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving favourite songs:', error);
    res.status(500).json({ error: 'Failed to retrieve songs' });
  }
});


// Add favorite route
app.post('/api/favorites/add', async (req, res) => {
  const { userId, songName, artist, album, songID ,albumCover} = req.body;
  try {
      const result = await pool.query(
          'INSERT INTO user_song ("Player ID", "Song Name", "Artist", "Album", "Song ID", "Album Cover") VALUES ($1, $2, $3, $4, $5,$6) RETURNING *',
          [userId, songName, artist, album, songID, albumCover]
      );
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error adding to favorites:', error);
      res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

//Delete favourite 
app.delete('/api/favourite/delete', async (req, res) => {
  const { userId, songID } = req.body;

  if (!userId || !songID) {
      return res.status(400).json({ error: 'Missing userId or songID' });
  }

  try {
      const query = 'DELETE FROM user_song WHERE "Player ID" = $1 AND "Song ID" = $2 RETURNING *';
      const result = await pool.query(query, [userId, songID]);

      if (result.rowCount > 0) {
          res.status(200).json({ message: 'Song removed from favorites' });
      } else {
          res.status(404).json({ error: 'Song not found in favorites' });
      }
  } catch (err) {
      console.error('Error deleting song from favorites:', err);
      res.status(500).json({ error: 'Server error' });
  }
});


// Get user details
app.get('/api/get-user-details', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const userId = req.session.userId;
    const result = await pool.query('SELECT id, email, username, profile_picture FROM users WHERE id = $1', [userId]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json({ userId: user.id, email: user.email, username: user.username, profilePicture: user.profilePicture});
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


//call cosinesimilarity script
app.get('/api/favourite/runCosineSimilarity', async (req, res) => {
  try {
    const userId = req.session.userId;
    const scriptPath = 'E:/Codes/MuseScapes/MuseScapes/cosine_similarity.py'; 

    execFile('python3', [scriptPath, userId], {
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }  // Setting UTF-8 encoding for Python
    }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing script', error);
        return res.status(500).send('Error executing script');
      }
      if (stderr) {
        console.error('Script error output:', stderr);
      }
      res.send(`Result: ${stdout}`); 
    });
  } catch (error) {
    console.error('Error fetching cosine script', error);
    res.status(500).send('Server issue');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
