import type { RequestArguments } from 'web3-core'
import { isReadOnlyPayload, ProviderType, RequestOptions, SendOverrides } from '@masknet/web3-shared-evm'
import { currentChainIdSettings, currentProviderSettings } from '../../../plugins/Wallet/settings'
import { createExternalProvider } from './provider'
import { createContext, dispatch } from './composer'
import './middleware'

export async function request<T extends unknown>(
    requestArguments: RequestArguments,
    overrides?: SendOverrides,
    options?: RequestOptions,
) {
    const { providerType = currentProviderSettings.value, chainId = currentChainIdSettings.value } = overrides ?? {}

    return new Promise<T>(async (resolve, reject) => {
        const context = createContext(requestArguments, overrides, options)

        await dispatch(context, async () => {
            if (!context.writeable) return
            try {
                // create request provider
                const externalProvider = await createExternalProvider(
                    chainId,
                    isReadOnlyPayload(context.request) ? ProviderType.MaskWallet : providerType,
                )
                if (!externalProvider?.request) throw new Error('Failed to create provider.')

                // send request and set result in the context
                const result = (await externalProvider?.request?.(context.requestArguments)) as T
                context.write(result)
            } catch (error) {
                context.abort(error, 'Failed to send request.')
            }
        })

        console.log('DEBUG: request')
        console.log({
            method: context.method,
            error: context.error,
            result: context.result,
        })

        if (context.error) reject(context.error)
        else resolve(context.result as T)
    })
}
