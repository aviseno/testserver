const axios = require('axios')
const today = new Date().toISOString();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendData(){
  while(true){
    axios.post('http://192.168.1.11:3000/updateDataFromOPC', {
    "timestamp":(new Date()).toISOString(),
    "values":[
      {"dataPointId":"DP-current","qualityCode":"0","value":(10+Math.random()).toString()},
      {"dataPointId":"DP-frequency","qualityCode":"0","value":"50"},
      {"dataPointId":"DP-PF","qualityCode":"0","value":(Math.random()).toString()},
      {"dataPointId":"DP-voltage","qualityCode":"0","value":(220+(10*Math.random())).toString()},
      {"dataPointId":"DP-onlineStatus","qualityCode":"0","value":"true"}
    ]
  })
  console.log(new Date() + ": data sent!")
  await sleep(1500)
  }
}

sendData()