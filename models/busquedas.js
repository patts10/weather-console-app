const fs = require('fs');

const axios = require('axios');

class Busquedas {
  

  historial = [ 'Lima', 'Santiago', 'Buenos Aires'];
  dbPath = './db/database.json';

  constructor() {
    //TOD: leer DB si existe
    this.leerDB();

  }

  get historialCapitalizado() {
    return this.historial.map( (lugar) => {
      let words = lugar.split(' ');
      words = words.map( word => word[0].toUpperCase() + word.substring(1) );
      return words.join(' ');
    });
  }

  get paramsMapbox() {
    return {
      'access_token': process.env.MAPBOX_KEY,
      'limit': 5,
      'language': 'es'
    }
  }

  get paramsOpenWeather() {
    return {
      'appid': process.env.OPENWEATHER_KEY,
      'units': 'metric',
      'lang': 'es'
    }
  }

  async ciudad( lugar = '' ) {

    try {

      //Peticion http
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
        params: this.paramsMapbox
      })

      const resp = await instance.get();
      return resp.data.features.map( lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1]

      }));

      
    } catch (error) {
      return [];
    }
  }

  async climaLugar( lat, lon ) {
    
    try {
      
      //instance axios.create
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ lon }`,
        params: { ...this.paramsOpenWeather, lat, lon  }
      });
  
      const resp = await instance.get();
      const { weather, main } = resp.data;
      return {
        desc:  weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = '' ) {
  
    //TODO: prevenit duplicados

    if ( this.historial.includes( lugar.toLowerCase() )) {
      return;
    }
    this.historial = this.historial.splice( 0, 5 );

    this.historial.unshift(lugar.toLowerCase() );

    //Grabar en DB
    this.guardarDB();
  }

  guardarDB() {
    const payLoad = {
      historial: this.historial
    };
  
    fs.writeFileSync( this.dbPath, JSON.stringify(payLoad) );
  }


  leerDB() {
    if ( !fs.existsSync(this.dbPath) ) return;
      
      const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'});
      const data = JSON.parse(info);

      this.historial = data.historial;

    
  }


}



module.exports = Busquedas;