import React, { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}

export const Button = ({ children, active = false, onClick }: Props) => (
  <a className={`button${active ? ' is-primary' : ''}`} onClick={onClick}>
    {children}
  </a>
);
