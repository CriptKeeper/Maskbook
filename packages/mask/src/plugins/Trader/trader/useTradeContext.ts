import { createContext, useMemo } from 'react'
import { unreachable } from '@dimensiondev/kit'
import { TradeProvider } from '@masknet/public-api'
import { getTraderConstants } from '@masknet/web3-shared-evm'
import {
    PANCAKESWAP_BASE_AGAINST_TOKENS,
    PANCAKESWAP_CUSTOM_BASES,
    QUICKSWAP_BASE_AGAINST_TOKENS,
    QUICKSWAP_CUSTOM_BASES,
    SASHIMISWAP_BASE_AGAINST_TOKENS,
    SASHIMISWAP_CUSTOM_BASES,
    SUSHISWAP_BASE_AGAINST_TOKENS,
    SUSHISWAP_CUSTOM_BASES,
    OOLONGSWAP_BASE_AGAINST_TOKENS,
    OOLONGSWAP_CUSTOM_BASES,
    SWAPPERCHAN_BASE_AGAINST_TOKENS,
    SWAPPERCHAN_CUSTOM_BASES,
    SENPAISWAP_BASE_AGAINST_TOKENS,
    SENPAISWAP_CUSTOM_BASES,
    UNISWAP_BASE_AGAINST_TOKENS,
    UNISWAP_CUSTOM_BASES,
    WANNASWAP_BASE_AGAINST_TOKENS,
    WANNASWAP_CUSTOM_BASES,
    TRISOLARIS_CUSTOM_BASES,
    TRISOLARIS_BASE_AGAINST_TOKENS,
} from '../constants'
import type { TradeContext as TradeContext_ } from '../types'
import { TargetChainIdContext } from './useTargetChainIdContext'

export const TradeContext = createContext<TradeContext_ | null>(null)

export function useTradeContext(tradeProvider: TradeProvider) {
    const { targetChainId: chainId } = TargetChainIdContext.useContainer()
    return useMemo<TradeContext_>(() => {
        const DEX_TRADE = getTraderConstants(chainId)
        switch (tradeProvider) {
            case TradeProvider.UNISWAP_V2:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V2_LIKE: true,
                    GRAPH_API: DEX_TRADE.UNISWAP_V2_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.UNISWAP_V2_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.UNISWAP_V2_ROUTER_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.UNISWAP_V2_FACTORY_ADDRESS,
                    AGAINST_TOKENS: UNISWAP_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: UNISWAP_CUSTOM_BASES,
                }
            case TradeProvider.UNISWAP_V3:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V3_LIKE: true,
                    GRAPH_API: DEX_TRADE.UNISWAP_V3_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.UNISWAP_V3_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.UNISWAP_SWAP_ROUTER_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.UNISWAP_V3_FACTORY_ADDRESS,
                    AGAINST_TOKENS: UNISWAP_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: UNISWAP_CUSTOM_BASES,
                }
            case TradeProvider.SUSHISWAP:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V2_LIKE: true,
                    GRAPH_API: DEX_TRADE.SUSHISWAP_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.SUSHISWAP_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.SUSHISWAP_ROUTER_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.SUSHISWAP_FACTORY_ADDRESS,
                    AGAINST_TOKENS: SUSHISWAP_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: SUSHISWAP_CUSTOM_BASES,
                }
            case TradeProvider.SASHIMISWAP:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V2_LIKE: true,
                    GRAPH_API: DEX_TRADE.SASHIMISWAP_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.SASHIMISWAP_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.SASHIMISWAP_ROUTER_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.SASHIMISWAP_FACTORY_ADDRESS,
                    AGAINST_TOKENS: SASHIMISWAP_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: SASHIMISWAP_CUSTOM_BASES,
                }
            case TradeProvider.QUICKSWAP:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V2_LIKE: true,
                    GRAPH_API: DEX_TRADE.QUICKSWAP_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.QUICKSWAP_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.QUICKSWAP_ROUTER_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.QUICKSWAP_FACTORY_ADDRESS,
                    AGAINST_TOKENS: QUICKSWAP_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: QUICKSWAP_CUSTOM_BASES,
                }
            case TradeProvider.PANCAKESWAP:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V2_LIKE: true,
                    GRAPH_API: DEX_TRADE.PANCAKESWAP_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.PANCAKESWAP_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.PANCAKESWAP_ROUTER_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.PANCAKESWAP_FACTORY_ADDRESS,
                    AGAINST_TOKENS: PANCAKESWAP_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: PANCAKESWAP_CUSTOM_BASES,
                }
            case TradeProvider.OOLONGSWAP:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V2_LIKE: true,
                    GRAPH_API: DEX_TRADE.OOLONGSWAP_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.OOLONGSWAP_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.OOLONGSWAP_ROUTER_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.OOLONGSWAP_FACTORY_ADDRESS,
                    AGAINST_TOKENS: OOLONGSWAP_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: OOLONGSWAP_CUSTOM_BASES,
                }
            case TradeProvider.SWAPPERCHAN:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V2_LIKE: true,
                    GRAPH_API: DEX_TRADE.SWAPPERCHAN_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.SWAPPERCHAN_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.SWAPPERCHAN_ROUTER_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.SWAPPERCHAN_FACTORY_ADDRESS,
                    AGAINST_TOKENS: SWAPPERCHAN_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: SWAPPERCHAN_CUSTOM_BASES,
                }
            case TradeProvider.SENPAISWAP:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V2_LIKE: true,
                    GRAPH_API: DEX_TRADE.SENPAISWAP_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.SENPAISWAP_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.SENPAISWAP_ROUTER_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.SENPAISWAP_FACTORY_ADDRESS,
                    AGAINST_TOKENS: SENPAISWAP_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: SENPAISWAP_CUSTOM_BASES,
                }
            case TradeProvider.WANNASWAP:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V2_LIKE: true,
                    GRAPH_API: DEX_TRADE.WANNASWAP_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.WANNASWAP_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.WANNASWAP_ROUTER_V2_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.WANNASWAP_FACTORY_ADDRESS,
                    AGAINST_TOKENS: WANNASWAP_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: WANNASWAP_CUSTOM_BASES,
                }
            case TradeProvider.TRISOLARIS:
                return {
                    TYPE: tradeProvider,
                    IS_UNISWAP_V2_LIKE: true,
                    GRAPH_API: DEX_TRADE.TRISOLARIS_THEGRAPH,
                    INIT_CODE_HASH: DEX_TRADE.TRISOLARIS_INIT_CODE_HASH,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.TRISOLARIS_ROUTER_ADDRESS,
                    FACTORY_CONTRACT_ADDRESS: DEX_TRADE.TRISOLARIS_FACTORY_ADDRESS,
                    AGAINST_TOKENS: TRISOLARIS_BASE_AGAINST_TOKENS,
                    ADDITIONAL_TOKENS: {},
                    CUSTOM_TOKENS: TRISOLARIS_CUSTOM_BASES,
                }
            case TradeProvider.ZRX:
                return {
                    TYPE: tradeProvider,
                }
            case TradeProvider.BALANCER:
                return {
                    TYPE: tradeProvider,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.BALANCER_EXCHANGE_PROXY_ADDRESS,
                }
            case TradeProvider.DODO:
                return {
                    TYPE: tradeProvider,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.DODO_EXCHANGE_PROXY_ADDRESS,
                }
            case TradeProvider.BANCOR:
                return {
                    TYPE: tradeProvider,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.BANCOR_EXCHANGE_PROXY_ADDRESS,
                }
            case TradeProvider.OPENOCEAN:
                return {
                    TYPE: tradeProvider,
                    ROUTER_CONTRACT_ADDRESS: DEX_TRADE.OPENOCEAN_EXCHANGE_PROXY_ADDRESS,
                }
            default:
                unreachable(tradeProvider)
        }
    }, [chainId, tradeProvider])
}
