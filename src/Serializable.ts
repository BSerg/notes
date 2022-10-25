export abstract class Serializable {
    static fromObject(obj: {}): unknown {
        return null
    }
    abstract toObject(): {}
}
