import { Artist } from '@/types/Artist';
import Image from 'next/image';
import React from 'react';
import { format } from 'date-fns';

interface Props {
  artist: Artist;
  hasSeen?: boolean;
}

export const ArtistCard = ({ artist, hasSeen }: Props) => {
  const formatDate = (date: string) => {
    const pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
    const formatted = new Date(date.replace(pattern, '$3-$2-$1'));
    return format(formatted, 'do MMMM YYY');
  };

  return (
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
            {artist.lastSeenDate}
            {hasSeen ? (
              <>
                <p>You&apos;ve seen this artist live!</p>
                {artist.lastSeenVenue && artist.lastSeenDate && (
                  <p>
                    <small>
                      Last seen at <strong>{artist.lastSeenVenue}</strong> on{' '}
                      {formatDate(artist.lastSeenDate)}
                    </small>
                  </p>
                )}
              </>
            ) : (
              <>
                <p>You haven&apos;t seen this artist live yet</p>
                <a
                  className="button"
                  target="_blank"
                  rel="noopener"
                  href={`https://www.songkick.com/search?query=${encodeURIComponent(
                    artist.name,
                  )}&type=upcoming`}
                >
                  View concerts
                </a>
              </>
            )}
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
};
