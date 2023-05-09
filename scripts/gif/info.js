import { gifsicleRun } from './gifsicle.js';

const resultInfo = document.getElementById('result_info');

document.getElementById('display_info').addEventListener('click', async () => {
	const { fileName } = previewImg.dataset;

	const { results, time } = await gifsicleRun({
		blobUrl: previewImg.src,
		fileName,
		cmd: `--info ${fileName}`
	});

	const resultText = await results[0].text();
	resultInfo.innerText = resultText;
});