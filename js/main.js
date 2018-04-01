//Set up basemap
var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);
//Use ajax to import and parse Philadelphia bridge data in geojson format
var dataset = "https://raw.githubusercontent.com/Sophiehsw/OST4GIS-Midterm/master/midterm.geojson";
var featureGroup;
var parsedData;
$.ajax(dataset).done(function(data) {
  parsedData = JSON.parse(data);
});
//Add map
var addMap = function(){
  featureGroup = L.geoJson(parsedData, {
    style: myStyle,
    filter: myFilter
  }).addTo(map);
};
//Get color functions
function getColor1(d) {
    return d == "0 to 20" ? '#800026' :
           d == "20 to 50" ? '#BD0026' :
           d == "50 to 80" ? '#E31A1C' :
           d == "80 to 150" ? '#FC4E2A' :
           d == "150 to 250" ? '#FD8D3C' :
           d == "250 to 500" ? '#FEB24C' :
           d == "More than 500" ? '#FED976' :
           '#60605d';
}
function getColor2(d) {
    return d == "Decrease more than 50%" ? '#800026' :
           d == "Decrease less than 50%" ? '#BD0026' :
           d == "Increase less than 50%" ? '#E31A1C' :
           d == "Increase 50% to 80%" ? '#FC4E2A' :
           d == "Increase 80% to 150%" ? '#FD8D3C' :
           d == "Increase 150% to 300%" ? '#FEB24C' :
           d == "Increase more than 300%" ? '#FED976' :
           '#60605d';
}
//Create myStyle
function myStyle(feature) {
  if (state.slideNum < 2){
    return {
        fillColor: getColor1(feature.properties.price2010N_range),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };}
    else if (state.slideNum == 2){
      return {
        fillColor: getColor1(feature.properties.price2013N_range),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };}
    else if (state.slideNum == 3) {return {
        fillColor: getColor1(feature.properties.price2016N_range),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };}
    else if (state.slideNum == 4) {return {
        fillColor: getColor2(feature.properties["census-tracts-philly_price2017new_percentchange"]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };}
}
//Create myFilter
var myFilter2 = function(feature) {
  if(feature.properties.price2013N_range !== " "){return true;}
};
var myFilter3 = function(feature) {
  if(feature.properties.price2016N_range !== " "){return true;}
};
var myFilter4 = function(feature) {
  if(feature.properties["census-tracts-philly_price2017new_percentchange"] !== " "){return true;}
};
var myFilter = function(feature) {
  if (state.slideNum < 2) {
    return true;
  } else if (state.slideNum == 2) {
    return myFilter2(feature);
  } else if (state.slideNum == 3) {
    return myFilter3(feature);
  } else if (state.slideNum == 4) {
    return myFilter4(feature);
  }
  console.log(state.slideNum);
};
//Remove layer for previous slide
var removeData = function(){
  if (typeof featureGroup !== 'undefined') {
    map.removeLayer(featureGroup);
  }
};
//Reset Zoom Buttom
$( ".reset" ).click(function() {
    $('#intro').show();
    $('#results').hide();
    map.fitBounds(featureGroup.getBounds());
  });
//What to hide or show on the first page, pages in between and the last page
var showResults1 = function() {
  $('#intro').show();
  $('#results').hide();
  $('.previous').hide();
  $('.legend').hide();
};
var showResults2 = function() {
  $('.previous').show();
  $('.next').show();
  $('.legend').show();
  $(".legend-title").text("Median Home Sales Price");
  $('.lab1').text('0 to 20');
  $('.lab2').text('20 to 50');
  $('.lab3').text('50 to 80');
  $('.lab4').text('80 to 150');
  $('.lab5').text('150 to 250');
  $('.lab6').text('250 to 500');
  $('.lab7').text('More than 500');
  $('.lab8').text('No Data');
  };
var showResults3 = function() {
  $('.previous').show();
  $('.next').hide();
  $(".legend-title").text("Percentage Increase or Decrease");
  $('.lab1').text('Decrease more than 50%');
  $('.lab2').text('Decrease less than 50%');
  $('.lab3').text('Increase less than 50%');
  $('.lab4').text('Increase 50% to 80%');
  $('.lab5').text('Increase 80% to 150%');
  $('.lab6').text('Increase 150% to 300%');
  $('.lab7').text('Increase more than 300%');
  $('.lab8').text('No Data');
};
//Clicking functions
var eachFeatureFunction = function(layer) {
  if (state.slideNum == 1) {
    layer.on('click', function (event) {
      console.log('clicked');
      layer.bindPopup(layer.feature.properties.price2010N_range);
      $('.link-replace').show();
    });
  } else if (state.slideNum == 2) {
    layer.on('click', function (event) {
      console.log('clicked');
      layer.bindPopup(layer.feature.properties.price2013N_range);
      console.log(layer.feature);
      $('.link-replace').show();
    });
  } else if (state.slideNum == 3) {
    layer.on('click', function (event) {
      console.log('clicked');
      layer.bindPopup(layer.feature.properties.price2016N_range);
      console.log(layer.feature);
      $('.link-replace').show();
    });
  } else if (state.slideNum == 4) {
    layer.on('click', function (event){
      var range;
      if(layer.feature.properties["census-tracts-philly_price2017new_percentchange"] == "Decrease more than 50%") {range = "decrease more than 50%";}
      if(layer.feature.properties["census-tracts-philly_price2017new_percentchange"] == "Decrease less than 50%") {range = "decrease less than 50%";}
      if(layer.feature.properties["census-tracts-philly_price2017new_percentchange"] == "Increase less than 50%") {range = "increase less than 50%";}
      if(layer.feature.properties["census-tracts-philly_price2017new_percentchange"] == "Increase 50% to 80%") {range = "increase 50% to 80%";}
      if(layer.feature.properties["census-tracts-philly_price2017new_percentchange"] == "Increase 80% to 150%") {range = "increase 80% to 150%";}
      if(layer.feature.properties["census-tracts-philly_price2017new_percentchange"] == "Increase 150% to 300%") {range = "increase 150% to 300%";}
      if(layer.feature.properties["census-tracts-philly_price2017new_percentchange"] == "Increase more than 300%") {range = "increase more than 300%";}
      if(layer.feature.properties["census-tracts-philly_price2017new_percentchange"] == " ") {range = "unknown ";}
      $('.pricerange').replaceWith(range)
      console.log(layer.feature);
      $('.link-replace2').show();
      $('#intro').hide();
      $('#results').show();
    });
  }
};
//Set initial page for reset
var initialSlide = function(event){
  map.setView([40.003215, -75.143526], 10);
  $(".title-replace").text("Home Price Analysis in Philadelphia");
  $(".para-replace").text("What area has the highest increase or decrease home sales price in Philadelphia?");
  $(".text-replace").text("Click on 'NEXT >' to learn more!");
  showResults1();
};
//Next slide
var nextSlide = function(event) {
  state.slideNum = state.slideNum + 1;
  removeData();
  addMap();
  if (state.slideNum < 4) {
    $(".header").hide();
    $(".title-replace").text(state.slideData[state.slideNum]["name"]);
    $(".para-replace").text(state.slideData[state.slideNum]["description"]);
    $('.text-replace').text("Double click on the map to find out the midian price range for the area you are interested in");
    map.setView([40.000, -75.1090], 11.5);
    showResults2();
  }
  else {
    $(".title-replace").text(state.slideData[state.slideNum]["name"]);
    $(".para-replace").text(state.slideData[state.slideNum]["description"]);
    $('.text-replace').text("Double click on the map to find out the increase or the decrease for the area you are interested in");
    showResults3();
  }
  featureGroup.eachLayer(eachFeatureFunction);
  $('.link-replace').hide();
};
//Previous slide
var previousSlide = function(event) {
  state.slideNum = state.slideNum - 1;
  removeData();
  addMap();
  if (state.slideNum > 0) {
    $(".header").hide();
    $(".title-replace").text(state.slideData[state.slideNum]["name"]);
    $(".para-replace").text(state.slideData[state.slideNum]["description"]);
    showResults2();
    featureGroup.eachLayer(eachFeatureFunction);
  }
  else {
    featureGroup.eachLayer(eachFeatureFunction);
    initialSlide();
  }
  $('#intro').show();
  $('#results').hide();
  $('.link-replace').hide();
};
//navigate to next slide when click on the "next" button
//navigate to previous slide when click on the "previous" button
//reset to reset zooming with reset button
$( ".next" ).click(nextSlide);
$(".previous").click(previousSlide);
//Cover page
$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      style: myStyle,
      filter: myFilter
    }).addTo(map);
    map.setView([40.003215, -75.143526], 10);
    showResults1();
    $('.link-replace').hide();
    $('.link-replace2').hide();
  });
});
