import { part1Unit1 } from './modules/part1-unit1.js';
import { part1Unit2 } from './modules/part1-unit2.js';
import { part1Unit3 } from './modules/part1-unit3.js';
import { part1Unit4 } from './modules/part1-unit4.js';
import { part1Unit5 } from './modules/part1-unit5.js';
import { part2Unit1 } from './modules/part2-unit1.js';
import { part2Unit2 } from './modules/part2-unit2.js';
import { part2Unit3 } from './modules/part2-unit3.js';
import { part2Unit4 } from './modules/part2-unit4.js';
import { part2Unit5 } from './modules/part2-unit5.js';
import { bonusUnit } from './modules/bonus.js';

export const courseData = {
  parts: [
    {
      id: 'part1',
      title: 'Part 1 - ASP.NET Core MVC',
      units: [
        part1Unit1,
        part1Unit2,
        part1Unit3,
        part1Unit4,
        part1Unit5
      ]
    },
    {
      id: 'part2',
      title: 'Part 2 - RESTful APIs',
      units: [
        part2Unit1,
        part2Unit2,
        part2Unit3,
        part2Unit4,
        part2Unit5
      ]
    },
    {
      id: 'bonus',
      title: 'Bonus - Enterprise Deep-Dives',
      units: [
        bonusUnit
      ]
    }
  ]
};

export default courseData;
