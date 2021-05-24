import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import Spinner from "../components/spinner";

import { Box, SimpleGrid } from "@chakra-ui/react";

import ProductCard from "../components/ProductCard";

import {
  useProductListQuery,
} from "@oddular/graphql-client-apollo";


export default function Home() {
  const { data, loading, error } = useProductListQuery({
    variables: { first: 10 },
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>The Weird Store</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{" "}
          <a href="https://oddular.com/">
            <b>The Weird Store!</b>
          </a>
        </h1>
      </main>
      <section>
        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>
        {!!loading ? (
          <Spinner />
        ) : (
          <>
            {!!error ? (
              <div className={styles.error}>{error}</div>
            ) : (
              <>
                <SimpleGrid columns={2} spacing={10} mt={5}>
                  {data.products.edges.map((node) => {
                    let product = node.node;
                    return (
                      <ProductCard
                        product={product}
                      />
                    );
                  })}
                </SimpleGrid>
              </>
            )}
          </>
        )}
      </section>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Oddular
        </a>
      </footer>
    </div>
  );
}
