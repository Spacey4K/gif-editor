import { gifsicleRun } from './gifsicle.js';

const resultGif = document.getElementById('result_crop');
const downloadBtn = document.getElementById('download_btn_crop');
const timeValue = document.getElementById('time_crop');
const doneArea = document.getElementById('done_area_crop');
const previewImg = document.getElementById('preview_img');
const cropPreview = document.getElementById('preview_crop');

document.getElementById('crop').addEventListener('click', async () => {
	const { fileName } = previewImg.dataset;

	const { results, time } = await gifsicleRun({
		blobUrl: previewImg.src,
		fileName,
		cmd: `--crop ${parseInt(b.x1)},${parseInt(b.y1)}-${parseInt(b.x2)},${parseInt(b.y2)} ${fileName}`,
	});

	const resultUrl = URL.createObjectURL(results[0]);

	resultGif.src = resultUrl;

	downloadBtn.href = resultUrl;
	downloadBtn.download = fileName;

	timeValue.innerText = time;

	doneArea.style.display = 'flex';
});

document.getElementById('center_snap').addEventListener('click', () => {
	const centerX = previewImg.width / 2;
	const centerY = previewImg.height / 2;

	const wx = b.x2 - b.x1;
	const wy = b.y2 - b.y1;

	b.xm = centerX - wb / 2;
	b.ym = centerY - wb / 2;

	b.x1 = centerX - wx / 2;
	b.y1 = centerY - wy / 2;

	b.x2 = centerX + wx / 2;
	b.y2 = centerY + wy / 2;

	draw();
});

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("crop_canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

document.getElementById('crop_btn').addEventListener('click', async () => {
	cropPreview.src = previewImg.src;
});

cropPreview.addEventListener('load', () => {
	canvas.width = cropPreview.offsetWidth;
	canvas.height = cropPreview.offsetHeight;

	draw();
});

const wb = 10;
const b = {
	x1: 0, y1: 0,
	x2: 100, y2: 100,
	xm: 50 - wb / 2, ym: 50 - wb / 2,
};

const clickedIn = {
	'1': false,
	'2': false,
	'm': false,
};

canvas.addEventListener('mousedown', (e) => {
	const x = e.offsetX;
	const y = e.offsetY;

	if (x >= b.x1 && y >= b.y1 && x <= b.x1 + wb && y <= b.y1 + wb) clickedIn['1'] = true;
	if (x >= b.x2 && y >= b.y2 && x <= b.x2 + wb && y <= b.y2 + wb) clickedIn['2'] = true;
	if (x >= b.xm && y >= b.ym && x <= b.xm + wb && y <= b.ym + wb) clickedIn['m'] = true;
});

canvas.addEventListener('mouseup', (e) => {
	clickedIn['1'] = false;
	clickedIn['2'] = false;
	clickedIn['m'] = false;
});

canvas.addEventListener('mousemove', (e) => {
	const x = e.offsetX;
	const y = e.offsetY;

	if (clickedIn['1']) {
		b.x1 = x;
		b.y1 = y;

		draw();
	}
	else if (clickedIn['2']) {
		b.x2 = x;
		b.y2 = y;

		draw();
	}
	else if (clickedIn['m']) {
		const wx = b.x2 - b.x1;
		const wy = b.y2 - b.y1;

		b.x1 = x - wx / 2;
		b.y1 = y - wy / 2;

		b.x2 = x + wx / 2;
		b.y2 = y + wy / 2;

		draw();
	}

	b.xm = b.x1 + (b.x2 - b.x1) / 2 - wb / 2;
	b.ym = b.y1 + (b.y2 - b.y1) / 2 - wb / 2;
});

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const wx = b.x2 - b.x1;
	const wy = b.y2 - b.y1;

	// dashed border
	ctx.setLineDash([5]);
	ctx.strokeStyle = '#fff';
	ctx.strokeRect(b.x1, b.y1, wx, wy);

	ctx.setLineDash([]);
	ctx.strokeStyle = '#000';
	ctx.strokeRect(b.x1, b.y1, wx, wy);

	ctx.beginPath();
	ctx.strokeStyle = '#000';
	ctx.fillStyle = '#fff';

	// p1
	ctx.rect(b.x1, b.y1, wb, wb);
	ctx.fill();
	ctx.stroke();

	// p2
	ctx.rect(b.x2, b.y2, wb, wb);
	ctx.fill();
	ctx.stroke();

	// mid
	ctx.beginPath();
	ctx.rect(b.xm, b.ym, wb, wb);
	ctx.fill();
	ctx.stroke();
}

