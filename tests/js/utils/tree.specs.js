import assert from 'assert';
import {createTree} from '../../../src/static/utils/tree';


describe('tree', function () {

    describe('#createTree', function () {

        it('should assign children to parent element', function () {
            const items = [{id: 1}, {id: 11, parent: 1}, {id: 12, parent: 1}];
            const expected = [
                {
                    id: 1,
                    children: [{id: 11, parent: 1}, {id: 12, parent: 1}],
                }
            ];

            assert.deepStrictEqual(createTree(items), expected);
        });

        it('should create deep tree with child for each node', function () {
            const items = [{id: 1}, {id: 11, parent: 1}, {id: 111, parent: 11}];
            const expected = [
                {
                    id: 1,
                    children: [
                        {
                            id: 11,
                            parent: 1, children: [{id: 111, parent: 11}]
                        }
                    ],
                }
            ];

            assert.deepStrictEqual(createTree(items), expected);
        });

        it('should assign child for each parent', function () {
            const items = [{id: 1}, {id: 2}, {id: 11, parent: 1}, {id: 22, parent: 2}];
            const expected = [
                {
                    id: 1,
                    children: [{id: 11, parent: 1}],
                },
                {
                    id: 2,
                    children: [{id: 22, parent: 2}],
                },
            ];

            assert.deepStrictEqual(createTree(items), expected);
        });

        it('should create tree from not sorted array', function () {
            const items = [{id: 111, parent: 11}, {id: 11, parent: 1}, {id: 1}];
            const expected = [{id: 1, children: [{id: 11, parent: 1, children: [{id: 111, parent: 11}]}]}];

            assert.deepStrictEqual(createTree(items), expected);
        });
    });
});