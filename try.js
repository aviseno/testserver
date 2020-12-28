const { json } = require("body-parser")
// const $ = require(jQuery)
jQuery = require()

// console.log(new Date().toISOString())
const a = [
    {
        "timestamp":"2020-12-11T01:28:45.794Z",
        "values":[
            {"dataPointId":"DP-current","qualityCode":"0","value":"10.52"},
            {"dataPointId":"DP-frequency","qualityCode":"0","value":"50"},
            {"dataPointId":"DP-PF","qualityCode":"0","value":"0.67"},
            {"dataPointId":"DP-voltage","qualityCode":"0","value":"220.09"},
            {"dataPointId":"DP-onlineStatus","qualityCode":"0","value":"true"}
        ]
    },
    {
        "timestamp":"2020-12-11T01:27:45.794Z",
        "values":[
            {"dataPointId":"DP-current","qualityCode":"0","value":"10.25"},
            {"dataPointId":"DP-frequency","qualityCode":"0","value":"50"},
            {"dataPointId":"DP-PF","qualityCode":"0","value":"0.7"},
            {"dataPointId":"DP-voltage","qualityCode":"0","value":"220.56"},
            {"dataPointId":"DP-onlineStatus","qualityCode":"0","value":"true"}
        ]
    },
    {
        "timestamp":"2020-12-11T01:26:45.794Z",
        "values":[
            {"dataPointId":"DP-current","qualityCode":"0","value":"11.1"},
            {"dataPointId":"DP-frequency","qualityCode":"0","value":"50"},
            {"dataPointId":"DP-PF","qualityCode":"0","value":"0.56"},
            {"dataPointId":"DP-voltage","qualityCode":"0","value":"221.3"},
            {"dataPointId":"DP-onlineStatus","qualityCode":"0","value":"true"}
        ]
    }
]

console.log(jQuery.getJSON("http://192.168.1.6:3000/getlivedata"))
// console.log(JSON.stringify(a))