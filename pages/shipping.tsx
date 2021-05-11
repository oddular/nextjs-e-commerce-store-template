import React from 'react';
import useSWR from 'swr';
import Spinner from "../components/spinner";
import {Stack, Button} from "@chakra-ui/react";
import ShippingCard from "../components/ShippingCard";
const SHIPPO_API_TOKEN = "shippo_test_3c941303c28b031362a909243d35ba9dc99f7f6b";
var shippo = require("shippo")(SHIPPO_API_TOKEN);

export const shippingPage = () => {
  const [selectedRate, selectRate] = React.useState();
  const { data, error, isValidating } = useSWR('/api/hello')

  if(isValidating){
    return <Spinner/>
  }

  const compareRates = (a, b) => {
    return a.amount_local - b.amount_local;
  }

  const purchaseRate = (rate) => {
    //TODO move this away from the client
    shippo.transaction.create({
      "rate": rate.object_id,
      "label_file_type": "PDF",
      "async": false
    }, function (err, transaction){
      if(err){
        alert(JSON.stringify(err));
      }else{
        alert(JSON.stringify(transaction));
      }
    })
  }

  data.sort(compareRates);

  return (!!data.type && data.type === "ShippoAPIError") ? (<pre>{JSON.stringify(data, null, 2)}</pre>) : data.length === 0 ? (<>no available rates</>):
    (<>
      <Stack m={2}>
      {data.map((rate, index)=>{
        return (
            <ShippingCard key={index} rate={rate} selected={rate === selectedRate} handleSelect={()=>{selectRate(rate)}}/>
        )
      })} 
    </Stack>
      <Button m={2} type="button" size="md" w="full" disabled={!!!selectedRate} onClick={()=>{purchaseRate(selectedRate)}}>Select</Button>
    </>);
  
}

export default shippingPage;
