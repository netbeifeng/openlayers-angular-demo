import { Component, OnInit } from '@angular/core';
import { InitService } from '../init.service';
// import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import Polyline from 'ol/format/Polyline';
import BingMaps from 'ol/source/BingMaps';
import {Icon, Style, Circle as CircleStyle} from 'ol/style';
import {Fill, Stroke, Text} from 'ol/style';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';
import GPX from 'ol/format/GPX';
import VectorSource from 'ol/source/Vector';
import TileJSON from 'ol/source/TileJSON';
import GeoJSON from 'ol/format/GeoJSON';
import ZoomSlider from 'ol/control/ZoomSlider';
import {defaults as defaultControls} from 'ol/control';
// import GeoJSON from 'ol/source/GeoJSON';

@Component({
  selector: 'app-demo1',
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.sass']
})
export class Demo1Component implements OnInit {
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
  ];
  gpx = [
    {id: -1, name: ""},
    {id: 0, name: "Veloroute 09: Mitte-Ricklingen"},
    {id: 1, name: "Veloroute 03: Mitte-Lahe"},
    {id: 2, name: "Veloroute 12: Mitte-Stöcken"},
  ]

  showWappen = [
    { value: 'toggled' },
    { value: 'untoggled' },
  ];

  tileLayer:TileLayer = null;
  vectorLayer:VectorLayer = null;

  wappenLayer_id = undefined;
  gpxLayer_id = undefined;

  select_mapSource:string = null; 
  select_geoJson:string = null; 
  select_gpx:string = null;
  checkbox_showWappen:boolean = false;

  map:any = undefined;

  style:any = undefined;
  highlightStyle:any = undefined;



  bundesland_array:any = new Array();

  onChange_mapSource(newValue) {
    this.select_mapSource = newValue;
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
        this.tileLayer = null;
        this.map.addLayer(tileLayer_paperMap);
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
          this.tileLayer = null;
          this.map.addLayer(tileLayer_osm);
        }
    } else if(this.select_mapSource == "BingMap_Dark") {
      var tileLayer_bing = new TileLayer({
        visible: true,
        preload: Infinity,
        source: new BingMaps({
          key: 'Ai6fp2ODdb5HRAEOI7nWAjEozFtB528VYoh0YMLhJpJpIry4fCpmxkmj7LL5RbRr',
          imagerySet: "CanvasDark",
          maxZoom: 19
        })
      })
      if(this.tileLayer == null) {
        this.map.addLayer(tileLayer_bing);
        this.tileLayer = tileLayer_bing;
      } else {
        this.map.removeLayer(this.tileLayer);
        this.tileLayer = null;
        this.map.addLayer(tileLayer_bing);
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
        this.tileLayer = null;
        this.map.addLayer(tileLayer_bing);
      }
    } else {
      if(this.tileLayer != null) {
        this.map.removeLayer(this.tileLayer);
        this.tileLayer = null;
      }
    }
  }
  onChange_geoJson(newValue) {
    this.select_geoJson = newValue;
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
        this.vectorLayer = null;
        this.map.addLayer(vectorLayer_land);
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
        this.vectorLayer = null;
        this.map.addLayer(vectorLayer_bundesland);
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
        this.vectorLayer = null;
        this.map.addLayer(vectorLayer_regierungsbezirke);
      }
    } else {
      if(this.vectorLayer != null) {
        this.map.removeLayer(this.vectorLayer);
        this.vectorLayer = null;
      }
    }
  }

  onChange_gpx(newValue) {
    this.select_geoJson = newValue;
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
      }
    }
  }

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

  constructor(private init: InitService) {
    
    this.style = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)',
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

    this.highlightStyle = new Style({
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
    var highlightStyle = this.highlightStyle;


    var map = new Map({
      target: 'map',
      controls: defaultControls().extend([new ZoomSlider()]),
      layers: [],
      view: new View({
        center: olProj.fromLonLat([9.723971 ,52.353564]),
        zoom: 8
      })
    });

    this.map = map;

    var featureOverlay = new VectorLayer({
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


    
    this.map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }
      var pixel = evt.map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
    });
  }
}
