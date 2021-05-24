import React from "react";
import {
  Box,
  Text,
  Heading,
  Button,
  Image,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useAddToCartMutation } from "@oddular/graphql-client-apollo";
import Link from "next/link";
import { setCartToken, getCartToken } from "../pages/api/tokens";

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [_cartToken, _setCartToken] = React.useState("");

  React.useEffect(() => {
    if (showError === true) {
      setTimeout(() => {
        setShowError(false);
      }, 500);
    }
  }, [showError]);

  React.useEffect(() => {
    _setCartToken(getCartToken());
  }, []);

  const handleAddToCartComplete = (values: any) => {
    const cartToken = values?.cartLinesAdd?.cart?.token;
    setCartToken(cartToken);
    _setCartToken(cartToken);
    console.log(getCartToken());
  };

  const [addToCart, result] = useAddToCartMutation({
    onCompleted: handleAddToCartComplete,
    variables: {
      lines: [],
      cartToken: _cartToken,
    },
  });

  const handleAddToCart = (e) => {
    if (product.variants.length > 0 && selectedVariant === "") {
      setShowError(true);
      return;
    }

    addToCart({
      variables: {
        cartToken: _cartToken,
        lines: [
          {
            productId: product.id,
            variantId: null,
            quantity: 1,
            choice: null,
            customizations: null,
            note: null,
          },
        ],
      },
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderColor="gray.100"
      boxShadow="sm"
      borderRadius="2xl"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      mb={3}
    >
      {!!product.thumbnail && (
        <Link href={"/product/" + product.id}>
          <Box
            h="250px"
            overflow="hidden"
            roundedTop="2xl"
            mb="-1em"
            zIndex={1}
          >
            <Image
              src={product.thumbnail.url}
              alt={product.thumbnail.alt}
              w="100%"
              objectFit="contain"
            />
          </Box>
        </Link>
      )}
      <Box
        p={3}
        rounded="2xl"
        overflow="hidden"
        bg="white"
        zIndex={2}
        display="flex"
        justifyContent="space-between"
        flexDirection="column"
        height="calc(100% - 250px + 1em)"
        borderColor="gray.100"
        borderTopWidth="2px"
      >
        <Link href={"/product/" + product.id}>
          <Heading mb={2}>{product.name}</Heading>
        </Link>
        <Box
          display={product.variants?.length > 0 ? "flex" : "none"}
          flexDirection="column"
        >
          <Text
            fontSize="xs"
            fontWeight={400}
            my={1}
            ml={1}
            color={showError ? "red" : "black"}
          >
            Choose One
          </Text>
          <Wrap>
            {product.variants?.map((variant: any) => {
              return (
                <WrapItem key={variant.id}>
                  <Box
                    onClick={() => setSelectedVariant(variant.id)}
                    borderWidth="2px"
                    borderRadius="xl"
                    bg="gray.50"
                    px={2}
                    py={1}
                    borderColor={
                      selectedVariant === variant.id
                        ? "blue.500"
                        : "transparent"
                    }
                  >
                    {variant.name}
                  </Box>
                </WrapItem>
              );
            })}
          </Wrap>
        </Box>
        <Button
          type="button"
          size="xs"
          onClick={handleAddToCart}
          w="full"
          mt={2}
        >
          Add to cart
        </Button>
      </Box>
    </Box>
  );
};

export default ProductCard;
