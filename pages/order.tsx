import React from "react";
import {gql, GraphQLClient} from 'graphql-request';
import {Box, Text, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot} from "@chakra-ui/react";
import Spinner from "../components/spinner"
import AddressCard from "../components/AddressCard";

const TOKEN = "__DEMO__ODDULAR_PUBLIC_TOKEN_00000";
const GRAPHQL_URL = "http://localhost:8000/storefront/";

const query = gql` 
  query getOrder($token: String!){ 
    orderByToken(token: $token){ 
      customer{
        email
        firstName
        lastName
        note
      }
      billingAddress{
        firstName
        lastName
        companyName
        streetAddress1
        city
        postalCode
        country{
          code
        }
        countryArea
        phone
      }
      shippingMethodName
      shippingAddress{
        firstName
        lastName
        companyName
        streetAddress1
        city
        cityArea
        postalCode
        country{
          code
        }
        countryArea
        phone
      }
      lines{
        productName
        variantName
        quantity
        unitPrice{
          currency
        }
        totalPrice{
          currency
        }
      }
      paymentStatusDisplay
      total{
        currency
      }
      statusDisplay
    } 
  } 
`

interface OrderProps{

}

const Order: React.FC<OrderProps> = ({}) => {
  const [data, setData] = React.useState(null);

  const client = new GraphQLClient(GRAPHQL_URL, {
    headers: {
      "x-oddular-storefront-token": TOKEN,
    },
    credentials: "include",
    mode: "cors"
  })

  const variables = {
    token: "b05647ca-7e1f-48cb-bf23-695602fb875b"
  }

  const tabulateProperty = (entry: any, index: number) => {

    if(entry[1] === null){
      return ( 
        <Tr key={index}>
          <Td>{entry[0]}</Td>
          <Td>—</Td>
        </Tr>
      )
    }
    if(typeof entry[1] === 'object'){

      return Object.entries(entry[1]).map((entryChild, index) => tabulateProperty([entry[0]+"."+entryChild[0], entryChild[1]], index));
        
    }else if(Array.isArray(entry[1])){
      return (
        <Tr key={index}>
          <Td>{entry[0]}</Td>
          <Td>{JSON.stringify(entry[1])}</Td>
        </Tr>
      );
    }else{
      return (
        <Tr key={index}>
          <Td>{entry[0]}</Td>
          <Td>{entry[1]}</Td>
        </Tr>
      );
    }
  }

  React.useEffect(()=>{
    client.request(query, variables).then((data)=>{
      setData(data.orderByToken);
    });
  },[])
  if(data){
    return (<Box p={2} m={2} borderColor="black" borderWidth="1px" rounded="lg" display="flex" flexDirection="column" alignItems="center" w="400px">
      <Text fontWeight="bold">Order Summary</Text>
      
      <Box p={2} m={2} rounded="lg" borderColor="black" borderWidth="1px" 
        w="300px"
>
        <Text fontWeight="bold">Customer Details</Text>
        <Text>{data.customer.firstName + " " + data.customer.lastName}</Text>
        <Text>{data.customer.email}</Text>
        <Text>Payment {data.customer.note}</Text>
      </Box>
      <AddressCard address={data.billingAddress} label="Billing Address"/>
      <AddressCard address={data.shippingAddress} label="Shipping Address"/>
      <Box p={2} m={2} rounded="lg" borderColor="black" borderWidth="1px" display={data.shippingMethodName && data.shippingMethodName.length > 0 ? "block" : "none"} w="300px">
        Shipping by {data.shippingMethodName} 
      </Box>

      <Box p={2} m={2} rounded="lg" borderColor="black" borderWidth="1px" 
        w="300px"
>
        <Text fontWeight="bold">Payment Details</Text>
        <Text>Payment Status: {data.paymentStatusDisplay}</Text>
        <Text>$50 {data.total.currency}</Text>
        <Text>Payment {data.statusDisplay}</Text>
      </Box>
      <Box p={2} m={2} rounded="lg" borderColor="black" borderWidth="1px" 
        w="300px"
        display="flex"
        flexDirection="column"
        alignItems="center"
>
        <Text fontWeight="bold">Order Details</Text>
        {data.lines.map((line, index)=>{
          return (
            <Box p={2} m={2} rounded="lg" borderColor="black" borderWidth="1px" 
              w="250px"
      >
              <Text fontWeight="bold">{line.productName + (line.variantName && line.variantName.length > 0 ?  " - " + line.variantName : "")}</Text>
              <Text>Quantity: {line.quantity}</Text>
              <Text>${50} {line.unitPrice.currency} per unit</Text>
              <Text>${50 * line.quantity} {line.totalPrice.currency} total</Text>
            </Box>
        ) 
        })} 
      </Box>
      {/* <Table variant="simple"> */}
      {/*   <TableCaption placement="top">Order Summary</TableCaption> */}
      {/*   <Tbody> */}
      {/*     {Object.entries(data).map(tabulateProperty)} */}
      {/*   </Tbody> */}
      {/* </Table> */}
    </Box>);
  }
  return <Spinner/>
}

export default Order;
