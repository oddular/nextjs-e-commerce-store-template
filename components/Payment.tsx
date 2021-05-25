import React, {
  useState,
  useEffect,
} from 'react';

import {
  Button,
  Box,
  Text,
  Input,
} from '@chakra-ui/react';

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';

import { isPhone, isEmail } from '../utilities';

const InputWrapper = ({ label, children, focus, ...props }) => {
  return (
    <Box flexDirection="column" mb={2} {...props}>
      <Text fontSize="sm" fontWeight="600">
        {label}
      </Text>
      <Box
        borderColor={focus ? 'blue.400' : '#E2E8F0'}
        background="white"
        borderWidth="1px"
        boxShadow={''}
        borderRadius="md"
        padding="10px"
        height="auto"
        maxHeight="60px"
      >
        {children}
      </Box>
    </Box>
  );
};

interface PaymentComponentProps {
  onUpdate: any;
  onCheckout: any;
  payButtonDisabled: boolean;
  showPickupContact?: boolean;
  payButtonText?: string;
}

export const PaymentComponent: React.FC<PaymentComponentProps> = ({
  onUpdate,
  onCheckout,
  payButtonDisabled = false,
  showPickupContact = true,
  payButtonText = 'Pay Now',
}) => {
  const [stripeFocus, setStripeFocus] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const validate = () => {
    const missing = [];
    const nameIsValid = name.length > 4 || !showPickupContact;
    if (!nameIsValid) {
      missing.push('Full Name');
    }
    const emailIsValid = isEmail(email) || !showPickupContact;
    if (!emailIsValid) {
      missing.push('Valid Email Address');
    }
    const phoneIsValid = isPhone(phone) || !showPickupContact;
    if (!phoneIsValid) {
      missing.push('Valid Phone Number');
    }
    if (missing.length === 1) {
      setErrorMessage(`${missing[0]} is required`);
    } else if (missing.length === 2) {
      setErrorMessage(`${missing[0]} and ${missing[1]} are required`);
    } else if (missing.length === 3) {
      setErrorMessage(
        `${missing[0]}, ${missing[1]}, and ${missing[2]}  are required`,
      );
    }
    const valid = nameIsValid && emailIsValid && phoneIsValid;

    onUpdate('customer', { customer: { name, phone, email } }, valid);

    return valid;
  };

  const attemptCharge = () => {
    setError(null);
    setProcessing(true);

    if (!validate()) {
      setProcessing(false);
      return;
    }

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    stripe
      .createToken(elements.getElement(CardNumberElement))
      .then(({ error, token }) => {
        if (error) {
          setError(error);
          setProcessing(false);
        } else {
          setToken(token);
          setProcessing(false);
          onCheckout(email, phone, name, token);
        }
      })
      .catch((error) => {
        setError(error);
        setProcessing(false);
      });
  };

  useEffect(() => {
    if (error !== null) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('');
    }
  }, [error]);

  const STRIPE_CARD_OPTIONS = {
    style: {
      base: {
        fonts: [
          {
            family: '"Lato"',
            src:
              'local("Lato Regular"), local("Lato-Regular"), url(https://fonts.gstatic.com/s/lato/v13/MDadn8DQ_3oT6kvnUq_2r_esZW2xOQ-xsNqO47m55DA.woff2) format("woff2")',
            weight: 300,
            style: 'normal',
            unicodeRange:
              'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215',
          },
        ],
        background: '#fff',
        backgroundColor: '#fff',
        color: '#111',
        fontWeight: '500',
        fontFamily: 'Lato, Helvetica Neue, Helvetica, Arial, sans-serif',
        fontSize: '1rem',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#d1d5da',
        },
        ':-webkit-autofill': {
          color: '#4b4d58',
        },
      },
      invalid: {
        iconColor: '#ea4a5a',
        color: '#ea4a5a',
      },
    },
  };

  const handleStripeElementChange = (event) => {
    if (event.complete) {
      if (event.elementType === 'cardNumber') {
        const q = document.querySelectorAll('.expiry-wrapper iframe');
        if (!!q.length) {
          // @ts-ignore
          q[0].focus();
        }
      } else if (event.elementType === 'cardExpiry') {
        const q = document.querySelectorAll('.cvc-wrapper iframe');
        if (!!q.length) {
          // @ts-ignore
          q[0].focus();
        }
      }
    }
  };

  const handleSubmit = (event) => {
    // Block native form submission.
    event.preventDefault();
    // !!onSubmit && onSubmit();
  };

  const handleStripeReady = () => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <Box>
      <Box display="flex" flexDirection={{ base: 'column', md: 'row' }}>
        <Box
          flex={3}
          display="flex"
          flexDirection={{ base: 'column' }}
          justifyContent="flex-start"
        >
          <Box mb={10} display={showPickupContact ? 'block' : 'none'}>
            <Text as="h2" fontSize="lg" fontWeight="600" mb={2}>
              Pickup Contact
            </Text>
            <Text fontSize="sm" fontWeight="600">
              Name
              <Text as="sup" color="red.200" fontSize=".75em">
                &#8226;
              </Text>
            </Text>
            <Input
              type="text"
              value={name}
              placeholder="Jane Doe"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Text fontSize="sm" fontWeight="600" mt={4}>
              Email
              <Text as="sup" color="red.200" fontSize=".75em">
                &#8226;
              </Text>
            </Text>
            <Input
              type="text"
              value={email}
              placeholder="name@email.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Text fontSize="sm" fontWeight="600" mt={4}>
              Phone Number
              <Text as="sup" color="red.200" fontSize=".75em">
                &#8226;
              </Text>
            </Text>
            <Input
              type="text"
              value={phone}
              placeholder="1 269 555 0100"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </Box>
          <Box as="form" onSubmit={handleSubmit}>
            <Text as="h2" fontSize="lg" fontWeight="600" mb={2}>
              Payment
            </Text>
            <InputWrapper label="Card Number" focus={stripeFocus === 'number'}>
              <CardNumberElement
                options={STRIPE_CARD_OPTIONS}
                className="card-wrapper"
                onFocus={() => setStripeFocus('number')}
                onBlur={() => setStripeFocus('')}
                onChange={handleStripeElementChange}
                onReady={handleStripeReady}
              />
            </InputWrapper>
            <Box display="flex" flexDirection={{ base: 'column', sm: 'row' }}>
              <InputWrapper
                label="Expiration"
                focus={stripeFocus === 'expiry'}
                minWidth="120px"
                flex={3}
              >
                <CardExpiryElement
                  options={STRIPE_CARD_OPTIONS}
                  className="expiry-wrapper"
                  onFocus={() => setStripeFocus('expiry')}
                  onBlur={() => setStripeFocus('')}
                  onChange={handleStripeElementChange}
                  onReady={handleStripeReady}
                />
              </InputWrapper>
              <InputWrapper
                label="CVC"
                focus={stripeFocus === 'cvc'}
                minWidth="120px"
                flex={2}
              >
                <CardCvcElement
                  options={STRIPE_CARD_OPTIONS}
                  className="cvc-wrapper"
                  onFocus={() => setStripeFocus('cvc')}
                  onBlur={() => setStripeFocus('')}
                  onChange={handleStripeElementChange}
                  onReady={handleStripeReady}
                />
              </InputWrapper>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
              px={2}
              flexDirection="column"
              width="full"
              py={3}
            >
              <Box
                display="flex"
                flexDirection={{ base: 'column', md: 'row' }}
                alignItems="center"
                justifyContent="space-around"
                width="full"
              >
                <Button
                  borderRadius="10rem"
                  variantColor="primary"
                  height="2.25rem"
                  justifyContent="center"
                  alignItems="center"
                  px={20}
                  marginTop={{ base: '2rem', md: '1rem' }}
                  isLoading={processing}
                  onClick={attemptCharge}
                  isDisabled={payButtonDisabled}
                >
                  {payButtonText}
                </Button>
              </Box>
              <Text color="red.400" p={2} fontWeight="500">
                {errorMessage}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentComponent;
