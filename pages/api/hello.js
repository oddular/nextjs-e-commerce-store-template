// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default (req, res) => {
//   res.status(200).json({ name: "John Doe" });
// };

const SHIPPO_API_TOKEN = "shippo_test_3c941303c28b031362a909243d35ba9dc99f7f6b";
var shippo = require("shippo")(SHIPPO_API_TOKEN);
var addressFrom = {
  name: "Shawn Ippotle",
  street1: "215 Clayton St.",
  city: "San Francisco",
  state: "CA",
  zip: "94117",
  country: "US",
};

var addressTo = {
  name: "Mr Hippo",
  street1: "Broadway 1",
  city: "New York",
  state: "NY",
  zip: "10007",
  country: "US",
};

var parcel = {
  length: "5",
  width: "5",
  height: "5",
  distance_unit: "in",
  weight: "2",
  mass_unit: "lb",
};

export default (req, res) => {
  shippo.shipment.create(
    {
      address_from: addressFrom,
      address_to: addressTo,
      parcels: [parcel],
      async: false,
    },
    (err, shipment) => {
      if (err) {
        res.status(err.statusCode).json(err); //change this error code
      } else {
        res.status(200).json(shipment);
      }
    }
  );
};
