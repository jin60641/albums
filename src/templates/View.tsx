import React from 'react';

import { CreatePagesArgs } from 'gatsby';

import Link from '../components/Link';
import Image from '../components/Image';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

interface Props {
  pageContext: {
    artist: string,
    album: string,
    rowId: number,
    photoCount: number,
  }
}

const SecondPage: React.FC<Props> = ({
  pageContext: {
    artist, album, rowId, photoCount,
  },
}) => {
  return (
  <Layout>
    <SEO title={`${artist} - ${album}`} />
      {Array.from(Array(photoCount)).map((_, i) => i === 0 ? (
        <div
          key={`View-${rowId}-${i}`}
          style={{
            maxWidth: 600,
            margin: '0 auto'
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
      ))}
      <Link to='/' >Go back to the homepage</Link>
  </Layout>
  );
}

export default SecondPage;
