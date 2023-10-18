import sleep from '@/lib/sleep';
import uniqueArray from '@/lib/unique-array';
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

type ResponseData = { message: string | string[] };

type Setlist = {
  id: string;
  eventDate: string;
  artist: {
    mbid: string;
    name: string;
    sortName: string;
  };
};

type SetlistFmResponse = {
  type: string;
  itemsPerPage: number;
  page: number;
  total: number;
  setlist: Setlist[];
};

let db: Database | null = null;

async function getSetlistFmConcertsAttended(page?: number): Promise<{
  ok: boolean;
  status: number;
  artists: string[];
  total: number;
  itemsPerPage: number;
}> {
  const response = await fetch(
    `https://api.setlist.fm/rest/1.0/user/${
      process.env.SETLISTFM_USER_ID
    }/attended?p=${page || 1}`,
    {
      headers: {
        'User-Agent': 'com.niksudan.concert-tracker/0.1.0',
        Accept: 'application/json',
        'x-api-key': process.env.SETLISTFM_API_KEY!,
      },
    },
  );

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      artists: [],
      total: 0,
      itemsPerPage: 0,
    };
  }

  const data = (await response.json()) as SetlistFmResponse;
  const artists = data.setlist.map((setlist) => setlist.artist.name);

  return {
    ok: true,
    status: response.status,
    artists,
    total: data.total,
    itemsPerPage: data.itemsPerPage,
  };
}

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
    const cache = await db.all('SELECT * FROM artists_seen');
    if (cache.length) {
      console.log(`Using cached result (${cache.length} artists)`);
      return res
        .status(200)
        .json({ message: cache.map((artist) => artist.name) });
    }

    // Determine total number of artists to load
    let currentPage = 1;
    let { artists, total } = await getSetlistFmConcertsAttended(currentPage);
    console.log(
      `Loaded ${artists.length} of ${total} artists... (Page ${currentPage})`,
    );

    // Slowly load all artists seen, page by page
    while (artists.length < total) {
      currentPage++;
      const response = await getSetlistFmConcertsAttended(currentPage);
      if (!response.ok) {
        return res
          .status(response.status)
          .json({ message: `Error ${response.status}` });
        break;
      }
      artists.push(...response.artists);
      console.log(
        `Loaded ${artists.length} of ${total} artists... (Page ${currentPage})`,
      );
      await sleep(1000); // Setlist.fm has a sensitive rate limit
    }

    // Filter out artists you may have seen twice
    artists = uniqueArray(artists);

    // Cache the results
    const query = `INSERT INTO artists_seen (name) VALUES ${artists.map(
      (artist, index) => `("${artist}") `,
    )}`;
    console.log(query);
    db.run(query);

    // Render result
    res.status(200).json({ message: artists });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal error' });
  }
}
