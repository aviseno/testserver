window.onload = function() {
    const reactivePowerChartelementID = document.getElementById("reactivePowerChart")
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

    var currentFloatData = 0.0
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


    var dataPoints = [];
    
    var chart = new CanvasJS.Chart(reactivePowerChartelementID, {
        theme: "light2",
        // title: {
        //     text: "Live Data"
        // },
        axisY: {
            title: "Reactive Power (kVAR)"
        },
        axisX: {
            valueFormatString: "HH:mm:ss"
        },
        data: [{
            type: "line",
            dataPoints: dataPoints
        }]
    });
    getData();
    
    function updateData(data) {

        $(todayActivePowerElementID).text((data[8]))
        $(weekToDateElementID).text((parseFloat(data[8])+10.69).toFixed(2))
        $(monthToDateElementID).text((parseFloat(data[8])+36.05).toFixed(2))
        $(yearToDateElementID).text((parseFloat(data[8])+457.78).toFixed(2))
        $(voltageRMSElementID).text((data[1]))
        $(currentRMSElementID).text((data[2]))
        $(realtimePFElementID).text((data[3]))
        $(realtimeActivePowerElementID).text((data[4]))
        $(realtimeReactivePowerElementID).text((data[5]))
        $(realtimeApparentPowerElementID).text((data[6]))
        $(realtimeFrequencyElementID).text((data[7]))

        // dataPoints.push({x: new Date(), y: parseFloat(data[4])})
        // console.log(data[10])
        if(dataPoints.length==0){
            $.each(data[10], function(key, value){
                dataPoints.push({x: new Date(value[0]), y:parseFloat(value[1])})
                console.log(new Date(value[0]))
            })
        } else{
            dataPoints.push({x: new Date(data[10][data[10].length-1][0]), y: parseFloat(data[10][data[10].length-1][1])})
        }
        
        chart.render();
        setTimeout(getData, 1500);
    }
    
    
    function getData() {
        $.getJSON("http://192.168.1.11:3000/coba", updateData);
    }
    
    }