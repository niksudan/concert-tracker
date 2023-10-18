import React, { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export const Section = ({ children }: Props) => (
  <section className="section">
    <div className="container">
      <div className="content">{children}</div>
    </div>
  </section>
);
