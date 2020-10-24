import { Component, OnInit } from '@angular/core';
import { InitService } from '../init.service';

import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

import BingMaps from 'ol/source/BingMaps';
import { Style, Circle as CircleStyle, Fill, Stroke, Text} from 'ol/style';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import GPX from 'ol/format/GPX';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import TileJSON from 'ol/source/TileJSON';

@Component({
  selector: 'app-demo1',
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.sass']
})
export class Demo1Component implements OnInit {

  // Bind to Select-Tag in Templates
  mapSource = [
    {id: -1, name: ""},
    {id: 0, name: "OpenStreetMap"},
    {id: 1, name: "BingMap_Dark"},
    {id: 2, name: "BingMap_Light"},

  ];

  geoJson = [
    {id: -1, name: ""},
    {id: 0, name: "Land"},
    {id: 1, name: "Bundesland"},
    {id: 2, name: "Regierungsbezirke"},
    {id: 3, name: "Kreise"},
  ];

  gpx = [
    {id: -1, name: ""},
    {id: 0, name: "Veloroute 09: Mitte-Ricklingen"},
    {id: 1, name: "Veloroute 03: Mitte-Lahe"},
    {id: 2, name: "Veloroute 12: Mitte-Stöcken"},
  ]

  tileLayer:TileLayer = null; // current selected TileLayer => (PaperMap, BingMap, OpenStreetMap)
  vectorLayer:VectorLayer = null; // curently selected VectorLayer => (Land, Bundesland, Regierungsbezirk)

  wappenLayer_id = undefined; // current ol_uid of WappenLayer, store here the ol_uid of layer so that can be gracefully removed 
  gpxLayer_id = undefined; // current ol_uid of GPXLayer, same as above

  select_mapSource:string = null; // the name of current selected MapSource ["" ,"PaperMap", "BingMap", "OpenStreetMap"]
  select_geoJson:string = null;  // the name of current selected GeoJSON ["" ,"Land", "Bundesland", "Regierungsbezirk", "Kreise"]
  select_gpx:string = null; // same

  checkbox_showWappen:boolean = false; // check state of checkbox, default in false (Unchecked)

  map:any = undefined; // core - OpenLayers map Object

  style:any = undefined; // style for GeoJSON display
  highlightStyle:any = undefined; // highlight style for GeoJSON display (mouse hover => highlight)

  bundesland_array:any = new Array(); 

  /** constructor
   * Component Constructor 
   * @param init -> init Service to build *bundesland_array
   * @author Chang
   * @date 24.10.2020
   */
  constructor(private init: InitService) {
    
    this.style = new Style({ // init Style
      fill: new Fill({ 
        color: 'rgba(255, 255, 255, 0.6)', // white in opacity 0.6
      }),
      stroke: new Stroke({
        color: '#319FD3', 
        width: 1,
      }),
      text: new Text({
        font: '20px Helvetica',
        fill: new Fill({
          color: '#000',
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 3,
        }),
      }),
    });

    this.highlightStyle = new Style({ // init highlight Style
      stroke: new Stroke({
        color: '#f00',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(255,0,0,0.1)',
      }),
      text: new Text({
        font: '25px Helvetica',
        fill: new Fill({
          color: 'black',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 3,
        }),
      }),
    });

    init.initBundesArray(this.bundesland_array);
  }

  ngOnInit(){
    var map = new Map({ // map init
      target: 'map',
      layers: [],
      view: new View({
        center: olProj.fromLonLat([9.723971 ,52.353564]),
        zoom: 8
      })
    });

    this.map = map;


    var highlightStyle = this.highlightStyle;

    var featureOverlay = new VectorLayer({ // highlightLayer
      source: new VectorSource(),
      map: this.map,
      style: function (feature) {
        highlightStyle.getText().setText(feature.get('name'));
        return highlightStyle;
      },
    });

    var highlight;
    var displayFeatureInfo = function (pixel) {
      var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
     
      if (feature !== highlight) {
        if (highlight) {
          featureOverlay.getSource().removeFeature(highlight);
        }
        if (feature) {
          featureOverlay.getSource().addFeature(feature);
        }
        highlight = feature;
      }
    };

    map.on('pointermove', function (evt) { // listen on event pointermove on Map
      if (evt.dragging) {
        return; // if mouse dragging event return
      } 
      var pixel = evt.map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
    });
  }


  /** onChange_mapSource
   * @description onChange for MapSource Select-Tag
   * @param e => new value
   * @source {
   *  OSM: https://www.openstreetmap.org/
   *  BingMap: https://www.bing.com/maps
   *  PaperMap: https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1
   * }
   * @author Chang
   * @date 24.10.2020
   */
  onChange_mapSource(e) { 
    this.select_mapSource = e;
    if(this.select_mapSource == "PaperMap") {
      var tileLayer_paperMap = new TileLayer({
        source: new TileJSON({ 
          url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1',
          crossOrigin: '',
        }),
      });
      if(this.tileLayer == null) {
        this.map.addLayer(tileLayer_paperMap);
        this.tileLayer = tileLayer_paperMap;
      } else {
        this.map.removeLayer(this.tileLayer);
        this.map.addLayer(tileLayer_paperMap);
        this.tileLayer = tileLayer_paperMap;
      }
    }
    else if(this.select_mapSource == "OpenStreetMap") {
        var tileLayer_osm = new TileLayer({
          source: new OSM() // OpenStreetMap Source
        });
        if(this.tileLayer == null) {
          this.map.addLayer(tileLayer_osm);
          this.tileLayer = tileLayer_osm;
        } else {
          this.map.removeLayer(this.tileLayer);
          this.map.addLayer(tileLayer_osm);
          this.tileLayer = tileLayer_osm;
        }
    } else if(this.select_mapSource == "BingMap_Dark") {
      var tileLayer_bing = new TileLayer({
        visible: true,
        preload: Infinity,
        source: new BingMaps({
          key: 'Ai6fp2ODdb5HRAEOI7nWAjEozFtB528VYoh0YMLhJpJpIry4fCpmxkmj7LL5RbRr', // app id
          imagerySet: "CanvasDark", // style of Bing Map
          maxZoom: 19
        })
      })
      if(this.tileLayer == null) {
        this.map.addLayer(tileLayer_bing);
        this.tileLayer = tileLayer_bing;
      } else {
        this.map.removeLayer(this.tileLayer);
        this.map.addLayer(tileLayer_bing);
        this.tileLayer = null;
      }
    } else if(this.select_mapSource == "BingMap_Light") {
      var tileLayer_bing = new TileLayer({
        visible: true,
        preload: Infinity,
        source: new BingMaps({
          key: 'Ai6fp2ODdb5HRAEOI7nWAjEozFtB528VYoh0YMLhJpJpIry4fCpmxkmj7LL5RbRr',
          imagerySet: "RoadOnDemand",
          maxZoom: 19
        })
      })
      if(this.tileLayer == null) {
        this.map.addLayer(tileLayer_bing);
        this.tileLayer = tileLayer_bing;
      } else {
        this.map.removeLayer(this.tileLayer);
        this.map.addLayer(tileLayer_bing);
        this.tileLayer = tileLayer_bing;
      }
    } else if(this.select_mapSource == "BingMap_Satellit") {
      var tileLayer_bing = new TileLayer({
        visible: true,
        preload: Infinity,
        source: new BingMaps({
          key: 'Ai6fp2ODdb5HRAEOI7nWAjEozFtB528VYoh0YMLhJpJpIry4fCpmxkmj7LL5RbRr',
          imagerySet: "AerialWithLabelsOnDemand",
          maxZoom: 19
        })
      })
      if(this.tileLayer == null) {
        this.map.addLayer(tileLayer_bing);
        this.tileLayer = tileLayer_bing;
      } else {
        this.map.removeLayer(this.tileLayer);
        this.map.addLayer(tileLayer_bing);
        this.tileLayer = tileLayer_bing;
      }
    } else {
      if(this.tileLayer != null) {
        this.map.removeLayer(this.tileLayer);
        this.tileLayer = null;
      }
    }
  }

  /** onChange_geoJson
   * @description onChange for GeoJSON Select-Tag
   * @param e => new value
   * @source {
   *  Land: https://github.com/datasets/geo-countries
   *  Bundeslaender, Regierungsbezirke, Kreise: https://github.com/isellsoap/deutschlandGeoJSON
   * }
   * @author Chang
   * @date 24.10.2020
   */
  onChange_geoJson(e) { 
    this.select_geoJson = e;
    var style = this.style;
    if(this.select_geoJson == "Land") {
      var vectorLayer_land = new VectorLayer({
        source: new VectorSource({
          url: 'assets/countries.geo.json', 
          format: new GeoJSON(),
        }),
        style: function (feature) {
          style.getText().setText(feature.get('ADMIN'));
          return style;
        },
      });
      if(this.vectorLayer == null) {
        this.map.addLayer(vectorLayer_land);
        this.vectorLayer = vectorLayer_land;
      } else {
        this.map.removeLayer(this.vectorLayer);
        this.map.addLayer(vectorLayer_land);
        this.vectorLayer = vectorLayer_land;
      }
    } else if(this.select_geoJson == "Bundesland") {
      var vectorLayer_bundesland = new VectorLayer({
        source: new VectorSource({
          url: 'assets/bundesland.geo.json',
          format: new GeoJSON(),
        }),
        style: function (feature) {
          style.getText().setText(feature.get('name'));
          return style;
        },
      });
      if(this.vectorLayer == null) {
        this.map.addLayer(vectorLayer_bundesland);
        this.vectorLayer = vectorLayer_bundesland;
      } else {
        this.map.removeLayer(this.vectorLayer);
        this.map.addLayer(vectorLayer_bundesland);
        this.vectorLayer = vectorLayer_bundesland;
      }
    } else if(this.select_geoJson == "Regierungsbezirke") {
      var vectorLayer_regierungsbezirke = new VectorLayer({
        source: new VectorSource({
          url: 'assets/regierungsbezirke.geo.json',
          format: new GeoJSON(),
        }),
        style: function (feature) {
          style.getText().setText(feature.get('NAME_2'));
          return style;
        },
      });
      if(this.vectorLayer == null) {
        this.map.addLayer(vectorLayer_regierungsbezirke);
        this.vectorLayer = vectorLayer_regierungsbezirke;
      } else {
        this.map.removeLayer(this.vectorLayer);
        this.map.addLayer(vectorLayer_regierungsbezirke);
        this.vectorLayer = vectorLayer_regierungsbezirke;
      }
    } else if (this.select_geoJson == "Kreise") {
      var vectorLayer_kreise = new VectorLayer({
        source: new VectorSource({
          url: 'assets/kreise.geo.json',
          format: new GeoJSON(),
        }),
        style: function (feature) {
          style.getText().setText(feature.get('NAME_3'));
          return style;
        },
      });
      if(this.vectorLayer == null) {
        this.map.addLayer(vectorLayer_kreise);
        this.vectorLayer = vectorLayer_kreise;
      } else {
        this.map.removeLayer(this.vectorLayer);
        this.map.addLayer(vectorLayer_kreise);
        this.vectorLayer = vectorLayer_kreise;
      }
    } else {
      if(this.vectorLayer != null) {
        this.map.removeLayer(this.vectorLayer);
        this.vectorLayer = null;
      }
    }
  }

  /** onChange_gpx
   * @description onChange for GPX Select-Tag
   * @param e => new value
   * @source : [Velorouten-Netz Hannover] *(https://www.hannover.de/Leben-in-der-Region-Hannover/Mobilit%C3%A4t/Hannovers-sch%C3%B6nste-Radtouren/Lust-auf-Fahrrad/Velorouten-Netz-%E2%80%93-Sichtbarmachung-der-ersten-Routen)
   * {
   *    Veloroute 09: Mitte-Ricklingen (https://www.hannover.de/content/download/835587/21276615/file/Veloroute+03+Mitte+-+Lahe.gpx)
   *    Veloroute 03: Mitte-Lahe (https://www.hannover.de/content/download/835585/21276585/file/Veloroute+03+Mitte+-+Bothfeld.gpx)
   *    Veloroute 12: Mitte-Stöcken (https://www.hannover.de/content/download/835596/21276696/file/Veloroute+12+Mitte+-+St%C3%B6cken.gpx)
   * }
   * @author Chang
   * @date 24.10.2020
   */
  onChange_gpx(e) { 
    this.select_geoJson = e;
    var gdx_style = {
      'Point': new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: 'rgba(255,255,0,0.4)',
          }),
          radius: 5,
          stroke: new Stroke({
            color: '#ff0',
            width: 1,
          }),
        }),
      }),
      'LineString': new Style({
        stroke: new Stroke({
          color: '#f00',
          width: 3,
        }),
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          color: '#0f0',
          width: 3,
        }),
      }),
    };
    
    if(this.select_geoJson == "Veloroute 09: Mitte-Ricklingen") {
      var gpxLayer = new VectorLayer({
        source: new VectorSource({
          url: 'assets/Veloroute+09+Mitte+-+Ricklingen.gpx',
          format: new GPX(),
        }),
        style: function (feature) {
          return gdx_style[feature.getGeometry().getType()];
        },
      });
      if(this.gpxLayer_id == undefined) {
        this.map.addLayer(gpxLayer);
        this.gpxLayer_id = gpxLayer.ol_uid;
      } else {
        for(let layer of this.map.getLayers().array_) {
          if(layer.ol_uid == this.gpxLayer_id) {
            this.map.removeLayer(layer);
          }
        }
        this.map.addLayer(gpxLayer);
        this.gpxLayer_id = gpxLayer.ol_uid;
      }
    } else if(this.select_geoJson == "Veloroute 03: Mitte-Lahe") {
      var gpxLayer = new VectorLayer({
        source: new VectorSource({
          url: 'assets/Veloroute+03+Mitte+-+Lahe.gpx',
          format: new GPX(),
        }),
        style: function (feature) {
          return gdx_style[feature.getGeometry().getType()];
        },
      });
      if(this.gpxLayer_id == undefined) {
        this.map.addLayer(gpxLayer);
        this.gpxLayer_id = gpxLayer.ol_uid;
      } else {
        for(let layer of this.map.getLayers().array_) {
          if(layer.ol_uid == this.gpxLayer_id) {
            this.map.removeLayer(layer);
          }
        }
        this.map.addLayer(gpxLayer);
        this.gpxLayer_id = gpxLayer.ol_uid;
      }
    } else if(this.select_geoJson == "Veloroute 12: Mitte-Stöcken") {
      var gpxLayer = new VectorLayer({
        source: new VectorSource({
          url: 'assets/Veloroute+12+Mitte+-+Stöcken.gpx',
          format: new GPX(),
        }),
        style: function (feature) {
          return gdx_style[feature.getGeometry().getType()];
        },
      });
      if(this.gpxLayer_id == undefined) {
        this.map.addLayer(gpxLayer);
        this.gpxLayer_id = gpxLayer.ol_uid;
      } else {
        for(let layer of this.map.getLayers().array_) {
          if(layer.ol_uid == this.gpxLayer_id) {
            this.map.removeLayer(layer);
          }
        }
        this.map.addLayer(gpxLayer);
        this.gpxLayer_id = gpxLayer.ol_uid;
      }
    }
  }

  /** onChange_showWappen
   * @description onChange for Wappen Input(Checkbox)-Tag
   * @author Chang
   * @date 24.10.2020
   */
  onChange_showWappen() { 
    console.log(this.checkbox_showWappen);

    var vectorLayer_wappen = new VectorLayer({
      source: new VectorSource({
        features: this.bundesland_array,
      })
    });
    console.log(this.map.getLayers());
    if(this.checkbox_showWappen) {
      this.map.addLayer(vectorLayer_wappen);
      this.wappenLayer_id = vectorLayer_wappen.ol_uid;
    } else {
      for(let layer of this.map.getLayers().array_) {
        if(layer.ol_uid == this.wappenLayer_id) {
          this.map.removeLayer(layer);
        }
      }
    }
  }
}
