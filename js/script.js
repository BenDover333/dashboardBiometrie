d3.select("body")
    .append("div")
    .attr("id", "tooltip")

    d3.select("#tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .style("opacity", 0)
    .style("pointer-events", "none")
    .style("font-size", "16px")
    .style("font-family", "Arial")
    .style("border-radius", "5px")
    .style("transition", "opacity 0.3s")
    .style("z-index", 1000);

d3.select("body")
    .append("div")
    .attr("class", "background")

d3.select(".background")
    .append("img")
    .attr("src", "svg/22379948_6558737.svg")
    .style("position", "fixed")
    .style("opacity", 0.1)

d3.select("body")
    .append("div")
    .attr("class", "header-bar")
    .style("position", "sticky")
    .style("top", "0")
    .style("width", "100%")
    .style("height", "100px")
    .style("background-color", "#2e4b64")
    .style("z-index", "10");


d3.select(".header-bar")
    .append("div")
    .attr("class", "sporter-container")
    .style("display", "flex") 
    .style("justify-content", "space-between") 
    .style("align-items", "center"); 

d3.select(".sporter-container")
    .append("div")
    .attr("class", "sporterGegevens")
    .style("font-family", "Arial")
    .style("color", "#e97025")
    .style("font-size", "20px")
    .style("flex", "1");

d3.select(".sporter-container")
    .append("div")
    .attr("class", "sporterGegevens2")
    .style("font-family", "Arial")
    .style("color", "#e97025")
    .style("font-size", "20px")
    .style("flex", "1")
    .style("margin-left", "20px"); 

d3.select(".header-bar")
    .append("div")
    .attr("class", "titel-container")
    .style("text-align", "center")
    .style("margin-top", "10px")
    .style("margin-right", "120px")
    .style("color", "#e97025")
    .style("font-size", "50px")
    .style("font-weight", "bold")
    .style("font-family", "Arial")
    .text("Weg naar de top");

d3.select(".header-bar")
    .append("div")
    .attr("class", "logo-container")
    .style("align-items", "center");

d3.select(".logo-container")
    .append("img")
    .attr("src", "img/Logo-Mens-en-Techniek-Biometrie-2.png")
    .style("width", "200px")
    .style("height", "auto")
    .style("margin-right", "100px");


d3.select("body")
    .append("div")
    .attr("class", "graphs")

d3.select(".graphs")
    .append("div")
    .attr("class", "grafieken-container")

    let datasets = [];
    let currentIndex = 0;
    
    Promise.all([
        d3.dsv(";", "data/Sporter.csv"),
        d3.dsv(";", "data/Sporter2.csv")
    ]).then(function (results) {
        datasets = results;
        loadData(currentIndex);
    }).catch(function (error) {
        console.error('Error loading CSV files:', error);
    });
    
    function loadData(index) {
        const data = datasets[index];
        if (!data) {
            console.error("Geen data beschikbaar voor index:", index);
            return;
        }
    
        var container = d3.select(".sporterGegevens");
        var container2 = d3.select(".sporterGegevens2");
    
        container.html('');
        container2.html('');
    
        data.forEach(function (row) {
            container.append("p")
                .html(`Voornaam: ${row.Voornaam}
                    <br>Achternaam: ${row.Achternaam}
                    <br>Leeftijd: ${row.Leeftijd}
                    <br>Geslacht: ${row.Geslacht}`);
        });
        data.forEach(function (d) {
            container2.append("p")
                .html(` 
                    <br>Lengte (cm): ${d["Lengte (cm)"]}
                    <br>Gewicht (kg): ${d["Gewicht (kg)"]}
                    <br>Testdatum: ${d["Test datum"]}`);
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
    
    console.log("Knoppen toegevoegd");
    
    d3.select("#vorigeMeting").on("click", function () {
        console.log("Vorige meting geklikt");
        if (currentIndex > 0) {
            currentIndex--;
            loadData(currentIndex);
        } else {
            alert("Er zijn geen eerdere metingen beschikbaar.");
        }
    });
    
    d3.select("#volgendeMeting").on("click", function () {
        console.log("Volgende meting geklikt");
        if (currentIndex < datasets.length - 1) {
            currentIndex++;
            loadData(currentIndex); 
        } else {
            alert("Er zijn geen latere metingen beschikbaar.");
        }
    });
    

var margin = { top: 70, right: 30, bottom: 60, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var hartslagGrafiek = d3.select(".grafieken-container")
    .append("svg")
    .attr("class", "hartslagGrafiek")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color", "#3c5c79")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function getDataFile() {
    if (currentIndex === 0) {
        return "data/sportData.csv";
    } else if (currentIndex === -1) {
        return "data/dummydata4.csv";
    } else {
        console.warn("Onngeldige index voor datset:", currentIndex);
        return null;
    }
}

function loadHeartRateData() {

    const dataFile = getDataFile();
    d3.dsv(";", dataFile).then(function (data) {
        data.forEach(function (d) {
            d.HR = d.HR ? +d.HR : 0;
            d["t (s)"] = d3.timeParse("%M:%S")(d["t (s)"]);
        });
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d["t (s)"]; }))
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return d.HR; })])
            .range([height, 0]);

        hartslagGrafiek.append("g")
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

        hartslagGrafiek.append("g")
            .call(d3.axisLeft(y))
            .style("font-size", "16px")
            .style("color", "white");

        const tooltip = d3.select("#tooltip");

        var line = d3.line()
            .x(function (d) { return x(d["t (s)"]); })
            .y(function (d) { return y(d.HR); });

        hartslagGrafiek.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .on("mouseover", function (event, d) {
                tooltip.style("opacity", 1);
            })
            .on("mousemove", function (event, d) {
                const [xPos2, yPos2] = d3.pointer(event);

                const closestDataPoint = data.reduce((prev, curr) =>
                    Math.abs(x(curr["t (s)"]) - xPos2) < Math.abs(x(prev["t (s)"]) - xPos2) ? curr : prev
                );

                tooltip.html(`Hartslag: ${closestDataPoint.HR} bpm <br>Tijd: ${d3.timeFormat("%M:%S")(closestDataPoint["t (s)"])}`)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function (event, d) {
                tooltip.style("opacity", 0);
            });

        let lastDataPoint = data[data.length - 1];
        let xPos = x(lastDataPoint["t (s)"]);
        let yPos = y(lastDataPoint.HR);

        hartslagGrafiek.append("path")
            .attr("d", "M474.655,74.503C449.169,45.72,413.943,29.87,375.467,29.87c-30.225,0-58.5,12.299-81.767,35.566 c-15.522,15.523-28.33,35.26-37.699,57.931c-9.371-22.671-22.177-42.407-37.699-57.931c-23.267-23.267-51.542-35.566-81.767-35.566 c-38.477,0-73.702,15.851-99.188,44.634C13.612,101.305,0,137.911,0,174.936c0,44.458,13.452,88.335,39.981,130.418 c21.009,33.324,50.227,65.585,86.845,95.889c62.046,51.348,123.114,78.995,125.683,80.146c2.203,0.988,4.779,0,6.981,0 c2.57-1.151,63.637-28.798,125.683-80.146c36.618-30.304,65.836-62.565,86.845-95.889C498.548,263.271,512,219.394,512,174.936 C512,137.911,498.388,101.305,474.655,74.503z")
            .attr("transform", `translate(${xPos - 20}, ${yPos - 10}) scale(0.05)`)
            .attr("fill", "#FF6647")
            .transition()
            .duration(1000)
            .ease(d3.easeSin)
            .attr("transform", `translate(${xPos - 20}, ${yPos - 10}) scale(0.06)`)
            .transition()
            .duration(1000)
            .attr("transform", `translate(${xPos - 20}, ${yPos - 10}) scale(0.05)`)
            .on("end", function repeat() {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("transform", `translate(${xPos - 20}, ${yPos - 10}) scale(0.06)`)
                    .transition()
                    .duration(1000)
                    .attr("transform", `translate(${xPos - 20}, ${yPos - 10}) scale(0.05)`)
                    .on("end", repeat);
            });

        hartslagGrafiek.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "36px")
            .style("fill", "#e97025")
            .style("font-family", "Monoton")
            .style("text-decoration", "underline")
            .text("_Hartslag_tijdens_ de_ test_");



    }).catch(function (error) {
        console.error('Error loading the CSV file:', error);
    })
};

loadHeartRateData();


let heartRate = 80;
let age = 30;
let maleMax = 220 - age;
let femaleMax = 226 - age;
let zone = '';

hartslagGrafiek.append("polygon") // berg 
    .attr("points", "400,000 000,800 800,800")
    .attr("fill", "#8B4513")

hartslagGrafiek.append("polygon") // sneeuw 1
    .attr("points", "400,0 200,400 350,300 400,400") // top, links, midden, rechts
    .attr("fill", "#ffffff")

hartslagGrafiek.append("polygon") // sneeuw 2
    .attr("points", "400,0 600,400 450,300 400,400") // top, links, midden, rechts
    .attr("fill", "#ffffff")

    

