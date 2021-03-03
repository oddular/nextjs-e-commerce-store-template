import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import Spinner from '../components/spinner';

import { OddularStorefrontClient, gql } from '@oddular/commerce-core';

export default function Home() {
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const OddularClient = new OddularStorefrontClient(
      'ODDULAR_PUBLIC_TOKEN_Nkpn4ZAmPJZD1Gs7SyiAP8CjQ5GRF6',
      'http://localhost:8000/storefront/',
      true,
      {},
    );

    const productFragment = gql`
      fragment ProductFragment on Product {
        id
        name
      }
    `;

    OddularClient.getProductList({ first: 5 }, productFragment)
      .then((data) => {
        setD(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Weird Store</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Weird Store!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>
        {!!loading ? (
          <Spinner />
        ) : (
          <>
            <div className={styles.grid}>
              {d.products.edges.map((node) => {
                let product = node.node;
                return (
                  <a
                    href="https://nextjs.org/docs"
                    className={styles.card}
                    key={product.id}
                  >
                    <h3>{product.name} &rarr;</h3>
                  </a>
                );
              })}
            </div>
          </>
        )}
      </main>

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
