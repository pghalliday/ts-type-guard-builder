import {ListType} from "../../../../src"
import {TestType} from "../../TestType";
import {Type} from "../../../../src/util/Type";

const NAME = 'MyListType'
const TYPE = new TestType('Type')

describe('ListType', () => {
    let instance: ListType

    before(() => {
        instance = new ListType(NAME, TYPE)
    })

    it('should be a type', () => {
        instance.should.be.an.instanceof(Type)
    })

    it('should have the correct name', () => {
        instance.getTypeName().should.equal(NAME)
    })

    it('should have the correct dependencies', () => {
        instance.getDependencies().should.eql([TYPE])
    })

    it('should not have any references', () => {
        instance.getReferences().should.eql([])
    })
})
