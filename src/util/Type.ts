import {Reference} from "../internal";

export abstract class Type {
    protected readonly name: string

    constructor(name: string) {
        this.name = name
    }

    abstract writeValidatedCode(exports: number): Promise<void>
    abstract writePartialCode(exports: number): Promise<void>
    abstract writeResolvedCode(exports: number): Promise<void>
    abstract getDependencies(): Type[]
    abstract getReferences(): Reference[]

    getTypeName(): string {
        return this.name
    }

    getValidatorName(): string {
        return `validate${this.name}`
    }

    getInitializerName(): string {
        return `initialize${this.name}`
    }

    getResolverName(): string {
        return `resolve${this.name}`
    }
}
