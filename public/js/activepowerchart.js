window.onload = function() {
    const activePowerChartelementID = document.getElementById("activePowerChart")

    var dataPoints = [];
    
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
    updateData();
    
    // Initial Values
    var xValue = 0;
    var yValue = 10;
    var newDataCount = 1;
    
    function addData(data) {
        if(newDataCount != 1) {
            $.each(data, function(key, value) {
                dataPoints.push({x: value[0], y: parseInt(value[1])});
                xValue++;
                yValue = parseInt(value[1]);
            });
        } else {
            //dataPoints.shift();
            dataPoints.push({x: new Date(), y: parseInt(data[1])});
            xValue++;
            yValue = parseInt(data[0][1]);
        }
        
        newDataCount = 1;
        chart.render();
        console.log(dataPoints)
        setTimeout(updateData, 1500);
    }
    
    
    function updateData() {
        $.getJSON("http://192.168.1.6:3000/getActivePowerChartData", addData);
    }
    
    }