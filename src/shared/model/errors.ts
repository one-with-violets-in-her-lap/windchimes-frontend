/**
 * error with which some essential functionality cannot work,
 * causes error page to open
 */
export class FatalError extends Error {
    constructor(
        readonly name: string,
        readonly explanation: string,
    ) {
        super(explanation)
    }
}

export class NotFoundError extends FatalError {
    constructor(explanation: string) {
        super('not-found-error', explanation)
    }
}

export class DragAndDropError extends Error {
    constructor(readonly explanation?: string) {
        super(explanation || 'failed to handle drag and drop action')
    }
}
