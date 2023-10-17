import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const url = `/api`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
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
