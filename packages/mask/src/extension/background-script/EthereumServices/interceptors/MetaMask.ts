import type { Context, Middleware } from '../types'

export class MetaMask implements Middleware<Context> {
    async fn(context: Context, next: () => Promise<void>) {
        await next()
    }
}
