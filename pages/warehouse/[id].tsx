import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Spinner from "../../components/spinner";
import { NextPage } from "@lib/types";
import { Box, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useWarehouseQuery } from "@oddular/graphql-client-apollo";
import WarehouseCard from "../../components/WarehouseCard"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = {};
  return { props: { data } };
};

interface WarehousePageProps {}

const WarehousePage: NextPage<WarehousePageProps> = ({}) => {
  const router = useRouter();
  const { id } = router.query;

  let safe_id: string;
  if (typeof id === "string") {
    safe_id = id;
  } else if (typeof id[0] === "string") {
    safe_id = id[0];
  }
  const { data, loading, error } = useWarehouseQuery({
    variables: { id: safe_id },
  });

  if (!!!loading && data && data.warehouse) {
    return <WarehouseCard warehouse={data?.warehouse} />;
  } else {
    return <Spinner />;
  }
};

WarehousePage.layout = null;
export default WarehousePage;
