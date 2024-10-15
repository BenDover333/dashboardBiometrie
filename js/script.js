d3.select("body")
    .append("div")
    .attr("class", "sporterGegevens")

d3.select(".sporterGegevens")
    .append("p-text")
    .text("test")

// const data = d3.csv("data/sportData.csv")
//     .row(function(d) {
//         return {
//             voornaam: d.Voornaam,
//             achternaam: d.Achternaam,
//             leeftijd: d.Leeftijd
//         };
//     })
//     .get(function(rows) {
//         console.log(rows);
//     });

// d3.csv("data/sportData.csv", function(d) {
//     return {
//         voornaam: d.Voornaam,
//         achternaam: d.Achternaam,
//         leeftijd: +d.Leeftijd
//     };
// }, function(data) {
//     console.log(data);
// });

d3.csv("data/sportData.csv", function(data) {   
    d3.select(".sporterGegevens")
        .selectAll("p")
        .data(data)
        .enter()
        .append("p")
        .text(function(d) {
            return d.voornaam
        })
});


d3.csv("data/sportData.csv", function(data) {
    for (let i = 0; i < data.length; i++) {
        const sporter = data[i];
        
        let voornaam = sporter.Voornaam;
        let achternaam = sporter.Achternaam;
        let leeftijd = sporter.Leeftijd;

        console.log(achternaam);
    }
});

d3.csv("data/sportData.csv", function(data) {
    console.log(data[0].Achternaam);
});


