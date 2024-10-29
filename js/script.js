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

let datasets = [];
    let currentIndex = 0;
    
    Promise.all([
        d3.dsv(";", "data/Sporter.csv"),
        d3.dsv(";", "data/Sporter2.csv"),
        //d3.dsv(";", "data/Sporter3.csv")
    ]).then(function(results) {
        datasets = results;
        loadData(currentIndex);
    }).catch(function(error) {
        console.error('Error loading CSV files:', error);
    });
    
    function loadData(index) {
        const data = datasets[index];
        const container = d3.select(".sporterGegevens");
        container.html("");
    
        data.forEach(function(row) {
            container.append("p")
                .html(`Voornaam: ${row.Voornaam}
                       <br>Achternaam: ${row.Achternaam}
                       <br>Leeftijd: ${row.Leeftijd}
                       <br>Geslacht: ${row.Geslacht}
                       <br>Lengte (cm): ${row["Lengte (cm)"]}
                       <br>Gewicht (kg): ${row["Gewicht (kg)"]}
                       <br>Testdatum: ${row["Test datum"]}`);
        });
    }
    
    d3.select("body")
        .append("button")
        .attr("id", "vorigeMeting")
        .text("Vorige meting");
    
    d3.select("body")
        .append("button")
        .attr("id", "volgendeMeting")
        .text("Volgende meting");
    
    d3.select("#vorigeMeting").on("click", function() {
        if (currentIndex < datasets.length - 1) {
            currentIndex++; 
            loadData(currentIndex);
        } else {
            alert("Er zijn geen eerdere metingen beschikbaar.");
        }
    });
    
    d3.select("#volgendeMeting").on("click", function() {
        if (currentIndex > 0) {
            currentIndex--; 
            loadData(currentIndex);
        } else {
            alert("Er zijn geen verdere metingen beschikbaar.");
        }
    });

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
        
    // Bepaal de positie van het laatste punt op de lijn
    let lastDataPoint = data[data.length - 1];
    let xPos = x(lastDataPoint["t (s)"]);
    let yPos = y(lastDataPoint.HR);

// Voeg het hart-icoon als `path` toe aan het einde van de lijn
svg.append("path")
    .attr("d", "M474.655,74.503C449.169,45.72,413.943,29.87,375.467,29.87c-30.225,0-58.5,12.299-81.767,35.566 c-15.522,15.523-28.33,35.26-37.699,57.931c-9.371-22.671-22.177-42.407-37.699-57.931c-23.267-23.267-51.542-35.566-81.767-35.566 c-38.477,0-73.702,15.851-99.188,44.634C13.612,101.305,0,137.911,0,174.936c0,44.458,13.452,88.335,39.981,130.418 c21.009,33.324,50.227,65.585,86.845,95.889c62.046,51.348,123.114,78.995,125.683,80.146c2.203,0.988,4.779,0,6.981,0 c2.57-1.151,63.637-28.798,125.683-80.146c36.618-30.304,65.836-62.565,86.845-95.889C498.548,263.271,512,219.394,512,174.936 C512,137.911,498.388,101.305,474.655,74.503z")
    .attr("transform", `translate(${xPos - 20}, ${yPos - 10}) scale(0.05)`) // Plaats en schaal het hart
    .attr("fill", "#FF6647") // Pas de kleur aan indien nodig
    .transition()
    .duration(1000)
    .ease(d3.easeSin)
    .attr("transform", `translate(${xPos - 20}, ${yPos - 10}) scale(0.06)`) // Kloppend effect: inzoomen
    .transition()
    .duration(1000)
    .attr("transform", `translate(${xPos - 20}, ${yPos - 10}) scale(0.05)`) // Terug naar originele schaal
    .on("end", function repeat() { // Herhaal de animatie
        d3.select(this)
            .transition()
            .duration(1000)
            .attr("transform", `translate(${xPos - 20}, ${yPos - 10}) scale(0.06)`)
            .transition()
            .duration(1000)
            .attr("transform", `translate(${xPos - 20}, ${yPos - 10}) scale(0.05)`)
            .on("end", repeat);
    });


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

let heartRate = 80;
let age = 30;
let maleMax = 220 - age;
let femaleMax = 226 - age;
let zone = '';

// Laad beide CSV-bestanden
Promise.all([
    d3.dsv(";", "data/sportData.csv"),
    d3.dsv(";", "data/Sporter.csv")
]).then(function(files) {
    let sportData = files[0];
    let sporterData = files[1];

    // Maak een map van sporter-ID naar sporter-informatie
    let sporterMap = {};
    sporterData.forEach(function(d) {
        sporterMap[d.ID] = {
            leeftijd: +d.Leeftijd,
            geslacht: d.Geslacht.trim()
        };
    });

    let timeInZones = {
        'Warming-up/Cooling-down': 0,
        'Vetverbranding': 0,
        'Aerobe training': 0,
        'Anaerobe training': 0,
        'Maximale inspanning': 0
    };

    sportData.forEach(function(d) {
        const sporterID = d.SporterID;
        const sporter = sporterMap[sporterID];

        if (!sporter) {
            console.error("Sporter niet gevonden voor ID:", sporterID);
            return;
        }

        const leeftijd = sporter.leeftijd;
        const geslacht = sporter.geslacht;
        const hartslag = +d.HR;

        const tijd = d["t (s)"];
        const tijdOnderdelen = tijd.split(':');
        const tijdInSeconden = (+tijdOnderdelen[0] * 60) + (+tijdOnderdelen[1]);
        //console.log("Originele tijd:", tijd, "Omgezet naar seconden:", tijdInSeconden);

        if (isNaN(tijdInSeconden)) {
            console.error("Ongeldige tijdswaarde:", tijd);
            return;
        }

        let maxHartslag;
        if (geslacht === "Man") {
            maxHartslag = 220 - leeftijd;
        } else if (geslacht === "Vrouw") {
            maxHartslag = 226 - leeftijd;
        } else {
            console.error("Ongeldig geslacht:", geslacht);
            return;
        }

        let zone;
        if (hartslag >= maxHartslag * 0.5 && hartslag < maxHartslag * 0.6) {
            zone = 'Warming-up/Cooling-down';
        } else if (hartslag >= (maxHartslag * 0.6) && hartslag < (maxHartslag * 0.7)) {
            zone = 'Vetverbranding';
        } else if (hartslag >= maxHartslag * 0.7 && hartslag < maxHartslag * 0.8) {
            zone = 'Aerobe training';
        } else if (hartslag >= maxHartslag * 0.8 && hartslag < maxHartslag * 0.9) {
            zone = 'Anaerobe training';
        } else if (hartslag >= maxHartslag * 0.9 && hartslag <= maxHartslag) {
            zone = 'Maximale inspanning';
        } else {
            zone = 'Buiten bereik';
        }

        if (zone && timeInZones[zone] !== undefined) {
            timeInZones[zone] += tijdInSeconden;
        }
    });
    let timeInMinutes = {};
    for (let zone in timeInZones) {
        timeInMinutes[zone] = (timeInZones[zone] / 60).toFixed(2);
    }

    console.log("Tijd in zones:", timeInMinutes);
});




// // Laad de CSV-data met D3
// d3.dsv(";", "data/sportData.csv").then(function(data) {
//     // Voorbereiding
//     let timeInZones = {
//         'Warming-up/Cooling-down': 0,
//         'Vetverbranding': 0,
//         'Aerobe training': 0,
//         'Anaerobe training': 0,
//         'Maximale inspanning': 0
//     };

//     data.forEach(function(d) {
//         const leeftijd = +d.Leeftijd; // Verander deze als de leeftijd niet in je dataset staat
//         const geslacht = d.Geslacht;
//         const hartslag = +d.HR;
//         const tijd = +d["t (s)"]; // Neem aan dat de tijd in seconden is


//         // Bereken de maximale hartslag
//         let maxHartslag;
//         if (geslacht === "Man") {
//             maxHartslag = 220 - leeftijd;
//         } else if (geslacht === "Vrouw") {
//             maxHartslag = 226 - leeftijd;
//         }

//         // Bepaal de hartslagzone
//         let zone;
//         if (hartslag >= maxHartslag * 0.5 && hartslag < maxHartslag * 0.6) {
//             zone = 'Warming-up/Cooling-down';
//         } else if (hartslag >= maxHartslag * 0.6 && hartslag < maxHartslag * 0.7) {
//             zone = 'Vetverbranding';
//         } else if (hartslag >= maxHartslag * 0.7 && hartslag < maxHartslag * 0.8) {
//             zone = 'Aerobe training';
//         } else if (hartslag >= maxHartslag * 0.8 && hartslag < maxHartslag * 0.9) {
//             zone = 'Anaerobe training';
//         } else if (hartslag >= maxHartslag * 0.9 && hartslag <= maxHartslag) {
//             zone = 'Maximale inspanning';
//         }

//         // Voeg de tijd toe aan de relevante zone
//         if (zone) {
//             timeInZones[zone] += tijd; // Tel de tijd op
//         }
//     });

//     // Log of gebruik de tijd in zones
//     console.log("Tijd in elke hartslagzone (in seconden):", timeInZones);

//     // Omzetten naar minuten voor beter leesbaarheid (optioneel)
//     for (let key in timeInZones) {
//         timeInZones[key] = (timeInZones[key] / 60).toFixed(2); // Zet om naar minuten
//     }

//     console.log("Tijd in elke hartslagzone (in minuten):", timeInZones);

//     // Hier kun je verder gaan om deze informatie te visualiseren, bijvoorbeeld met D3.js
// });


    

    // let currentData = [];
    // let previousData = [];  
    // let isCurrentData = true; 
    
    // d3.dsv(";", "data/Sporter.csv").then(function(data) {
    //     currentData = data;
    //     loadData(currentData);
    // }).catch(function(error) {
    //     console.error('Error loading the current CSV file:', error);
    // });
    
    // d3.dsv(";", "data/Sporter2.csv").then(function(data) {
    //     previousData = data;
    // }).catch(function(error) {
    //     console.error('Error loading the previous CSV file:', error);
    // });
    
    // function loadData(data) {
    //     const container = d3.select(".sporterGegevens");
    //     container.html("");
    
    //     data.forEach(function(row) {
    //         container.append("p")
    //             .html(`Voornaam: ${row.Voornaam}
    //                    <br>Achternaam: ${row.Achternaam}
    //                    <br>Leeftijd: ${row.Leeftijd}
    //                    <br>Geslacht: ${row.Geslacht}
    //                    <br>Lengte (cm): ${row["Lengte (cm)"]}
    //                    <br>Gewicht (kg): ${row["Gewicht (kg)"]}
    //                    <br>Testdatum: ${row["Test datum"]}`);
    //     });
    // }
    
    
    // d3.select("#vorigeMeting").on("click", function() {
    //     if (isCurrentData) {
    //         if (previousData.length > 0) {
    //             loadData(previousData);
    //             d3.select("#vorigeMeting").text("Huidige meting");
    //         } else {
    //             alert("Geen gegevens voor de vorige meting gevonden.");
    //         }
    //     } else {
    //         loadData(currentData);
    //         d3.select("#vorigeMeting").text("Vorige meting");
    //     }
    //     isCurrentData = !isCurrentData; 
    // });
    
 
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


