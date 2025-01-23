import { ExpandedBlock } from './types'

const InitialFee = 100000

export class FeeMarket {
    private cache = new FIFOCache(100)

    // 50%  = (2, 8), max 12.5%
    // 75% = (4/3, 8/3) max 12.5%
    constructor(private multiplier: number, private denominator: number) {
    }

    // returned value is the multiplier of the initial base fee
    public runBlock(block: ExpandedBlock): number {
        let limit = block.gasLimit
        let target = limit / this.multiplier
        let used = block.gasUsed

        let parentBaseFee = this.getBaseFee(block.number - 1)
        let baseFee = parentBaseFee
        if (used > target) {
            let usedDelta = used - target
            let feeDelta = Math.max(parentBaseFee * usedDelta / target / this.denominator, 1)

            baseFee = parentBaseFee + feeDelta
        } else if (used < target) {
            let usedDelta = target - used
            let feeDelta = parentBaseFee * usedDelta / target / this.denominator

            baseFee = parentBaseFee - feeDelta
            if (baseFee < InitialFee) {
                baseFee = InitialFee
            }
        }

        return baseFee / InitialFee
    }

    private getBaseFee(num: number): number {
        if (num < 1) {
            return InitialFee
        }
        const fee = this.cache.get(num.toString())
        if (fee) {
            return fee
        }
        throw new Error('block basefee not found')
    }
}

class FIFOCache {
    private queue: string[] = []
    private map: Map<string, any> = new Map()

    constructor(private size: number) { }
    public put(key: string, value: any) {
        if (this.queue.length > this.size) {
            const k = this.queue.shift()
            this.map.delete(k!)
        }
        this.queue.push(key)
        this.map.set(key, value)
    }
    public get(key: string): any | undefined {
        return this.map.get(key)
    }
}