import {Type} from "../util/Type";
import {Primitive} from "../util/Primitive";
import {join} from "path";
import {PRIVATE_DIR, TEMPLATES_DIR, VALIDATION_DIR} from "../util/constants";
import {readFileSync} from "fs";
import Mustache from "mustache";
import {PrimitiveType} from "./PrimitiveType";
import {outputFile, write} from "fs-extra";

const TYPE_TEMPLATES_DIR = join(TEMPLATES_DIR, 'DictionaryType')
const VALIDATION_CODE = readFileSync(join(TYPE_TEMPLATES_DIR, 'validation.ts.mustache')).toString()

export class PrimitiveDictionaryType<T extends Primitive> implements Type {
    private readonly type: PrimitiveType<T>

    constructor(type: PrimitiveType<T>) {
        this.type = type
    }

    getValidationTypeName(): string {
        return `{[key: string]: ${this.type.getValidationTypeName()}}`;
    }

    getNamespacedValidationTypeName(): string {
        return this.getValidationTypeName()
    }

    getValidatorName(): string {
        return `validate_${this.type.getValidationTypeName()}Dictionary`;
    }

    getNamespacedValidatorName(): string {
        return `Private.${this.getValidatorName()}`
    }

    /* istanbul ignore next */
    async writeValidationCode(outputDir: string, privateExports: number): Promise<void> {
        const importPath = join(PRIVATE_DIR, `${this.type.getValidationTypeName()}Dictionary`)
        await outputFile(join(outputDir, VALIDATION_DIR, `${importPath}.ts`), Mustache.render(VALIDATION_CODE, {
            isPublic: false,
            validatorName: this.getValidatorName(),
            typeValidatorName: this.type.getNamespacedValidatorName(),
        }))
        await write(privateExports, `export * from "./${importPath}";\n`)
    }

    getDependencies(): Type[] {
        return [this.type]
    }
}
