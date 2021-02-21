import {
    Type,
    FILES_DIR,
    TEMPLATES_DIR,
    collectTypes,
    collectReferences,
    COLLAPSE,
    VALIDATE,
    RESOLVE,
    UTIL_DIR,
    INTERNAL_PREFIX,
    REFERENCES,
    RESOLVER,
    VALIDATOR,
} from './internal'
import {close, copy, open, outputFile, write} from "fs-extra";
import {join} from 'path'
import Mustache from "mustache";
import {readFileSync} from "fs";

const VALIDATE_CODE = readFileSync(join(TEMPLATES_DIR, 'validate.ts.mustache')).toString()
const RESOLVE_CODE = readFileSync(join(TEMPLATES_DIR, 'resolve.ts.mustache')).toString()
const REFERENCES_CODE = readFileSync(join(TEMPLATES_DIR, 'references.ts.mustache')).toString()
const RESOLVER_CODE = readFileSync(join(TEMPLATES_DIR, 'Resolver.ts.mustache')).toString()
const VALIDATOR_CODE = readFileSync(join(TEMPLATES_DIR, 'Validator.ts.mustache')).toString()
const INDEX_CODE = readFileSync(join(TEMPLATES_DIR, 'index.ts.mustache')).toString()

export class TsTypeGenerator {
    private readonly types: Type[] = []

    type(type: Type): TsTypeGenerator {
        this.types.push(type)
        return this
    }

    async generate(outputDir: string): Promise<void> {
        const types = collectTypes(this.types)
        const references = collectReferences(types)
        await copy(FILES_DIR, outputDir)
        const validateExports = await open(join(outputDir, VALIDATE + '.ts'), 'w')
        const resolveExports = await open(join(outputDir, RESOLVE + '.ts'), 'w')
        const collapseExports = await open(join(outputDir, COLLAPSE + '.ts'), 'w')
        await write(validateExports, Mustache.render(VALIDATE_CODE, {
            internalPrefix: INTERNAL_PREFIX,
            validated: VALIDATE,
            resolved: RESOLVE,
            collapsed: COLLAPSE,
            utilDir: UTIL_DIR,
        }))
        await write(resolveExports, Mustache.render(RESOLVE_CODE, {
            internalPrefix: INTERNAL_PREFIX,
            validated: VALIDATE,
            resolved: RESOLVE,
            references: REFERENCES,
            collapsed: COLLAPSE,
            utilDir: UTIL_DIR,
        }))
        for (const type of types) {
            await type.writeValidateCode(validateExports)
            await type.writeResolveCode(resolveExports)
            await type.writeCollapseCode(collapseExports)
        }
        await close(validateExports)
        await close(resolveExports)
        await close(collapseExports)
        await outputFile(join(outputDir, REFERENCES + '.ts'), Mustache.render(REFERENCES_CODE, {
            validated: VALIDATE,
            resolved: RESOLVE,
            collapsed: COLLAPSE,
            utilDir: UTIL_DIR,
            referencesData: references,
        }))
        await outputFile(join(outputDir, RESOLVER + '.ts'), Mustache.render(RESOLVER_CODE, {
            validated: VALIDATE,
            resolved: RESOLVE,
            collapsed: COLLAPSE,
            references: REFERENCES,
            utilDir: UTIL_DIR,
            referencesData: references,
        }))
        await outputFile(join(outputDir, VALIDATOR + '.ts'), Mustache.render(VALIDATOR_CODE, {
            validated: VALIDATE,
            resolver: RESOLVER,
            utilDir: UTIL_DIR,
            references: REFERENCES,
            referencesData: references,
        }))
        await outputFile(join(outputDir, 'index.ts'), Mustache.render(INDEX_CODE, {
            validated: VALIDATE,
            resolved: RESOLVE,
            collapsed: COLLAPSE,
            references: REFERENCES,
            resolver: RESOLVER,
            validator: VALIDATOR,
            utilDir: UTIL_DIR,
        }))
    }
}
