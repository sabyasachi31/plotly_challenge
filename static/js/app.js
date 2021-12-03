function init(){
  url = "././samples.json"
  d3.json(url).then(function (data) {

    var names = data.names;
    console.log(names)

    var n = names.length;

    for (let i = 0; i < n; i++) {
      var d = names[i];

      var option = document.createElement("option");
      option.text = d;
      option.value = d;
      var select = document.getElementById("selDataset");
      select.appendChild(option);


    }

  });
}
init();
getID();


function getID(){
  d = document.getElementById("selDataset").value;
  console.log(d);
  

  optionChanged(940);
  optionChanged(d);


}

function optionChanged(d) {
  
  var div=d3.select("#sample-metadata")

  url = "././samples.json"
  d3.json(url).then(function (data) {

    console.log(data)

    var samples = data.samples;
    var dem_info = data.metadata;

    var names = data.names;
    var n = names.length;

    for (let i = 0; i < n; i++) {

      if (d == names[i]) {

        //Demographic Info
        div.html(`ID: ${dem_info[i].id} <br> ETHNITICITY: ${dem_info[i].ethnicity} <br> GENDER: ${dem_info[i].gender} <br> 
        AGE: ${dem_info[i].age} <br> LOCATION: ${dem_info[i].location} <br> BBTYPE: ${dem_info[i].bbtype} <br> 
        WFREQ: ${dem_info[i].wfreq}`);

        var otu_ids = samples[i].otu_ids;
        var otu_labels = samples[i].otu_labels;
        var sample_values = samples[i].sample_values;

        //Call sorting function
        var sorted_values = sort_slice_func(otu_ids, otu_labels, sample_values);
        var sv = sorted_values[0];
        var oi = sorted_values[1];
        var ol = sorted_values[2];

        var sub_id=i;
        break;
      }
    }
    var y_labels=[];
    for(let j=0; j< 10;j++){
      y_labels[j]=`OTU ${oi[j]}`;
    
    }

    //Horizontal Bar Chart
    var trace1 = {
      x: sv,
      y: y_labels,
      hovertext: ol,
      type: "bar",
      orientation: 'h'
    };
    var data1 = [trace1];
  
    var layout1 = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {autorange: "reversed"}
    };
  
    Plotly.newPlot("bar", data1, layout1);

    //Bubble Chart
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker:{
        size: sample_values,
        color: otu_ids
      }
    };
    var data2 = [trace2];
  
    var layout2 = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title:"OTU ID"}
    };
  
    Plotly.newPlot("bubble", data2, layout2);

    //Gauge Chart

    var data3 = [
      {
        type: "indicator",
        mode: "gauge",
        value: dem_info[sub_id].wfreq,
        title: { text: "Scrubs per Week", font: { size: 24 } },
        
        gauge: {
          axis: { range: [null, 9], dtick: 1, tickwidth: 1, tickcolor: "black" },
          bar: { color: "green" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 9], color: "cyan" },
          ],
          threshold: {
            line: { color: "purple", width: 4 },
            thickness: 2,
            value: dem_info[sub_id].wfreq
          }
        }
      }
    ];
    
    var layout3 = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      
      font: { color: "darkblue", family: "Arial" }
    };
    
    Plotly.newPlot('gauge', data3, layout3);
    

  });

}

function sort_slice_func(otu_ids, otu_labels, sample_values) {
  var l = otu_ids.length;

  for (let i = 0; i < l - 1; i++) {
    for (let j = 0; j < l - i - 1; j++) {
      if (sample_values[j] > sample_values[j + 1]) {

        var t = sample_values[j];
        sample_values[j] = sample_values[j + 1];
        sample_values[j + 1] = t;

        var t = otu_ids[j];
        otu_ids[j] = otu_ids[j + 1];
        otu_ids[j + 1] = t;

        var t = otu_labels[j];
        otu_labels[j] = otu_labels[j + 1];
        otu_labels[j + 1] = t;

      }
    }
  }

  sample_values = sample_values.reverse();
  otu_ids = otu_ids.reverse();
  otu_labels = otu_labels.reverse();

  if (l > 10) {
    l = 10;
  }

  var sv = sample_values.slice(0, l);
  var oi = otu_ids.slice(0, l);
  var ol = otu_labels.slice(0, l);

  return ([sv, oi, ol]);

}
