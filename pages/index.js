import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import Spinner from '../components/spinner';

import { OddularStorefrontClient, gql } from '@oddular/commerce-core';

const TOKEN = 'ODDULAR_PUBLIC_TOKEN_x6eCRpSwmsKXtV8XYmCDl2V2nREFMq';
const GRAPHQL_URL = 'http://localhost:8000/storefront/';

export default function Home() {
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const OddularClient = new OddularStorefrontClient(
      TOKEN,
      GRAPHQL_URL,
      true,
      {},
    );

    const productFragment = gql`
      fragment ProductFragment on Product {
        id
        name
        description
      }
    `;

    OddularClient.getProductList({ first: 100 }, productFragment)
      .then(({ status, data, error }) => {
        if (status === 'error') {
          console.log('response');
          console.log(error.response.error);
          setError(error.response.error);
        } else {
          setD(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (variant, quantity) => {
    const OddularClient = new OddularStorefrontClient(
      TOKEN,
      GRAPHQL_URL,
      true,
      {},
    );

    OddularClient.addProductToCart();
  };

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
      </main>
      <section>
        <h2>Cart</h2>
      </section>
      <section>
        <p className={styles.description}>
          Get started by editing{' '}
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
                <div className={styles.grid}>
                  {d.products.edges.map((node) => {
                    let product = node.node;
                    return (
                      <div
                        onClick={() => addProductToCart(product.id)}
                        className={styles.card}
                        key={product.id}
                      >
                        <h3>{product.name} &rarr;</h3>
                        <h5 style={{ fontSize: '0.6rem' }}>
                          {!!product.category && product.category.name}
                        </h5>
                        <p>
                          {!!product.description &&
                            product.description.substring(0, 50)}
                        </p>
                      </div>
                    );
                  })}
                </div>
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
