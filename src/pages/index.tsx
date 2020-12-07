import React, { useMemo, useCallback, useEffect } from 'react';

import qs from 'query-string';
import styled from 'styled-components';
import { PageProps } from 'gatsby';

import Coverflow from '../components/Coverflow';
import Image from '../components/Image';
import Layout from '../components/Layout';
import Link from '../components/Link';
import SEO from '../components/SEO';
import dataJson from '../constants/data.json';

const INDEX = 10;

const IndexPage: React.FC<PageProps> = ({ location: { search } }) => {
  const data = useMemo(() => {
    if (!search.length) {
      return dataJson;
    }
    const query = qs.parse(search);
    return dataJson.filter(row => 
      Object.entries(query).every(([key, value]) => (
        `${row[key as keyof typeof row]}` === value
      ))
    );
  }, [search]);

  const randoms = useMemo<number[]>(() => Array.from(Array(INDEX)).reduce((arr, _, i) => {
    while (true) {
      const num = Math.floor(Math.random() * data.length);
      if (!arr.includes(num)) {
        arr[i] = num;
        return arr;
      }
    }
  }, []), [data, search]);

  return (
    <Layout>
      <SEO title='Home' />
        <Coverflow
          displayQuantityOfSide={2}
          active={5}
          navigation={false}
          enableScroll={false}
          enableHeading={false}
        >
          {randoms.map((num) => (
            <Image
              key={`Home-Coverflow-${num}`}
              data-to={`/view/${data[num].artist}-${data[num].album}`}
              src={`music/${data[num].id}/0.jpg`}
            />
          ))}
        </Coverflow>
        <CardWrap>
          {data.map(({ artist, album, id }) => (
            <Card key={`Home-Card-${artist}-${album}-${id}`}>
              <Link
                to={`/view/${artist}-${album}`}
              >
                <CardImage
                >
                  <Image
                    data-to={`/view/${artist}-${album}`}
                    src={`music/${id}/0.jpg`}
                  />
                </CardImage>
                <CardText>
                  {artist}
                </CardText>
                <CardText>
                  {album}
                </CardText>
              </Link>
            </Card>
          ))}
        </CardWrap>
    </Layout>
  );
};

const Card = styled.div`
  display: inline-block;
  vertical-align: top;
  margin: 10px 20px;

  @media only screen and (max-width: 600px) {
    width: 100%;
    margin: 0;
    margin-bottom: 60px;
  }
  @media only screen and (min-width: 600px) {
    width: 40%;
  }
  @media only screen and (min-width: 1200px) {
    width: 30%;
  }

  @media only screen and (min-width: 1600px) {
    width: 20%;
  }

  text-align: center;
`;

const CardImage = styled.div`
  width: 100%;
  position: relative;
  padding-top: 100%;
  border: 2px solid black;
  margin-bottom: 8px;
  @media only screen and (max-width: 600px) {
    border: none;
  }
  > div {
    position: absolute !important;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const CardWrap = styled.div`
  text-align: center;
  margin-top: 40px;
  @media only screen and (max-width: 600px) {
    margin-top: 0px;
  }
`;

const CardText = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
  color: #888;
  overflow-x: hidden;
`;

export default IndexPage;
