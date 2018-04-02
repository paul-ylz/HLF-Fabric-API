'use strict'

const flightNamespace = 'org.acme.airline.flight';
const flightType = 'Flight';

const bnUtil = require('./bn-connection-util')
bnUtil.connect(main)

function main(error) {
  if (error) {
    console.log(error)
    process.exit(1)
  }

  return bnUtil.connection.getAssetRegistry(flightNamespace+'.'+flightType).then(registry=>{
    console.log("registry: ", registry)
    var flights = [
      {
        flightNumber: 'AE101',
        origin: 'EWR',
        destination: 'ATL',
        schedule: new Date('2018-10-15T21:44Z')
      },
      {
        flightNumber: 'AE102',
        origin: 'EWA',
        destination: 'ATA',
        schedule: new Date('2018-10-16T21:44Z')
      },
      {
        flightNumber: 'AE103',
        origin: 'EWB',
        destination: 'ATB',
        schedule: new Date('2018-10-17T21:44Z')
      }
    ]
    addFlights(registry, flights)

  })
}

// Parameter is a AssetRegistry
function addFlights(registry, flights){
  const  bnDef = bnUtil.connection.getBusinessNetwork();
  const  factory = bnDef.getFactory();
  var dataArray = []
  flights.forEach(data => {
    let flightID = data.flightNumber+'-01-01-1010'
    let flightResource = factory.newResource(flightNamespace,flightType,flightID);
    flightResource.setPropertyValue('flightNumber',data.flightNumber);
    flightResource.route = factory.newConcept(flightNamespace,'Route');
    flightResource.route.setPropertyValue('origin', data.origin);
    flightResource.route.setPropertyValue('destination' , data.destination);
    flightResource.route.setPropertyValue('schedule' , data.schedule);

    dataArray.push(flightResource)
  })
  return registry.addAll(dataArray).then(()=>{
    console.log('Successfully created flights');
    bnUtil.disconnect();
  }).catch((error)=>{
    console.log('Error: ', error);
    bnUtil.disconnect();
  });
}

