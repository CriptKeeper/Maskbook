import type { NonSerializableWithAltTypedMessage } from '../base'
import { createIsType } from '../utils/internal'
import { makeTypedMessageText, TypedMessageText } from '../core'

/** It represents a single link */
export interface TypedMessageAnchor extends NonSerializableWithAltTypedMessage {
    readonly type: 'x-anchor'
    readonly category: 'normal' | 'user' | 'cash' | 'hash'
    readonly href: string
    readonly content: string
    readonly alt: TypedMessageText
}

export const isTypedMessageAnchor = createIsType<TypedMessageAnchor>('x-anchor')

export function makeTypedMessageAnchor(
    category: TypedMessageAnchor['category'],
    href: TypedMessageAnchor['href'],
    content: TypedMessageAnchor['content'],
): TypedMessageAnchor {
    return {
        type: 'x-anchor',
        serializable: false,
        category,
        href,
        content,
        alt: makeTypedMessageText(`[${content}](${href})`),
    }
}
