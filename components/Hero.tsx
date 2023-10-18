import React, { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export const Hero = ({ children }: Props) => (
  <section className="hero is-primary is-medium" style={{}}>
    <div className="hero-body">
      <div className="container">
        <h1 className="title">{children}</h1>
      </div>
    </div>
  </section>
);
