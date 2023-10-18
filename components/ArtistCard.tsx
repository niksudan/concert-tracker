import { Artist } from '@/types/Artist';
import Image from 'next/image';
import React from 'react';

interface Props {
  artist: Artist;
  hasSeen?: boolean;
}

export const ArtistCard = ({ artist, hasSeen }: Props) => (
  <div className="card mb-4">
    <div className="card-content">
      <div className="media">
        <div className="media-left">
          <div className="image is-64x64">
            <Image
              src={hasSeen ? './icon-done.svg' : './icon-pending.svg'}
              alt={hasSeen ? '✅' : '❌'}
              width={128}
              height={128}
            />
          </div>
        </div>
        <div className="media-content">
          <p>
            <strong>{artist.name}</strong>
          </p>
          <p>
            {hasSeen
              ? "You've seen this artist live!"
              : "You haven't seen this artist live"}
          </p>
        </div>
        {!!artist.playcount && (
          <div className="media-right">
            <span className="tag">{artist.playcount} plays</span>
          </div>
        )}
      </div>
    </div>
  </div>
);
