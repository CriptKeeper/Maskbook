/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js'
import { ContractOptions } from 'web3-eth-contract'
import { EventLog } from 'web3-core'
import { EventEmitter } from 'events'
import {
    Callback,
    PayableTransactionObject,
    NonPayableTransactionObject,
    BlockType,
    ContractEventLog,
    BaseContract,
} from './types'

interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export type Approval = ContractEventLog<{
    owner: string
    approved: string
    tokenId: string
    0: string
    1: string
    2: string
}>
export type ApprovalForAll = ContractEventLog<{
    owner: string
    operator: string
    approved: boolean
    0: string
    1: string
    2: boolean
}>
export type Transfer = ContractEventLog<{
    from: string
    to: string
    tokenId: string
    0: string
    1: string
    2: string
}>

export interface ElectionToken extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): ElectionToken
    clone(): ElectionToken
    methods: {
        approve(to: string, tokenId: number | string | BN): NonPayableTransactionObject<void>

        mintStateToken(claimer: string, state: number | string | BN): NonPayableTransactionObject<string>

        modify_admin(target: string, ifadmin: boolean): NonPayableTransactionObject<void>

        modify_limits(state: number | string | BN, delta: number | string | BN): NonPayableTransactionObject<void>

        'safeTransferFrom(address,address,uint256)'(
            from: string,
            to: string,
            tokenId: number | string | BN,
        ): NonPayableTransactionObject<void>

        'safeTransferFrom(address,address,uint256,bytes)'(
            from: string,
            to: string,
            tokenId: number | string | BN,
            _data: string | number[],
        ): NonPayableTransactionObject<void>

        setApprovalForAll(operator: string, approved: boolean): NonPayableTransactionObject<void>

        transferFrom(from: string, to: string, tokenId: number | string | BN): NonPayableTransactionObject<void>

        balanceOf(owner: string): NonPayableTransactionObject<string>

        baseURI(): NonPayableTransactionObject<string>

        check_availability(state: number | string | BN): NonPayableTransactionObject<string>

        getApproved(tokenId: number | string | BN): NonPayableTransactionObject<string>

        isApprovedForAll(owner: string, operator: string): NonPayableTransactionObject<boolean>

        name(): NonPayableTransactionObject<string>

        ownerOf(tokenId: number | string | BN): NonPayableTransactionObject<string>

        supportsInterface(interfaceId: string | number[]): NonPayableTransactionObject<boolean>

        symbol(): NonPayableTransactionObject<string>

        tokenByIndex(index: number | string | BN): NonPayableTransactionObject<string>

        tokenOfOwnerByIndex(owner: string, index: number | string | BN): NonPayableTransactionObject<string>

        tokenURI(tokenId: number | string | BN): NonPayableTransactionObject<string>

        totalSupply(): NonPayableTransactionObject<string>
    }
    events: {
        Approval(cb?: Callback<Approval>): EventEmitter
        Approval(options?: EventOptions, cb?: Callback<Approval>): EventEmitter

        ApprovalForAll(cb?: Callback<ApprovalForAll>): EventEmitter
        ApprovalForAll(options?: EventOptions, cb?: Callback<ApprovalForAll>): EventEmitter

        Transfer(cb?: Callback<Transfer>): EventEmitter
        Transfer(options?: EventOptions, cb?: Callback<Transfer>): EventEmitter

        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }

    once(event: 'Approval', cb: Callback<Approval>): void
    once(event: 'Approval', options: EventOptions, cb: Callback<Approval>): void

    once(event: 'ApprovalForAll', cb: Callback<ApprovalForAll>): void
    once(event: 'ApprovalForAll', options: EventOptions, cb: Callback<ApprovalForAll>): void

    once(event: 'Transfer', cb: Callback<Transfer>): void
    once(event: 'Transfer', options: EventOptions, cb: Callback<Transfer>): void
}