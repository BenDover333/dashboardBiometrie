function drawGraph() {
    const dataFile = "data/sportData.csv";

    d3.dsv(";", dataFile).then(function (data) {
        data.forEach(function (d) {
            d.HR = d.HR ? +d.HR : 0;
            d["t (s)"] = d3.timeParse("%M:%S")(d["t (s)"]);
            d.VO2 = parseFloat(d.VO2.replace(",", "."));
            d.VCO2 = parseFloat(d.VCO2.replace(",", "."));
            d.VE = parseFloat(d.VE.replace(",", "."));
            d.fase = bepaalFase(d["t (s)"]);
        });

        const gemiddeldePerFase = berekenGemiddeldenPerFase(data);
        createDoubleYAxisChart(gemiddeldePerFase);
    });
}

function createDoubleYAxisChart(data) {
    const width = 800;
    const height = 400;
    const margin = { top: 70, right: 60, bottom: 30, left: 60 };

    const svg = d3.select(".grafieken-container")
        .append("svg")
        .attr("class", "belangrijkste-waarden-per-fase")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "#3c5c79")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "36px")
        .style("fill", "#e97025")
        .style("font-family", "Monoton")
        .style("text-decoration", "underline")
        .text("Belangrijkste_waarden_per_fase");

    const x = d3.scaleBand()
        .domain(data.map(d => d.fase))
        .range([0, width])
        .padding(0.1);

    const yLeft = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.gemiddeldeVO2, d.gemiddeldeVCO2)) * 1.1])
        .range([height, 0]);

    const yRight = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.gemiddeldeHR, d.gemiddeldeVE)) * 1.1])
        .range([height, 0]);

    drawBerg(data, svg, x, yLeft, height);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .attr("color", "white")
        .style("font-size", "14px")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(yLeft))
        .attr("color", "white")
        .style("font-size", "14px")
        .append("text")
        .attr("fill", "white")
        .attr("x", -30)
        .attr("y", -10)
        .attr("dy", "0.71em")
        .attr("text-anchor", "start")
        .attr("font-size", "16px")
        .attr("font-weight", "bolder")
        .text("VO2 / VCO2");

    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .attr("color", "white")
        .style("font-size", "14px")
        .call(d3.axisRight(yRight))
        .append("text")
        .attr("fill", "white")
        .attr("x", 40)
        .attr("y", -10)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("font-size", "16px")
        .attr("font-weight", "bolder")
        .text("HR / VE");

    const line = d3.line()
        .x(d => x(d.fase) + x.bandwidth() / 2);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line.y(d => yLeft(d.gemiddeldeVO2)))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Fase: ${d.fase}<br>VO2: ${d.gemiddeldeVO2}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 2)
        .attr("d", line.y(d => yLeft(d.gemiddeldeVCO2)))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Fase: ${d.fase}<br>VCO2: ${d.gemiddeldeVCO2}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line.y(d => yRight(d.gemiddeldeHR)))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Fase: ${d.fase}<br>HR: ${d.gemiddeldeHR}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("d", line.y(d => yRight(d.gemiddeldeVE)))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Fase: ${d.fase}<br>VE: ${d.gemiddeldeVE}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    const legend = svg.append("g")
        .attr("transform", `translate(${width/5},70)`);

    const labels = [
        { color: "steelblue", text: "VO2" },
        { color: "orange", text: "VCO2" },
        { color: "green", text: "HR" },
        { color: "purple", text: "VE" }
    ];

    labels.forEach((label, i) => {
        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", i * 20)
            .attr("r", 5)
            .style("fill", label.color);

        legend.append("text")
            .attr("x", 10)
            .attr("y", i * 20)
            .attr("dy", "0.35em")
            .text(label.text)
            .style("font-size", "12px")
            .style("fill", "white");
    });
}

function drawBerg(data, svg, x, y, height) {
    const area = d3.area()
        .x(d => x(d.fase) + x.bandwidth() / 2)
        .y0(height)
        .y1(d => y(d.gemiddeldeHR * 17.75));

    const area2 = d3.area()
        .x(d => x(d.fase) + x.bandwidth() / 2)
        .y0(height)
        .y1(d => y(d.gemiddeldeVE * 17.75));

    const area3 = d3.area()
        .x(d => x(d.fase) + x.bandwidth() / 2)
        .y0(height)
        .y1(d => y(d.gemiddeldeVCO2));

    const area4 = d3.area()
        .x(d => x(d.fase) + x.bandwidth() / 2)
        .y0(height)
        .y1(d => y(d.gemiddeldeVO2));

    svg.append("path")
        .datum(data)
        .attr("fill", "#A87F4E")
        .attr("opacity", 0.75)
        .attr("d", area);

    svg.append("path")
        .datum(data)
        .attr("fill", "#4A2C08")
        .attr("opacity", 1)
        .attr("d", area2);

    svg.append("path")
        .datum(data)
        .attr("fill", "#8B6520")
        .attr("opacity", 0.5)
        .attr("d", area3);

    svg.append("path")
        .datum(data)
        .attr("fill", "#5A3A10")
        .attr("opacity", 0.5)
        .attr("d", area4);
}

function bepaalFase(tijd) {
    const parseTime = d3.timeParse("%M:%S");
    const grenzen = [
        { start: parseTime("00:30"), end: parseTime("01:00"), fase: "Fase 1" },
        { start: parseTime("03:30"), end: parseTime("04:00"), fase: "Fase 2" },
        { start: parseTime("06:35"), end: parseTime("07:05"), fase: "Fase 3" },
        { start: parseTime("09:35"), end: parseTime("10:05"), fase: "Fase 4" },
        { start: parseTime("12:35"), end: parseTime("13:05"), fase: "Fase 5" },
        { start: parseTime("15:35"), end: parseTime("16:05"), fase: "Fase 6" },
        { start: parseTime("18:35"), end: parseTime("19:05"), fase: "Fase 7" },
        { start: parseTime("21:35"), end: parseTime("22:05"), fase: "Fase 8" },
        { start: parseTime("24:35"), end: parseTime("25:05"), fase: "Fase 9" }
    ];

    for (let i = 0; i < grenzen.length; i++) {
        if (tijd >= grenzen[i].start && tijd < grenzen[i].end) {
            return grenzen[i].fase;
        }
    }
    return "Onbekende fase";
}

function berekenGemiddeldenPerFase(data) {
    const bekendeFasen = data.filter(d => d.fase !== "Onbekende fase");
    const faseGroepen = d3.group(bekendeFasen, d => d.fase);

    return Array.from(faseGroepen, ([fase, waarden]) => ({
        fase: fase,
        gemiddeldeVE: d3.mean(waarden, d => d.VE),
        gemiddeldeHR: d3.mean(waarden, d => d.HR),
        gemiddeldeVO2: d3.mean(waarden, d => d.VO2),
        gemiddeldeVCO2: d3.mean(waarden, d => d.VCO2)
    }));
    
}

drawGraph();
