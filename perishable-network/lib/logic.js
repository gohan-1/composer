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
    const NS = 'org.fishDepartment.shipping.net';
    function checkProfileforProccessorandFisherMan(role){
        console.log(role)
        return  (role == "PRODUCER" || role == "FISHERMAN")
      }
     function checkProfileforProcessor(role){
      console.log(role)
        return  (role == "PROCESSOR")
      }
      
      /* global getParticipantRegistry getAssetRegistry getFactory */
      
    /**
     * Initialize some test assets and participants useful for running a demo.
     * @param {org.fishDepartment.shipping.net.initializeAll} initializeAllfn - the SetupDemo transaction
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
        
        Fishermanid.forEach((element,index) => {
            let Fisherman =  factory.newResouce(NS,'FisherMan',element);
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

    //     let Fisherman =  factory.newResource(NS,'FisherMan','1001');

   
     
   


    //     let  fisherManAddress = factory.newConcept(NS,'Address')
    //     fisherManAddress.city="london"
    //     fisherManAddress.country = "United Kingdom"
    //     fisherManAddress.street = "Finsbury park"
    //     fisherManAddress.postCode = "N4 1EE"
       
    
    //   Fisherman.email = "gohanthe@gmail.com"
    //     Fisherman.address = fisherManAddress
    //   Fisherman.certificate ="ABC"
    //   Fisherman.location ="Finsbury Park"
    //   Fisherman.role = "FISHERMAN"
    
      let producer =  factory.newResource(NS,'Producer','2001');
    
      
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
    
    
      let processor  =  factory.newResource(NS,'Processor','3001');
      processor.email= "processor@gmail.com"
      processor.number = "12345678"
      processor.role = "PROCESSOR"
    
      let distributor  =  factory.newResource(NS,'Distributor','4001');
      distributor.email= "distributor@gmail.com"
      distributor.number = "12345347"
      distributor.role = "DISTRIBUTOR"
    
      let retailer  =  factory.newResource(NS,'Retailer','5001');
      retailer.email= "retailer@gmail.com"
      retailer.number = "12345347"
      retailer.role = "RETAILER"
    
      let consumer  =  factory.newResource(NS,'Consumer','6001');
      consumer.email= "consumer@gmail.com"
      consumer.number = "12345347"
      consumer.role = "CONSUMER"
    
    
    
    
      let fishProduct = factory.newResource(NS,'FishProduct','FP_001')
    
    
      fishProduct.componentId = ['123']
      fishProduct.id = '453'
      fishProduct.barcode= 'abcde'
      fishProduct.name= 'tuna product'
      fishProduct.placeoforigin ="london"
      fishProduct.produceDate = tx.timestamp
      fishProduct.expirationDate = tx.timestamp 
      fishProduct.batchId='1'
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
      productLocation.PreviousState= [previousState]
      productLocation.currentState =currentState
      fishProduct.productLocation = productLocation
    
    
    
    
      fishProduct.shipmentStatus ="NOT_CREATED"
      fishProduct.owner = factory.newRelationship(NS,'FisherMan','1001')
     
      fishProduct.producer = factory.newRelationship(NS,'Producer','2001')
       
      fishProduct.processor = factory.newRelationship(NS,'Processor','3001')
    
     
    
    
      let contract = factory.newResource(NS,'Contract','CN_001')
      contract.processor=factory.newRelationship(NS,'Processor','3001')
      contract.producer=factory.newRelationship(NS,'Producer','2001')
      contract.distributor=factory.newRelationship(NS,'Distributor','4001')
      let tomorrow = tx.timestamp
      tomorrow.setDate(tomorrow.getDate() + 1);
    
      contract.arrivalDate = tomorrow  
    
      contract.unitPrize = 0.5
      contract.minTemperature =10
      contract.maxTemperature = 20
      contract.minPenality =0.1
      contract.maxPenality =0.2
    
      let shipment = factory.newResource(NS,'Shipment','SP_001')
      
      shipment.type ="Salamon"
    
      shipment.status = "NOT_CREATED"
      shipment.unitCount = 50
    
      shipment.contract = factory.newRelationship(NS,'Contract','CN_001')
     shipment.distributor = factory.newRelationship(NS,'Distributor','4001')
     shipment.retailer = factory.newRelationship(NS,'Retailer','5001')
     shipment.consumer = factory.newRelationship(NS,'Consumer','6001')
     shipment.product = factory.newRelationship(NS,'FishProduct','FP_001')
    
    
    //added participants  
    const fishermanParticipantRegistry = await getParticipantRegistry(NS+'.FisherMan');
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
    
    
      
      
    }