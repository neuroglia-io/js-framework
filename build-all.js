/** Builds the angular packages in the proper order */
const { spawn  } = require('child_process');
const ngBin = './node_modules/@angular/cli/bin/ng';
const params = process.argv.slice(2);
const projects = [
  '@neuroglia/common',
  '@neuroglia/string-formatter',
  '@neuroglia/logging',
  '@neuroglia/logging-transport-console',
  '@neuroglia/integration',
  '@neuroglia/angular-logging',
  '@neuroglia/angular-common',
  '@neuroglia/angular-oidc',
  '@neuroglia/angular-rest-core',
  '@neuroglia/angular-signalr', 
  '@neuroglia/angular-native-federation',
  '@neuroglia/angular-native-federation-tools',
  '@neuroglia/angular-ngrx'
];
const ngBuild = (project) => () => new Promise((resolve, reject) => {
	console.log(`========== ${project} ==========`);
	console.log(`ng build ${project} ${params.join(' ')}`);
	const proc = spawn('node', [ngBin, 'build', project, ...params]);
	proc.stdout.pipe(process.stdout, { end: false });
	proc.stderr.pipe(process.stderr, { end: false });
	proc.on('error', (error) => {
		console.error(`error: ${error.message}`);
	});
	proc.on('close', code => {
		console.log(`ng exited with code ${code}`);
		resolve();
	});
});
const chainPromises = (arr, continueOnError = false) => {
  let results = [];
  return arr.reduce((current, next, i) =>
    current
      .then(accumulatedResults => {
        results = accumulatedResults;
        return next();
      })
      .then(nextResult => [...results, nextResult])
      .catch(err => {
        if (continueOnError) return [...results, null];
        throw err;
      }),
    Promise.resolve(results)
  );
};
chainPromises(projects.map(ngBuild), true)
	.then(() => 
		console.log('done')
	)
	.catch(console.error.bind(console))
	;