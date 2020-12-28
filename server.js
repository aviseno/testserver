const react = require('react')
const express = require('express')
const { Client, Pool } = require("pg")

const app = express()
const bodyParser = require("body-parser")

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.use(bodyParser.urlencoded({extended:true}))

app.use('/', express.static(__dirname))
app.use(bodyParser.json())

var totalPayload = [];
var arrayResult = [];
var dailyEnergy = 0.00;
var weeklyEnergy = 0.00;
var monthlyEnergy = 0.00;
var yearlyEnergy = 0.00;
var latestEnergy = 0.00;
var activePowerChartData = [];
var reactivePowerChartdata = [];
var energyChartData = [];
const today = new Date()
const x = new Date()
const tomorrow = new Date(x.setDate(x.getDate()+1)) 
var startDateString = today.getFullYear().toString()+'-'+(today.getMonth()+1).toString()+'-'+today.getDate().toString()
var endDateString = tomorrow.getFullYear().toString()+'-'+(tomorrow.getMonth()+1).toString()+'-'+(tomorrow.getDate()).toString();
var assetQuery = "PM1";

const dbUser = 'postgres';
const dbHost = '192.168.1.5';
const dbPort = 5432;
const dbName = 'postgres';
const dbPassword = 'pgadmin';

async function dbClient(query_str){
  const db_client = await new Client({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPassword,
    port: dbPort,
    keepAlive: true
  })
  console.log(new Date()+": PostgreSQL Agent Initialized")
    
  await db_client.connect();
  console.log(new Date() +": PostgreSQL Agent Connected!")

  await db_client.query(query_str, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
  console.log(new Date()+ ': Data Query successful');
    for (let row of response.rows){
      let timeStamp =  new Date(row.timestamp)
      currentData = parseFloat(row.current)
      frequencyData = parseFloat(row.frequency)
      powerFactorData = parseFloat(row.pf)
      voltageData = parseFloat(row.voltage)
      tetha = Math.atan(powerFactorData)
      activePower = ((voltageData*currentData*Math.cos(tetha))/1000).toFixed(2)
      reactivePower = ((voltageData*currentData*Math.sin(tetha))/1000).toFixed(2)
      apparentPower = (voltageData*currentData/1000).toFixed(2)
      energy = parseFloat((voltageData*currentData*60/(3600*1000)))
      // totalEnergy = dailyEnergy = 0.00 ? energy : dailyEnergy+energy
      // dailyEnergy = totalEnergy
      latestEnergy = latestEnergy+energy
      activePowerPayload = [timeStamp, parseFloat(activePower)]
      reactivePowerPayload = [timeStamp, parseFloat(reactivePower)]
      energyPayload = [timeStamp, latestEnergy]

      activePowerChartData.push(activePowerPayload)
      reactivePowerChartdata.push(reactivePowerPayload)
      energyChartData.push(energyPayload)

      totalPayload = [timeStamp, voltageData.toFixed(2), currentData.toFixed(2), powerFactorData.toFixed(2), activePower, reactivePower, apparentPower, frequencyData.toFixed(2), (0).toFixed(2), activePowerChartData, reactivePowerChartdata, energyChartData, startDateString, endDateString, dailyEnergy.toFixed(2), weeklyEnergy.toFixed(2), monthlyEnergy.toFixed(2), yearlyEnergy.toFixed(2)]
    }
  })
  await sleep(1500)

  await db_client.end();
  console.log(new Date()+": PostgreSQL Agent Terminated")
  activePowerChartData=[]
  reactivePowerChartdata=[]
  energyChartData=[]
}
async function updateEnergy(){
  const db_client = await new Client({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPassword,
    port: dbPort,
    keepAlive: true
  })
  console.log(new Date()+": PostgreSQL Agent Initialized (update DB)")
    
  await db_client.connect();
  console.log(new Date() +": PostgreSQL Agent Connected! (update DB)")

  const daily = "select sum(te.energy), daily from total_energy te group by daily order by daily desc limit 1";
    const weekly = "select sum(te.energy), weekly from total_energy te group by weekly order by weekly desc limit 1";
    const monthly = "select sum(te.energy), monthly from total_energy te group by monthly order by monthly desc limit 1";
    const yearly = "select sum(te.energy), yearly from total_energy te group by yearly order by yearly desc limit 1";
        
    await db_client.query(daily, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        for (let row of res.rows){
            arrayResult.push(row)
        }
    });
    await sleep(1000)
    await db_client.query(weekly, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        for (let row of res.rows){
            arrayResult.push(row)
        }
    });
    await sleep(1000)
    await db_client.query(monthly, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        for (let row of res.rows){
            arrayResult.push(row)
        }
    });
    await sleep(1000)
    await db_client.query(yearly, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        for (let row of res.rows){
            arrayResult.push(row)
            console.log(arrayResult)
            console.log(arrayResult[0].sum, arrayResult[1].sum, arrayResult[2].sum)
            dailyEnergy = arrayResult[0].sum
            weeklyEnergy = arrayResult[1].sum
            monthlyEnergy = arrayResult[2].sum
            yearlyEnergy = arrayResult[3].sum
        }
    });
    await sleep(1000)

    await db_client.end()
    console.log(new Date()+": PostgreSQL Agent Terminated (update DB)")
    arrayResult = [];
}

// Router/API list
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/active1.html")
})
app.get('/reactivepower1', function(req, res){
  res.sendFile(__dirname + '/reactivepower1.html')
})
app.get('/energy1', function(req, res){
  res.sendFile(__dirname + "/energy1.html")
})
app.get('/underconstruction', function(req, res){
  res.sendFile(__dirname +"/under-construction.html")
})
app.post('/postfilterdata', function(req, res){
  console.log(req.body)
  const queryStr = "\
  SELECT * FROM powermeter \
  WHERE device_id = "+(req.body.asset).substr(2,2)+" \
  AND timestamp BETWEEN ('"+req.body.startDate+"')::timestamp AND ('"+req.body.endDate+"')::timestamp \
  ORDER BY id ASC \
  ";
  
  dbClient(queryStr)
  console.log(totalPayload[0], totalPayload[1], totalPayload[2], totalPayload[3], totalPayload[4])
  res.status(200).send("success")
})
app.post('/postdata', function(req, res){
  console.log(req.body)
  console.log(req.body['trip-start'], req.body['trip-end'])
  startDateString = (req.body['trip-start']).toString()
  endDateString = (req.body['trip-end']).toString()

  let new_query = "\
  SELECT * FROM powermeter \
  WHERE device_id = "+assetQuery.substr(2,2)+" \
  AND timestamp BETWEEN ('"+startDateString+"')::timestamp AND ('"+endDateString+"')::timestamp \
  ORDER BY id ASC \
  ";

  dbClient(new_query)
  res.sendFile(__dirname+'/active1.html')
})
app.post('/postreactive', function(req, res){
  console.log(req.body)
  console.log(req.body['trip-start'], req.body['trip-end'])
  startDateString = (req.body['trip-start']).toString()
  endDateString = (req.body['trip-end']).toString()

  let new_query = "\
  SELECT * FROM powermeter \
  WHERE device_id = "+assetQuery.substr(2,2)+" \
  AND timestamp BETWEEN ('"+startDateString+"')::timestamp AND ('"+endDateString+"')::timestamp \
  ORDER BY timestamp ASC \
  ";

  dbClient(new_query)
  res.sendFile(__dirname+'/reactivepower1.html')
})
app.post('/postenergy', function(req, res){
  console.log(req.body)
  console.log(req.body['trip-start'], req.body['trip-end'])
  startDateString = (req.body['trip-start']).toString()
  endDateString = (req.body['trip-end']).toString()

  let new_query = "\
  SELECT * FROM powermeter \
  WHERE device_id = "+assetQuery.substr(2,2)+" \
  AND timestamp BETWEEN ('"+startDateString+"')::timestamp AND ('"+endDateString+"')::timestamp \
  ORDER BY timestamp ASC \
  ";

  dbClient(new_query)
  res.sendFile(__dirname+'/energy1.html')
})
app.get('/getdbdata', function(req, res){
  const queryStr = "\
  SELECT * FROM powermeter \
  WHERE device_id = "+assetQuery.substr(2,2)+" \
  AND timestamp BETWEEN ('"+startDateString+"')::timestamp AND ('"+endDateString+"')::timestamp \
  ORDER BY timestamp ASC \
  ";
  
  dbClient(queryStr)
  res.send(totalPayload)
  // totalPayload=[]
})
app.post('/updateDataDB', function(req, res){
  updateEnergy()
  res.status(200).send('success')
})

app.post('/selectAsset', function(req, res){
  if(req.body.dropdown=="PM1"){
    link = "/active1.html"
  } else if (req.body.dropdown=="PM2"){
    link = "/under-construction.html"
  } else if(req.body.dropdown=="PM3"){
    link = "/under-construction.html"
  }
  console.log(req.body.dropdown)
  res.sendFile(__dirname + link)
  // res.status(200)
})

app.post('/updateDataFromOPC', function(req, res){
  console.log(new Date() + ": Data Updated")
  // console.log(req.body)
  // let timeStamp =  new Date(req.body.timestamp)
  // x = timeStamp.getTime()
  // xValue = timeStamp.toTimeString().substr(0,8)
  // currentData = parseFloat(req.body.values[0].value)
  // frequencyData = parseFloat(req.body.values[1].value)
  // powerFactorData = parseFloat(req.body.values[2].value)
  // voltageData = parseFloat(req.body.values[3].value)
  // tetha = Math.atan(powerFactorData)
  // activePower = ((voltageData*currentData*Math.cos(tetha))/1000).toFixed(2)
  // reactivePower = ((voltageData*currentData*Math.sin(tetha))/1000).toFixed(2)
  // apparentPower = (voltageData*currentData/1000).toFixed(2)
  // energy = parseFloat((voltageData*currentData*1.5/(3600*1000)))
  // totalEnergy = dailyEnergy = 0.00 ? energy : dailyEnergy+energy
  // dailyEnergy = totalEnergy
  // activePowerPayload = [(new Date()).getTime(), parseFloat(activePower)]
  // reactivePowerPayload = [(new Date()).getTime(), parseFloat(reactivePower)]
  // energyPayload = [(new Date()).getTime(), totalEnergy]

  // arrayPayload = [timeStamp, voltageData.toFixed(2), currentData.toFixed(2), powerFactorData.toFixed(2), activePower, reactivePower, apparentPower, frequencyData.toFixed(2), (totalEnergy).toFixed(2)]
  // console.log(payload)

  // activePowerChartData.push(payload)
  // activePowerChartData.push(activePowerPayload)
  // reactivePowerChartdata.push(reactivePowerPayload)
  // energyChartData.push(energyPayload)
  
  // totalPayload = [timeStamp, voltageData.toFixed(2), currentData.toFixed(2), powerFactorData.toFixed(2), activePower, reactivePower, apparentPower, frequencyData.toFixed(2), (totalEnergy).toFixed(2), activePowerChartData, reactivePowerChartdata, energyChartData]
  // totalPayload = arrayPayload
  // console.log(activePowerChartData)
  // console.log(xValue, currentData, frequencyData, powerFactorData, voltageData, tetha, activePower, reactivePower, apparentPower)
  // chartRender(activePowerChartDataX, activePowerChartDataY)

  res.status(200).send("success")
})

app.get('/coba', function(req, res){
  res.send(totalPayload)
})

app.listen(3000, function(){
    console.log("Mindsphere UI Server is started on port 3000")
    // console.log(__dirname)
})