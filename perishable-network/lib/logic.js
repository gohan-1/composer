/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getParticipantRegistry getAssetRegistry getFactory */

/**
 * A shipment has been received by an importer
 * @param {org.acme.shipping.perishable.ShipmentReceived} shipmentReceived - the ShipmentReceived transaction
 * @transaction
 */
async function payOut(shipmentReceived) {  // eslint-disable-line no-unused-vars

    const contract = shipmentReceived.shipment.contract;
    const shipment = shipmentReceived.shipment;
    let payOut = contract.unitPrice * shipment.unitCount;

    console.log('Received at: ' + shipmentReceived.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the shipment
    shipment.status = 'ARRIVED';

    // if the shipment did not arrive on time the payout is zero
    if (shipmentReceived.timestamp > contract.arrivalDateTime) {
        payOut = 0;
        console.log('Late shipment');
    } else {
        // find the lowest temperature reading
        if (shipment.temperatureReadings) {
            // sort the temperatureReadings by centigrade
            shipment.temperatureReadings.sort(function (a, b) {
                return (a.centigrade - b.centigrade);
            });
            const lowestReading = shipment.temperatureReadings[0];
            const highestReading = shipment.temperatureReadings[shipment.temperatureReadings.length - 1];
            let penalty = 0;
            console.log('Lowest temp reading: ' + lowestReading.centigrade);
            console.log('Highest temp reading: ' + highestReading.centigrade);

            // does the lowest temperature violate the contract?
            if (lowestReading.centigrade < contract.minTemperature) {
                penalty += (contract.minTemperature - lowestReading.centigrade) * contract.minPenaltyFactor;
                console.log('Min temp penalty: ' + penalty);
            }

            // does the highest temperature violate the contract?
            if (highestReading.centigrade > contract.maxTemperature) {
                penalty += (highestReading.centigrade - contract.maxTemperature) * contract.maxPenaltyFactor;
                console.log('Max temp penalty: ' + penalty);
            }

            // apply any penalities
            payOut -= (penalty * shipment.unitCount);

            if (payOut < 0) {
                payOut = 0;
            }
        }
    }

    console.log('Payout: ' + payOut);
    contract.grower.accountBalance += payOut;
    contract.importer.accountBalance -= payOut;

    console.log('Grower: ' + contract.grower.$identifier + ' new balance: ' + contract.grower.accountBalance);
    console.log('Importer: ' + contract.importer.$identifier + ' new balance: ' + contract.importer.accountBalance);

    // update the grower's balance
    const growerRegistry = await getParticipantRegistry('org.acme.shipping.perishable.Grower');
    await growerRegistry.update(contract.grower);

    // update the importer's balance
    const importerRegistry = await getParticipantRegistry('org.acme.shipping.perishable.Importer');
    await importerRegistry.update(contract.importer);

    // update the state of the shipment
    const shipmentRegistry = await getAssetRegistry('org.acme.shipping.perishable.Shipment');
    await shipmentRegistry.update(shipment);
}

/**
 * A temperature reading has been received for a shipment
 * @param {org.acme.shipping.perishable.TemperatureReading} temperatureReading - the TemperatureReading transaction
 * @transaction
 */
async function temperatureReading(temperatureReading) {  // eslint-disable-line no-unused-vars

    const shipment = temperatureReading.shipment;

    console.log('Adding temperature ' + temperatureReading.centigrade + ' to shipment ' + shipment.$identifier);

    if (shipment.temperatureReadings) {
        shipment.temperatureReadings.push(temperatureReading);
    } else {
        shipment.temperatureReadings = [temperatureReading];
    }

    // add the temp reading to the shipment
    const shipmentRegistry = await getAssetRegistry('org.acme.shipping.perishable.Shipment');
    await shipmentRegistry.update(shipment);
}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.acme.shipping.perishable.initializeAll} initializeAllfn - the SetupDemo transaction
 * @transaction
 */
async function initializeAllfn(tx) {
    
    let factory = getFactory();
    const NS = 'org.fishDepartment.shipping.net';

    //create the Fisherman 

    let Fishermanid = ['1001','1002','1003','1004']
    let city = ['London','Hendon','CrickleWood','Luton']
    let postCode = ["N4 1EE","N4 1EA","N4 1EB","N4 1EC"]
    let street = ['London','Hendon','CrickleWood','Luton']
    let email = ["fisherMan1@gmail.com","fisherMan2@gmail.com","fisherMan3@gmail.com","fisherMan4@gmail.com"]
    let certificate = ['abc','def','ghij','klmnopq']
    let location = ['London','Hendon','CrickleWood','Luton']

    
    let fisherMans = []
    
    fishermanId.forEach((element,index) => {
        let Fisherman =  factory.newResouce(NS,'FisherMan',element);
    let  fisherManAddress = factory.newConcept(NS,'Address')
    fisherManAddress.city=city[index]
    fisherManAddress.country = "United Kingdom"
    fisherManAddress.street = street[index]
    fisherManAddress.postCode = postCode[index]

  Fisherman.email = email[index]

  Fisherman.certificate =certificate[index]
  Fisherman.location =location[index]
  Fisherman.role = "FISHERMAN"
  fisherMans.push(fisherMans)
    });
//     let Fisherman =  factory.newResouce(NS,'FisherMan','1001');
//     let  fisherManAddress = factory.newConcept(NS,'Address')
//     fisherManAddress.city="london"
//     fisherManAddress.country = "United Kingdom"
//     fisherManAddress.street = "Finsbury park"
//     fisherManAddress.postCode = "N4 1EE"

//   Fisherman.email = "gohanthe@gmail.com"

//   Fisherman.certificate ="ABC"
//   Fisherman.location ="Finsbury Park"
//   Fisherman.role = "FISHERMAN"

  let producer =  factory.newResouce(NS,'Producer','2001');

  
    producer.email = 'producer@gmail.com'

  producer.companyName = 'ABC'
  producer.fishermanId= '1001'
  producer.role = "PRODUCER"
  let  producerAddress = factory.newConcept(NS,'Address')
  producerAddress.city="london"
  producerAddress.country = "United Kingdom"
  producerAddress.street = "Hendo"
  producerAddress.postCode = "NW 4EE"
  producer.Address = producerAddress


  let processor  =  factory.newResouce(NS,'Processor','3001');
  processor.email= "processor@gmail.com"
  processor.number = "12345678"
  processor.role = "PROCESSOR"

  let distributor  =  factory.newResouce(NS,'Distributor','4001');
  distributor.email= "distributor@gmail.com"
  distributor.number = "12345347"
  distributor.role = "DISTRIBUTOR"

  let retailer  =  factory.newResouce(NS,'Retailer','5001');
  retailer.email= "retailer@gmail.com"
  retailer.number = "12345347"
  retailer.role = "RETAILER"

  let consumer  =  factory.newResouce(NS,'consumer','6001');
  consumer.email= "consumer@gmail.com"
  consumer.number = "12345347"
  consumer.role = "CONSUMER"




  let fishProduct = factory.newResouce(NS,'FishProduct','FP_001')


  fishProduct.componentId = ['123']
  fishProduct.id = '453'
  fishProduct.barcode= 'abcde'
  fishProduct.name= 'tuna product'
  fishProduct.placeoforigin = london
  fishProduct.produceDate = tx.timestamp
  fishProduct.expirationDate = tx.timestamp 
  fishProduct.batchId='1'
  fishProduct.type= "Salamon"
  fishProduct.batchQuantity ="100"
  fishProduct.unitPrice  ="100"
  let  productLocation = factory.newConcept(NS,'ProductLocation')
  let currentState = factory.newConcept(NS,'currentState')
  let previousState =factory.newConcept(NS,'PreviousState')
  currentState.location ="A"
  currentState.arrivalDate = tx.timestamp
  PreviousState.arrivalDate = tx.timestamp
  previousState.location ="B"
  productLocation.PreviousState= [previousState]
  productLocation.currentState =currentState
  fishProduct.productLocation = productLocation




  fishProduct.shipmentStatus ="NOT_CREATED"
  fishProduct.owner = factory.newRelationship(NS,'FisherMan','1001')
 
  fishProduct.producer = factory.newRelationship(NS,'Producer','2001')
   
  fishProduct.processor = factory.newRelationship(NS,'Processor','3001')

 


  let contract = factory.newResouce(NS,'Contract','CN_001')
  contract.newRelationship(NS,'Processor','3001')
  contract.newRelationship(NS,'Producer','2001')
  contract.newRelationship(NS,'Distributor','4001')
  let tomorrow = tx.timestamp
  tomorrow.setDate(tomorrow.getDate() + 1);

  contract.arrivalDate = tomorrow  

  contract.unitPrize = 0.5
  contract.minTemperature =10
  contract.maxTemperature = 20
  contract.minPenality =0.1
  contract.maxPenality =0.2

  let shipment = factory.newResouce(NS,'Shipment','SP_001')
  
  shipment.type ="Salamon"

  shipment.status = "SHIPPMENT_NOT_CREATED"
  shipment.unitCount = 50

  shipment.contract = factory.newRelationship(NS,'Contract','CN_001')
 shipment.distributor = factory.newRelationship(NS,'Distributor','4001')
 shipment.retailer = factory.newRelationship(NS,'Retailer','5001')
 shipment.consumer = factory.newRelationship(NS,'Consumer','6001')
 shipment.product = factory.newRelationship(NS,'FishProduct','FP_001')


//added participants  
const fishermanParticipantRegistry = await getParticipantRegistry(NS+'.Fisherman');
await fishermanParticipantRegistry.addAll(Fisherman)

const processorParticipantRegistry = await getParticipantRegistry(NS+'.Processor');
await processorParticipantRegistry.addAll(processor)


const producerParticipantRegistry = await getParticipantRegistry(NS+'.Producer');
await producerParticipantRegistry.addAll(producer)


const distributorParticipantRegistry = await getParticipantRegistry(NS+'.Distributor');
await distributorParticipantRegistry.addAll(distributor)

const retailerParticipantRegistry = await getParticipantRegistry(NS+'.Retailer');
await retailerParticipantRegistry.addAll(retailer)

const consumerParticipantRegistry = await getParticipantRegistry(NS+'.Consumer');
await consumerParticipantRegistry.addAll(consumer)

const fishProductAssetRegistery =  await getAssetRegistry(NS+'.FishProduct')
await fishProductAssetRegistery.addAll(fishProduct)

const contractAssetRegistery =  await getAssetRegistry(NS+'.Contract')
await contractAssetRegistery.addAll(contract)

const shipmentAssetRegistery =  await getAssetRegistry(NS+'.Shipment')
await shipmentAssetRegistery.addAll(shipment)









  
  

    // eslint-disable-line no-unused-vars

    // const factory = getFactory();

    // // create the grower
    // const grower = factory.newResource(NS, 'Grower', 'farmer@email.com');
    // const growerAddress = factory.newConcept(NS, 'Address');
    // growerAddress.country = 'USA';
    // grower.address = growerAddress;
    // grower.accountBalance = 0;

    // // create the importer
    // const importer = factory.newResource(NS, 'Importer', 'supermarket@email.com');
    // const importerAddress = factory.newConcept(NS, 'Address');
    // importerAddress.country = 'UK';
    // importer.address = importerAddress;
    // importer.accountBalance = 0;

    // // create the shipper
    // const shipper = factory.newResource(NS, 'Shipper', 'shipper@email.com');
    // const shipperAddress = factory.newConcept(NS, 'Address');
    // shipperAddress.country = 'Panama';
    // shipper.address = shipperAddress;
    // shipper.accountBalance = 0;

    // // create the contract
    // const contract = factory.newResource(NS, 'Contract', 'CON_001');
    // contract.grower = factory.newRelationship(NS, 'Grower', 'farmer@email.com');
    // contract.importer = factory.newRelationship(NS, 'Importer', 'supermarket@email.com');
    // contract.shipper = factory.newRelationship(NS, 'Shipper', 'shipper@email.com');
    // const tomorrow = setupDemo.timestamp;
    // tomorrow.setDate(tomorrow.getDate() + 1);
    // contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow
    // contract.unitPrice = 0.5; // pay 50 cents per unit
    // contract.minTemperature = 2; // min temperature for the cargo
    // contract.maxTemperature = 10; // max temperature for the cargo
    // contract.minPenaltyFactor = 0.2; // we reduce the price by 20 cents for every degree below the min temp
    // contract.maxPenaltyFactor = 0.1; // we reduce the price by 10 cents for every degree above the max temp

    // // create the shipment
    // const shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
    // shipment.type = 'BANANAS';
    // shipment.status = 'IN_TRANSIT';
    // shipment.unitCount = 5000;
    // shipment.contract = factory.newRelationship(NS, 'Contract', 'CON_001');

    // // add the growers
    // const growerRegistry = await getParticipantRegistry(NS + '.Grower');
    // await growerRegistry.addAll([grower]);

    // // add the importers
    // const importerRegistry = await getParticipantRegistry(NS + '.Importer');
    // await importerRegistry.addAll([importer]);

    // // add the shippers
    // const shipperRegistry = await getParticipantRegistry(NS + '.Shipper');
    // await shipperRegistry.addAll([shipper]);

    // // add the contracts
    // const contractRegistry = await getAssetRegistry(NS + '.Contract');
    // await contractRegistry.addAll([contract]);

    // // add the shipments
    // const shipmentRegistry = await getAssetRegistry(NS + '.Shipment');
    // await shipmentRegistry.addAll([shipment]);
}