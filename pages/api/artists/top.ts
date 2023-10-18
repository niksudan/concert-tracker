import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

type ResponseData = { message: string | string[] };

type Artist = {
  mbid: string;
  name: string;
  playcount: string;
};

type LastFmResponse = {
  artists: {
    artist: Artist[];
  };
  '@attr': {
    user: string;
    totalPages: string;
    page: string;
    perPage: string;
    total: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
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

    const data = (await response.json()) as LastFmResponse;
    const artists = data.artists.artist.map((artist) => artist.name);

    // Render result
    res.status(200).json({ message: artists });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal error' });
  }
}
