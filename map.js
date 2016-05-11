$(function() {
	queue()
		.defer(d3.json, "dot_data/tract_white.geojson_byMsaId.json")
		.defer(d3.json, "dot_data/tract_black.geojson_byMsaId.json")
		.defer(d3.json, "dot_data/tract_asian.geojson_byMsaId.json")
		.defer(d3.json, "dot_data/tract_hispanic.geojson_byMsaId.json")
		.defer(d3.json, "dot_data/msa_white.geojson_byMsaId.json")
		.defer(d3.json, "dot_data/msa_black.geojson_byMsaId.json")
		.defer(d3.json, "dot_data/msa_asian.geojson_byMsaId.json")
		.defer(d3.json, "dot_data/msa_hispanic.geojson_byMsaId.json")
		.defer(d3.json, "data/topo_tract_filtered.geojson")
        .defer(d3.json, "data/crossReference.json")
        .defer(d3.csv, "data/data_tract.csv")
        .defer(d3.csv, "data/data_msa.csv")
        .defer(d3.json, "data/centroids_byMsaId.json")
		.await(dataDidLoad);
})

var map = null
function dataDidLoad(error,tw,tb,ta,th,mw,mb,ma,mh,tract_topo,crossReference,msaData,tractData,cityCentroids) {

    map = drawBaseMap()
    
    var newCoords = map.center
    d3.select("#chicagoTract").style("cursor","pointer").on("click",function(){  
        newCoords = {lat:41.788268,lng: -87.598644}
        map.setZoom(10)
        map.panTo(newCoords);
    })
    d3.select("#miamiTract").style("cursor","pointer").on("click",function(){ 
        var miami = {lat:25.759687, lng: -80.201221}
        map.setZoom(8.5)
        map.panTo(miami)    
    })
    
    d3.select("#nycTract").style("cursor","pointer").on("click",function(){
        var newYork = {lat:40.767680, lng:-73.975193}
        map.setZoom(10)
        map.panTo(newYork)  
    })
 
    d3.select("#cityRank").style("cursor","pointer").on("click",function(){
        sortableTable(diversityScores,centroidsById,tractTopoFeaturesById,msaTractDictionary,tractData,colors,svg,projection,msaData,msaTopoFeaturesById)
    })
    d3.select("#cityPlot").style("cursor","pointer").on("click",function(){
        plot(diversityScores,centroidsById,tractTopoFeaturesById,msaTractDictionary,tractData,colors,svg,projection,msaData,msaTopoFeaturesById)
    })
}



function drawBaseMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/jjjiia123/cio0du5yv002fagkled2g604q', //hosted style id
        center:[-85,41.788268], // starting position
        zoom:3 // starting zoom
    })
    return map
}
