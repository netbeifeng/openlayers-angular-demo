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
    {id: 2, name: "RKI Corona Bundesland"},
    {id: 3, name: "Regierungsbezirke"},
    {id: 4, name: "Kreise"},
    {id: 4, name: "RKI Corona Kreise"},
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

  tileLayer_paperMap = new TileLayer({
    source: new TileJSON({ 
      url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1',
      crossOrigin: '',
    }),
  });

  tileLayer_osm = new TileLayer({
    source: new OSM() // OpenStreetMap Source
  });

  tileLayer_bing_dark = new TileLayer({
    visible: true,
    preload: Infinity,
    source: new BingMaps({
      key: 'Ai6fp2ODdb5HRAEOI7nWAjEozFtB528VYoh0YMLhJpJpIry4fCpmxkmj7LL5RbRr', // app id
      imagerySet: "CanvasDark", // style of Bing Map
      maxZoom: 19
    })
  })

  tileLayer_bing_light = new TileLayer({
    visible: true,
    preload: Infinity,
    source: new BingMaps({
      key: 'Ai6fp2ODdb5HRAEOI7nWAjEozFtB528VYoh0YMLhJpJpIry4fCpmxkmj7LL5RbRr',
      imagerySet: "RoadOnDemand",
      maxZoom: 19
    })
  })

  tileLayer_bing_satellit = new TileLayer({
    visible: true,
    preload: Infinity,
    source: new BingMaps({
      key: 'Ai6fp2ODdb5HRAEOI7nWAjEozFtB528VYoh0YMLhJpJpIry4fCpmxkmj7LL5RbRr',
      imagerySet: "AerialWithLabelsOnDemand",
      maxZoom: 19
    })
  })

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
      this.setTileLayer(this.tileLayer_paperMap);
    } else if(this.select_mapSource == "OpenStreetMap") {
      this.setTileLayer(this.tileLayer_osm);
    } else if(this.select_mapSource == "BingMap_Dark") {
      this.setTileLayer(this.tileLayer_bing_dark);
    } else if(this.select_mapSource == "BingMap_Light") {
      this.setTileLayer(this.tileLayer_bing_light);
    } else if(this.select_mapSource == "BingMap_Satellit") {
      this.setTileLayer(this.tileLayer_bing_satellit);
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
   *  Corona: https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0
   * }
   * @author Chang
   * @date 24.10.2020
   */
  onChange_geoJson(e) { 
    console.log(e);
    
    this.select_geoJson = e;
    var style = this.style;
    var _that = this;
    style.getFill().setColor("rgba(255, 255, 255, 0.6)")
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
      this.setVectorLayer(vectorLayer_land);
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
      this.setVectorLayer(vectorLayer_bundesland);
    } else if(this.select_geoJson == "RKI Corona Bundesland") {
      var vectorLayer_corona_bundesland = new VectorLayer({
        source: new VectorSource({
          url: 'https://opendata.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0.geojson',
          format: new GeoJSON(),
        }),
        style: function (feature) {
          style.getText().setText(feature.get('LAN_ew_GEN'));
          let cases = feature.get('Fallzahl');
          let faelle_100000_EW = feature.get('faelle_100000_EW');
          _that.setFillColor_bundesland(style,faelle_100000_EW);
          var _style = new Style({ 
            text: new Text({
              font: 'bold 20px Helvetica',
              text: String(cases),
              offsetY: 25,
              fill: new Fill({
                color: '#000',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 3,
              }),
            }),
          });
          return [style,_style];
        },
      });
      this.setVectorLayer(vectorLayer_corona_bundesland);
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
      this.setVectorLayer(vectorLayer_regierungsbezirke);
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
      this.setVectorLayer(vectorLayer_kreise);
    } else if (this.select_geoJson == "RKI Corona Kreise") {
      var vectorLayer_corona_kreise = new VectorLayer({
        source: new VectorSource({
          url: 'https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson',
          format: new GeoJSON(),
        }),
        style: function (feature) {
          style.getText().setText(feature.get('GEN'));
          let cases = feature.get('cases');
          let cases7_per_100k = feature.get('cases7_per_100k');
          _that.setFillColor_kreis(style,cases7_per_100k);
          var _style = new Style({ 
            text: new Text({
              font: 'bold 20px Helvetica',
              text: String(cases),
              offsetY: 25,
              fill: new Fill({
                color: '#000',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 3,
              }),
            }),
          });
          return [style,_style];
        },
      });
      this.setVectorLayer(vectorLayer_corona_kreise);
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

  /** setTileLayer
   * setMapSourceTileLayer
   * @param layer -> new Layer
   * @author Chang
   * @date 25.10.2020
   */
  setTileLayer(layer) {
    if(this.tileLayer == null) {
      this.map.addLayer(layer);
      this.tileLayer = layer;
    } else {
      this.map.removeLayer(this.tileLayer);
      this.map.addLayer(layer);
      this.tileLayer = layer;
    }
  }

  /** setVectorLayer
   * setGeoJSONVectorLayerLayer
   * @param layer -> new Layer
   * @author Chang
   * @date 25.10.2020
   */
  setVectorLayer(layer) {
    if(this.vectorLayer == null) {
      this.map.addLayer(layer);
      this.vectorLayer = layer;
    } else {
      this.map.removeLayer(this.vectorLayer);
      this.map.addLayer(layer);
      this.vectorLayer = layer;
    }
  }

  setFillColor_bundesland(style,index) {
    if(index < 178) {
      style.getFill().setColor('#D3D3D3');
    } else if(index < 272 && index >= 178) {
      style.getFill().setColor('#D2D0AD');
    } else if(index < 394 && index >= 272) {
      style.getFill().setColor('#D1CF88');
    } else if(index < 536 && index >= 394) {
      style.getFill().setColor('#CB9527');
    } else if(index < 637 && index >= 536) {
      style.getFill().setColor('#AC2038');
    } else if(index >= 637) {
      style.getFill().setColor('#8A0720');
    }
  }

  setFillColor_kreis(style,index) {
    if(index == 0) {
      style.getFill().setColor('#D3D3D3');
    } else if(index <= 5 && index > 0) {
      style.getFill().setColor('#D2D0AD');
    } else if(index <= 25 && index > 5) {
      style.getFill().setColor('#D1CF88');
    } else if(index <= 50 && index > 25) {
      style.getFill().setColor('#CB9527');
    } else if(index <= 100 && index > 50) {
      style.getFill().setColor('#AC2038');
    } else if(index > 100) {
      style.getFill().setColor('#8A0720');
    }
  }
}
