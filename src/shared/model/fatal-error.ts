export class FatalError extends Error {
    constructor(
        readonly name: string,
        readonly explanation: string,
    ) {
        super(explanation)
    }
}
