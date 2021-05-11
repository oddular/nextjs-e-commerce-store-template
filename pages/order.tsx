import React from "react";
import {gql, GraphQLClient} from 'graphql-request';
import {Box, Text, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot} from "@chakra-ui/react";
import Spinner from "../components/spinner"

const TOKEN = "__DEMO__ODDULAR_PUBLIC_TOKEN_00000";
const GRAPHQL_URL = "http://localhost:8000/storefront/";

const query = gql` 
  query getOrder($token: String!){ 
    orderByToken(token: $token){ 
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
      customerNote
      paymentStatusDisplay
      total{
        currency
      }
      statusDisplay
      userEmail
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
    return (<Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Text>{data.billingAddress.firstName + " " + data.billingAddress.lastName}</Text> 
        <Text>{data.billingAddress.companyName}</Text> 
        <Text>{data.billingAddress.streetAddress1}</Text> 
        <Text>{data.billingAddress.city + ", " + (data.billingAddress.countryArea ? data.billingAddress.countryArea + ", " : "") + data.billingAddress.country.code + " " + data.billingAddress.postalCode }</Text> 
        <Text>{data.billingAddress.phone}</Text> 
      </Box>
      <Table variant="simple">
        <TableCaption placement="top">Order Summary</TableCaption>
        <Tbody>
          {Object.entries(data).map(tabulateProperty)}
        </Tbody>
      </Table>
    </Box>);
  }
  return <Spinner/>
}

export default Order;
