const { Client, Pool } = require("pg")
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
var arrayResult = [];
var activePowerChartData = [];
var reactivePowerChartdata = [];
var energyChartData = [];
var totalPayload = [];
let latestEnergy = 0.00;

async function main(){
    const client = await new Client({
        user: 'postgres',
        host: '192.168.1.5',
        database: 'postgres',
        password: 'pgadmin',
        port: 5432,
        keepAlive: true
    });
    console.log("client created")

    await client.connect()
    console.log("client connected")

    const daily = "select sum(te.energy), daily from total_energy te group by daily order by daily desc limit 1";
    const weekly = "select sum(te.energy), weekly from total_energy te group by weekly order by weekly desc limit 1";
    const monthly = "select sum(te.energy), monthly from total_energy te group by monthly order by monthly desc limit 1";
    const yearly = "select sum(te.energy), yearly from total_energy te group by yearly order by yearly desc limit 1";
        
    await client.query(daily, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        // console.log(new Date()+ ': Data insert successful');
        for (let row of res.rows){
            // let timeStamp =  new Date(row.timestamp)
            // currentData = parseFloat(row.current)
            // frequencyData = parseFloat(row.current)
            // powerFactorData = parseFloat(row.current)
            // voltageData = parseFloat(row.current)
            // tetha = Math.atan(powerFactorData)
            // activePower = ((voltageData*currentData*Math.cos(tetha))/1000).toFixed(2)
            // reactivePower = ((voltageData*currentData*Math.sin(tetha))/1000).toFixed(2)
            // apparentPower = (voltageData*currentData/1000).toFixed(2)
            // energy = parseFloat((voltageData*currentData*1.5/(3600*1000)))
            // totalEnergy = latestEnergy = 0.00 ? energy : latestEnergy+energy
            // latestEnergy = totalEnergy
            // activePowerPayload = [timeStamp, parseFloat(activePower)]
            // reactivePowerPayload = [timeStamp, parseFloat(reactivePower)]
            // energyPayload = [timeStamp, totalEnergy]

            // activePowerChartData.push(activePowerPayload)
            // reactivePowerChartdata.push(reactivePowerPayload)
            // energyChartData.push(energyPayload)

            // totalPayload = [timeStamp, voltageData.toFixed(2), currentData.toFixed(2), powerFactorData.toFixed(2), activePower, reactivePower, apparentPower, frequencyData.toFixed(2), (totalEnergy).toFixed(2), activePowerChartData, reactivePowerChartdata, energyChartData]
            arrayResult.push(row)
            // console.log(row.current ,typeof(row.current))
        }

    });
    await sleep(1000)
    await client.query(weekly, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        // console.log(new Date()+ ': Data insert successful');
        for (let row of res.rows){
            arrayResult.push(row)
            // console.log(row.current ,typeof(row.current))
        }
    });
    await sleep(1000)
    await client.query(monthly, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        // console.log(new Date()+ ': Data insert successful');
        for (let row of res.rows){
            arrayResult.push(row)
            // console.log(row.current ,typeof(row.current))
        }
    });
    await sleep(1000)
    await client.query(yearly, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        // console.log(new Date()+ ': Data insert successful');
        for (let row of res.rows){
            arrayResult.push(row)
            // console.log(row.current ,typeof(row.current))
            console.log(arrayResult)
        }
    });
    await sleep(1000)

    await client.end()
    console.log("client disconnected")
    // console.log(totalPayload)
}

try{
    main()
} catch(err){
    console.log(err)
}