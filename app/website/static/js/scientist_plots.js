ambroisieArray = [
    [1994,11.727272727272727,37],
    [1995,8.782608695652174,49],
    [1996,4.454545454545454,27],
    [1997,16.4,33],
    [1998,11.461538461538462,12],
    [1999,10.857142857142858,32],
    [2000,8.571428571428571,30],
    [2001,5.666666666666667,43],
    [2002,10.4,38],
    [2003,5.043478260869565,14],
    [2004,9.419354838709678,32],
    [2005,7.217391304347826,16],
    [2006,13.44,31],
    [2007,4.0,12],
    [2008,8.074074074074074,32],
    [2009,9.935483870967742,19],
    [2010,7.6,37],
    [2011,9.547619047619047,5],
    [2012,8.75,41],
    [2013,7.9,42],
    [2014,7.04,30],
    [2015,10.357142857142858,15],
    [2016,8.125,41],
    [2017,10.304347826086957,3],
    [2018,6.472222222222222,36],
    [2019,2.823529411764706,22],
    [2020,6.608695652173913,26],
    [2021,5.782608695652174,35],
    [2022,5.764705882352941,18],
    [2023,10.90625,30],
]

function readingDateAndAvg(pollenArray) {
    dateArray = []
    avgArray = []

    for (let i = 0; i < pollenArray.length; i++) {
        dateArray.push(pollenArray[i][0]);
        avgArray.push(pollenArray[i][1]);
    }

    return {"date": dateArray, "avgArray": avgArray}
}


function test(ambroisieArray) {
    ambroisieReadObj = readingDateAndAvg(ambroisieArray)
    const xArray = ambroisieReadObj["date"];
    const yArray = ambroisieReadObj["avgArray"];

    console.log(ambroisieReadObj["avgArray"])

    // Define Data
    const data = [{
    x: xArray,
    y: yArray,
    mode: "lines",
    type: "scatter"
    }];

    // Define Layout
    const layout = {
    xaxis: {range: [ambroisieReadObj["date"][0], ambroisieReadObj["date"][ambroisieReadObj["date"].length-1]], title: "Square Meters"},
    yaxis: {range: [Math.min(ambroisieReadObj["avgArray"]), Math.max(ambroisieReadObj["avgArray"])], title: "Price in Millions"},
    title: "House Prices vs Size"
    };

    // Display using Plotly
    Plotly.newPlot("scientistMeanEvolution", data, layout);
}

test(ambroisieArray)