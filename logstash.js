// To send messages to logstash->elasticsearch->kibana
const Client = require("logstash-client");
var client = new Client({
  type: "tcp",
  host: "localhost",
  port: 5000,
});

module.exports = (data) => {
  client.send((data), (err) => {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("log sent to logstash !");
    }
  });
  return;
};
