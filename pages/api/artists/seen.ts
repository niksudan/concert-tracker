import sleep from '@/lib/sleep';
import uniqueArray from '@/lib/unique-array';
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

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
  let currentPage = 1;

  try {
    const { artists, total } = await getSetlistFmConcertsAttended(currentPage);

    console.log(
      `Loaded ${artists.length} of ${total} artists... (Page ${currentPage})`,
    );

    while (artists.length < total) {
      currentPage++;
      const response = await getSetlistFmConcertsAttended(currentPage);
      if (!response.ok) {
        res
          .status(response.status)
          .json({ message: `Error ${response.status}` });
        break;
      }

      artists.push(...response.artists);
      console.log(
        `Loaded ${artists.length} of ${total} artists... (Page ${currentPage})`,
      );
      await sleep(1000);
    }

    res.status(200).json({ message: uniqueArray(artists) });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal error' });
  }
}
