d3.select("body")
    .append("div")
    .attr("class", "sporterGegevens")

d3.select(".sporterGegevens")
    .append("p-text")
    .text("test")

d3.csv("data/sportData.csv", function(data) {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        console.log(element);
    }
});


