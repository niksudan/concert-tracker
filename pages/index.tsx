import { ArtistCard } from '@/components/ArtistCard';
import { Button } from '@/components/Button';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { Artist } from '@/types/Artist';
import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [filter, setFilter] = useState(0);

  /**
   * Load an API route
   *
   * @param url URL to load
   * @returns Artist[]
   */
  const loadApiRoute = async (url: string): Promise<{ message: Artist[] }> => {
    const response = await fetch(url);
    return await response.json();
  };

  /**
   * Determine if an artist has been seen
   */
  const isArtistSeen = useCallback(
    (artist: Artist) => !!artist.lastSeenDate,
    [],
  );

  /**
   * Load and process initial data
   */
  useEffect(() => {
    loadApiRoute(`/api/artists/seen`).then((seenArtistsPayload) => {
      loadApiRoute(`/api/artists/top`).then((topArtistsPayload) => {
        const seenArtists = seenArtistsPayload.message;
        const topArtists = topArtistsPayload.message;

        const processedArtists = [];
        for (const artist of topArtists) {
          const { lastSeenDate, lastSeenVenue } =
            seenArtists.find((a) => a.mbid === artist.mbid) || {};
          processedArtists.push({
            ...artist,
            lastSeenVenue,
            lastSeenDate,
          });
        }

        setArtists(processedArtists);
        setFilteredArtists(processedArtists);
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
        setFilteredArtists(artists);
        break;
      case 1:
        setFilteredArtists(artists.filter((artist) => isArtistSeen(artist)));
        break;
      case 2:
        setFilteredArtists(artists.filter((artist) => !isArtistSeen(artist)));
        break;
    }
  }, [artists, filter, isArtistSeen]);

  const content = (
    <>
      <div className="columns is-mobile">
        <div className="column">
          <h2>My Artists</h2>
        </div>
        <div className="column">
          <div className="buttons has-addons is-right">
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
    </>
  );

  return (
    <>
      <Hero>🎸 Concert Tracker</Hero>
      <Section>
        <div className="columns is-centered">
          <div className="column is-two-thirds-widescreen">
            {isLoading ? <p>Loading... please wait</p> : content}
          </div>
        </div>
      </Section>
    </>
  );
}
