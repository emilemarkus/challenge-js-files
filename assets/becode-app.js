/* 
// WRITE YOUR JAVASCRIPT BELOW THIS COMMENT 
Your name :     Markus Emile
Date :  12/11/201
Contact information : 
What does this script do ? 
...

we need to catch something like this
tabData[0]= {years:2004, position:2155}
]

}
*/
// Table parser
const getDataTable = (maTable, styleGraph, cible, ) => {

    //we make the selection of our target
    let table = d3.selectAll(maTable);
    // we catch all lines of the table
    let allNodes = table.nodes();
    // for country name
    let finalTableCountry = [];
    // for the date in the line or the pie
    let tempoTableDate = [];
    // for the id and the array of position for the line
    let finalTableDonnee = [];
    // ALL CRIME
    let allDataCrime = [];
    switch (styleGraph) {
        case 'line':
            for (let i = 0; i <= allNodes.length - 1; i++) {
                //we catch all elements in the line of the table
                let allCellCurrentNode = [...allNodes[i].cells];
                if (i == 0) {
                    for (let j = 2; j <= allCellCurrentNode.length - 1; j++) {
                        let tempoDate = new Date(allCellCurrentNode[j].innerText, 1, 1);
                        tempoTableDate.push(tempoDate);
                    }
                } else {
                    if (i == 1) {}
                    finalTableDonnee[i - 1] = [];
                    finalTableDonnee[i - 1].data = [];
                    finalTableDonnee[i - 1].id = i;
                    let lastVal = "";
                    for (let j = 1; j <= allCellCurrentNode.length - 1; j++) {
                        if (j == 1) {
                            finalTableCountry.push(allCellCurrentNode[j].innerText);
                        } else {
                            finalTableDonnee[i - 1].data[j - 2] = [];
                            finalTableDonnee[i - 1].data[j - 2].years = +tempoTableDate[j - 2];
                            let tempoCrime = parseFloat(allCellCurrentNode[j].innerText);
                            //console.log(tempoCrime);
                            let patt = /^[0-9,]*$/;
                            let test = patt.test(tempoCrime);
                            if (!(test)) {
                                tempoCrime = lastVal;
                                finalTableDonnee[i - 1].data[j - 2].crime = tempoCrime;
                            } else {
                                finalTableDonnee[i - 1].data[j - 2].crime = tempoCrime;
                                lastVal = tempoCrime;
                            }
                            allDataCrime.push(lastVal);
                        }
                    }
                }
            }
            break;
        case 'bar':
            for (let i = 0; i <= allNodes.length - 1; i++) {
                finalTableDonnee[i] = [];
                finalTableDonnee[i].id = i;
                finalTableDonnee[i].data = [];
                //we catch all elements in the line of the table
                let allCellCurrentNode = [...allNodes[i].cells];
                for (let j = 1; j <= allCellCurrentNode.length - 1; j++) {
                    //console.log(`i=${i} et j=${j}- ${allCellCurrentNode[j].innerText}`);
                    if (j == 1) {
                        finalTableCountry.push(allCellCurrentNode[j].innerText);
                    } else {
                        let yearDate = "";
                        finalTableDonnee[i].data[j - 2] = [];
                        finalTableDonnee[i].data[j - 2].crime = +allCellCurrentNode[j].innerText;
                        if (j == "2") { yearDate = "2007" };
                        if (j == "3") { yearDate = "2010" };
                        finalTableDonnee[i].data[j - 2].year = +yearDate;
                    }
                }
            }
            break;
    }
    // we check the type of graphic
    // Les dimensions 
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = 800 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    switch (styleGraph) {
        case 'line':
            // we make the button
            let newDiv = document.createElement('DIV');
            finalTableCountry.forEach((pays, id) => {
                // we make a random color
                let butt = document.createElement("button");
                butt.innerText = pays;
                butt.id = `butt${id}`;
                butt.setAttribute("onClick", `displayLine("lines${id}","butt${id}")`)
                butt.style.backgroundColor = "#fFF";
                butt.style.margin = "2px 2px";
                butt.style.border = "2px solid";
                butt.style.borderColor = "#ADDDDD";
                newDiv.appendChild(butt);

            })
            target = document.querySelector(cible);
            target.appendChild(newDiv);

            // we make the area at the good position in the dom and we initializ it
            let svg = d3.select(cible).append('svg')
                .attr("id", "theSvg")
                .attr('width', 800)
                .attr('height', 500)
                .style('background', '#f2f2f2')
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`)


            // console.log(d3.extent(tempoTableDate, d => d));

            // we make the groupe X and Y
            const groupeX = svg.append('g')
                .attr('transform', `translate(0,${height})`)
            const groupeY = svg.append('g');
            // we make the x and Y
            let x = d3.scaleTime()
                .domain(d3.extent(tempoTableDate, d => d))
                .range([0, width])
                .nice();
            let y = d3.scaleLinear()
                .domain(d3.extent(allDataCrime))
                .range([height, 0])
                .nice();

            let myColor = d3.scaleSequential()
                .domain([1, finalTableCountry.length])
                .interpolator(d3.interpolateRainbow)


            //we create the axis and we add to our group
            const axeX = d3.axisBottom(x)
            const axeY = d3.axisLeft(y)
            groupeX.call(axeX);
            groupeY.call(axeY);

            // we make the method and we display the lines
            let valueLine = d3.line()
                .x(function(d) { return x(d.years) })
                .y(function(d) { return y(d.crime) })


            finalTableDonnee.forEach((line, id) => {

                let color = randomColor();

                svg.append('path')
                    .attr('d', valueLine(finalTableDonnee[id].data))
                    .attr("id", `lines${id}`)
                    .attr("flag", "false")
                    .style("stroke", color)
                    .style('fill', "none")
                    .style('stroke-width', "1px")
                    .style('display', 'none')

                const dot = svg.append('g');

                let year = d3.timeFormat("%Y");

                dot.attr('id', `dotlines${id}`)
                    .style("display", "none")
                    .selectAll(`dotlines${id}`)
                    .data(finalTableDonnee[id].data)
                    .enter()
                    .append("circle")
                    .attr("alt", function(d) { return d.crime })
                    .attr("cx", function(d) { return x(d.years) })
                    .attr("cy", function(d) { return y(d.crime) })
                    .style("fill", color)
                    .attr("r", 5)
                    .append("title")
                    .text(function(d) { return " En " + finalTableCountry[id] + " il y a eu " + d.crime + " crimes en " + year(d.years) })



            })

            break;
            // ---------------------------------------------------------------------
            //  ici on commence le type Bar
            //-----------------------------------------------------------------------

        case 'bar':


            let thelistOfCountry = document.createElement("SELECT");
            thelistOfCountry.name = "country";
            thelistOfCountry.id = "country-select";
            thelistOfCountry.style.float = "left";

            finalTableCountry.forEach((elem, id) => {
                let options = document.createElement('OPTION')
                options.innerText = elem;
                thelistOfCountry.appendChild(options);
            })

            var svgBar = d3.select(cible)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .data(finalTableCountry)
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            targetBar = document.querySelector(cible);
            targetBar.appendChild(thelistOfCountry);
            thelistOfCountry.addEventListener("change", () => {
                valueIndex = document.getElementById("country-select").selectedIndex;
                updateBar(valueIndex);
            })

            // X axis
            var barX = d3.scaleBand()
                .range([0, (width - 50)])
                .domain([2007, 2010])
                .padding(0.2);

            svgBar.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(barX))

            // Add Y axis
            var barY = d3.scaleLinear()
                .domain([0, 320])
                .range([height - 30, 0]);

            svgBar.append("g")
                .attr("class", "myYaxis")
                .call(d3.axisLeft(barY));




            function updateBar(index) {

                let u = svgBar.selectAll("rect")
                    .data(finalTableDonnee[index].data)

                u
                    .enter()
                    .append("rect")
                    .merge(u)
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) { return barX(d.year) })
                    .attr("y", function(d) { return barY(d.crime) })
                    .attr("width", barX.bandwidth())
                    .attr("height", function(d) { return height - barY(d.crime); })
                    .attr("fill", "#2e2e2e");
            }
            let mouseover = function() {
                alert();

            }
            updateBar(0);
            break;

    }


    console.log(finalTableDonnee);
    //console.log(finalTableCountry);
    //console.log(tempoTableDate);

}



function displayLine(liner, button) {
    let target = document.getElementById(`${liner}`);
    let attrib = target.getAttribute("flag");
    targetColor = target.style.stroke;
    if (attrib == "false") {
        document.getElementById(liner).style.display = "block";
        document.getElementById(`dot${liner}`).style.display = "block";
        document.getElementById(button).style.backgroundColor = targetColor;

        target.setAttribute("flag", "true");
    } else {
        document.getElementById(liner).style.display = "none";
        document.getElementById(button).style.backgroundColor = "#fff";

        document.getElementById(`dot${liner}`).style.display = "none";
        target.setAttribute("flag", "false");
    }
}


function randomColor() {
    var maxVal = parseInt("0xffffff");
    // we make our random number
    var randomVariable = Math.floor(Math.random() * maxVal);
    // we creat our color variable
    return randomCol = "#" + (randomVariable.toString(16));
}
let domTable1 = getDataTable("#table1 > tbody > tr", "line", "#table1 caption");
let domTable2 = getDataTable("#table2 > tbody > tr", "bar", "#table2 caption");