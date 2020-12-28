window.onload = function() {
    const todayActivePowerElementID = document.getElementById("todayActivePower")
    const currentFloatData = 0.0
    $(todayActivePowerElementID).text("0.00")

    updateData();

    function updateText(data){
        let floatData
        floatData =  currentFloatData + parseFloat(data)
        console.log(data, typeof(data), typeof(floatData))
        
        $(todayActivePowerElementID).text(floatData.toString())

        setTimeout(updateData, 1500)
    }

    function updateData() {
        $.get("http://192.168.1.6:3000/getTodayActiveData", updateText);
    }
}