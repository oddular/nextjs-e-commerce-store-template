import React from 'react';
import Head from 'next/head';

const preFetch = (id: string, storeKey: string) => {};

const getDescription: any = (collection: any) => {
  //seo.og_description > seo.description > description
  if(!!collection.seo){
    if(!!collection.seo.og_description){
      return collection.seo.og_description;
    }else if(!!collection.seo.description){
      return collection.seo.description;
    }
  }
  return collection.description;
}

const getTitle: any = (collection: any) => {
  //seo.og_title > seo.title > name
  if(!!collection.seo){
    if(!!collection.seo.og_title){
      return collection.seo.og_title;
    }else if(!!collection.seo.title){
      return collection.seo.title;
    }
  }
  return collection.name;
}

const getImage: any = (collection: any) => {
  //seo.image > thumbnail.url > static oddular logo
  if(!!collection.seo){
    if(!!collection.seo.og_title){
      return collection.seo.og_title;
    }else if(!!collection.seo.title){
      return collection.seo.title;
    }
  }
  return "https://via.placeholder.com/200/8D43F0/FFFFFF/?text=Oddular";
}

interface OddularCollectionMetaProps {collection: any}

const OddularCollectionMeta: React.FC<OddularCollectionMetaProps> = ({collection}) => {
  return <>
      {/* Twitter */}
      <meta name="twitter:card" content="summary" key="twcard" />
      <meta name="twitter:creator" content="oddularhq" key="twhandle" />

      {/* Open Graph */}

      {/* <meta property="og:url" content={currentURL} key="ogurl" /> */}

      <meta property="og:image" content={getImage(collection)} key="ogimage" />
      <meta property="og:type" content="website"/>
      {/* <meta property="og:site_name" content={} key="ogsitename" /> */}
      <meta property="og:title" content={getTitle(collection)} key="ogtitle" />
      <meta property="og:description" content={getDescription(collection)} key="ogdesc" />
  </>;
};

export default OddularCollectionMeta;
