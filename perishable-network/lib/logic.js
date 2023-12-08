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
var NS = 'org.fishDepartment.shipping.net';
function checkProfileforProccessorandFisherMan(role){
    console.log(role)
    return  (role == "PRODUCER" || role == "FISHERMAN")
  }
 function checkProfileforProcessor(role){
  console.log(role)
    return  (role == "PROCESSOR")
  }


  /**
* @param {org.fishDepartment.shipping.net.queryAssetByassetId} fishProduct 
 * @transaction
 */
async function queryAsset(tx){
  const assetId = tx.fishProduct.getIdentifier()

  const result = await query('assetDetails',{'productid' : assetId})

  if (result.length !=1) throw new Error(' asset details missmatching ')
  return result
  result.forEach(item => {
    console.log('+++=++++++')
    console.log(item)
    return item
    
  });
}





  
  /* global getParticipantRegistry getAssetRegistry getFactory */
  
/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.fishDepartment.shipping.net.initializeAll} initializeAllfn - initialize all  transaction  1 params
 * @transaction
 */
async function initializeAllfn(tx) {
    
    let factory = getFactory();
 



    //create the Fisherman 


    let FishermanId = ['1000','1001','1002','1003']
    let city = ['London','Hendon','CrickleWood','Luton']
    let postCode = ["N4 1EE","N4 1EA","N4 1EB","N4 1EC"]
    let street = ['London','Hendon','CrickleWood','Luton']
    let email = ["fisherMan1@gmail.com","fisherMan2@gmail.com","fisherMan3@gmail.com","fisherMan4@gmail.com"]
    let certificate = ['abc','def','ghij','klmnopq']
    let location = ['London','Hendon','CrickleWood','Luton']

    
    let fisherMans = []
    
    FishermanId.forEach((element,index) => {
        let Fisherman =  factory.newResource(NS,'FisherMan',element);
    let  fisherManAddress = factory.newConcept(NS,'Address')
    fisherManAddress.city=city[index]
    fisherManAddress.country = "United Kingdom"
    fisherManAddress.street = street[index]
    fisherManAddress.postCode = postCode[index]

  Fisherman.email = email[index]
  Fisherman.address = fisherManAddress
  Fisherman.certificate =certificate[index]
  Fisherman.location =location[index]
  Fisherman.role = "FISHERMAN"
  fisherMans.push(Fisherman)
    });

// create produce

let producerId = ['2000','2001','2002','2003']
let producerEmail = ['producer1@gmail.com','producer2@gmail.com','producer3@gmail.com','producer4@gmail.com']
let producers =[]

producerId.forEach((element,index) => {
    
    let producer =  factory.newResource(NS,'Producer',element);

  
    producer.email = producerEmail[index]

  producer.companyName = 'ABC'+index
  producer.fishermanId= FishermanId[index]
  producer.role = "PRODUCER"
  let  producerAddress = factory.newConcept(NS,'Address')
  producerAddress.city=city[index]
  producerAddress.country = "United Kingdom"
  producerAddress.street = street[index]

  producerAddress.postCode = postCode[index]
  producer.address = producerAddress

    producers.push(producer)
});
 let  processors = []
 let distributors = []
 let retailers=[]
 let consumers = []
producerId.forEach((element,index) => {
    
    let processor  =  factory.newResource(NS,'Processor',`300${index}`);
  processor.email= `processor${index}@gmail.com`
  processor.number = "12345678"+index
  processor.role = "PROCESSOR"

  let distributor  =  factory.newResource(NS,'Distributor',`400${index}`);
  distributor.email= `distributor${index}@gmail.com`
  distributor.name = `Distributor${index}`
  distributor.role = "DISTRIBUTOR"

  let retailer  =  factory.newResource(NS,'Retailer',`500${index}`);
  retailer.email= `retailer${index}@gmail.com`
  retailer.name = `Retailer${index}`
  retailer.role = "RETAILER"

  let consumer  =  factory.newResource(NS,'Consumer',`600${index}`);
  consumer.email= `consumer${index}@gmail.com`
  consumer.name = `Consumer${index}`
  consumer.role = "CONSUMER"

  processors.push(processor)
  distributors.push(distributor)
  retailers.push(retailer)
  consumers.push(consumer)
});

let fishProducts = []

FishermanId.forEach((element,index) => {
    let fishProduct = factory.newResource(NS,'FishProduct',`FP_00${index}`)
    fishProduct.componentId = [`123${index}`]
    fishProduct.id = `45${index}`
    fishProduct.barcode= `abcde${index}`
    fishProduct.name= `product${index}`
    fishProduct.placeoforigin =location[index]
    fishProduct.produceDate = tx.timestamp
    fishProduct.expirationDate = tx.timestamp 
    fishProduct.type= "Salamon"
    fishProduct.batchQuantity ="100"
    fishProduct.batchId = `B${index}`
    fishProduct.unitPrice  ="100"
    let  productLocation = factory.newConcept(NS,'ProductLocation')
    let currentState = factory.newConcept(NS,'CurrentState')
    let previousState =factory.newConcept(NS,'PreviousState')
    currentState.location ="A"
    currentState.arrivalDate = tx.timestamp
    previousState.arrivalDate = tx.timestamp
    previousState.location ="B"
    productLocation.previousState= [previousState]
    productLocation.currentState =currentState
    fishProduct.productLocation = productLocation
  
  
  
  
    fishProduct.productStatus ="CREATED"
    fishProduct.owner = factory.newRelationship(NS,'FisherMan',`100${index}`)
   
    fishProduct.producer = factory.newRelationship(NS,'Producer',`200${index}`)
     
    fishProduct.processor = factory.newRelationship(NS,'Processor',`300${index}`)
   fishProducts.push(fishProduct)
});
  




  
 
  let contracts = []
  let shipments =[]
FishermanId.forEach((element,index) => {

  let contract = factory.newResource(NS,'Contract',`CN_00${index}`)
  contract.processor=factory.newRelationship(NS,'Processor',`300${index}`)
  contract.producer=factory.newRelationship(NS,'Producer',`200${index}`)
  contract.distributor=factory.newRelationship(NS,'Distributor',`400${index}`)
  let tomorrow = tx.timestamp
  tomorrow.setDate(tomorrow.getDate() + 1);

  contract.arrivalDate = tomorrow  

  contract.unitPrize = 0.5
  contract.minTemperature =10
  contract.maxTemperature = 20
  contract.minPenality =0.1
  contract.maxPenality =0.2

  let shipment = factory.newResource(NS,'Shipment',`SP_00${index}`)
  
  shipment.type ="Salamon"

  shipment.status = "NOT_CREATED"
  shipment.unitCount = 50+index

  shipment.contract = factory.newRelationship(NS,'Contract',`CN_00${index}`)
 shipment.distributor = factory.newRelationship(NS,'Distributor',`400${index}`)
 shipment.retailer = factory.newRelationship(NS,'Retailer',`500${index}`)
 shipment.consumer = factory.newRelationship(NS,'Consumer',`600${index}`)
 shipment.product = factory.newRelationship(NS,'FishProduct',`FP_00${index}`)

  contracts.push(contract)
  shipments.push(shipment)
});





//added participants  
const fishermanParticipantRegistry = await getParticipantRegistry(NS+'.FisherMan');
await fishermanParticipantRegistry.addAll(fisherMans)

const processorParticipantRegistry = await getParticipantRegistry(NS+'.Processor');
await processorParticipantRegistry.addAll(processors)


const producerParticipantRegistry = await getParticipantRegistry(NS+'.Producer');
await producerParticipantRegistry.addAll(producers)


const distributorParticipantRegistry = await getParticipantRegistry(NS+'.Distributor');
await distributorParticipantRegistry.addAll(distributors)

const retailerParticipantRegistry = await getParticipantRegistry(NS+'.Retailer');
await retailerParticipantRegistry.addAll(retailers)

const consumerParticipantRegistry = await getParticipantRegistry(NS+'.Consumer');
await consumerParticipantRegistry.addAll(consumers)

const fishProductAssetRegistery =  await getAssetRegistry(NS+'.FishProduct')
await fishProductAssetRegistery.addAll(fishProducts)

const contractAssetRegistery =  await getAssetRegistry(NS+'.Contract')
await contractAssetRegistery.addAll(contracts)

const shipmentAssetRegistery =  await getAssetRegistry(NS+'.Shipment')
await shipmentAssetRegistery.addAll(shipments)


  
  
}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.fishDepartment.shipping.net.TemperatureReading} TemperatureReadingFn - the SetupDemo transaction
 * @transaction
 */


async function TemperatureReadingFn(tx){

  let shipment = tx.shipment

  if(shipment.temperatureReadings.length != 0 ){
    shipment.temperatureReadings.push = tx
  }else{
    
    shipment.temperatureReadings = [tx]
  }

  const shipmentAsset = await getAssetRegistry(NS+'.Shipment')
  await shipmentAsset.update(shipment)

}


/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.fishDepartment.shipping.net.addNewFishProduct} addNewFishProductFn - no params
 * @transaction
 */




async function addNewFishProductFn(tx){
   let factory = getFactory();

  const id = getCurrentParticipant()  
  
  let fishProduct = factory.newResource(NS,'FishProduct',tx.productid)
    fishProduct.componentId = tx.componentId
    fishProduct.id = tx.id
    fishProduct.barcode= tx.barcode
    fishProduct.name= tx.name
    fishProduct.placeoforigin =tx.location
    fishProduct.produceDate = tx.timestamp
    fishProduct.expirationDate = tx.timestamp 
    fishProduct.type= tx.type
    fishProduct.batchQuantity =tx.batchQuantity
    fishProduct.batchId = tx.batchId 
    fishProduct.unitPrice  = tx.unitPrice
    let  productLocation = factory.newConcept(NS,'ProductLocation')
    let currentState = factory.newConcept(NS,'CurrentState')
    let previousState =factory.newConcept(NS,'PreviousState')
    currentState.location =tx.location
    currentState.arrivalDate = tx.timestamp
    previousState.arrivalDate = tx.timestamp
    previousState.location =tx.location
    productLocation.previousState= [previousState]
    productLocation.currentState =currentState
    fishProduct.productLocation = productLocation
  
  console.log('--------------------------------------')
   console.log(id)
  
  
  
    fishProduct.productStatus =tx.productStatus
    fishProduct.owner = factory.newRelationship(NS,'FisherMan',id)
   
    fishProduct.producer = factory.newRelationship(NS,'Producer',`0000`)
     
    fishProduct.processor = factory.newRelationship(NS,'Processor',`0000`)
    const fishProductAssetRegistery =  await getAssetRegistry(NS+'.FishProduct')
    await fishProductAssetRegistery.addAll([fishProduct])
  
}




/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.fishDepartment.shipping.net.TransferToProducer} TransferToProducerFn - no params
 * @transaction
 */

async function TransferToProducerFn(tx){
  let factory = getFactory();

  const fishermanDetails= getCurrentParticipant()  
// only fisherman can do this  have to wrte rule


  console.log(fishermanDetails)

  
  
  const producerParticipantRegistry = await getParticipantRegistry(NS+'.Producer');

  
  let exist = producerParticipantRegistry.exists(tx.producer.getIdentifier());
  const fishProductAssetRegistery =  await getAssetRegistry(NS+'.FishProduct')

  


  if(exist){
    const assetDetails =await queryAsset(tx)

 
    
    //  query the details fishProduct
   
		console.log('----------------------------------------')
	let product =	await queryAsset(tx)
   
    product=product[0]
    
    console.log( product.owner.getIdentifier())
    
    let fisherman = "resourece:"+fishermanDetails.getFullyQualifiedIdentifier()
    
    console.log(fishermanDetails.getIdentifier())
    if(product.productStatus == 'CREATED' && product.owner.getIdentifier() == fishermanDetails.getIdentifier()){
      
      product.producer = tx.producer
   
      fishProductAssetRegistery.update(product)
    }else{
      throw new Error('Fisherman can not do this operation , check whether product is already transfered or have the right access')
    }



  }else{
    throw new Error('Producer does not exist, please check the producer id')
  }


  
}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.fishDepartment.shipping.net.productRecieved} productRecievedFn - no params
 * @transaction
 */
async function TransferToProducerFn(tx){

 let factory = getFactory();

  const particpantDetails= getCurrentParticipant()  
// only fisherman can do this  have to wrte rule
console.log(particpantDetails)

  const fishProductAssetRegistery =  await getAssetRegistry(NS+'.FishProduct')

  if(particpantDetails.role=== "PRODUCER"){

  const assetDetails = tx.fishDepartment  

//  let result = await queryAssetByParticipant(particpantDetails,particpantDetails.role)
//  let flag =0 

  if(assetDetails.producer.getIdentifier() ==  particpantDetails.getIdentifier() ){
    assetDetails.productStatus = "IN_PRODUCTION"
    const previousloc =  assetDetails.productLocation.currentState.location
    const previousDate = assetDetails.productLocation.currentState.arrivalDate
    const previousObject = {
      "location" : previousloc,
      "arrivalDate" :previousDate
    }
    assetDetails.productLocation.previousState.push(previousObject)

    assetDetails.productLocation.currentState.location = tx.location
    assetDetails.productLocation.currentState.arrivalDate =  tx.timestamp
    
    fishProductAssetRegistery.update(assetDetails)

  }else{
    throw new Error('Identifier miss match')
  }




  }else if(participant == org.fishDepartment.shipping.net.Processor){
    if(assetDetails.processor.getIdentifier() ==  particpantDetails.getIdentifier() ){
      assetDetails.productStatus = "IN_PROCESSING"
      const previousloc =  assetDetails.productLocation.currentState.location
      const previousDate = assetDetails.productLocation.currentState.arrivalDate
      const previousObject = {
        "location" : previousloc,
        "arrivalDate" :previousDate
      }
      assetDetails.productLocation.previousState.push(previousObject)
  
      assetDetails.productLocation.currentState.location = tx.location
      assetDetails.productLocation.currentState.arrivalDate =  tx.timestamp
      
      fishProductAssetRegistery.update(assetDetails)
    }else{
      throw new Error('Identifier miss match')
    }
  
    
  }else{
    throw new Error('particpiant having wrong credential')
  }


}
