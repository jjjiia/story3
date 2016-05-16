$(function() {
	queue()
		
        .defer(d3.json, "data/crossReference.json")
        .defer(d3.csv, "data/data_tract.csv")
        .defer(d3.json, "data/combinedByMsaId.json")
        .defer(d3.json, "data/centroids_byMsaId.json")
		.await(dataDidLoad);
})

var map = null
function dataDidLoad(error,crossReference,tractData,msaData,cityCentroids) {

        map = drawBaseMap()
        drawRanks(msaData,cityCentroids)
    
    d3.select("#chicagoTract").style("cursor","pointer").on("click",function(){  
        newCoords = {lat:41.788268,lng: -87.598644}
        map.setZoom(10)
        map.panTo(newCoords);
        d3.select("#cityLabel").html("Chicago")
        
    })
    d3.select("#miamiTract").style("cursor","pointer").on("click",function(){ 
        var miami = {lat:25.759687, lng: -80.201221}
        map.setZoom(8.5)
        map.panTo(miami)    
        d3.select("#cityLabel").html("Miami")
        
    })
    
    d3.select("#nycTract").style("cursor","pointer").on("click",function(){
        var newYork = {lat:40.767680, lng:-73.975193}
        map.setZoom(10)
        map.panTo(newYork)  
        d3.select("#cityLabel").html("New York")
        
    })
 
   // d3.select("#cityRank").style("cursor","pointer").on("click",function(){
   //     drawRanks(msaData,cityCentroids)
   // })
   // 
    d3.select("#cityPlot").style("cursor","pointer").on("click",function(){
        drawPlot(tractData,msaData,cityCentroids,crossReference)
    })
}
function drawPlot(tractData,msaData,cityCentroids,crossReference){
    var array = []
    for(var i in msaData){
        array.push(msaData[i])
    }
    d3.select("#plot svg").remove()
    var xScale = d3.scale.linear().domain([0,70]).range([0,300])
    var yScale = d3.scale.linear().domain([0,70]).range([300,0])
    
    var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickSize(-400);
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(4)
        .orient("left")

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 10])
    .attr("opacity",1)

    var svg = d3.select("#plot").append("svg").attr("width",400).attr("height",400)
    svg.append("text").text("MSA Diversity").attr("x",270).attr("y",320)
    svg.append("text").text("Average Tract Diversity").attr("x",35).attr("y",20)
    svg.call(tip)
    
    svg.selectAll("circle")
    .data(array)
    .enter()
    .append("circle")
    .attr("cy",function(d){return yScale(d.tractsD)})
    .attr("cx",function(d){return xScale(d.msaD)})
    .attr("r",4)
    .attr("opacity",.2)
    .attr("cursor","pointer")
    .on("mouseover",function(d){
        d3.select(this).attr("opacity",1)
        tip.html(d.name)        
        tip.show()
    })
    .on("mouseout",function(d){
        d3.select(this).attr("opacity",.2)
        tip.hide()
    })
    .on("click",function(d){
        d3.selectAll("#plot circle").attr("fill","#000")
        d3.select(this).attr("fill","red")
        var centroid = cityCentroids["310M200US"+d.msaCode].point
        var city = {lat:centroid[1], lng:centroid[0]}
        map.setZoom(8)
        map.panTo(city)
        d3.select("#cityLabel").html(d.name)
    })
    
svg.append("g")
     .attr("class", "y axis")
     .attr("transform", "translate(30,30)")
     .call(yAxis);    
     
svg.append("g")
     .attr("class", "y axis")
     .attr("transform", "translate(30,330)")
     .call(xAxis)

svg.selectAll("text")
    
}
function drawRanks(msaData,cityCentroids){
    var array = []
    for(var i in msaData){
        array.push(msaData[i])
    }
     var row = $("<tr />")
    $("#rank").append(row)
    var newArray = array.sort(function(a,b){return b["population"]-a["population"]}).slice(1,20)
   
    row.append($("<td>" + "city" + "</td>"));
    //city.attr("cursor","pointer").attr("class","city")    
    var od = row.append($("<td>" + "overall diversity" + "</td>"))
//    od.on("click",function(){var newArray = array.sort(function(a,b){return b["msaD"]-a["msaD"]}).slice(1,40)})
    var td = row.append($("<td>" + "tract Diveristy" + "</td>"));
//    od.on("click",function(){var newArray = array.sort(function(a,b){return b["tractsD"]-a["tractsD"]}).slice(1,40)})
    row.append($("<td>" + "difference" + "</td>"));
    
    for (var i in newArray) {
        drawRow(cityCentroids,newArray[i],i)
    }
}
function drawRow(cityCentroids,rowData,i) {
    var row = $("<tr />").attr("class",rowData.geoid);
    row.on("click",function(){
        console.log(rowData)
        var centroid = cityCentroids["310M200US"+rowData.msaCode].point
        var city = {lat:centroid[1], lng:centroid[0]}
        map.setZoom(8)
        map.panTo(city)
        d3.select("#cityLabel").html(rowData.name)
    })
    $("#rank").append(row)
    row.append($("<td>" + rowData.name + "</td>"));
    row.append($("<td>" + rowData["msaD"]+ "</td>"));
    row.append($("<td>" + rowData["tractsD"]+ "</td>"));
    row.append($("<td>" + rowData["difference"]+ "</td>"));
}

function drawBaseMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/jjjiia123/cio0du5yv002fagkled2g604q', //hosted style id
        center:[-85,41.788268], // starting position
        zoom:15 // starting zoom
    })
    return map
}
