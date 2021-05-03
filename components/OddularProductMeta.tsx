import React from 'react';
import Head from 'next/head';

const preFetch = (id: string, storeKey: string) => {

};

const getDescription: any = (product: any) => {
  //seo.og_description > seo.description > description
  if(!!product.seo){
    if(!!product.seo.og_description){
      return product.seo.og_description;
    }else if(!!product.seo.description){
      return product.seo.description;
    }
  }
  return product.description;
}

const getTitle: any = (product: any) => {
  //seo.og_title > seo.title > name
  if(!!product.seo){
    if(!!product.seo.og_title){
      return product.seo.og_title;
    }else if(!!product.seo.title){
      return product.seo.title;
    }
  }
  return product.name;
}

const getImage: any = (product: any) => {
  //seo.image > thumbnail.url > static oddular logo
  if(!!product.seo){
    if(!!product.seo.og_title){
      return product.seo.og_title;
    }else if(!!product.seo.title){
      return product.seo.title;
    }
  }
  return "https://via.placeholder.com/200/8D43F0/FFFFFF/?text=Oddular";
}

interface OddularProductMetaProps {
  product: any
}

const OddularProductMeta: React.FC<OddularProductMetaProps> = ({product}) => {

  return (
    <>
      {/* Twitter */}
      <meta name="twitter:card" content="summary" key="twcard" />
      <meta name="twitter:creator" content="oddularhq" key="twhandle" />

      {/* Open Graph */}

      {/* <meta property="og:url" content={currentURL} key="ogurl" /> */}

      <meta property="og:image" content={getImage(product)} key="ogimage" />
      <meta property="og:type" content="website"/>
      {/* <meta property="og:site_name" content={} key="ogsitename" /> */}
      <meta property="og:title" content={getTitle(product)} key="ogtitle" />
      <meta property="og:description" content={getDescription(product)} key="ogdesc" />
    </>
  );
};

export default OddularProductMeta;
