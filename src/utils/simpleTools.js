// /**
//  * @file simpleTools.js
//  * @brief This file contains ...
//  * 
//  * @created Jul.12 2024
//  * @update
//  */

// function shuffleArray(nums) {
//     for (let i = nums.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [nums[i], nums[j]] = [nums[j], nums[i]];
//     }
//     return nums;
// }

// /**
//  * Generates a shuffled array of integers from 0 to n-1.
//  * 
//  * @param {number} n The total number of integers.
//  * @returns {number[]} A shuffled array of integers from 0 to n-1.
//  */
// export function createShuffledArray(n) {
//     const nums = Array.from({ length: n }, (_, i) => i);
//     return shuffleArray(nums);
// }