import gifsicle from '../../dist/gifsicle.min.js';

async function gifsicleRun({ blobUrl, fileName, cmd }) {
	const pStart = performance.now();

	const results = await gifsicle.run({
		input: [{
			file: blobUrl,
			name: fileName,
		}],
		command: [`${cmd} -o /out/${fileName}`]
	});

	const pEnd = performance.now();

	return {
		results,
		time: pEnd - pStart,
	};
}

export { gifsicleRun };
