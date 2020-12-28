
const host = 'http://192.168.1.11:3000'
const today = new Date()
const x = new Date()
tomorrow = new Date(x.setDate(x.getDate()+1)) 
const startDateString = today.getFullYear().toString()+'-'+(today.getMonth()+1).toString()+'-'+today.getDate().toString()
const endDateString = tomorrow.getFullYear().toString()+'-'+(tomorrow.getMonth()+1).toString()+'-'+(tomorrow.getDate()).toString();
const activePowerChartelementID = document.getElementById("activePowerChart")
const todayActivePowerElementID = document.getElementById("todayEnergy")
const weekToDateElementID = document.getElementById("weekToDateEnergy")
const monthToDateElementID = document.getElementById("monthToDateEnergy")
const yearToDateElementID = document.getElementById("yearToDateEnergy")
const voltageRMSElementID = document.getElementById("voltagerms")
const currentRMSElementID = document.getElementById("currentrms")
const realtimePFElementID = document.getElementById("realtimepf")
const realtimeActivePowerElementID = document.getElementById("realtimeactivepower")
const realtimeReactivePowerElementID = document.getElementById("realtimereactivepower")
const realtimeApparentPowerElementID = document.getElementById("realtimeapparentpower")
const realtimeFrequencyElementID = document.getElementById("realtimefrequency")

var dataPoints = [];
var dataBaru = [];

// if(dataPoints.length==0){
//     $(startdate).val(startDateString)
//     $(enddate).val(endDateString)
// }


$(todayActivePowerElementID).text("0.00")
$(weekToDateElementID).text("10.69")
$(monthToDateElementID).text("36.05")
$(yearToDateElementID).text("457.78")
$(voltageRMSElementID).text("0.00")
$(currentRMSElementID).text("0.00")
$(realtimePFElementID).text("0.00")
$(realtimeActivePowerElementID).text("0.00")
$(realtimeReactivePowerElementID).text("0.00")
$(realtimeApparentPowerElementID).text("0.00")
$(realtimeFrequencyElementID).text("0.00")

var chart = new CanvasJS.Chart(activePowerChartelementID, {
    theme: "light2",
    // title: {
    //     text: "Live Data"
    // },
    axisY: {
        title: "Active Power (kW)"
    },
    axisX: {
        valueFormatString: "HH:mm:ss"
    },
    data: [{
        type: "line",
        dataPoints: dataPoints
    }]
});

// if((document.getElementById("startdate").value)
getData()


function updateData(data){
    // dataPoints = []
    // console.log(data)
    $(todayActivePowerElementID).text((parseFloat(data[14])).toFixed(2))
    $(weekToDateElementID).text((parseFloat(data[15])).toFixed(2))
    $(monthToDateElementID).text((parseFloat(data[16])).toFixed(2))
    $(yearToDateElementID).text((parseFloat(data[17])).toFixed(2))
    $(voltageRMSElementID).text((data[1]))
    $(currentRMSElementID).text((data[2]))
    $(realtimePFElementID).text((data[3]))
    $(realtimeActivePowerElementID).text((data[4]))
    $(realtimeReactivePowerElementID).text((data[5]))
    $(realtimeApparentPowerElementID).text((data[6]))
    $(realtimeFrequencyElementID).text((data[7]))
    // console.log(data[12], data[13])
    if (!document.getElementById("startdate").value){
        $(startdate).val(data[12])
        $(enddate).val(data[13])
    }
    

    if(dataPoints.length==0){
        $.each(data[9], function(key, value){
            dataPoints.push({x: new Date(value[0]), y:parseFloat(value[1])})
            console.log(new Date(value[0]), value[1])
        })
    } else{
        dataPoints.push({x: new Date(data[9][data[9].length-1][0]), y: parseFloat(data[9][data[9].length-1][1])})
    }
    // $.each(data[9], function(key, value){
    //     dataPoints.push({x: new Date(value[0]), y:parseFloat(value[1])})
        // console.log(new Date(value[0]))
        
    // })
    console.log(dataPoints)
    // dataPoints=dataBaru
    
    chart.render();
    setTimeout(getData, 1500);
    // setTimeout(function(){dataPoints=[]}, 1500)
}

function getData(){
    // await $.post(host+'/postfilterdata', {
    //     startDate: document.getElementById("startdate").value,
    //     endDate: document.getElementById("enddate").value,
    //     asset: document.getElementById("assetform").value
    // })

    $.getJSON(host+'/getdbdata', updateData)
    // updateData(dataBaru)
    // console.log(dataBaru)
}

// async function changeDate(){
    
//     await getData()
//     await chart.render()
//     console.log(document.getElementById("startdate").value, document.getElementById("enddate").value, document.getElementById("assetform").value)
// }

// window.onload = async function(){
//     getData()
//     await chart.render()
// }