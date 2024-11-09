import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const RecycleChainModule = buildModule(
  'RecycleChainModule',
  (m: { contract: (arg0: string, arg1: never[]) => any }) => {
    const recycleChain = m.contract('RecycleChain', [])

    return { recycleChain }
  },
)

export default RecycleChainModule
