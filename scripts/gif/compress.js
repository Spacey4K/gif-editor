import { gifsicleRun } from './gifsicle.js';
import { bytesToHuman } from '../util.js';

const resultGif = document.getElementById('result_compress');
const downloadBtn = document.getElementById('download_btn_compress');
const timeValue = document.getElementById('time_compress');
const doneArea = document.getElementById('done_area_compress');
const output_compress_tmp = document.getElementById('output_compress_tmp');

const optimize = {
	low: 'O1',
	medium: 'O2',
	high: 'O3',
};

document.getElementById('compress_form').addEventListener('submit', async (e) => {
	e.preventDefault();

	const compressionLvl = e.target.compression_lvl.value;
	const amount = e.target.amount.value;

	const previewImg = document.getElementById('preview_img');
	const { fileName, fileSize: ogFileSize } = previewImg.dataset;

	const { results, time } = await gifsicleRun({
		blobUrl: previewImg.src,
		fileName,
		cmd: `-${optimize[compressionLvl]} --lossy=${amount} ${fileName}`
	});

	const resultUrl = URL.createObjectURL(results[0]);

	resultGif.src = resultUrl;

	downloadBtn.href = resultUrl;
	downloadBtn.download = fileName;

	timeValue.innerText = time;
	output_compress_tmp.innerText = `\nReduced from ${bytesToHuman(ogFileSize)} to ${bytesToHuman(results[0].size)}`;

	doneArea.style.display = 'flex';
});