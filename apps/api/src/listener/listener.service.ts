import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ethers } from 'ethers'
import { RecycleChain, RecycleChain__factory } from '../common/typechain-types'
import { contractAddress } from 'src/common/util'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { ProductStatus } from '@prisma/client'

const statusMapping = [
  ProductStatus.MANUFACTURED,
  ProductStatus.SOLD,
  ProductStatus.RETURNED,
  ProductStatus.RECYCLED,
]

@Injectable()
export class ListenerService implements OnModuleInit, OnModuleDestroy {
  private provider: ethers.WebSocketProvider
  private contract: RecycleChain

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.initializeWebSocketProvider()
    this.subscribeToEvents()
  }

  onModuleDestroy() {
    this.cleanup()
  }

  private initializeWebSocketProvider() {
    const infuraWssUrl = `wss://ws.hekla.taiko.xyz`
    this.provider = new ethers.WebSocketProvider(infuraWssUrl)
    this.contract = RecycleChain__factory.connect(
      contractAddress,
      this.provider,
    )
  }

  private subscribeToEvents() {
    if (!this.contract) {
      throw new Error('Contract is not initialized')
    }

    this.contract.on(
      this.contract.filters.ManufacturerRegistered(),
      this.handleManufacturerRegistered.bind(this),
    )
    this.contract.on(
      this.contract.filters.ProductCreated(),
      this.handleProductCreated.bind(this),
    )
    this.contract.on(
      this.contract.filters.ProductItemsAdded(),
      this.handleProductItemsAdded.bind(this),
    )
    // this.contract.on(this.contract.filters.ProductItemsStatusChanged(), this.handleProductItemsStatusChanged.bind(this))
    this.contract.on(
      this.contract.filters.ToxicItemCreated(),
      this.handleToxicItemCreated.bind(this),
    )
    this.contract.on(
      this.contract.filters.ProductItemsStatusChanged,
      async (productItemIds, statusIndex, event) => {
        console.log('Received event:', event)

        if (!event || !event.blockNumber) {
          console.error('Event does not contain blockNumber:', event)
          return
        }

        const timestamp = await this.getBlockTimeStamp(event.blockNumber)

        await this.updateProductItemStatus({
          productItemIds,
          statusIndex: +statusIndex.toString(),
          timestamp,
        })
      },
    )

    console.log('Event listeners have been set up.')
  }

  async resyncBlockchainData() {
    if (!this.contract) {
      throw new Error('Contract is not initialized')
    }

    const fromBlock = 0
    const toBlock = 'latest'
    const eventFilters = [
      {
        filter: this.contract.filters.ManufacturerRegistered(),
        handler: this.handleManufacturerRegistered.bind(this),
      },
      {
        filter: this.contract.filters.ProductCreated(),
        handler: this.handleProductCreated.bind(this),
      },
      {
        filter: this.contract.filters.ProductItemsAdded(),
        handler: this.handleProductItemsAdded.bind(this),
      },
      {
        filter: this.contract.filters.ProductItemsStatusChanged(),
        handler: this.handleProductItemsStatusChanged.bind(this),
      },
      {
        filter: this.contract.filters.ToxicItemCreated(),
        handler: this.handleToxicItemCreated.bind(this),
      },
    ]

    for (const { filter, handler } of eventFilters) {
      const events = await this.contract.queryFilter(filter, fromBlock, toBlock)
      for (const event of events) {
        await handler(...event.args, event)
      }
    }
  }

  private cleanup() {
    this.provider.removeAllListeners()
  }

  async getBlockTimeStamp(blockNumber?: number) {
    if (blockNumber === undefined) {
      console.warn('No block number provided, returning current timestamp.')
      return new Date()
    }
    const block = await this.provider.getBlock(blockNumber)
    return new Date(block.timestamp * 1000)
  }

  /**
   * Event Handlers
   */
  private async handleManufacturerRegistered(
    id,
    name,
    location,
    contact,
    event,
  ) {
    const timestamp = await this.getBlockTimeStamp(event.blockNumber)
    await this.createManufacturer({ id, name, location, contact, timestamp })
  }

  private async handleProductCreated(productId, name, manufacturer, event) {
    const timestamp = await this.getBlockTimeStamp(event.blockNumber)
    await this.createProduct({
      productId: productId.toString(),
      name,
      manufacturer,
      timestamp,
    })
  }

  private async handleProductItemsAdded(productItemIds, productId, event) {
    const timestamp = await this.getBlockTimeStamp(event.blockNumber)
    await this.createProductItems({
      productId: productId.toString(),
      productItemIds,
      timestamp,
    })
  }

  private async handleProductItemsStatusChanged(
    productItemIds,
    statusIndex,
    event,
  ) {
    // Ensure 'event' contains the required data
    const blockNumber =
      event.blockNumber || (await this.provider.getBlockNumber())
    const timestamp = await this.getBlockTimeStamp(blockNumber)

    // Now handle the status update
    await this.updateProductItemStatus({
      productItemIds,
      statusIndex: +statusIndex.toString(),
      timestamp,
    })
  }

  private async handleToxicItemCreated(productId, name, weight, event) {
    const timestamp = await this.getBlockTimeStamp(event.blockNumber)
    await this.createToxicItem({
      productId: productId.toString(),
      name,
      weight: +weight.toString(),
      timestamp,
    })
  }

  /**
   * Database Write Operations
   */
  private async createManufacturer({ id, name, location, contact, timestamp }) {
    await this.prisma.manufacturer.create({
      data: { id, name, location, contact, timestamp },
    })
  }

  private async createProduct({ productId, name, manufacturer, timestamp }) {
    await this.prisma.product.create({
      data: {
        id: productId,
        name,
        timestamp,
        manufacturer: { connect: { id: manufacturer } },
      },
    })
  }

  private async createProductItems({ productId, productItemIds, timestamp }) {
    await this.prisma.$transaction([
      this.prisma.productItem.createMany({
        data: productItemIds.map((id) => ({
          id,
          productId,
          status: ProductStatus.MANUFACTURED,
          timestamp,
        })),
      }),
      ...productItemIds.map((id) =>
        this.prisma.transaction.create({
          data: {
            productItemId: id,
            status: ProductStatus.MANUFACTURED,
            timestamp,
          },
        }),
      ),
    ])
  }

  private async updateProductItemStatus({
    productItemIds,
    statusIndex,
    timestamp,
  }) {
    const status = statusMapping[statusIndex]
    await this.prisma.$transaction([
      this.prisma.productItem.updateMany({
        data: { status, timestamp },
        where: { id: { in: productItemIds } },
      }),
      ...productItemIds.map((id) =>
        this.prisma.transaction.create({
          data: { productItemId: id, status, timestamp },
        }),
      ),
    ])
  }

  private async createToxicItem({ productId, name, weight, timestamp }) {
    const maxRetries = 5
    let retryCount = 0

    while (retryCount < maxRetries) {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      })
      if (product) {
        await this.prisma.toxicItem.create({
          data: { productId, name, weight, timestamp },
        })
        return
      }
      retryCount++
      await new Promise((res) => setTimeout(res, 1000)) // 1-second delay
    }
  }
}
