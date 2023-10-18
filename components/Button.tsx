import React, { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}

export const Button = ({ children, active = false, onClick }: Props) => (
  <a
    className={`button is-responsive${active ? ' is-primary is-light' : ''}`}
    onClick={onClick}
  >
    {children}
  </a>
);
