import {StringLiteralType} from "../../../src"
import {join} from 'path'
import {readFileSync} from "fs";
import {TEMPLATES_DIR} from "../../../src/util/constants";
import Mustache = require("mustache");

const TYPE_NAME = 'MyStringLiteralType'
const GENERATED_TYPE_NAME_REGEXP = new RegExp('^__TTG_Anonymous_stringLiteral_[0-9]+$')
const VALUE = "hello"

const TYPE_DEFINITION_TEMPLATE = readFileSync(join(TEMPLATES_DIR, 'PrimitiveLiteralType.ts.mustache')).toString()
const TYPE_GUARD_DEFINITION_TEMPLATE = readFileSync(join(TEMPLATES_DIR, 'PrimitiveLiteralType.guard.ts.mustache')).toString()

describe('StringLiteralType', () => {
    let instance: StringLiteralType

    describe('with name', () => {
        beforeEach(async () => {
            instance = new StringLiteralType(VALUE, TYPE_NAME)
        })

        it('should have the correct name', () => {
            instance.getName().should.equal(TYPE_NAME)
        })

        it('should be exported', () => {
            instance.isExported().should.be.true
        })

        it('should have the correct type definition', () => {
            instance.getTypeDefinition().should.equal(Mustache.render(TYPE_DEFINITION_TEMPLATE, {
                name: TYPE_NAME,
                value: JSON.stringify(VALUE),
                type: 'string',
            }))
        })

        it('should have the correct type guard definition', () => {
            instance.getTypeGuardDefinition().should.equal(Mustache.render(TYPE_GUARD_DEFINITION_TEMPLATE, {
                name: TYPE_NAME,
                value: JSON.stringify(VALUE),
                type: 'string',
            }))
        })

        it('should report the correct dependencies', () => {
            instance.getDependencies().should.eql([])
        })
    })

    describe('when anonymous', () => {
        beforeEach(async () => {
            instance = new StringLiteralType(VALUE)
        })

        it('should have a generated name', () => {
            instance.getName().should.match(GENERATED_TYPE_NAME_REGEXP)
        })

        it('should not be exported', () => {
            instance.isExported().should.be.false
        })
    })
})
