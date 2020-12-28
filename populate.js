const { Client } = require('pg');
const axios = require('axios')
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main(){
    const client = await new Client({
        user: 'postgres',
        host: '192.168.1.5',
        database: 'postgres',
        password: 'pgadmin',
        port: 5432,
        keepAlive: true
    });
    console.log(new Date()+": PostgreSQL Agent Initialized")
    
    await client.connect();
    console.log(new Date() +": PostgreSQL Agent Connected!")

    while(true){
        const query1 = "\
            INSERT INTO public.powermeter (timestamp, device_id, current, frequency, pf, voltage) \
            VALUES (CURRENT_TIMESTAMP, 1, "+parseFloat((10+Math.random()).toFixed(2))+", 50, "+parseFloat((Math.random()).toFixed(2))+", "+parseFloat((220+(10*Math.random())).toFixed(2))+") \
            ";
            
        await client.query(query1, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(new Date()+ ': Data insert successful');
    
        });
        await sleep(1500)
    
        const query2 = "\
            INSERT INTO public.powermeter (timestamp, device_id, current, frequency, pf, voltage) \
            VALUES (CURRENT_TIMESTAMP, 2, "+parseFloat((10+Math.random()).toFixed(2))+", 50, "+parseFloat((Math.random()).toFixed(2))+", "+parseFloat((220+(10*Math.random())).toFixed(2))+") \
            ";
            
        await client.query(query2, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(new Date()+ ': Data insert successful');
    
        });
        await sleep(1500)
    
        const query3 = "\
            INSERT INTO public.powermeter (timestamp, device_id, current, frequency, pf, voltage) \
            VALUES (CURRENT_TIMESTAMP, 3, "+parseFloat((10+Math.random()).toFixed(2))+", 50, "+parseFloat((Math.random()).toFixed(2))+", "+parseFloat((220+(10*Math.random())).toFixed(2))+") \
            ";
            
        await client.query(query3, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(new Date()+ ': Data insert successful');
    
        });
        await sleep(1000)

        axios.post('http://192.168.1.11:3000/updateDataDB', {
            'status':'success'
        })
        console.log(new Date()+ ': Data update successful')

        await sleep(60000)
        
        // await client.end();
        // console.log(new Date()+": PostgreSQL Agent Terminated")
    }
}

try{
    main()
} catch(err){
    console.log(err)
}






