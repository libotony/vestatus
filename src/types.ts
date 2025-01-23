export type ExpandedBlock = {
    number: number
    id: string
    size: number
    parentID: string
    timestamp: number
    gasLimit: number
    beneficiary: string
    gasUsed: number
    totalScore: number
    txsRoot: string
    txsFeatures: number
    stateRoot: string
    receiptsRoot: string
    signer: string
    isTrunk: boolean
    transactions: Array<{
        id: string
        chainTag: number
        blockRef: string
        expiration: number
        clauses: Array<{
            to: string | null
            value: string
            data: string
        }>
        gasPriceCoef: number
        gas: number
        origin: string
        delegator: string | null
        nonce: string
        dependsOn: string | null
        size: number

        // receipt part
        gasUsed: number
        gasPayer: string
        paid: string
        reward: string
        reverted: boolean
        outputs: Array<{
            contractAddress: string | null
            events: Array<{
                address: string
                topics: string[]
                data: string
            }>
            transfers: Array<{
                sender: string
                recipient: string
                amount: string
            }>
        }>
    }>
}
