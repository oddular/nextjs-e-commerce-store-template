import React from 'react';
import useSWR from 'swr';
import Spinner from "../components/spinner";
import {Stack} from "@chakra-ui/react";
import ShippingCard from "../components/ShippingCard";
export const shippingPage = () => {
  const [selectedRate, selectRate] = React.useState();
  const { data, error, isValidating } = useSWR('/api/hello')

  if(isValidating){
    return <Spinner/>
  }

  const compareRates = (a, b) => {
    return a.amount_local - b.amount_local;
  }

  data.rates.sort(compareRates);

  return data.type === "ShippoAPIError" ? (<pre>{JSON.stringify(data, null, 2)}</pre>) : 
    (<Stack m={2}>
      {data.rates.map((rate, index)=>{
        return (
            <ShippingCard key={index} rate={rate} selected={rate === selectedRate} handleSelect={()=>{selectRate(rate)}}/>
        )
      })} 
    </Stack>);
  
}

export default shippingPage;
