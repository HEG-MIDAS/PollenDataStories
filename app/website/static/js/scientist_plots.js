let ambroisieArray = [
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
];

let bouleauArray = [
    [1994,42.0,66],
    [1995,80.8440366972477,71],
    [1996,99.19672131147541,95],
    [1997,63.470588235294116,60],
    [1998,65.03448275862068,80],
    [1999,72.80412371134021,70],
    [2000,63.03703703703704,71],
    [2001,62.29457364341085,70],
    [2002,71.92592592592592,54],
    [2003,74.45255474452554,75],
    [2004,70.22047244094489,16],
    [2005,97.39622641509433,45],
    [2006,139.9111111111111,90],
    [2007,101.38461538461539,60],
    [2008,91.15315315315316,78],
    [2009,122.37037037037037,86],
    [2010,97.88,81],
    [2011,92.41489361702128,82],
    [2012,90.27272727272727,80],
    [2013,81.11304347826086,69],
    [2014,80.8785046728972,74],
    [2015,84.13207547169812,88],
    [2016,87.91818181818182,82],
    [2017,148.8640776699029,77],
    [2018,119.86086956521739,22],
    [2019,89.07352941176471,57],
    [2020,90.4885496183206,49],
    [2021,66.66949152542372,49],
    [2022,103.01639344262296,46],
    [2023,124.81818181818181,74]
];

let gramineesArray= [
    [1994,42.96376811594203,3],
    [1995,44.24548736462094,12],
    [1996,39.16151202749141,35],
    [1997,38.788079470198674,16],
    [1998,40.303030303030305,32],
    [1999,39.09342560553633,16],
    [2000,43.904761904761905,39],
    [2001,43.42295081967213,30],
    [2002,41.1578947368421,10],
    [2003,41.52597402597402,22],
    [2004,36.390728476821195,38],
    [2005,32.59722222222222,29],
    [2006,33.48453608247423,24],
    [2007,39.70666666666666,1],
    [2008,38.532051282051285,12],
    [2009,30.63973063973064,35],
    [2010,25.640776699029125,38],
    [2011,31.65286624203822,0],
    [2012,42.41379310344828,15],
    [2013,40.52903225806452,10],
    [2014,40.278481012658226,24],
    [2015,38.33974358974359,3],
    [2016,30.842443729903536,8],
    [2017,26.438538205980066,15],
    [2018,25.08169934640523,36],
    [2019,29.934375,2],
    [2020,30.356495468277945,10],
    [2021,26.37539432176656,23],
    [2022,39.12422360248447,6],
    [2023,51.046783625730995,56],
];

function linearRegression(y,x){
    let lr = {};
    let n = y.length;
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;
    let sum_yy = 0;

    for (let i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    } 

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
}

function generateArrayFromLR(pollenArrayDateAndAvg) {
    let lr = linearRegression(pollenArrayDateAndAvg["avgArray"], pollenArrayDateAndAvg["date"]);
    let pollenLRArray = [];
    for (let i = 0; i < pollenArrayDateAndAvg["date"].length; i++) {
        pollenLRArray.push(lr["intercept"]+lr["slope"]*(i+1994));
    }
    
    return pollenLRArray;
}

function generateArrayFirstDayFromLR(pollenArrayDateAndAvg) {
    let lr = linearRegression(pollenArrayDateAndAvg["firstday"], pollenArrayDateAndAvg["date"]);
    let pollenLRArray = [];
    for (let i = 0; i < pollenArrayDateAndAvg["date"].length; i++) {
        pollenLRArray.push(lr["intercept"]+lr["slope"]*(i+1994));
    }
    
    return pollenLRArray;
}

function readingDateAndAvg(pollenArray) {
    let dateArray = [];
    let avgArray = [];

    for (let i = 0; i < pollenArray.length; i++) {
        dateArray.push(pollenArray[i][0]);
        avgArray.push(pollenArray[i][1]);
    }

    return {"date": dateArray, "avgArray": avgArray};
}

function readingDateAndFirstDay(pollenArray) {
    let dateArray = [];
    let firstdayArray = [];

    for (let i = 0; i < pollenArray.length; i++) {
        dateArray.push(pollenArray[i][0]);
        firstdayArray.push(pollenArray[i][2]);
    }

    return {"date": dateArray, "firstday": firstdayArray};
}

function meanPollenEvolution(ambroisieArray, bouleauArray, gramineesArray) {
    let ambroisieReadObj = readingDateAndAvg(ambroisieArray);
    let bouleauReadObj = readingDateAndAvg(bouleauArray);
    let gramineesReadObj = readingDateAndAvg(gramineesArray);

    let ambroisieLRArray = generateArrayFromLR(ambroisieReadObj);
    let bouleauLRArray = generateArrayFromLR(bouleauReadObj);
    let gramineesLRArray = generateArrayFromLR(gramineesReadObj);

    // Define Data
    const data = [
        {
            x: ambroisieReadObj["date"],
            y: ambroisieReadObj["avgArray"],
            mode: "lines",
            type: "scatter",
            name: "Ambroisie",
            line: {
                color: "rgba(255,0,0,1)"
            }
        },
        {
            x: ambroisieReadObj["date"],
            y: ambroisieLRArray,
            mode: "lines",
            type: "scatter",
            name: "R.L. Ambroisie",
            line: {
                dash: "dot",
                color: "rgba(255,0,0,1)"
            }
        },
        {
            x: bouleauReadObj["date"],
            y: bouleauReadObj["avgArray"],
            mode: "lines",
            type: "scatter",
            name: "Bouleau",
            line: {
                color: "rgba(0,255,0,1)"
            }
        },
        {
            x: bouleauReadObj["date"],
            y: bouleauLRArray,
            mode: "lines",
            type: "scatter",
            name: "R.L. Bouleau",
            line: {
                dash: "dot",
                color: "rgba(0,255,0,1)"
            }
        },
        {
            x: gramineesReadObj["date"],
            y: gramineesReadObj["avgArray"],
            mode: "lines",
            type: "scatter",
            name: "Graminées",
            line: {
                color: "rgba(0,0,255,1)"
            }
        },
        {
            x: gramineesReadObj["date"],
            y: gramineesLRArray,
            mode: "lines",
            type: "scatter",
            name: "R.L. Graminées",
            line: {
                dash: "dot",
                color: "rgba(0,0,255,1)"
            }
        },
    ];


    // console.log(Math.min(... [Math.min(... ambroisieReadObj["avgArray"])-1, Math.min(... bouleauReadObj["avgArray"])-1]))
    // Define Layout
    const layout = {
        xaxis: {range: [Math.min(... ambroisieReadObj["date"])-1, Math.max(... ambroisieReadObj["date"])+1], title: "Années"},
        yaxis: {range: [0, Math.max(... [Math.max(... ambroisieReadObj["avgArray"])+1, Math.max(... bouleauReadObj["avgArray"])+1])], title: "Moyenne annuelle du pollen"},
        title: "Evolution de la moyenne des pollens au fil des années depuis 1994 [No/m³]"
    };

    // Display using Plotly
    Plotly.newPlot("scientistMeanPollenEvolution", data, layout);
}

meanPollenEvolution(ambroisieArray, bouleauArray, gramineesArray)


function firstDayPollenEvolution() {

    let ambroisieReadObj = readingDateAndFirstDay(ambroisieArray);
    let bouleauReadObj = readingDateAndFirstDay(bouleauArray);
    let gramineesReadObj = readingDateAndFirstDay(gramineesArray);

    let ambroisieLRArray = generateArrayFirstDayFromLR(ambroisieReadObj);
    let bouleauLRArray = generateArrayFirstDayFromLR(bouleauReadObj);
    let gramineesLRArray = generateArrayFirstDayFromLR(gramineesReadObj);

    console.log(ambroisieLRArray)

    var trace1 = {
        x: ambroisieReadObj["date"],
        y: ambroisieReadObj["firstday"],
        name: 'Ambroisie',
        type: 'bar',
        marker: {
            // dash: "dot",
            color: "rgba(255,0,0,1)"
        }
      };
      
      var trace2 = {
        x: bouleauReadObj["date"],
        y: bouleauReadObj["firstday"],
        name: 'Bouleau',
        type: 'bar',
        marker: {
            // dash: "dot",
            color: "rgba(0,255,0,1)"
        }
      };

      var trace3 = {
        x: gramineesReadObj["date"],
        y: gramineesReadObj["firstday"],
        name: 'Graminées',
        type: 'bar',
        marker: {
            // dash: "dot",
            color: "rgba(0,0,255,1)"
        }
      };

      var trace4 = {
        x: ambroisieReadObj["date"],
        y: ambroisieLRArray,
        name: 'R.L. Ambroisie',
        type: 'scatter',
        line: {
            dash: "dot",
            color: "rgba(255,0,0,1)"
        }
      };

      var trace5 = {
        x: bouleauReadObj["date"],
        y: bouleauLRArray,
        name: 'R.L. Bouleau',
        type: 'scatter',
        line: {
            dash: "dot",
            color: "rgba(0,255,0,1)"
        }
      };

      var trace6 = {
        x: gramineesReadObj["date"],
        y: gramineesLRArray,
        name: 'R.L. Graminées',
        type: 'scatter',
        line: {
            dash: "dot",
            color: "rgba(0,0,255,1)"
        }
      };
      
      var data = [trace1, trace2, trace3, trace4, trace5, trace6];
      
      var layout = {
        barmode: 'group',
        xaxis: {title: "Années"},
        yaxis: {title: "Evolution du nombre de jours à partir de l'offset"},
        title: "Evolution du premier jour de pollen au fil des années depuis 1994"
      };
      
      Plotly.newPlot('scientistFirstDayPollenEvolution', data, layout);
}

firstDayPollenEvolution()


let ppmRuralArray = [
    [2011,19.122692307692308,15.319972505441632,48.40198261068527],
    [2012,16.285125348189418,13.878262358716748,50.81533553983108],
    [2013,17.090358126721764,14.033454274922741,46.87828764766601],
    [2014,14.511318681318683,12.433788107105597,49.833421753735664],
    [2015,15.723812154696134,13.83003505901601,54.143872335548934],
    [2016,14.011010928961749,12.93050263004091,51.838506560182545],
    [2017,14.104710743801654,12.63184471756086,54.270724819938266],
    [2018,14.31918309859155,10.989101640892455,56.855166628361296],
    [2019,14.75728021978022,10.825418177564627,57.937032339161235],
    [2020,14.032797783933518,8.857140843415952,53.590581809819476],
    [2021,13.39065934065934,8.509046617595512,50.870481307876986],
    [2022,14.198356164383563,9.419140397813191,57.46216472469728],
    [2023,13.238164383561644,7.272483331383787,58.10621111619396],
];

let ppmSuburbainArray = [
    [2011,22.390365093814005,23.424909837679564,45.93032430096466],
    [2012,18.709417644551998,19.843312383991666,51.96967509495994],
    [2013,19.429236919052016,21.71588006625387,48.47655483700214],
    [2014,16.22567200463052,19.913896120230078,46.81595964974271],
    [2015,17.83631506849315,21.16507969507679,52.07801099931282],
    [2016,15.464071038251365,20.25729094025962,48.47303554316887],
    [2017,15.663520547945206,20.362238159868706,51.078020639164116],
    [2018,15.864151330019354,17.571672392897177,54.67073996733324],
    [2019,15.12986301369863,16.386984992858252,54.98083435165974],
    [2020,14.44084699453552,13.942449243009484,52.019168801611],
    [2021,14.179426322561113,14.103195063196344,51.10589386233862],
    [2022,15.223959332146173,14.207758024692438,55.866672867305766],
    [2023,13.64611144087789,12.541712988036826,56.65610211860228],
];

let ppmUrbainArray = [
    [2011,26.6,38.3,40.0],
    [2012,22.5,35.0,44.5],
    [2013,22.5,36.5,38.5],
    [2014,17.803098591549293,40.33565662440386,37.39793384633054],
    [2015,20.428986301369864,40.725594821553535,38.91869122526027],
    [2016,17.77532786885246,39.29009995296331,39.46429811536265],
    [2017,17.55643835616438,38.42293333333333,42.13535624284078],
    [2018,17.734794520547943,34.85595371669004,45.16393453879606],
    [2019,16.994520547945207,35.37755373831776,45.73591470386462],
    [2020,16.30710382513661,30.802651612152253,44.13884624145786],
    [2021,15.792328767123287,29.41133348902382,43.54105804387569],
    [2022,17.410136986301367,29.824682955206516,47.633702307516565],
    [2023,13.562005494505494,28.451421900537007,48.088744673499946],
];

function readingDateAndPPM(ppmArray) {
    let dateArray = [];
    let PM10Array = [];
    let NO2Array = [];
    let O3Array = [];

    for (let i = 0; i < ppmArray.length; i++) {
        dateArray.push(ppmArray[i][0]);
        PM10Array.push(ppmArray[i][1]);
        NO2Array.push(ppmArray[i][2]);
        O3Array.push(ppmArray[i][3]);
    }

    return {"date": dateArray, "pm10": PM10Array, "no2": NO2Array, "o3": O3Array};
}

function meanPPMEvolution(ppmRuralArray) {

    let ppmRuralReadObj = readingDateAndPPM(ppmRuralArray);
    let ppmSuburbainReadObj = readingDateAndPPM(ppmSuburbainArray);
    let ppmUrbainReadObj = readingDateAndPPM(ppmUrbainArray);

    var trace1 = {
        x: ppmRuralReadObj["date"],
        y: ppmRuralReadObj["pm10"],
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'scatter',
        name: "PM10 Rural",
        line: {
            // dash: "dot",
            color: "rgba(255,0,0,1)"
        }
    };
      
    var trace2 = {
        x: ppmRuralReadObj["date"],
        y: ppmRuralReadObj["no2"],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'scatter',
        name: "NO2 Rural",
        line: {
            // dash: "dot",
            color: "rgba(255,0,0,1)"
        }
    };
      
    var trace3 = {
        x: ppmRuralReadObj["date"],
        y: ppmRuralReadObj["o3"],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'scatter',
        name: "O3 Rural",
        line: {
            // dash: "dot",
            color: "rgba(255,0,0,1)"
        }
    };

    var trace4 = {
        x: ppmSuburbainReadObj["date"],
        y: ppmSuburbainReadObj["pm10"],
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'scatter',
        name: "PM10 Suburbain",
        line: {
            // dash: "dot",
            color: "rgba(0,255,0,1)"
        }
    };
      
    var trace5 = {
        x: ppmSuburbainReadObj["date"],
        y: ppmSuburbainReadObj["no2"],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'scatter',
        name: "NO2 Suburbain",
        line: {
            // dash: "dot",
            color: "rgba(0,255,0,1)"
        }
    };
      
    var trace6 = {
        x: ppmSuburbainReadObj["date"],
        y: ppmSuburbainReadObj["o3"],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'scatter',
        name: "O3 Suburbain",
        line: {
            // dash: "dot",
            color: "rgba(0,255,0,1)"
        }
    };

    var trace7 = {
        x: ppmUrbainReadObj["date"],
        y: ppmUrbainReadObj["pm10"],
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'scatter',
        name: "PM10 Urbain",
        line: {
            // dash: "dot",
            color: "rgba(0,0,255,1)"
        }
    };
      
    var trace8 = {
        x: ppmUrbainReadObj["date"],
        y: ppmUrbainReadObj["no2"],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'scatter',
        name: "NO2 Urbain",
        line: {
            // dash: "dot",
            color: "rgba(0,0,255,1)"
        }
    };
      
    var trace9 = {
        x: ppmUrbainReadObj["date"],
        y: ppmUrbainReadObj["o3"],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'scatter',
        name: "O3 Urbain",
        line: {
            // dash: "dot",
            color: "rgba(0,0,255,1)"
        }
    };
      
    var data = [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8, trace9];
      
    var layout = {
    grid: {
        rows: 3,
        columns: 1,
        pattern: 'independent'
    },
    yaxis1: {title: "PM10"},
    yaxis2: {title: "NO2"},
    yaxis3: {title: "O3"},
    xaxis3: {title: "Années"},
    title: "Evolution de la moyenne des particules fines depuis 2011 [μg/m³]"
    };
      
    Plotly.newPlot('scientistMeanPPMEvolution', data, layout);
      
}

meanPPMEvolution(ppmRuralArray)