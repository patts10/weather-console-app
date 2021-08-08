
require('dotenv').config();


const { leerInput, pausa, inquirerMenu, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');


const main = async() => {

  const busquedas = new Busquedas();
  let opt;

  do {

    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // Mostrar mensaje
        const termino =  await leerInput('Ciudad: ');       
        
        // Buscar los lugares 
        const lugares = await busquedas.ciudad( termino ); 
        
        //Seleccionar el lugar
        const id = await listarLugares( lugares );

        if ( id === '0' ) continue;

        //Guardar en DB
        
        const lugarSel = lugares.find( lugar => lugar.id == id);
        busquedas.agregarHistorial(( lugarSel.nombre ));
        const { nombre, lng, lat } = lugarSel;

        // Clima
        const clima = await busquedas.climaLugar( lat, lng);


        //Mostrar resultados
        console.clear();
        console.log('\nInofrmacion de la ciudad\n'.green);
        console.log( 'Ciudad: ', nombre.green );
        console.log( 'Lat: ', lat );
        console.log( 'Lng: ', lng );
        console.log( 'Tempertura: ', clima.temp );
        console.log( 'Minima: ', clima.min );
        console.log( 'Maxima: ', clima.max );
        console.log( 'Como está el clima: ', clima.desc.green );
        

        break;
      case 2:
        busquedas.historialCapitalizado.forEach( (lugar, i) => {
          idx = `${ i + 1 }.`.green;
          console.log( `${ idx } ${ lugar } ` );
        });
      
  
        break;
      case 0:
        
        break;
    }
    
    if (opt !== 0) await pausa;

  } while (opt !== 0);




}

main();
