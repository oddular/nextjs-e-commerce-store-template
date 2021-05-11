const SHIPPO_API_TOKEN = "shippo_test_3c941303c28b031362a909243d35ba9dc99f7f6b";
var shippo = require("shippo")(SHIPPO_API_TOKEN);

export default (req, res) => {
  console.log(req);
};
