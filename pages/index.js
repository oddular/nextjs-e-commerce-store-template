import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import Spinner from "../components/spinner";

import { GraphQLClient } from "graphql-request";

import { Box, SimpleGrid } from "@chakra-ui/react";

import { OddularCommerceClient, gql } from "@oddular/commerce-core";

import DisplayBlocks from "../components/DisplayBlocks";
import ProductCard from "../components/ProductCard";

import { useProductListQuery } from "@oddular/graphql-client-apollo";

const TOKEN = "__DEMO__ODDULAR_PUBLIC_TOKEN_00000";
const GRAPHQL_URL = "http://localhost:8000/storefront/";

export const cartErrorFragment = gql`
  fragment CartError on CartError {
    code
    field
    message
  }
`;

export const paymentGatewayFragment = gql`
  fragment PaymentGateway on PaymentGateway {
    id
    name
    config {
      field
      value
    }
    currencies
  }
`;

export const cartPriceFragment = gql`
  fragment Price on TaxedMoney {
    gross {
      amount
      currency
    }
    net {
      amount
      currency
    }
  }
`;

export const cartAddressFragment = gql`
  fragment Address on Address {
    id
    firstName
    lastName
    companyName
    streetAddress1
    streetAddress2
    city
    postalCode
    country {
      code
      country
    }
    countryArea
    phone
    isDefaultBillingAddress
    isDefaultShippingAddress
  }
`;

export const cartProductVariantFragment = gql`
  ${cartPriceFragment}
  fragment ProductVariant on ProductVariant {
    id
    name
    sku
    quantityAvailable
    pricing {
      onSale
      priceUndiscounted {
        ...Price
      }
      price {
        ...Price
      }
    }
    attributes {
      attribute {
        id
        name
      }
      values {
        id
        name
        value: name
      }
    }
    product {
      id
      name
      slug
      thumbnail {
        url
        alt
      }
      thumbnail2x: thumbnail(size: 510) {
        url
      }
      productType {
        id
        isShippingRequired
      }
    }
  }
`;

export const cartShippingMethodFragment = gql`
  fragment ShippingMethod on ShippingMethod {
    id
    name
    price {
      currency
      amount
    }
  }
`;

export const cartLineFragment = gql`
  ${cartPriceFragment}
  fragment CartLine on CartLine {
    id
    quantity
    totalPrice {
      ...Price
    }
  }
`;

export const cartFragment = gql`
  ${cartLineFragment}
  ${cartAddressFragment}
  ${cartShippingMethodFragment}
  ${paymentGatewayFragment}
  fragment Cart on Cart {
    token
    id

    shippingAddress {
      ...Address
    }
    email
    availableShippingMethods {
      ...ShippingMethod
    }

    lines {
      ...CartLine
    }
    availablePaymentGateways {
      ...PaymentGateway
    }
    totals {
      currency
      subtotal
      shipping
      delivery
      pickup
      fee
      promotion
      weightHold
      tip
      donation
      tax
      pendingTax
      grandTotal
    }
  }
`;

export const createCartMutation = gql`
  ${cartFragment}
  ${cartErrorFragment}
  mutation CreateCart($cartInput: CartCreateInput!) {
    cartCreate(input: $cartInput) {
      created
      cartErrors {
        ...CartError
      }
      cart {
        ...Cart
      }
    }
  }
`;

export default function Home() {
  const [cart, setCart] = useState(1);

  const [cartToken, setCartToken] = useState(null);

  const { data, loading, error } = useProductListQuery({
    variables: { first: 10 },
  });

  useEffect(async () => {
    const OddularClient = new OddularCommerceClient(
      TOKEN,
      {},
      "",
      GRAPHQL_URL,
      false,
      false
    );

    const productFragment = gql`
      fragment ProductFragment on Product {
        id
        name
        description
        descriptionJson
        hasVariants
        thumbnail(size: 500) {
          url
          alt
        }
        listing {
          hasVariants
          price {
            amount
            currency
          }
        }
        variants {
          id
          sku
          name
          images {
            id
            url
            alt
          }
          listing {
            price {
              amount
              currency
            }
          }
          pricing {
            onSale
            priceUndiscounted {
              currency
              gross
              net
            }
          }
        }
      }
    `;

    // OddularClient.getProductList({ first: 100 }, productFragment)
    //   .then(({ status, data, error }) => {
    //     if (status === "error") {
    //       setError(error.response.error);
    //     } else {
    //       setD(data);
    //     }
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }, []);

  const handleAddToCart = (productId, variantId) => {
    const client = new GraphQLClient(GRAPHQL_URL, {
      headers: {
        "x-oddular-storefront-token": TOKEN,
        "x-oddular-cart-token": "1231231",
      },
      credentials: "include",
      mode: "cors",
    });

    const lineItem = {
      quantity: 1,
      note: "a note",
      choice: "a choice",
    };

    const variables = {
      cartInput: {
        localToken: "12j1239jf0942",
        lines: [lineItem],
        email: "",
        phone: "",
        phoneTransactionalSmsAgree: false,
      },
    };

    let mutation = createCartMutation;

    client.request(mutation, variables).then((result) => {
      JSON.stringify(result);
    });

    // const OddularClient = new OddularStorefrontClient(
    //   TOKEN,
    //   {},
    //   '',
    //   GRAPHQL_URL,
    //   true,
    //   true,
    // );

    // OddularClient.addProductToCart({
    //   quantity: 1,
    //   variantId,
    //   note: 'a note',
    //   choice: 'a choice',
    // }).then((data) => {
    //   console.log(data);
    // });

    // setTimeout(() => {
    //   setCart(cart + 1);
    // }, 200);
  };

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
        {cart == 0 ? (
          <h2>Cart</h2>
        ) : (
          <h2>
            Cart: <span style={{ color: "#0070f3" }}>{cart}</span>
          </h2>
        )}
      </section>
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
                        cartToken={cartToken}
                        onCartUpdate={(token) => {
                          setCartToken(token);
                        }}
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
