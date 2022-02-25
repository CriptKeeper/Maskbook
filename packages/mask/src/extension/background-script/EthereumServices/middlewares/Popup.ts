import { EthereumMethodType, isRiskPayload, ProviderType } from '@masknet/web3-shared-evm'
import Services from '../../../service'
import type { Context, Middleware } from '../types'
import { WalletRPC } from '../../../../plugins/Wallet/messages'
import { hasNativeAPI } from '../../../../../shared/native-rpc'

export class Popup implements Middleware<Context> {
    async fn(context: Context, next: () => Promise<void>) {
        switch (context.method) {
            case EthereumMethodType.MASK_CONFIRM_TRANSACTION:
            case EthereumMethodType.MASK_REJECT_TRANSACTION:
                const payload = await WalletRPC.topUnconfirmedRequest()
                if (!payload) {
                    context.abort(new Error('No unconfirmed request.'))
                    break
                }
                await WalletRPC.deleteUnconfirmedRequest(payload)
                await Services.Helper.removePopupWindow()
                if (context.method === EthereumMethodType.MASK_CONFIRM_TRANSACTION) {
                    context.requestArguments = {
                        method: payload.method,
                        params: payload.params,
                    }
                } else {
                    context.end()
                }
                break
            default:
                if (
                    !hasNativeAPI &&
                    isRiskPayload(context.request) &&
                    context.providerType === ProviderType.MaskWallet
                ) {
                    await WalletRPC.pushUnconfirmedRequest(context.request)
                }
                break
        }

        await next()
    }
}
