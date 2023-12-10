
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
* @param {org.fishDepartment.shipping.net.productStatus} no params 
 * @transaction
 */

async function productStatus(){

  

    let resourece  = "resourece:"+tx.product.getFullyQualifiedIdentifier()
    const result = await query('statusQuery',{'product' : resourece})

  if (result.length ==0 ) throw new Error(' No Shipment Details for this product')
  result.forEach(item => {
    
    console(`product having shipment ID ${item.shipmentId} and belong to batch ID${item.batchId} is in ${item.status}`)
  });


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

/**
* @param {org.fishDepartment.shipping.net.queryShipmentAsset} shipment 
 * @transaction
 */
async function queryShipmentAsset(tx){
  const assetId = tx.shipment.getIdentifier()

  const result = await query('shipmentDetails',{'shipmentId' : assetId})

  if (result.length !=1) throw new Error(' asset details missmatching ')
  return result
}



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
    let fishProduct = factory.newResource(NS,'FishProduct',`FP_000${index}`)
    fishProduct.componentId = [`123${index}`]
    fishProduct.id = `45${index}`
    fishProduct.barcode= `abcde${index}`
    fishProduct.name= `product${index}`
    fishProduct.placeoforigin =location[index]
    fishProduct.produceDate = tx.timestamp
    fishProduct.expirationDate = tx.timestamp 
    fishProduct.type= "Salamon"
    fishProduct.batchQuantity ="100"
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
   	fishProduct.history = ["A"]
    fishProduct.producer = factory.newRelationship(NS,'Producer',`000${index}`)
     
    fishProduct.processor = factory.newRelationship(NS,'Processor',`000${index}`)
   fishProducts.push(fishProduct)
});
  




  
 

  let shipments =[]
FishermanId.forEach((element,index) => {



  let shipment = factory.newResource(NS,'Shipment',`SP_000${index}`)
  
  shipment.type ="Salamon"

  shipment.status = "NOT_CREATED"
  shipment.batchId = "1"
  shipment.unitCount = 50+index


 shipment.distributor = factory.newRelationship(NS,'Distributor',`400${index}`)
 shipment.retailer = factory.newRelationship(NS,'Retailer',`500${index}`)
 shipment.consumer = factory.newRelationship(NS,'Consumer',`600${index}`)
 shipment.product = factory.newRelationship(NS,'FishProduct',`FP_00${index}`)


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
 * @param {org.fishDepartment.shipping.net.createFishProduct} createFishProductFn - no params
 * @transaction
 */




async function createFishProductFn(tx){
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
 * @param {org.fishDepartment.shipping.net.createShipment} createShipmentFn - no params
 * @transaction
 */

async function createShipmentFn(tx){
  let factory = getFactory();

  const id = getCurrentParticipant()  
  
  let shipment = factory.newResource(NS,'Shipment',tx.shipmentId)
    
   
    shipment.type= tx.type
    shipment.unitCount =tx.unitCount
    shipment.batchId = tx.batchId 
    shipment.status = tx.status
   

  
  
    shipment.distributor =tx.distributor

   
    shipment.retailer = factory.newRelationship(NS,'Retailer',`0000`)
     
    shipment.consumer = factory.newRelationship(NS,'Consumer',`0000`)

    shipment.product =tx.product


    const shipmentAssetRegistery =  await getAssetRegistry(NS+'.Shipment')
    await shipmentAssetRegistery.add(shipment)
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
async function productRecievedFn(tx){

 let factory = getFactory();

  const particpantDetails= getCurrentParticipant()  
// only fisherman can do this  have to wrte rule
let previoustateArray = []

  const fishProductAssetRegistery =  await getAssetRegistry(NS+'.FishProduct')

  if(particpantDetails.role=== "PRODUCER"){

  const assetDetails = tx.fishDepartment  

//  let result = await queryAssetByParticipant(particpantDetails,particpantDetails.role)
//  let flag =0 

  if(assetDetails.producer.getIdentifier() ==  particpantDetails.getIdentifier() ){
    assetDetails.productStatus = "IN_PRODUCTION"
    let  productLocation = factory.newConcept(NS,'ProductLocation')
    let currentState = factory.newConcept(NS,'CurrentState')
    let previousStates=factory.newConcept(NS,'PreviousState')
    
    
     previousStates.arrivalDate = assetDetails.productLocation.currentState.arrivalDate
    previousStates.location = assetDetails.productLocation.currentState.location

  
    
    productLocation.previousState=[previousStates]

    currentState.location = tx.location
    currentState.arrivalDate = tx.timestamp

    productLocation.currentState =currentState

    assetDetails.productLocation = productLocation
    assetDetails.history.push(assetDetails.productLocation.currentState.location)

    
    fishProductAssetRegistery.update(assetDetails)

  }else{
    throw new Error('Identifier miss match')
  }




  }else if(particpantDetails.role=== "PROCESSOR"){
     const assetDetails = tx.fishDepartment 
    if(assetDetails.processor.getIdentifier() ==  particpantDetails.getIdentifier() ){
      assetDetails.productStatus = "IN_PROCESSING"
  
      
      let  productLocation = factory.newConcept(NS,'ProductLocation')
      let currentState = factory.newConcept(NS,'CurrentState')
      let previousStates=factory.newConcept(NS,'PreviousState')
     
      previousStates.arrivalDate = assetDetails.productLocation.currentState.arrivalDate
      previousStates.location = assetDetails.productLocation.currentState.location
     
      assetDetails.history.push(assetDetails.productLocation.currentState.location)
   
    assetDetails.productLocation.previousState=[previousStates]
      currentState.location = tx.location
      currentState.arrivalDate = tx.timestamp
  
      productLocation.currentState =currentState
  
      assetDetails.productLocation = productLocation
  
      


      fishProductAssetRegistery.update(assetDetails)
    }else{
      throw new Error('Identifier miss match')
    }
  
    
  }else{
    throw new Error('particpiant having wrong credential')
  }


}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.fishDepartment.shipping.net.ShipmentReceived} shipmentReceivedFn - no params
 * @transaction
 */
async function shipmentReceivedFn(tx){

  let factory = getFactory();
 
   const particpantDetails= getCurrentParticipant()  
 // only fisherman can do this  have to wrte rule
 let previoustateArray = []
 
   const fishProductAssetRegistery =  await getAssetRegistry(NS+'.FishProduct')
    const shipmentAssetRegistery =  await getAssetRegistry(NS+'.Shipment')
   
 
   if(particpantDetails.role=== "DISTRIBUTOR"){
 
   const assetDetails = tx.shipment

   
 
 //  let result = await queryAssetByParticipant(particpantDetails,particpantDetails.role)
 //  let flag =0 
 
   if(assetDetails.distributor.getIdentifier() ==  particpantDetails.getIdentifier() ){
   const fishProduct  = fishProductAssetRegistery.get(assetDetails.product.getIdentifier())
  
     let  productLocation = factory.newConcept(NS,'ProductLocation')
     let currentState = factory.newConcept(NS,'CurrentState')
     let previousStates=factory.newConcept(NS,'PreviousState')
    
     
     
   
     
      previousStates.arrivalDate = fishProduct.productLocation.currentState.arrivalDate
     previousStates.location = fishProduct.productLocation.currentState.location
 
   
     
     productLocation.previousState=[previousStates]
 
     currentState.location = tx.location
     currentState.arrivalDate = tx.timestamp
 
     productLocation.currentState =currentState
 
     fishProduct.productLocation = productLocation
     fishProduct.history.push(fishProduct.productLocation.currentState.location)
 
     
     fishProductAssetRegistery.update(fishProduct)

     assetDetails.status= "IN_TRANSIST"

     shipmentAssetRegistery.update(assetDetails)


 
   }else{
     throw new Error('Identifier miss match')
   }
 
 
 
 
   }else if(particpantDetails.role=== "RETAILER"){
    const assetDetails = tx.shipment

   
 
    //  let result = await queryAssetByParticipant(particpantDetails,particpantDetails.role)
    //  let flag =0 
    
      if(assetDetails.retailer.getIdentifier() ==  particpantDetails.getIdentifier() ){
      const fishProduct  = fishProductAssetRegistery.get(assetDetails.product.getIdentifier())
     
        let  productLocation = factory.newConcept(NS,'ProductLocation')
        let currentState = factory.newConcept(NS,'CurrentState')
        let previousStates=factory.newConcept(NS,'PreviousState')
       
        
        
      
        
         previousStates.arrivalDate = fishProduct.productLocation.currentState.arrivalDate
        previousStates.location = fishProduct.productLocation.currentState.location
    
      
        
        productLocation.previousState=[previousStates]
    
        currentState.location = tx.location
        currentState.arrivalDate = tx.timestamp
    
        productLocation.currentState =currentState
    
        fishProduct.productLocation = productLocation
        fishProduct.history.push(fishProduct.productLocation.currentState.location)
    
        
        fishProductAssetRegistery.update(fishProduct)
   
        assetDetails.status= "ARRIVED"
   
        shipmentAssetRegistery.update(assetDetails)

        }else{
       throw new Error('Identifier miss match')
     }
   
     
   }else{
     throw new Error('particpiant having wrong credential')
   }
 
 
 }

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.fishDepartment.shipping.net.TransferToProcesor} TransferToProcesorFn - no params
 * @transaction
 */


async function TransferToProcesorFn(tx){

  let factory = getFactory();

  const producerDetails= getCurrentParticipant()  
// only fisherman can do this  have to wrte rule


  console.log(producerDetails)

  
  
  const processorParticipantRegistry = await getParticipantRegistry(NS+'.Processor');

  
  let exist = processorParticipantRegistry.exists(tx.processor.getIdentifier());
  const fishProductAssetRegistery =  await getAssetRegistry(NS+'.FishProduct')

  


  if(exist){

 
    
    //  query the details fishProduct
   
		console.log('----------------------------------------')
	let product =	await queryAsset(tx)
   
    product=product[0]
    
    

    

    if(product.productStatus == 'IN_PRODUCTION' && product.producer.getIdentifier() == producerDetails.getIdentifier()){
      
      product.processor = tx.processor
   
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
 * @param {org.fishDepartment.shipping.net.TransferToRetailer} TransferToRetailerFn - no params
 * @transaction
 */

async function TransferToRetailerFn(tx){

  let factory = getFactory();

  const distributorDetails= getCurrentParticipant()  
// only fisherman can do this  have to wrte rule


  console.log(distributorDetails)

  
  
  const retailerParticipantRegistry = await getParticipantRegistry(NS+'.Retailer');

  
  let exist = retailerParticipantRegistry.exists(tx.processor.getIdentifier());
  const shipmentAssetRegistery =  await getAssetRegistry(NS+'.Shipment')

  


  if(exist){

 
    
    //  query the details fishProduct
   
		console.log('----------------------------------------')
	let shipment =	await queryShipmentAsset(tx)
   
  shipment=shipment[0]
    
    

    

    if(shipment.productStatus == 'IN_TRANSIST' && product.distributor.getIdentifier() == producerDetails.getIdentifier()){
      
      shipment.retailer = tx.retailer
      shipment.status = "SHIPPED"
      shipmentAssetRegistery.update(shipment)
    }else{
      throw new Error('Fisherman can not do this operation , check whether product is already transfered or have the right access')
    }



  }else{
    throw new Error('Producer does not exist, please check the producer id')
  }





}


/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.fishDepartment.shipping.net.Consume} ConsumeFn - no params
 * @transaction
 */
async function ConsumeFn(tx){

  let factory = getFactory();

  const distributorDetails= getCurrentParticipant()  
// only fisherman can do this  have to wrte rule


  console.log(distributorDetails)

  
  
  const consumerParticipantRegistry = await getParticipantRegistry(NS+'.Consumer');

  
  let exist = consumerParticipantRegistry.exists(tx.consumer.getIdentifier());
  const shipmentAssetRegistery =  await getAssetRegistry(NS+'.Shipment')

  


  if(exist){

 
    
    //  query the details fishProduct
   
		console.log('----------------------------------------')
	let shipment =	await queryShipmentAsset(tx)
   
  shipment=shipment[0]
    
    

    

    if(shipment.productStatus == 'ARRIVED' && product.retailer.getIdentifier() == producerDetails.getIdentifier()){
      
      shipment.consumer = tx.consumer
      shipment.status = "SOLD"
      shipmentAssetRegistery.update(shipment)
    }else{
      throw new Error('Fisherman can not do this operation , check whether product is already transfered or have the right access')
    }



  }else{
    throw new Error('Producer does not exist, please check the producer id')
  }





}










