import React from 'react';

import Image from '../components/Image';
import Layout from '../components/Layout';
import Link from '../components/Link';
import SEO from '../components/SEO';

interface Props {
  pageContext: {
    artist: string,
    album: string,
    rowId: number,
    photoCount: number,
  }
}

const isWindow = typeof window !== 'undefined';

const SecondPage: React.FC<Props> = ({ pageContext: { artist, album, rowId, photoCount } }) => (
  <Layout>
    <SEO
      title={`${artist} - ${album}`}
      image={`music/${rowId}/0.jpg`}
    />
    {Array.from(Array(photoCount)).map((_, i) => (i === 0 ? (
      <div
        key={`View-${rowId}-${i}`}
        style={{
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <Image
          src={`music/${rowId}/${i}.jpg`}
        />
      </div>
    ) : (
      <div
        key={`View-${rowId}-${i}`}
      >
        <img src={require(`../images/music/${rowId}/${i}.jpg`)} />
      </div>
    )))}
    <Link to={isWindow ? ((window as any).previousPath || '/') : '/'}>
      Go back to the homepage
    </Link>
  </Layout>
);

export default SecondPage;
