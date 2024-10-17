d3.select("body")
    .append("div")
    .attr("class", "sporterGegevens")

d3.select(".sporterGegevens")
    .append("p-text")
    .text("test")

d3.dsv(";", "data/Sporter.csv").then(function(data) {
    var container = d3.select(".sporterGegevens")

    data.forEach(function(row) {
        container.append("p")
            .html(`Voornaam: ${row.Voornaam}
                <br>Achternaam: ${row.Achternaam}
                <br>Leeftijd: ${row.Leeftijd}
                <br>Geslacht: ${row.Geslacht}
                <br>Lengte (cm): ${row["Lengte (cm)"]}
                <br>Gewicht (kg): ${row["Gewicht (kg)"]}
                <br>Testdatum: ${row["Test datum"]}`)
    });
});

async function loadSportData() {
    d3.dsv(";", "data/sportData.csv").then(function(data) {
        console.log("Test om te kijken of de data correct laad.");
        data.forEach(function(d) {
            console.log(d.HR);
            console.log(d["t (s)"]);
        });
    });
};

d3.select("body")
    .append("div")
    .attr("class", "hartslagGrafiek")

var margin = { top: 70, right: 30, bottom: 60, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select(".hartslagGrafiek")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color", "#3c5c79")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.dsv(";", "data/sportData.csv").then(function(data) {
        data.forEach(function(d) {
            d.HR = d.HR ? +d.HR : 0;
            d["t (s)"] = d3.timeParse("%M:%S")(d["t (s)"]);
        });
    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d["t (s)"]; }))
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.HR; })])
        .range([height, 0]);

    // X-as
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("color", "white")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%M:%S")))
        .selectAll("text")
        .style("font-size", "16px")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .style("fill", "white");

    // Y-as
    svg.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", "16px")
        .style("color", "white");

    // Definieer de lijn
    var line = d3.line()
        .x(function(d) { return x(d["t (s)"]); })
        .y(function(d) { return y(d.HR); });

    // Voeg de lijn toe aan de grafiek
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 3);

    // Titel voor de grafiek
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "36px")
        .style("fill", "white")
        .style("font-family", "Monoton")
        .style("text-decoration", "underline") 
        .text("Hartslag tijdens de test");

}).catch(function(error) {
    console.error('Error loading the CSV file:', error);
});



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

// d3.csv("data/sportData.csv", function(data) {   
//     d3.select(".sporterGegevens")
//         .selectAll("p")
//         .data(data)
//         .enter()
//         .append("p")
//         .text(function(d) {
//             return d.voornaam
//         })
// });


// d3.csv("data/sportData.csv", function(data) {
//     for (let i = 0; i < data.length; i++) {
//         const sporter = data[i];
        
//         let voornaam = sporter.Voornaam;
//         let achternaam = sporter.Achternaam;
//         let leeftijd = sporter.Leeftijd;

//         console.log(achternaam);
//     }
// });

// d3.csv("data/sportData.csv", function(data) {
//     console.log(data);
// });

// d3.dsv(";", "data/sportData.csv", function(data) {
//     console.log(data);
// });


