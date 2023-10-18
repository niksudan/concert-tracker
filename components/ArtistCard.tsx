import { Artist } from '@/types/Artist';
import React from 'react';

interface Props {
  artist: Artist;
}

export const ArtistCard = ({ artist }: Props) => (
  <div className="card mb-4">
    <div className="card-content">
      <div className="columns">
        <div className="column">
          <p>
            <strong>{artist.name}</strong>
          </p>
        </div>

        {!!artist.playcount && (
          <div className="column has-text-right">
            <span className="tag">{artist.playcount} plays</span>
          </div>
        )}
      </div>
    </div>
  </div>
);
