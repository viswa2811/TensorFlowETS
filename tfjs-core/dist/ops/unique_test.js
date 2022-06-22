/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as tf from '../index';
import { ALL_ENVS, describeWithFlags } from '../jasmine_util';
import { expectArraysEqual } from '../test_util';
import { tensor1d } from './tensor1d';
describeWithFlags('unique', ALL_ENVS, () => {
    it('1d tensor with int32', async () => {
        const x = tensor1d([1, 1, 2, 4, 4, 4, 7, 8, 8]);
        const { values, indices } = tf.unique(x);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual(x.shape);
        expect(values.shape).toEqual([5]);
        expectArraysEqual(await values.data(), [1, 2, 4, 7, 8]);
        expectArraysEqual(await indices.data(), [0, 0, 1, 2, 2, 2, 3, 4, 4]);
    });
    it('1d tensor with string', async () => {
        const x = tensor1d(['a', 'b', 'b', 'c', 'c']);
        const { values, indices } = tf.unique(x);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual(x.shape);
        expect(values.dtype).toEqual('string');
        expect(values.shape).toEqual([3]);
        expectArraysEqual(await values.data(), ['a', 'b', 'c']);
        expectArraysEqual(await indices.data(), [0, 1, 1, 2, 2]);
    });
    it('1d tensor with bool', async () => {
        const x = tensor1d([true, true, false]);
        const { values, indices } = tf.unique(x);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual(x.shape);
        expect(values.dtype).toEqual('bool');
        expect(values.shape).toEqual([2]);
        expectArraysEqual(await values.data(), [true, false]);
        expectArraysEqual(await indices.data(), [0, 0, 1]);
    });
    it('1d tensor with NaN and Infinity', async () => {
        const x = tensor1d([NaN, Infinity, NaN, Infinity]);
        const { values, indices } = tf.unique(x);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual(x.shape);
        expect(values.shape).toEqual([2]);
        expectArraysEqual(await values.data(), [NaN, Infinity]);
        expectArraysEqual(await indices.data(), [0, 1, 0, 1]);
    });
    it('2d tensor with axis=0', async () => {
        const x = tf.tensor2d([[1, 0, 0], [1, 0, 0], [2, 0, 0]]);
        const { values, indices } = tf.unique(x, 0);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual([x.shape[0]]);
        expect(values.shape).toEqual([2, 3]);
        expectArraysEqual(await values.data(), [1, 0, 0, 2, 0, 0]);
        expectArraysEqual(await indices.data(), [0, 0, 1]);
    });
    it('2d tensor with axis=1', async () => {
        const x = tf.tensor2d([[1, 0, 0, 1], [1, 0, 0, 1], [2, 0, 0, 2]]);
        const { values, indices } = tf.unique(x, 1);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual([x.shape[1]]);
        expect(values.shape).toEqual([3, 2]);
        expectArraysEqual(await values.data(), [[1, 0], [1, 0], [2, 0]]);
        expectArraysEqual(await indices.data(), [0, 1, 1, 0]);
    });
    it('2d tensor with string', async () => {
        const x = tf.tensor2d([['a', 'b', 'b'], ['a', 'b', 'b'], ['c', 'b', 'b']]);
        const { values, indices } = tf.unique(x, 0);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual([x.shape[0]]);
        expect(values.dtype).toEqual('string');
        expect(values.shape).toEqual([2, 3]);
        expectArraysEqual(await values.data(), ['a', 'b', 'b', 'c', 'b', 'b']);
        expectArraysEqual(await indices.data(), [0, 0, 1]);
    });
    it('2d tensor with strings that have comma', async () => {
        const x = tf.tensor2d([['a', 'b,c', 'd'], ['a', 'b', 'c,d']]);
        const { values, indices } = tf.unique(x, 0);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual([x.shape[0]]);
        expect(values.dtype).toEqual('string');
        expect(values.shape).toEqual([2, 3]);
        expectArraysEqual(await values.data(), ['a', 'b,c', 'd', 'a', 'b', 'c,d']);
        expectArraysEqual(await indices.data(), [0, 1]);
    });
    it('3d tensor with axis=0', async () => {
        const x = tf.tensor3d([[[1, 0], [1, 0]], [[1, 0], [1, 0]], [[1, 1], [1, 1]]]);
        const { values, indices } = tf.unique(x, 0);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual([x.shape[0]]);
        expect(values.shape).toEqual([2, 2, 2]);
        expectArraysEqual(await values.data(), [1, 0, 1, 0, 1, 1, 1, 1]);
        expectArraysEqual(await indices.data(), [0, 0, 1]);
    });
    it('3d tensor with axis=1', async () => {
        const x = tf.tensor3d([[[1, 0], [1, 0]], [[1, 0], [1, 0]], [[1, 1], [1, 1]]]);
        const { values, indices } = tf.unique(x, 1);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual([x.shape[1]]);
        expect(values.shape).toEqual([3, 1, 2]);
        expectArraysEqual(await values.data(), [[[1, 0]], [[1, 0]], [[1, 1]]]);
        expectArraysEqual(await indices.data(), [0, 0]);
    });
    it('3d tensor with axis=2', async () => {
        const x = tf.tensor3d([[[1, 0, 1]], [[1, 0, 1]]]);
        const { values, indices } = tf.unique(x, 2);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual([x.shape[2]]);
        expect(values.shape).toEqual([2, 1, 2]);
        expectArraysEqual(await values.data(), [1, 0, 1, 0]);
        expectArraysEqual(await indices.data(), [0, 1, 0]);
    });
    it('3d tensor with string', async () => {
        const x = tf.tensor3d([
            [['a', 'b'], ['a', 'b']], [['a', 'b'], ['a', 'b']],
            [['a', 'a'], ['a', 'a']]
        ]);
        const { values, indices } = tf.unique(x, 0);
        expect(indices.dtype).toBe('int32');
        expect(indices.shape).toEqual([x.shape[0]]);
        expect(values.dtype).toEqual('string');
        expect(values.shape).toEqual([2, 2, 2]);
        expectArraysEqual(await values.data(), ['a', 'b', 'a', 'b', 'a', 'a', 'a', 'a']);
        expectArraysEqual(await indices.data(), [0, 0, 1]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pcXVlX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy91bmlxdWVfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRS9DLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFcEMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxNQUFNLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxpQkFBaUIsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVB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QyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELGlCQUFpQixDQUFDLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVCQUF1QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3JDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEUsTUFBTSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FB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QUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxpQkFBaUIsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNyQyxNQUFNLENBQUMsR0FDSCxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxpQkFBaUIsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RSxpQkFBaUIsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVCQUF1QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3JDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxpQkFBaUIsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsaUJBQWlCLENBQUMsTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdUJBQXVCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDckMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUNwQixDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCLENBQUMsQ0FBQztRQUNILE1BQU0sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxpQkFBaUIsQ0FDYixNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25FLGlCQUFpQixDQUFDLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNFcXVhbH0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuaW1wb3J0IHt0ZW5zb3IxZH0gZnJvbSAnLi90ZW5zb3IxZCc7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCd1bmlxdWUnLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnMWQgdGVuc29yIHdpdGggaW50MzInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHRlbnNvcjFkKFsxLCAxLCAyLCA0LCA0LCA0LCA3LCA4LCA4XSk7XG4gICAgY29uc3Qge3ZhbHVlcywgaW5kaWNlc30gPSB0Zi51bmlxdWUoeCk7XG5cbiAgICBleHBlY3QoaW5kaWNlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3QoaW5kaWNlcy5zaGFwZSkudG9FcXVhbCh4LnNoYXBlKTtcbiAgICBleHBlY3QodmFsdWVzLnNoYXBlKS50b0VxdWFsKFs1XSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgdmFsdWVzLmRhdGEoKSwgWzEsIDIsIDQsIDcsIDhdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBpbmRpY2VzLmRhdGEoKSwgWzAsIDAsIDEsIDIsIDIsIDIsIDMsIDQsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJzFkIHRlbnNvciB3aXRoIHN0cmluZycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB4ID0gdGVuc29yMWQoWydhJywgJ2InLCAnYicsICdjJywgJ2MnXSk7XG4gICAgY29uc3Qge3ZhbHVlcywgaW5kaWNlc30gPSB0Zi51bmlxdWUoeCk7XG5cbiAgICBleHBlY3QoaW5kaWNlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3QoaW5kaWNlcy5zaGFwZSkudG9FcXVhbCh4LnNoYXBlKTtcbiAgICBleHBlY3QodmFsdWVzLmR0eXBlKS50b0VxdWFsKCdzdHJpbmcnKTtcbiAgICBleHBlY3QodmFsdWVzLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgdmFsdWVzLmRhdGEoKSwgWydhJywgJ2InLCAnYyddKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBpbmRpY2VzLmRhdGEoKSwgWzAsIDEsIDEsIDIsIDJdKTtcbiAgfSk7XG5cbiAgaXQoJzFkIHRlbnNvciB3aXRoIGJvb2wnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHRlbnNvcjFkKFt0cnVlLCB0cnVlLCBmYWxzZV0pO1xuICAgIGNvbnN0IHt2YWx1ZXMsIGluZGljZXN9ID0gdGYudW5pcXVlKHgpO1xuXG4gICAgZXhwZWN0KGluZGljZXMuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGluZGljZXMuc2hhcGUpLnRvRXF1YWwoeC5zaGFwZSk7XG4gICAgZXhwZWN0KHZhbHVlcy5kdHlwZSkudG9FcXVhbCgnYm9vbCcpO1xuICAgIGV4cGVjdCh2YWx1ZXMuc2hhcGUpLnRvRXF1YWwoWzJdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCB2YWx1ZXMuZGF0YSgpLCBbdHJ1ZSwgZmFsc2VdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBpbmRpY2VzLmRhdGEoKSwgWzAsIDAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJzFkIHRlbnNvciB3aXRoIE5hTiBhbmQgSW5maW5pdHknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHRlbnNvcjFkKFtOYU4sIEluZmluaXR5LCBOYU4sIEluZmluaXR5XSk7XG4gICAgY29uc3Qge3ZhbHVlcywgaW5kaWNlc30gPSB0Zi51bmlxdWUoeCk7XG5cbiAgICBleHBlY3QoaW5kaWNlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3QoaW5kaWNlcy5zaGFwZSkudG9FcXVhbCh4LnNoYXBlKTtcbiAgICBleHBlY3QodmFsdWVzLnNoYXBlKS50b0VxdWFsKFsyXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgdmFsdWVzLmRhdGEoKSwgW05hTiwgSW5maW5pdHldKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBpbmRpY2VzLmRhdGEoKSwgWzAsIDEsIDAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJzJkIHRlbnNvciB3aXRoIGF4aXM9MCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB4ID0gdGYudGVuc29yMmQoW1sxLCAwLCAwXSwgWzEsIDAsIDBdLCBbMiwgMCwgMF1dKTtcbiAgICBjb25zdCB7dmFsdWVzLCBpbmRpY2VzfSA9IHRmLnVuaXF1ZSh4LCAwKTtcblxuICAgIGV4cGVjdChpbmRpY2VzLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdChpbmRpY2VzLnNoYXBlKS50b0VxdWFsKFt4LnNoYXBlWzBdXSk7XG4gICAgZXhwZWN0KHZhbHVlcy5zaGFwZSkudG9FcXVhbChbMiwgM10pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHZhbHVlcy5kYXRhKCksIFsxLCAwLCAwLCAyLCAwLCAwXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgaW5kaWNlcy5kYXRhKCksIFswLCAwLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCcyZCB0ZW5zb3Igd2l0aCBheGlzPTEnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjJkKFtbMSwgMCwgMCwgMV0sIFsxLCAwLCAwLCAxXSwgWzIsIDAsIDAsIDJdXSk7XG4gICAgY29uc3Qge3ZhbHVlcywgaW5kaWNlc30gPSB0Zi51bmlxdWUoeCwgMSk7XG5cbiAgICBleHBlY3QoaW5kaWNlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3QoaW5kaWNlcy5zaGFwZSkudG9FcXVhbChbeC5zaGFwZVsxXV0pO1xuICAgIGV4cGVjdCh2YWx1ZXMuc2hhcGUpLnRvRXF1YWwoWzMsIDJdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCB2YWx1ZXMuZGF0YSgpLCBbWzEsIDBdLCBbMSwgMF0sIFsyLCAwXV0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGluZGljZXMuZGF0YSgpLCBbMCwgMSwgMSwgMF0pO1xuICB9KTtcblxuICBpdCgnMmQgdGVuc29yIHdpdGggc3RyaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IyZChbWydhJywgJ2InLCAnYiddLCBbJ2EnLCAnYicsICdiJ10sIFsnYycsICdiJywgJ2InXV0pO1xuICAgIGNvbnN0IHt2YWx1ZXMsIGluZGljZXN9ID0gdGYudW5pcXVlKHgsIDApO1xuXG4gICAgZXhwZWN0KGluZGljZXMuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGluZGljZXMuc2hhcGUpLnRvRXF1YWwoW3guc2hhcGVbMF1dKTtcbiAgICBleHBlY3QodmFsdWVzLmR0eXBlKS50b0VxdWFsKCdzdHJpbmcnKTtcbiAgICBleHBlY3QodmFsdWVzLnNoYXBlKS50b0VxdWFsKFsyLCAzXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgdmFsdWVzLmRhdGEoKSwgWydhJywgJ2InLCAnYicsICdjJywgJ2InLCAnYiddKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBpbmRpY2VzLmRhdGEoKSwgWzAsIDAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJzJkIHRlbnNvciB3aXRoIHN0cmluZ3MgdGhhdCBoYXZlIGNvbW1hJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IyZChbWydhJywgJ2IsYycsICdkJ10sIFsnYScsICdiJywgJ2MsZCddXSk7XG4gICAgY29uc3Qge3ZhbHVlcywgaW5kaWNlc30gPSB0Zi51bmlxdWUoeCwgMCk7XG5cbiAgICBleHBlY3QoaW5kaWNlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3QoaW5kaWNlcy5zaGFwZSkudG9FcXVhbChbeC5zaGFwZVswXV0pO1xuICAgIGV4cGVjdCh2YWx1ZXMuZHR5cGUpLnRvRXF1YWwoJ3N0cmluZycpO1xuICAgIGV4cGVjdCh2YWx1ZXMuc2hhcGUpLnRvRXF1YWwoWzIsIDNdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCB2YWx1ZXMuZGF0YSgpLCBbJ2EnLCAnYixjJywgJ2QnLCAnYScsICdiJywgJ2MsZCddKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBpbmRpY2VzLmRhdGEoKSwgWzAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJzNkIHRlbnNvciB3aXRoIGF4aXM9MCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB4ID1cbiAgICAgICAgdGYudGVuc29yM2QoW1tbMSwgMF0sIFsxLCAwXV0sIFtbMSwgMF0sIFsxLCAwXV0sIFtbMSwgMV0sIFsxLCAxXV1dKTtcbiAgICBjb25zdCB7dmFsdWVzLCBpbmRpY2VzfSA9IHRmLnVuaXF1ZSh4LCAwKTtcblxuICAgIGV4cGVjdChpbmRpY2VzLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdChpbmRpY2VzLnNoYXBlKS50b0VxdWFsKFt4LnNoYXBlWzBdXSk7XG4gICAgZXhwZWN0KHZhbHVlcy5zaGFwZSkudG9FcXVhbChbMiwgMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHZhbHVlcy5kYXRhKCksIFsxLCAwLCAxLCAwLCAxLCAxLCAxLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgaW5kaWNlcy5kYXRhKCksIFswLCAwLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCczZCB0ZW5zb3Igd2l0aCBheGlzPTEnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9XG4gICAgICAgIHRmLnRlbnNvcjNkKFtbWzEsIDBdLCBbMSwgMF1dLCBbWzEsIDBdLCBbMSwgMF1dLCBbWzEsIDFdLCBbMSwgMV1dXSk7XG4gICAgY29uc3Qge3ZhbHVlcywgaW5kaWNlc30gPSB0Zi51bmlxdWUoeCwgMSk7XG5cbiAgICBleHBlY3QoaW5kaWNlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3QoaW5kaWNlcy5zaGFwZSkudG9FcXVhbChbeC5zaGFwZVsxXV0pO1xuICAgIGV4cGVjdCh2YWx1ZXMuc2hhcGUpLnRvRXF1YWwoWzMsIDEsIDJdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCB2YWx1ZXMuZGF0YSgpLCBbW1sxLCAwXV0sIFtbMSwgMF1dLCBbWzEsIDFdXV0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGluZGljZXMuZGF0YSgpLCBbMCwgMF0pO1xuICB9KTtcblxuICBpdCgnM2QgdGVuc29yIHdpdGggYXhpcz0yJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChbW1sxLCAwLCAxXV0sIFtbMSwgMCwgMV1dXSk7XG4gICAgY29uc3Qge3ZhbHVlcywgaW5kaWNlc30gPSB0Zi51bmlxdWUoeCwgMik7XG5cbiAgICBleHBlY3QoaW5kaWNlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3QoaW5kaWNlcy5zaGFwZSkudG9FcXVhbChbeC5zaGFwZVsyXV0pO1xuICAgIGV4cGVjdCh2YWx1ZXMuc2hhcGUpLnRvRXF1YWwoWzIsIDEsIDJdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCB2YWx1ZXMuZGF0YSgpLCBbMSwgMCwgMSwgMF0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGluZGljZXMuZGF0YSgpLCBbMCwgMSwgMF0pO1xuICB9KTtcblxuICBpdCgnM2QgdGVuc29yIHdpdGggc3RyaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChbXG4gICAgICBbWydhJywgJ2InXSwgWydhJywgJ2InXV0sIFtbJ2EnLCAnYiddLCBbJ2EnLCAnYiddXSxcbiAgICAgIFtbJ2EnLCAnYSddLCBbJ2EnLCAnYSddXVxuICAgIF0pO1xuICAgIGNvbnN0IHt2YWx1ZXMsIGluZGljZXN9ID0gdGYudW5pcXVlKHgsIDApO1xuXG4gICAgZXhwZWN0KGluZGljZXMuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGluZGljZXMuc2hhcGUpLnRvRXF1YWwoW3guc2hhcGVbMF1dKTtcbiAgICBleHBlY3QodmFsdWVzLmR0eXBlKS50b0VxdWFsKCdzdHJpbmcnKTtcbiAgICBleHBlY3QodmFsdWVzLnNoYXBlKS50b0VxdWFsKFsyLCAyLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoXG4gICAgICAgIGF3YWl0IHZhbHVlcy5kYXRhKCksIFsnYScsICdiJywgJ2EnLCAnYicsICdhJywgJ2EnLCAnYScsICdhJ10pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGluZGljZXMuZGF0YSgpLCBbMCwgMCwgMV0pO1xuICB9KTtcbn0pO1xuIl19