import React, { useMemo } from 'react';

import { useScrollRestoration } from "gatsby"

import Link from '../components/Link';
import Image from '../components/Image';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import data from '../constants/data.json';

import Coverflow from '../components/Coverflow';

const INDEX = 10;

const IndexPage: React.FC = (props) => {
  const ulScrollRestoration = useScrollRestoration(`page-component-ul-list`)
  const randoms = useMemo<number[]>(() => Array.from(Array(INDEX)).reduce((arr, _, i) => {
    while(true) {
      const num = Math.floor(Math.random() * data.length);
      if (!arr.includes(num)) {
        arr[i] = num;
        return arr;
      }
    }
  }, []), []);

  return (
    <Layout>
      <SEO title='Home' />
      <div ref={ulScrollRestoration.ref as any} onScroll={ulScrollRestoration.onScroll} style={{ overflow: 'auto', height: '100vh' }}>
        <Coverflow
          height={600}
          displayQuantityOfSide={2}
          active={5}
          navigation={false}
          enableScroll={false}
          enableHeading={false}
        >
          {randoms.map((num, i) => (
            <Image
              key={`Home-Coverflow-${num}`}
              data-to={`/view/${data[num].artist}-${data[num].album}`}
              src={`music/${num}/0.jpg`}
            />
          ))}
        </Coverflow>
        <div
          style={{
            textAlign: 'center'
          }}
        >
          {data.map((row, i) => (
            <Link
              key={i}
              to={`/view/${row.artist}-${row.album}`}
            >
              <div
                style={{ width: 300, height: 300, display: 'inline-block', verticalAlign: 'top'}}
              >
                <Image
                  data-to={`/view/${row.artist}-${row.album}`}
                  src={`music/${i}/0.jpg`}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage;
