var map, geojson;
var selected, features, layer_name, layerControl;
var content;
var popup = L.popup();



map = L.map('map', {

    //crs: L.CRS.EPSG4326,
    center: [-6.77755,39.26428],
    zoom: 14.2,
    zoomControl: false
    //layers: [grayscale, cities]
});

/*var satellite = L.tileLayer('https://wi.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
   // maxZoom: 23,
	    attribution: 'Source: Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, USGS, Getmapping, Aerogrid, IGN, IGP, and the GIS User Community'
    }).addTo(map);
	
	var hillshade = L.tileLayer('https://whi.maptiles.arcgis.com/arcgis/rest/services/World_Hillshade/MapServer/tile/{z}/{y}/{x}', {
	//maxZoom: 19,
	attribution: 'Sources: Esri, Airbus DS, USGS, NGA, NASA, CGIAR, N Robinson, NCEAS, NLS, OS, NMA, Geodatastyrelsen, Rijkswaterstaat, GSA, Geoland, FEMA, Intermap, and the GIS user community',
});*/

var satellite = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 23,
	
    attributions: ['Powered by Esri',
        'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
    ],
    id: 'mapbox/light-v9',
    //tileSize: 256,
    //zoomOffset: -1
}).addTo(map);
var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var DAWASA = L.tileLayer.wms('http://localhost:8080/geoserver/DAWASA/wms?',{
layers: 'DAWASA:ALL LAYERS',
 transparent: 'true',
    format: 'image/png'
}).addTo(map);
/*var india_district = L.tileLayer.wms('http://localhost:8080/geoserver/india/wms?',{
layers: 'india:india_district',
 transparent: 'true',
    format: 'image/png'
}).addTo(map);*/


var overlays = L.layerGroup();
//overlays.addLayer(india_state,'india_state');
//overlays.addLayer(india_district,'india_district');
layerControl = L.control.layers().addTo(map);
var base = L.layerGroup();

base.addLayer(satellite, 'satellite');
base.addLayer(OSM, 'OSM');

layerControl.addBaseLayer(satellite, "satellite");
layerControl.addBaseLayer(OSM, "OSM");
layerControl.addOverlay(DAWASA,"ALL LAYERS");

//layerControl.addOverlay(india_state,"india_state");
//layerControl.addOverlay(india_district,"india_district");


//layerControl.add(base);
//L.control.layers().addTo(map);
//layerControl = L.control.layers().addTo(map);

//L.control.layers.addOverlay(DAWASA,"test").addTo(map);
//layerControl.addBaseLayer(satellite,"satellite");
//layerControl.addBaseLayer(OSM,"OSM");




// Zoom bar
var zoom_bar = new L.Control.ZoomBar({
    position: 'topleft'
}).addTo(map);
//map.addControl(new L.Control.Zoomslider());

// mouse position
L.control.mousePosition({
    position: 'bottomleft',
    prefix: "lat : long",
}).addTo(map);

//scale
L.control.scale({
    position: 'bottomleft'
}).addTo(map);

//geocoder
L.Control.geocoder({
    position: 'topright'
}).addTo(map);

//line mesure
L.control.polylineMeasure({
    position: 'topleft',
    unit: 'kilometres',
    showBearings: true,
    clearMeasurementsOnStop: false,
    showClearControl: true,
    showUnitControl: true
}).addTo(map);
//area measure
var measureControl = new L.Control.Measure({
    position: 'topleft'
	
});
measureControl.addTo(map);

//search
map.addControl(L.control.search({
    position: 'topleft'
}));


//legend
function legend() {

    $('#legend').empty();
    var layers = overlays.getLayers();
    //console.log(no_layers[0].options.layers);
    //console.log(no_layers);
    //var no_layers = overlays.getLayers().get('length');

    var head = document.createElement("h8");

    var txt = document.createTextNode("Legend");

    head.appendChild(txt);
    var element = document.getElementById("legend");
    element.appendChild(head);
	overlays.eachLayer(function (layer) {
	
	var head = document.createElement("p");

        var txt = document.createTextNode(layer.options.layers);
        //alert(txt[i]);
        head.appendChild(txt);
        var element = document.getElementById("legend");
        element.appendChild(head);
	 var img = new Image();
	  img.src = "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +layer.options.layers;
	  var src = document.getElementById("legend");
        src.appendChild(img);
    
});
	
   
}

legend();


// layer dropdown query
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/geoserver/DAWASA/wfs?request=getCapabilities",
        dataType: "xml",
        success: function(xml) {
            var select = $('#layer');
            $(xml).find('FeatureType').each(function() {
                //var title = $(this).find('ows:Operation').attr('name');
                //alert(title);
                var name = $(this).find('Name').text();
                //select.append("<option/><option class='ddheader' value='"+ name +"'>"+title+"</option>");
                $(this).find('Name').each(function() {
                    var value = $(this).text();
                    select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
                });
            });
            //select.children(":first").text("please make a selection").attr("selected",true);
        }
    });
});


// attribute dropdown		
$(function() {
    $("#layer").change(function() {

        var attributes = document.getElementById("attributes");
        var length = attributes.options.length;
        for (i = length - 1; i >= 0; i--) {
            attributes.options[i] = null;
        }

        var value_layer = $(this).val();


        attributes.options[0] = new Option('Select attributes', "");
        //  alert(url);

        $(document).ready(function() {
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" + value_layer,
                dataType: "xml",
                success: function(xml) {

                    var select = $('#attributes');
                    //var title = $(xml).find('xsd\\:complexType').attr('name');
                    //	alert(title);
                    $(xml).find('xsd\\:sequence').each(function() {

                        $(this).find('xsd\\:element').each(function() {
                            var value = $(this).attr('name');
                            //alert(value);
                            var type = $(this).attr('type');
                            //alert(type);
                            if (value != 'geom' && value != 'the_geom') {
                                select.append("<option class='ddindent' value='" + type + "'>" + value + "</option>");
                            }
                        });

                    });
                }
            });
        });


    });
});

// operator combo
$(function() {
    $("#attributes").change(function() {

        var operator = document.getElementById("operator");
        var length = operator.options.length;
        for (i = length - 1; i >= 0; i--) {
            operator.options[i] = null;
        }

        var value_type = $(this).val();
        // alert(value_type);
        var value_attribute = $('#attributes option:selected').text();
        operator.options[0] = new Option('Select operator', "");

        if (value_type == 'xsd:short' || value_type == 'xsd:int' || value_type == 'xsd:double' || value_type == 'xsd:long') {
            var operator1 = document.getElementById("operator");
            operator1.options[1] = new Option('Greater than', '>');
            operator1.options[2] = new Option('Less than', '<');
            operator1.options[3] = new Option('Equal to', '=');
			 operator1.options[4] = new Option('Between', 'BETWEEN');
        } else if (value_type == 'xsd:string') {
            var operator1 = document.getElementById("operator");
            operator1.options[1] = new Option('Like', 'ILike');

        }

    });
});

// function for finding row in the table when feature selected on map
function findRowNumber(cn1, v1) {

    var table = document.querySelector('#table');
    var rows = table.querySelectorAll("tr");
    var msg = "No such row exist"
    for (i = 1; i < rows.length; i++) {
        var tableData = rows[i].querySelectorAll("td");
        if (tableData[cn1 - 1].textContent == v1) {
            msg = i;
            break;
        }
    }
    return msg;
}

// function for loading query

function query() {

    $('#table').empty();
    if (geojson) {
        map.removeLayer(geojson);

    }


    //alert('jsbchdb');	
    var layer = document.getElementById("layer");
    var value_layer = layer.options[layer.selectedIndex].value;
    //alert(value_layer);

    var attribute = document.getElementById("attributes");
    var value_attribute = attribute.options[attribute.selectedIndex].text;
    //alert(value_attribute);

    var operator = document.getElementById("operator");
    var value_operator = operator.options[operator.selectedIndex].value;
    //alert(value_operator);

    var txt = document.getElementById("value");
    var value_txt = txt.value;

    if (value_operator == 'ILike') {
        value_txt = "'" + value_txt + "%25'";
        //alert(value_txt);
        //value_attribute = 'strToLowerCase('+value_attribute+')';
    } else {
        value_txt = value_txt;
        //value_attribute = value_attribute;
    }
    //alert(value_txt);




    var url = "http://localhost:8080/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=" + value_attribute + "%20" + value_operator + "%20" + value_txt + "&outputFormat=application/json"
    //console.log(url);
    $.getJSON(url, function(data) {

        geojson = L.geoJson(data, {
            onEachFeature: onEachFeature
        });
        geojson.addTo(map);
        map.fitBounds(geojson.getBounds());

        var col = [];
        col.push('id');
        for (var i = 0; i < data.features.length; i++) {

            for (var key in data.features[i].properties) {

                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }



        var table = document.createElement("table");


        //table.setAttribute("class", "table table-bordered");
        table.setAttribute("class", "table table-hover table-striped");
        table.setAttribute("id", "table");
		
		var caption = document.createElement("caption");
        caption.setAttribute("id", "caption");
caption.style.captionSide = 'top';
caption.innerHTML = value_layer+" (Number of Features : "+data.features.length+" )";
table.appendChild(caption);
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1); // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th"); // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.features.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if (j == 0) {
                    tabCell.innerHTML = data.features[i]['id'];
                } else {
                    //alert(data.features[i]['id']);
                    tabCell.innerHTML = data.features[i].properties[col[j]];
                    //alert(tabCell.innerHTML);
                }
            }
        }



        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("table_data");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);

        addRowHandlers();

        document.getElementById('map').style.height = '71%';
        document.getElementById('table_data').style.height = '29%';
        map.invalidateSize();




    });


}

// highlight the feature on map and table on map click
function onEachFeature(feature, layer) {

    layer.on('click', function(e) {
        // e = event

        // Reset selected to default style
        if (selected) {
            // Reset selected to default style
            geojson.resetStyle(selected);
        }

        selected = e.target;

        selected.setStyle({
            'color': 'red'
        });

        if (feature) {

            console.log(feature);
            $(function() {
                $("#table td").each(function() {
                    $(this).parent("tr").css("background-color", "white");
                });
            });


        }

        var table = document.getElementById('table');
        var cells = table.getElementsByTagName('td');
        var rows = document.getElementById("table").rows;
        var heads = table.getElementsByTagName('th');
        var col_no;
        for (var i = 0; i < heads.length; i++) {
            // Take each cell
            var head = heads[i];
            //alert(head.innerHTML);
            if (head.innerHTML == 'id') {
                col_no = i + 1;
                //alert(col_no);
            }

        }
        var row_no = findRowNumber(col_no, feature.id);
        //alert(row_no);

        var rows = document.querySelectorAll('#table tr');

        rows[row_no].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        $(document).ready(function() {
            $("#table td:nth-child(" + col_no + ")").each(function() {

                if ($(this).text() == feature.id) {
                    $(this).parent("tr").css("background-color", "grey");

                }
            });
        });
    });




};

// highlight the feature on map and table on row select in table
function addRowHandlers() {
    var rows = document.getElementById("table").rows;
    var heads = table.getElementsByTagName('th');
    var col_no;
    for (var i = 0; i < heads.length; i++) {
        // Take each cell
        var head = heads[i];
        //alert(head.innerHTML);
        if (head.innerHTML == 'id') {
            col_no = i + 1;
            //alert(col_no);
        }

    }
    for (i = 0; i < rows.length; i++) {



        rows[i].onclick = function() {
            return function() {
                //featureOverlay.getSource().clear();
                if (geojson) {
                    geojson.resetStyle();
                }
                $(function() {
                    $("#table td").each(function() {
                        $(this).parent("tr").css("background-color", "white");
                    });
                });
                var cell = this.cells[col_no - 1];
                var id = cell.innerHTML;


                $(document).ready(function() {
                    $("#table td:nth-child(" + col_no + ")").each(function() {
                        if ($(this).text() == id) {
                            $(this).parent("tr").css("background-color", "grey");
                        }
                    });
                });

                features = geojson.getLayers();

                for (i = 0; i < features.length; i++) {



                    if (features[i].feature.id == id) {
                        //alert(features[i].feature.id);
                        //featureOverlay.getSource().addFeature(features[i]);
                        selected = features[i];
                        selected.setStyle({
                            'color': 'red'
                        });
                        map.fitBounds(selected.getBounds());
                        console.log(selected.getBounds());
                    }
                }

                //alert("id:" + id);
            };
        }(rows[i]);
    }
}

//list of wms_layers_ in window on click of button

function wms_layers() {

   
     
  $("#wms_layers_window").modal({backdrop: false});
  //$("#wms_layers_window").draggable();
  $("#wms_layers_window").modal('show');
 
    

    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/geoserver/DAWASA/wms?request=getCapabilities",
            dataType: "xml",
            success: function(xml) {
                $('#table_wms_layers').empty();
                // console.log("here");
                $('<tr></tr>').html('<th>Name</th><th>Title</th><th>Abstract</th>').appendTo('#table_wms_layers');
                $(xml).find('Layer').find('Layer').each(function() {
                    var name = $(this).children('Name').text();
                    // alert(name);
                    //var name1 = name.find('Name').text();
                    //alert(name);
                    var title = $(this).children('Title').text();

                    var abst = $(this).children('Abstract').text();
                    //   alert(abst);


                    //   alert('test');
                    $('<tr></tr>').html('<td>' + name + '</td><td>' + title + '</td><td>' + abst + '</td>').appendTo('#table_wms_layers');
                    //document.getElementById("table_wms_layers").setAttribute("class", "table-success");

                });
                addRowHandlers1();
            }
        });
    });




    function addRowHandlers1() {
        //alert('knd');
        var rows = document.getElementById("table_wms_layers").rows;
        var table = document.getElementById('table_wms_layers');
        var heads = table.getElementsByTagName('th');
        var col_no;
        for (var i = 0; i < heads.length; i++) {
            // Take each cell
            var head = heads[i];
            //alert(head.innerHTML);
            if (head.innerHTML == 'Name') {
                col_no = i + 1;
                //alert(col_no);
            }

        }
        for (i = 0; i < rows.length; i++) {

            rows[i].onclick = function() {
                return function() {

                    $(function() {
                        $("#table_wms_layers td").each(function() {
                            $(this).parent("tr").css("background-color", "white");
                        });
                    });
                    var cell = this.cells[col_no - 1];
                    layer_name = cell.innerHTML;
                    // alert(layer_name);

                    $(document).ready(function() {
                        $("#table_wms_layers td:nth-child(" + col_no + ")").each(function() {
                            if ($(this).text() == layer_name) {
                                $(this).parent("tr").css("background-color", "grey");



                            }
                        });
                    });

                    //alert("id:" + id);
                };
            }(rows[i]);
        }

    }

}
// add wms layer to map on click of button
function add_layer() {
    //	alert("jd"); 

    //alert(layer_name);
    //map.removeControl(layerSwitcher);

    var name = layer_name.split(":");
    //alert(layer_name);
    var layer_wms = L.tileLayer.wms('http://localhost:8080/geoserver/wms?', {
        layers: layer_name,
        transparent: 'true',
        format: 'image/png'
		
    }).addTo(map);
    //layerControl.addOverlay(india_district,"india_district");

    layerControl.addOverlay(layer_wms, layer_name);
    overlays.addLayer(layer_wms, layer_name);


    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/geoserver/wms?request=getCapabilities",
            dataType: "xml",
            success: function(xml) {


                $(xml).find('Layer').find('Layer').each(function() {
                    var name = $(this).children('Name').text();
                    // alert(name);
                    if (name == layer_name) {
                        // use this for getting the lat long of the extent
                        var bbox1 = $(this).children('EX_GeographicBoundingBox').children('southBoundLatitude').text();
                        var bbox2 = $(this).children('EX_GeographicBoundingBox').children('westBoundLongitude').text();
                        var bbox3 = $(this).children('EX_GeographicBoundingBox').children('northBoundLatitude').text();
                        var bbox4 = $(this).children('EX_GeographicBoundingBox').children('eastBoundLongitude').text();
                        var southWest = L.latLng(bbox1, bbox2);
                        var northEast = L.latLng(bbox3, bbox4);
                        var bounds = L.latLngBounds(southWest, northEast);
                        map.fitBounds(bounds);

                        // use below code for getting the extent in the projection defined in geoserver

                        /* $(this).find('BoundingBox').each(function(){
                         if ($(this).attr('CRS') != "CRS:84" ){
                         var bbox1 = $(this).attr('minx');
                         var bbox2 = $(this).attr('miny');
                         var bbox3 = $(this).attr('maxx');
                         var bbox4 = $(this).attr('maxy');
                         var southWest = L.latLng(bbox1, bbox2);
                         var northEast = L.latLng(bbox3, bbox4);
                         var bounds = L.latLngBounds(southWest, northEast);
                          map.fitBounds(bounds);
                         }
                         });*/

                        //  alert($(this).children('EX_GeographicBoundingBox').text());
                      if (bounds != undefined){alert(layer_name+" added to the map");}
                    }



                });

            }
        });
    });


    legend();

}

function close_wms_window(){
layer_name = undefined;
}

// function on click of getinfo
function info() {
    if (document.getElementById("info_btn").innerHTML == "☰ Activate GetInfo") {

        document.getElementById("info_btn").innerHTML = "☰ De-Activate GetInfo";
        document.getElementById("info_btn").setAttribute("class", "btn btn-danger btn-sm");
        map.on('click', getinfo);
    } else {

        map.off('click', getinfo);
        document.getElementById("info_btn").innerHTML = "☰ Activate GetInfo";
        document.getElementById("info_btn").setAttribute("class", "btn btn-success btn-sm");

    }
}

// getinfo function
function getinfo(e) {


    //var url1 = test.getFeatureInfoUrl(e.latlng);
    //console.log(url1);
    
    var point = map.latLngToContainerPoint(e.latlng, map.getZoom());
    
    var bbox = map.getBounds().toBBoxString();
    var size = map.getSize();
    var height = size.y;
    var width = size.x;
    var x = point.x;
    var y = point.y;
    

   
   
    if (content) {
        content = '';
    }
	
	overlays.eachLayer(function (layer) {
	   var url = 'http://localhost:8080/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=' + layer.options.layers + '&LAYERS=' + layer.options.layers + '&INFO_FORMAT=text%2Fhtml&X=' + x + '&Y=' + y + '&CRS=EPSG%3A4326&STYLES=&WIDTH=' + width + '&HEIGHT=' + height + '&BBOX=' + bbox;
console.log(url);   
	   $.get(url, function(data) {
            //content.push(data);

            content += data;
            //console.log(content);

            popup.setContent(content);
            popup.setLatLng(e.latlng);
            map.openPopup(popup);


        });
	});
	
    

}


// clear function
function clear_all() {
    document.getElementById('map').style.height = '100%';
    document.getElementById('table_data').style.height = '0%';
    map.invalidateSize();
    $('#table').empty();
	 $('#legend').empty();
    //$('#table1').empty();
    if (geojson) {
        map.removeLayer(geojson);
    }
    map.flyTo([-6.77755, 39.26428], 14.5);

    document.getElementById("query_panel_btn").innerHTML = "☰ Open Query Panel";
	document.getElementById("query_panel_btn").setAttribute("class", "btn btn-success btn-sm");

    document.getElementById("query_tab").style.width = "0%";
    document.getElementById("map").style.width = "100%";
    document.getElementById("map").style.left = "0%";
    document.getElementById("query_tab").style.visibility = "hidden";
    document.getElementById('table_data').style.left = '0%';

    document.getElementById("legend_btn").innerHTML = "☰ Show Legend";
    document.getElementById("legend").style.width = "0%";
    document.getElementById("legend").style.visibility = "hidden";
    document.getElementById('legend').style.height = '0%';

    map.off('click', getinfo);
    document.getElementById("info_btn").innerHTML = "☰ Activate GetInfo";
    document.getElementById("info_btn").setAttribute("class", "btn btn-success btn-sm");
	
	overlays.eachLayer(function (layer) {
	map.removeLayer(layer);
	layerControl.removeLayer(layer);
	overlays.removeLayer(layer);
	
	});
	overlays.clearLayers();
	
		
    map.invalidateSize();

}

function show_hide_querypanel() {

    if (document.getElementById("query_tab").style.visibility == "hidden") {

	document.getElementById("query_panel_btn").innerHTML = "☰ Hide Query Panel";
        document.getElementById("query_panel_btn").setAttribute("class", "btn btn-danger btn-sm");
		document.getElementById("query_tab").style.visibility = "visible";
        document.getElementById("query_tab").style.width = "20%";
        document.getElementById("map").style.width = "79%";
        document.getElementById("map").style.left = "20%";
        
        document.getElementById('table_data').style.left = '20%';
        map.invalidateSize();
    } else {
        document.getElementById("query_panel_btn").innerHTML = "☰ Open Query Panel";
        document.getElementById("query_panel_btn").setAttribute("class", "btn btn-success btn-sm");
        document.getElementById("query_tab").style.width = "0%";
        document.getElementById("map").style.width = "100%";
        document.getElementById("map").style.left = "0%";
        document.getElementById("query_tab").style.visibility = "hidden";
        document.getElementById('table_data').style.left = '0%';

        map.invalidateSize();
    }
}

function show_hide_legend() {

    if (document.getElementById("legend").style.visibility == "hidden") {

        document.getElementById("legend_btn").innerHTML = "☰ Hide Legend";
		 document.getElementById("legend").style.visibility = "visible";
        document.getElementById("legend").style.width = "15%";
       
        document.getElementById('legend').style.height = '38%';
        map.invalidateSize();
    } else {
        document.getElementById("legend_btn").innerHTML = "☰ Show Legend";
        document.getElementById("legend").style.width = "0%";
        document.getElementById("legend").style.visibility = "hidden";
        document.getElementById('legend').style.height = '0%';

        map.invalidateSize();
    }
}