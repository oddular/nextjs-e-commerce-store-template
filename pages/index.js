import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import Spinner from '../components/spinner';

import { OddularStorefrontClient, gql } from '@oddular/commerce-core';

const TOKEN = '__DEMO__ODDULAR_PUBLIC_TOKEN_00000';
const GRAPHQL_URL = 'http://localhost:8000/storefront/';

export default function Home() {
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const OddularClient = new OddularStorefrontClient(
      TOKEN,
      {},
      '',
      GRAPHQL_URL,
      true,
      true,
    );

    const productFragment = gql`
      fragment ProductFragment on Product {
        id
        name
        description
        variants {
          id
          sku
          name
          images {
            id
            url
            alt
          }
          pricing {
            onSale
            priceUndiscounted {
              gross {
                amount
                currency
              }
              net {
                amount
                currency
              }
            }
            price {
              gross {
                amount
                currency
              }
              net {
                amount
                currency
              }
            }
          }
        }
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

  const handleAddToCart = (variantId) => {
    const OddularClient = new OddularStorefrontClient(
      TOKEN,
      {},
      '',
      GRAPHQL_URL,
      true,
      true,
    );

    OddularClient.addProductToCart({
      quantity: 1,
      variantId,
      note: 'a note',
      choice: 'a choice',
    });
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
                      <div className={styles.card} key={product.id}>
                        <h3>{product.name} &rarr;</h3>
                        <h5 style={{ fontSize: '0.6rem' }}>
                          {!!product.category && product.category.name}
                        </h5>
                        {product.variants.map((variant) => {
                          return (
                            <pre
                              key={variant.id}
                              onClick={() => handleAddToCart(variant.id)}
                              style={{
                                fontSize: '10px',
                                background: 'rgba(120,120,120, 0.25)',
                                margin: '10px 0',
                              }}
                            >
                              {JSON.stringify(variant, null, 2)}
                            </pre>
                          );
                        })}

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
