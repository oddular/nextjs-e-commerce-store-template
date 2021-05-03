import React from 'react';
import Head from 'next/head';

const preFetch = (id: string, storeKey: string) => {};

const getDescription: any = (category: any) => {
  //seo.og_description > seo.description > description
  if(!!category.seo){
    if(!!category.seo.og_description){
      return category.seo.og_description;
    }else if(!!category.seo.description){
      return category.seo.description;
    }
  }
  return category.description;
}

const getTitle: any = (category: any) => {
  //seo.og_title > seo.title > name
  if(!!category.seo){
    if(!!category.seo.og_title){
      return category.seo.og_title;
    }else if(!!category.seo.title){
      return category.seo.title;
    }
  }
  return category.name;
}

const getImage: any = (category: any) => {
  //seo.image > thumbnail.url > static oddular logo
  if(!!category.seo){
    if(!!category.seo.og_title){
      return category.seo.og_title;
    }else if(!!category.seo.title){
      return category.seo.title;
    }
  }
  return "https://via.placeholder.com/200/8D43F0/FFFFFF/?text=Oddular";
}

interface OddularCategoryMetaProps {
    category: any
}

const OddularCategoryMeta: React.FC<OddularCategoryMetaProps> = ({category}) => {
  return <>
      {/* Twitter */}
      <meta name="twitter:card" content="summary" key="twcard" />
      <meta name="twitter:creator" content="oddularhq" key="twhandle" />

      {/* Open Graph */}

      {/* <meta property="og:url" content={currentURL} key="ogurl" /> */}

      <meta property="og:image" content={getImage(category)} key="ogimage" />
      <meta property="og:type" content="website"/>
      {/* <meta property="og:site_name" content={} key="ogsitename" /> */}
      <meta property="og:title" content={getTitle(category)} key="ogtitle" />
      <meta property="og:description" content={getDescription(category)} key="ogdesc" />
  </>;
};

export default OddularCategoryMeta;
