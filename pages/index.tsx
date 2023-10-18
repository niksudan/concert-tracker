import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const [seenArtists, setSeenArtists] = useState<string[]>([]);
  const [topArtists, setTopArtists] = useState<string[]>([]);

  const loadApiRoute = async (url: string) => {
    const response = await fetch(url);
    return await response.json();
  };

  useEffect(() => {
    loadApiRoute(`/api/artists/seen`).then((data) => {
      setSeenArtists(data);

      loadApiRoute(`/api/artists/top`).then((data) => {
        setTopArtists(data);
        setLoading(false);
      });
    });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Hello World</h1>
    </>
  );
}
