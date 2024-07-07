/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import packageInfo from './package.json' assert { type: 'json' };

console.info('');
console.info('');
console.info('| Package | Version |');
console.info('| ------ | ------ |');
console.info('| ***Production dependencies*** |');

for (const dependency in packageInfo.dependencies) {
  if (dependency === 'api.feathers') {
    console.info(
      `| [${dependency}](${
        packageInfo.dependencies[dependency]
      }) | ${packageInfo.dependencies[dependency]
        .split('-')
        .slice(-1)[0]
        .replace('.tgz', '')} |`,
    );
  } else {
    console.info(
      `| [${dependency}](https://npmjs.com/package/${dependency}) | ${packageInfo.dependencies[dependency]} |`,
    );
  }
}

console.info('| ***Development dependencies*** |');

for (const dependency in packageInfo.devDependencies) {
  console.info(
    `| [${dependency}](https://npmjs.com/package/${dependency}) | ${packageInfo.devDependencies[dependency]} |`,
  );
}
