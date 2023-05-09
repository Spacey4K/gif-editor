import { gifsicleRun } from './gifsicle.js';

const resultGif = document.getElementById('result_color');
const downloadBtn = document.getElementById('download_btn_color');
const timeValue = document.getElementById('time_color');
const doneArea = document.getElementById('done_area_color');

document.getElementById('grayscale').addEventListener('click', () => {
	handleClick('gray');
});

document.getElementById('threshold').addEventListener('click', () => {
	handleClick('bw');
});

async function handleClick(colorMap) {
	const previewImg = document.getElementById('preview_img');
	const { fileName } = previewImg.dataset;

	const { results, time } = await gifsicleRun({
		blobUrl: previewImg.src,
		fileName,
		cmd: `--use-colormap ${colorMap} ${fileName}`
	});

	const resultUrl = URL.createObjectURL(results[0]);

	resultGif.src = resultUrl;

	downloadBtn.href = resultUrl;
	downloadBtn.download = fileName;

	timeValue.innerText = time;

	doneArea.style.display = 'flex';
}