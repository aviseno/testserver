function pickasset() {
    $.post("http://192.168.1.6:3000/selectAsset", {
            asset: document.getElementById("assetform").value
        })
}