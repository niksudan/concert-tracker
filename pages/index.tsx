import { ArtistCard } from '@/components/ArtistCard';
import { Button } from '@/components/Button';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { Artist } from '@/types/Artist';
import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const [seenArtists, setSeenArtists] = useState<Artist[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filter, setFilter] = useState(0);

  const loadApiRoute = async (url: string): Promise<{ message: Artist[] }> => {
    const response = await fetch(url);
    return await response.json();
  };

  const isArtistSeen = useCallback(
    (artist: Artist) => {
      return seenArtists.some(
        (seenArtist) =>
          seenArtist.name === artist.name ||
          (!!seenArtist.mbid && seenArtist.mbid == artist.mbid),
      );
    },
    [seenArtists],
  );

  /**
   * Load initial data
   */
  useEffect(() => {
    loadApiRoute(`/api/artists/seen`).then((data) => {
      setSeenArtists(data.message);
      loadApiRoute(`/api/artists/top`).then((data) => {
        setTopArtists(data.message);
        setArtists(data.message);
        setLoading(false);
      });
    });
  }, []);

  /**
   * Filter artists
   */
  useEffect(() => {
    switch (filter) {
      case 0:
        setArtists(topArtists);
        break;
      case 1:
        setArtists(topArtists.filter((artist) => isArtistSeen(artist)));
        break;
      case 2:
        setArtists(topArtists.filter((artist) => !isArtistSeen(artist)));
        break;
    }
  }, [filter, isArtistSeen, topArtists]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Hero>Concert Tracker</Hero>
      <Section>
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="columns">
              <div className="column">
                <h2>My Artists</h2>
              </div>
              <div className="column">
                <div className="buttons is-right">
                  <Button onClick={() => setFilter(0)} active={filter === 0}>
                    All
                  </Button>
                  <Button onClick={() => setFilter(1)} active={filter === 1}>
                    Seen
                  </Button>
                  <Button onClick={() => setFilter(2)} active={filter === 2}>
                    Not Seen
                  </Button>
                </div>
              </div>
            </div>

            {artists.map((artist, index) => (
              <ArtistCard
                key={index}
                artist={artist}
                hasSeen={isArtistSeen(artist)}
              />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
