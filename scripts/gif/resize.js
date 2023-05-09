import { gifsicleRun } from './gifsicle.js';

const resultGif = document.getElementById('result_resize');
const downloadBtn = document.getElementById('download_btn_resize');
const timeValue = document.getElementById('time_resize');
const doneArea = document.getElementById('done_area_resize');

document.getElementById('resize_form').addEventListener('submit', async (e) => {
	e.preventDefault();

	const w = e.target.w.value;
	const h = e.target.h.value;

	const previewImg = document.getElementById('preview_img');
	const { fileName } = previewImg.dataset;

	const { results, time } = await gifsicleRun({
		blobUrl: previewImg.src,
		fileName,
		cmd: `--resize ${w}x${h} ${fileName}`
	});

	const resultUrl = URL.createObjectURL(results[0]);

	resultGif.src = resultUrl;

	downloadBtn.href = resultUrl;
	downloadBtn.download = fileName;

	timeValue.innerText = time;

	doneArea.style.display = 'flex';
});