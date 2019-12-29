/*

# Write a function counting sets of three

Write a function that takes an array of positive integers and a threshold, and returns the number of sets of three which sum <= threshold.

For instance, for the array [1,2,3,4], it should consider the following sets:

* 1 2 3 (sum is 6)
* 1 2 4 (sum is 7)
* 1 3 4 (sum is 8)
* 2 3 4 (sum is 9)

So invoking `countSetsOfThree([1,2,3,4], 7)` should return 2.

Signature:

    ```
function countSetsOfThree(numbers, threshold) {
  // write here
}
```

More test cases:

```
console.log(countSetsOfThree([1,2,3,4], 7) = 2);
console.log(countSetsOfThree([4,1,3,2], 7) = 2);
console.log(countSetsOfThree([1,2,3,9], 7) = 1);
console.log(countSetsOfThree([2,2,2,2], 7) = 4);
console.log(countSetsOfThree([3,3,3,3], 7) = 0);
console.log(countSetsOfThree([1,2,3,4,5], 7) = 2);
```

See `index.ts` for more information.

Don't worry about optimizing the solution. The simpler the solution the better.

*/

function countSetsOfThree(arr, sum) {
    if (arr.length === 0) {
        return 0;
    }

    const allSubsets = getSets(arr, arr.length - 1);

    const setsOfThree = allSubsets.reduce((acc, subset) => {
        if (subset.length === 3 && (subset[0] + subset[1] + subset[2]) <= sum) {
            acc.push(subset);
        }
        return acc;
    }, []);

    return setsOfThree.length;
}

function getSets(set, index) {
    if (index === 0) {
        return [[], [set[index]]];
    } else {
        const _sets = getSets(set, index - 1);
        const _clone = JSON.parse(JSON.stringify(_sets));
        const _r = _clone.map((el) => {
            el.push(set[index]);
            return el;
        });
        return [..._sets, ..._r];
    }
}

console.log(countSetsOfThree([1, 2, 3, 4], 7) === 2);
console.log(countSetsOfThree([4, 1, 3, 2], 7) === 2);
console.log(countSetsOfThree([1, 2, 3, 9], 7) === 1);
console.log(countSetsOfThree([2, 2, 2, 2], 7) === 4);
console.log(countSetsOfThree([3, 3, 3, 3], 7) === 0);
console.log(countSetsOfThree([1, 2, 3, 4, 5], 7) === 2);
