// d3.select("body")
//     .append("div")
//     .attr("class", "grafieken");

Promise.all([
    d3.dsv(";", "data/sportData.csv"),
    d3.dsv(";", "data/Sporter.csv")
]).then(function (files) {
    let sportData = files[0];
    let sporterData = files[1];

    let sporterMap = {};
    sporterData.forEach(function (d) {
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

    sportData.forEach(function (d) {
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
            timeInZones[zone] += 5; // omdat er stapjes worden genomen van 5 seconden
        }
    });
    let timeInMinutes = {};
    for (let zone in timeInZones) {
        timeInMinutes[zone] = (timeInZones[zone] / 60).toFixed(2);
    }

    console.log("Tijd in zones:", timeInMinutes);

    const svg = d3.select(".grafieken-container")
        .append("svg")
        .attr("class", "hartslag-zones")
        .attr("width", 800)
        .attr("height", 500)
        .style("background", "lightblue"); // Achtergrond van de lucht

    // Definieer kleuren voor de zones
    const zoneColors = {
        'Warming-up/Cooling-down': "#8BC34A",
        'Vetverbranding': "#F9A825",
        'Aerobe training': "#FFC107",
        'Anaerobe training': "#FF5722",
        'Maximale inspanning': "#D32F2F"
    };

    const zones = Object.keys(timeInMinutes);
    let currentHeight = 450;
    const stepHeight = 70;

    zones.forEach((zone, i) => {
        const height = currentHeight - stepHeight * i;

        svg.append("rect")
            .attr("x", 50 + (i * 40))
            .attr("y", height)
            .attr("width", 700 - (i * 20))
            .attr("height", stepHeight)
            .attr("fill", zoneColors[zone])
            .attr("opacity", 0.8);

        svg.append("text")
            .attr("x", 60 + 40 * i)
            .attr("y", height + stepHeight / 2)
            .text(`${zone}: ${timeInMinutes[zone]} min`)
            .attr("fill", "white")
            .style("font-size", "14px")
            .style("font-weight", "bold");
    });

    let wolken = [];

function createWolk(x, y, size) {
    const wolk = svg.append("g")
        .attr("transform", `translate(${x}, ${y})`);

    let numCircles = Math.floor(Math.random() * 5) + 4;
    for (let i = 0; i < numCircles; i++) {
        let cx = Math.random() * 40;
        let cy = Math.random() * 20;
        let radius = Math.random() * size + size * 0.5;
        wolk.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", radius)
            .attr("fill", "white")
            .attr("opacity", 0.8);
    }

    wolken.push(wolk);
}

function animateWolken() {
    if (wolken.length < 5) {
        createWolk(-100, Math.random() * 100, 20);
    }

    wolken.forEach(function(wolk, index) {
        wolk.transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attr("transform", `translate(${800 + index * 100}, ${Math.random() * 100})`)
            .on("end", function () {
                wolk.attr("transform", `translate(-100, ${Math.random() * 100})`);
                animateWolken();
            });
    });
}

for (let i = 0; i < 5; i++) {
    createWolk(-100, Math.random() * 100, 20);
}
animateWolken();




    const fietser = svg.append("g")
        .attr("transform", `translate(40, ${currentHeight + stepHeight / 2})`);

    fietser.append("circle")
        .attr("r", 10)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "white");

    fietser.append("circle")
        .attr("cx", 50)
        .attr("r", 10)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "white");

    fietser.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 10)
        .attr("y2", -15)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    fietser.append("line")
        .attr("x1", 50)
        .attr("y1", 0)
        .attr("x2", 40)
        .attr("y2", -15)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    fietser.append("line")
        .attr("x1", 10)
        .attr("y1", -15)
        .attr("x2", 40)
        .attr("y2", -15)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    fietser.append("line")
        .attr("x1", 40)
        .attr("y1", -15)
        .attr("x2", 40)
        .attr("y2", -30)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    fietser.append("line")
        .attr("x1", 40)
        .attr("y1", -30)
        .attr("x2", 32)
        .attr("y2", -35)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    fietser.append("line")
        .attr("x1", 40)
        .attr("y1", -30)
        .attr("x2", 32)
        .attr("y2", -26)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    function animateFietser() {
        const startX = 40;
        const startY = currentHeight + stepHeight / 2;
        fietser.attr("transform", `translate(${startX}, ${startY})`);

        zones.forEach((zone, i) => {
            const newX = startX + i * 27;
            const newY = currentHeight - (stepHeight * i) + stepHeight / 2;

            fietser.transition()
                .delay(i * 1000)
                .duration(1000)
                .attr("transform", `translate(${newX}, ${newY})`)
                .on("end", () => {
                    if (i === zones.length - 1) {
                        animateFietser();
                    }
                });
        });
    }

    animateFietser();

    let maxZone = Object.keys(timeInMinutes).reduce((a, b) => timeInMinutes[a] > timeInMinutes[b] ? a : b);
    let minZone = Object.keys(timeInMinutes).reduce((a, b) => timeInMinutes[a] < timeInMinutes[b] ? a : b);

    console.log("Meeste tijd in zone:", maxZone);
    console.log("Minste tijd in zone:", minZone);

    d3.select(".grafieken-container")
        .append("div")
        .attr("class", "hartslag-zones-uitleg")
        .html(`Je hebt de meeste tijd doorgebracht 
            in de <span style="color: ${zoneColors[maxZone]}">${maxZone}</span> 
            zone en de minste tijd in de <span style="color: ${zoneColors[minZone]}">${minZone}</span> zone.`);

    if (maxZone === 'Warming-up/Cooling-down') {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .html(`De warming-up en cooling-down hartslagzone ligt meestal tussen 50-60% van je maximale hartslag. Deze zone wordt vaak bereikt door activiteiten zoals wandelen of licht joggen en voelt als een lichte inspanning.

Als je deze hartslagzone voor een langere periode aanhoudt tijdens het sporten, zijn er enkele belangrijke effecten:

Herstel en Voorbereiding: Het bevordert het herstel na intensievere trainingen en helpt je lichaam voor te bereiden op zwaardere inspanningen.
Minimale Vetverbranding: Hoewel de vetverbranding minimaal is, kan het toch bijdragen aan een lichte calorieverbranding.
Lage Belastingsintensiteit: Het is een veilige manier om actief te blijven zonder je lichaam te veel te belasten, wat vooral nuttig kan zijn voor beginners of tijdens herstelperiodes.`);
    
} else if (maxZone === 'Vetverbranding') {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .html(`De vetverbrandingszone ligt meestal tussen 60-70% van je maximale hartslag. Dit is de intensiteit waarbij je lichaam voornamelijk vet als energiebron gebruikt in plaats van koolhydraten.

Als je deze hartslagzone voor een langere periode aanhoudt tijdens het sporten, zijn er enkele belangrijke effecten:

Vetverbranding: Je lichaam verbrandt een hoger percentage vet in vergelijking met koolhydraten.
Uithoudingsvermogen: Het helpt bij het verbeteren van je algehele uithoudingsvermogen en aerobe capaciteit.
Calorieverbruik: Hoewel je in deze zone relatief minder calorieën verbrandt dan bij hogere intensiteiten, kan het toch bijdragen aan gewichtsverlies door consistentie en duur.`);
    
} else if (maxZone === 'Aerobe training') {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .html(`De aerobe zone ligt meestal tussen 60-80% van je maximale hartslag. Dit is de intensiteit waarbij je lichaam voornamelijk zuurstof gebruikt om energie te produceren.

Als je deze hartslagzone voor een langere periode aanhoudt tijdens het sporten, zijn er enkele belangrijke effecten:

Uithoudingsvermogen: Het helpt bij het verbeteren van je algehele uithoudingsvermogen en aerobe capaciteit.
Vetverbranding: Je lichaam verbrandt zowel vetten als koolhydraten voor energie.
Hart- en longgezondheid: Het versterkt je hart en longen, wat bijdraagt aan een betere cardiovasculaire gezondheid.`);
    } else if (maxZone === 'Anaerobe training') {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .html(`De anaerobe zone ligt meestal tussen 80-90% van je maximale hartslag. Dit is de intensiteit waarbij je lichaam voornamelijk suikers (koolhydraten) verbrandt voor energie, omdat er niet genoeg zuurstof beschikbaar is om vetten te verbranden.

Als je deze hartslagzone voor een langere periode aanhoudt tijdens het sporten, zijn er enkele belangrijke effecten:

Melkzuurproductie: Je lichaam produceert melkzuur, wat kan leiden tot vermoeidheid en een branderig gevoel in de spieren.
Verbetering van snelheid en kracht: Training in deze zone helpt bij het verbeteren van je snelheid en kracht, omdat je lichaam leert omgaan met hogere intensiteiten.
Beperkte duur: Vanwege de hoge intensiteit is het moeilijk om deze zone voor een lange periode vol te houden zonder rustpauzes.`);
    } else if (maxZone === 'Maximale inspanning') {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .html(`De maximale inspanningszone ligt meestal tussen 90-100% van je maximale hartslag. Dit is de intensiteit waarbij je lichaam op zijn maximale capaciteit werkt en voornamelijk suikers (koolhydraten) verbrandt voor energie.

Als je deze hartslagzone voor een langere periode aanhoudt tijdens het sporten, zijn er enkele belangrijke effecten:

Zeer hoge intensiteit: Het is moeilijk om deze zone voor een lange periode vol te houden zonder rustpauzes.
Maximale kracht en snelheid: Training in deze zone helpt bij het verbeteren van je maximale kracht en snelheid.
Hoge belasting: Vanwege de hoge intensiteit kan het leiden tot snelle vermoeidheid en een verhoogd risico op blessures als het niet zorgvuldig wordt uitgevoerd.`);
    } else {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .text("Je hebt veel tijd besteed in een onbekende zone. Dit is niet goed voor je gezondheid.");
    }

    if (minZone === 'Warming-up/Cooling-down') {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .text("Je hebt weinig tijd besteed aan het opwarmen en afkoelen. Dit kan leiden tot blessures en spierpijn.");
    } else if (minZone === 'Vetverbranding') {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .text("Je hebt weinig tijd besteed in de vetverbrandingszone. Dit kan leiden tot gewichtstoename en een slechte conditie.");
    } else if (minZone === 'Aerobe training') {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .text("Je hebt weinig tijd besteed in de aerobe training zone. Dit kan leiden tot een slechte conditie en een slecht uithoudingsvermogen.");
    } else if (minZone === 'Anaerobe training') {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .text("Je hebt weinig tijd besteed in de anaerobe training zone. Dit kan leiden tot een slechte kracht en snelheid.");
    } else if (minZone === 'Maximale inspanning') {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .text("Je hebt weinig tijd besteed in de maximale inspanningszone. Dit kan leiden tot slechte prestaties.");
    } else {
        d3.select(".hartslag-zones-uitleg")
            .append("p")
            .text("Je hebt weinig tijd besteed in een onbekende zone. Dit is niet goed voor je gezondheid.");
    }
});