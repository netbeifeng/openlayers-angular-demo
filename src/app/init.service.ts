import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';
import {Icon, Style} from 'ol/style';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor() { }
  
  initBundesArray(bundesland_array) {
    var hsh = new Feature({
      geometry: new Point(fromLonLat([9.723971 ,52.353564])) // Hochschule Hannover
    });
    var bundesland_BE = new Feature({
      geometry: new Point(fromLonLat([13.3884, 52.5169])), // Berlin
    });

    var bundesland_NI = new Feature({
      geometry: new Point(fromLonLat([9.7332, 52.3705])), // Hannover
    });

    var bundesland_BW = new Feature({
      geometry: new Point(fromLonLat([9.1770, 48.7823])), // Stuttgart
    });

    var bundesland_BY = new Feature({
      geometry: new Point(fromLonLat([11.5819, 48.1351])), // München
    });

    var bundesland_HB = new Feature({
      geometry: new Point(fromLonLat([8.8016, 53.0792])), // Bremen
    });

    var bundesland_BB = new Feature({
      geometry: new Point(fromLonLat([13.0585, 52.3961])), // Potsdam
    });

    var bundesland_HE = new Feature({
      geometry: new Point(fromLonLat([8.2397, 50.0782])), // Wiesbaden
    });

    var bundesland_HH = new Feature({
      geometry: new Point(fromLonLat([9.9936, 53.5510])), // Hamburg
    });

    var bundesland_MV = new Feature({
      geometry: new Point(fromLonLat([11.4131, 53.6293])), // Schwerin
    });

    var bundesland_NRW = new Feature({
      geometry: new Point(fromLonLat([6.7761, 51.2217])), // Düsseldorf
    });

    var bundesland_RP = new Feature({
      geometry: new Point(fromLonLat([8.2472, 49.9928])), // Mainz
    });

    var bundesland_SE = new Feature({
      geometry: new Point(fromLonLat([13.7383, 51.0508])), // Dresden
    });

    var bundesland_SH = new Feature({
      geometry: new Point(fromLonLat([10.1348, 54.3213])), // Kiel
    });

    var bundesland_SL = new Feature({
      geometry: new Point(fromLonLat([6.9816, 49.2354])), // Saarbrücken
    });

    var bundesland_ST = new Feature({
      geometry: new Point(fromLonLat([11.6166, 52.1333])), // Magdeburg
    });

    var bundesland_TH = new Feature({
      geometry: new Point(fromLonLat([11.0328, 50.9787])), // Erfurt
    });

    hsh.setStyle(new Style({
      image: new Icon({
        crossOrigin: 'anonymous',
        imgSize: [1115, 626],
        scale: 0.1,
        src: 'https://upload.wikimedia.org/wikipedia/commons/6/63/HsH_Logo.png',
      }),
    })
  );

    bundesland_BE.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 164],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Coat_of_arms_of_Berlin.svg/100px-Coat_of_arms_of_Berlin.svg.png',
        }),
      })
    );

    bundesland_NI.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 115],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Coat_of_arms_of_Lower_Saxony.svg/100px-Coat_of_arms_of_Lower_Saxony.svg.png',
        }),
      })
    );

    bundesland_BW.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 140],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Coat_of_arms_of_Baden-W%C3%BCrttemberg_%28lesser%29.svg/100px-Coat_of_arms_of_Baden-W%C3%BCrttemberg_%28lesser%29.svg.png',
        }),
      })
    );

    bundesland_BY.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [98, 131],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Bayern_Wappen.svg/98px-Bayern_Wappen.svg.png',
        }),
      })
    );

    bundesland_HB.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 146],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Bremen_Wappen%28Mittel%29.svg/100px-Bremen_Wappen%28Mittel%29.svg.png',
        }),
      })
    );

    bundesland_BB.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 119],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Brandenburg_Wappen.svg/100px-Brandenburg_Wappen.svg.png',
        }),
      })
    );

    bundesland_HE.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 120],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Coat_of_arms_of_Hesse.svg/100px-Coat_of_arms_of_Hesse.svg.png',
        }),
      })
    );

    bundesland_HH.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 108],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Coat_of_arms_of_Hesse.svg/100px-Coat_of_arms_of_Hesse.svg.png',
        }),
      })
    );

    bundesland_MV.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 120],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Coat_of_arms_of_Mecklenburg-Western_Pomerania_%28great%29.svg/100px-Coat_of_arms_of_Mecklenburg-Western_Pomerania_%28great%29.svg.png',
        }),
      })
    );

    bundesland_NRW.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 115],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Coat_of_arms_of_North_Rhine-Westfalia.svg/100px-Coat_of_arms_of_North_Rhine-Westfalia.svg.png',
        }),
      })
    );

    bundesland_RP.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 121],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Coat_of_arms_of_Rhineland-Palatinate.svg/100px-Coat_of_arms_of_Rhineland-Palatinate.svg.png',
        }),
      })
    );

    bundesland_SE.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 113],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Coat_of_arms_of_Saxony.svg/100px-Coat_of_arms_of_Saxony.svg.png',
        }),
      })
    );

    bundesland_SH.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 117],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Coat_of_arms_of_Schleswig-Holstein.svg/100px-Coat_of_arms_of_Schleswig-Holstein.svg.png',
        }),
      })
    );

    bundesland_SL.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 123],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Wappen_des_Saarlands.svg/100px-Wappen_des_Saarlands.svg.png',
        }),
      })
    );

    bundesland_ST.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 121],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Wappen_Sachsen-Anhalt.svg/100px-Wappen_Sachsen-Anhalt.svg.png',
        }),
      })
    );

    bundesland_TH.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          imgSize: [100, 116],
          scale: 0.6,
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Coat_of_arms_of_Thuringia.svg/100px-Coat_of_arms_of_Thuringia.svg.png',
        }),
      })
    );

    bundesland_array.push(hsh);

    bundesland_array.push(bundesland_BE);
    bundesland_array.push(bundesland_NI);
    bundesland_array.push(bundesland_BW);
    bundesland_array.push(bundesland_BY);
    bundesland_array.push(bundesland_HB);
    bundesland_array.push(bundesland_BB);
    bundesland_array.push(bundesland_HE);
    bundesland_array.push(bundesland_HH);
    bundesland_array.push(bundesland_MV);
    bundesland_array.push(bundesland_NRW);
    bundesland_array.push(bundesland_RP);
    bundesland_array.push(bundesland_SE);
    bundesland_array.push(bundesland_SH);
    bundesland_array.push(bundesland_SL);
    bundesland_array.push(bundesland_ST);
    bundesland_array.push(bundesland_TH);
  }
}
