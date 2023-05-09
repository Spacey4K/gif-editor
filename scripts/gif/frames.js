import { gifsicleRun } from './gifsicle.js';

const resultsDiv = document.getElementById('result_frames');
// const downloadBtn = document.getElementById('download_btn_frames');
const timeValue = document.getElementById('time_frames');
const doneArea = document.getElementById('done_area_frames');

document.getElementById('export_frames').addEventListener('click', async () => {
	const previewImg = document.getElementById('preview_img');
	const { fileName } = previewImg.dataset;

	const { results, time } = await gifsicleRun({
		blobUrl: previewImg.src,
		fileName,
		cmd: `-e -U ${fileName}`
	});

	resultsDiv.innerHTML = '';
	results.forEach((result) => {
		const resultUrl = URL.createObjectURL(result);

		const img = document.createElement('img');
		img.src = resultUrl;

		resultsDiv.appendChild(img);
	});

	// TODO zip
	/* downloadBtn.href = resultUrl;
	downloadBtn.download = fileName; */

	timeValue.innerText = time;

	doneArea.style.display = 'flex';
});