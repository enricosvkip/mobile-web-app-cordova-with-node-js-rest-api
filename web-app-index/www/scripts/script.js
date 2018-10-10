$.ajax({
    type: "GET",
    dataType: "jsonp",
    url: "http://localhost:1337/data",
    success: function (data) {
        alert(data);
    }
});