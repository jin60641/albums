import React from 'react';
import AniLink from "gatsby-plugin-transition-link/AniLink"

interface Props {
  to: string;
  preventScrollJump?: boolean;
}

const Link: React.FC<Props> = ({ children, to, preventScrollJump }) => (
  <AniLink
    paintDrip
    hex='#000000'
    to={to}
  >
    {children}
  </AniLink>
);

export default Link;
