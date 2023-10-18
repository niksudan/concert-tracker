import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { Artist } from '@/types/Artist';
import sqliteEscapeString from '@/lib/sqliteEscapeString';

type ResponseData = { message: string | Artist[] };

type LastFmArtistResponse = {
  mbid: string;
  name: string;
  playcount: number;
};

type LastFmResponse = {
  artists: {
    artist: LastFmArtistResponse[];
  };
  '@attr': {
    user: string;
    totalPages: string;
    page: string;
    perPage: string;
    total: string;
  };
};

let db: Database | null = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    // Connect to DB
    if (!db) {
      db = await open({
        filename: './database.db',
        driver: sqlite3.Database,
      });
    }

    // Load cache and render it, if applicable
    const cache = (await db.all('SELECT * FROM artists_top')) as Artist[];
    if (cache.length) {
      return res.status(200).json({ message: cache });
    }

    // Load artists
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=${process.env.LASTFM_API_KEY}&user=${process.env.LASTFM_USER_ID}&format=json&limit=250`,
      {
        headers: {
          'User-Agent': 'com.niksudan.concert-tracker/0.1.0',
        },
      },
    );
    if (!response.ok) {
      return res.status(response.status).json({ message: response.statusText });
    }

    // Process response
    const data = (await response.json()) as LastFmResponse;
    const artists = data.artists.artist.map(
      (artist): Artist => ({
        mbid: artist.mbid,
        name: artist.name,
        playcount: Number(artist.playcount), // Last.fm returns playcount as string, convert it
      }),
    );

    // Cache the results
    const query = `INSERT INTO artists_top (mbid, name, playcount) VALUES ${artists.map(
      (artist) =>
        `('${sqliteEscapeString(artist.mbid)}', '${sqliteEscapeString(
          artist.name,
        )}', ${artist.playcount}) `,
    )}`;
    db.run(query);

    // Render result
    res.status(200).json({ message: artists });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal error' });
  }
}
