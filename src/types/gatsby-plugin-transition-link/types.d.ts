declare module 'gatsby-plugin-transition-link/AniLink' {
  const AniLink: React.FC<{
    to: string;
    paintDrip?: boolean;
    hex?: string;
  }>;
  export default AniLink;
}
