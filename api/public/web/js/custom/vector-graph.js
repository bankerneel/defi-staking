/* eslint-disable no-empty */
function draw(graphData) {
  try {
    // compile the expression once
    const expression = '15 * (1 + 0.25 * x/7 )';
    const expr = math.compile(expression);

    const expression1 = '15 * (1.25 + 0.5 * (x - 7)/7)';
    const expr1 = math.compile(expression1);

    const expression2 = '15 * (1.75 + 1.25 * (x - 14)/7)';
    const expr2 = math.compile(expression2);
    // const expr = math.compile(expression)
    // evaluate the expression repeatedly for different values of x
    const xValues = math.range(0, 21, 7, true).toArray();
    const yValues = xValues.map((x) => {
      if (x >= 0 && x <= 7) {
        return expr.evaluate({ x });
      }
      if (x > 7 && x <= 14) {
        return expr1.evaluate({ x });
      }
      if (x > 14 && x <= 21) {
        return expr2.evaluate({ x });
      }
      return 45;
    });

    const xData = [];
    const yData = [];
    xValues.map((x) => {
      if (x >= 0 && x <= graphData.stakeDays) {
        xData.push(x);
      }
      return 0;
    });
    xData.push(parseInt(graphData.stakeDays));
    yValues.map((y) => {
      if (y >= 0 && y <= graphData.rewardRate) {
        yData.push(y);
      }
      return 0;
    });
    yData.push(graphData.rewardRate);

    // render the plot using plotly
    const trace1 = {
      x: xValues,
      y: yValues,
      type: 'scatter',
      line: { color: '072ac8', width: 4 },
      marker: {
        symbol: 'pentagon',
        size: 10,
      },
      name: 'RRC - Rewards Rate Change',
    };

    const trace2 = {
      x: xValues, // day
      y: yValues, // rewardRate
      fill: 'tozeroy',
      fillcolor: 'rgba(139,133,172,0.6)',
      transparent: 50,
      type: 'scatter',
      mode: 'none',
      name: 'PRR - Predicted Rewards Rate',
    };

    const trace3 = {
      x: xData, // day
      y: yData, // rewardRate
      fill: 'tozeroy',
      fillcolor: 'rgba(85,81,134,0.8)',
      opacity: 10,
      type: 'scatter',
      mode: 'none',
      name: 'CRR - Current Rewards Rate',
      text: xData,
    };

    const data = [trace2, trace3];

    const layout = {
      title: '<b>Rewards Rate Prediction Graph</b>',
      titlefont: {
        family: 'Montserrat, sans-serif',
        size: 21,
        color: '2659a9',
      },
      xaxis: {
        title: 'Number Of Days',
        titlefont: {
          family: 'Montserrat, sans-serif',
          size: 18,
          color: '2659a9',
        },
        autotick: false,
        automargin: true,
        zeroline: false,
        showline: true,
        showdividers: false,
        tick0: 0,
        linewidth: 2,
        tickfont: {
          size: 17,
          color: 'black',
        },
        dtick: 7,
        showgrid: false,
        hoverinfo: 'none',
        font: { size: 18 },
        range: [-0.5, 22],
        fixedrange: true,
      },
      yaxis: {
        title: 'Rewards Rate',
        titlefont: {
          family: 'Montserrat, sans-serif',
          size: 18,
          color: '2659a9',
        },
        autotick: false,
        automargin: true,
        zeroline: false,
        showline: true,
        linewidth: 2,
        tick0: 0,
        dtick: 5,
        tickfont: {
          size: 18,
        },
        showgrid: false,
        hoverinfo: 'none',
        font: { size: 18 },
        range: [10.5, 48],
        showlegend: false,
        fixedrange: true,
      },
    };

    Plotly.newPlot('chartdiv', data, layout, {
      displayModeBar: false,
      responsive: true,
      scrollZoom: false,
      editable: false,
      staticPlot: false,
    });

    // const xData = []
    // const yData = []
    // xValues.map((x) => {
    // 	if (x >= 0 && x <= graphData.stakeDays) {
    // 		xData.push(x)
    // 	}
    // 	return 0
    // })
    // xData.push(parseInt(graphData.stakeDays))
    // yValues.map((y) => {
    // 	if (y >= 0 && y <= graphData.rewardRate) {
    // 		yData.push(y)
    // 	}
    // 	return 0
    // })
    // yData.push(graphData.rewardRate)
    // Plotly.addTraces('chartdiv', {
    // 	x: xValues, // day
    // 	y: yValues, // rewardRate
    // 	fill: 'tozeroy',
    // 	//fillcolor: '04a6c2',
    // 	type: 'scatter',
    // 	mode: 'none',
    // 	name: 'PRR - Predicted Rewards Rate',
    // })
    Plotly.addTraces('chartdiv', {
      x: xValues,
      y: yValues,
      type: 'scatter',
      line: { color: 'rgb(85,81,134)', width: 3 },
      marker: {
        symbol: 'circle',
        size: 9,
      },
      name: 'RRC - Rewards Rate Change',
    });
  } catch (err) {
    console.error(err);
    swal(err);
  }
}

$.get('/dashboard/update-reward-rate/', async (result) => {
  if (result.message == 'Success') {
    draw(result.data);
  }
});
