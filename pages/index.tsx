import { ArtistCard } from '@/components/ArtistCard';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { Artist } from '@/types/Artist';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const [seenArtists, setSeenArtists] = useState<Artist[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  const loadApiRoute = async (url: string): Promise<{ message: Artist[] }> => {
    const response = await fetch(url);
    return await response.json();
  };

  useEffect(() => {
    loadApiRoute(`/api/artists/seen`).then((data) => {
      setSeenArtists(data.message);

      loadApiRoute(`/api/artists/top`).then((data) => {
        setTopArtists(data.message);
        setLoading(false);
      });
    });
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Hero>Concert Tracker</Hero>
      <Section>
        <div className="columns">
          <div className="column">
            <h2>Top Artists</h2>
            {topArtists.map((artist, index) => (
              <ArtistCard key={index} artist={artist} />
            ))}
          </div>
          <div className="column">
            <h2>Seen Artists</h2>
            {seenArtists.map((artist, index) => (
              <ArtistCard key={index} artist={artist} />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
