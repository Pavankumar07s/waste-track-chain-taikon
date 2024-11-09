import { ethers } from 'ethers'
import { RecycleChain__factory } from '../../standalone/recycle-chain-contract/typechain-types'
import { contractAddress } from './util'
require('dotenv').config()

const main = () => {
  const infuraWssUrl = `wss://polygon-amoy.g.alchemy.com/v2/NxRopOY8kKulbvcbzp3H0SeEbQ4Rzvpi`

  const provider = new ethers.WebSocketProvider(infuraWssUrl)

  const contract = RecycleChain__factory.connect(contractAddress, provider)

  // Listening to ProductCreated event
  try {
    contract.on(contract.filters.ProductCreated(), (productId, name, manufacturer) => {
      console.log(`🎉 Product Created: ID - ${productId}, Name - ${name}, Manufacturer - ${manufacturer}`);
    })
    console.log('Event: ProductCreated Listening...')
  } catch (error) {
    console.error('Event: ProductCreated Listener setup failed.', error)
  }

  // Listening to ToxicItemCreated event
  try {
    contract.on(contract.filters.ToxicItemCreated(), (productId, toxicName, toxicWeight) => {
      console.log(`🎉 Toxic Item Created: Product ID - ${productId}, Toxic Name - ${toxicName}, Weight - ${toxicWeight}`);
    })
    console.log('Event: ToxicItemCreated Listening...')
  } catch (error) {
    console.error('Event: ToxicItemCreated Listener setup failed.', error)
  }

  // Listening to ProductItemsAdded event
  try {
    contract.on(contract.filters.ProductItemsAdded(), (itemIds, productId) => {
      console.log(`🎉 Product Items Added: Product ID - ${productId}, Item IDs - ${itemIds.join(', ')}`);
    })
    console.log('Event: ProductItemsAdded Listening...')
  } catch (error) {
    console.error('Event: ProductItemsAdded Listener setup failed.', error)
  }

  // Listening to ProductItemsStatusChanged event
  try {
    contract.on(contract.filters.ProductItemsStatusChanged(), (itemIds, status) => {
      console.log(`🎉 Product Items Status Changed: Item IDs - ${itemIds.join(', ')}, New Status - ${status}`);
    })
    console.log('Event: ProductItemsStatusChanged Listening...')
  } catch (error) {
    console.error('Event: ProductItemsStatusChanged Listener setup failed.', error)
  }

  // Listening to ManufacturerRegistered event
  try {
    contract.on(contract.filters.ManufacturerRegistered(), (manufacturer, name, location, contactUs) => {
      console.log(`🎉 Manufacturer Registered: ${manufacturer}, Name - ${name}, Location - ${location}, Contact - ${contactUs}`);
    })
    console.log('Event: ManufacturerRegistered Listening...')
  } catch (error) {
    console.error('Event: ManufacturerRegistered Listener setup failed.', error)
  }
}

main()
