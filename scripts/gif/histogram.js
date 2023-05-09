import { gifsicleRun } from './gifsicle.js';

const frameRange = document.getElementById('frame_range');
const progressFrame = document.getElementById('progress_frame');
const previewImg = document.getElementById('preview_img');

/** @type {HTMLCanvasElement} */
const histogramCanvas = document.getElementById("histogram_canvas");

/** @type {HTMLCanvasElement} */
const frameCanvas = document.getElementById("progress_frame");
/** @type {CanvasRenderingContext2D} */
const ctxF = frameCanvas.getContext("2d");

const data = {
	datasets: [
		{
			label: 'R',
			backgroundColor: '#ff0000',
		}, {
			label: 'G',
			backgroundColor: '#00ff00',
		}, {
			label: 'B',
			backgroundColor: '#0000ff',
		}
	]
};

const chart = new Chart(
	histogramCanvas,
	{
		type: 'bar',
		data,
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
				}
			}
		},
	}
);

previewImg.addEventListener('load', async () => {
	const { fileName } = previewImg.dataset;

	const { results } = await gifsicleRun({
		blobUrl: previewImg.src,
		fileName,
		cmd: `--info ${fileName} `
	});

	const resultText = await results[0].text();
	const frameCount = resultText.match(/(\d*) images/);

	frameRange.max = frameCount[1] - 1;

	updateHistogram();
});

frameRange.addEventListener('input', async () => {
	updateHistogram();
});

async function updateHistogram() {
	const { fileName } = previewImg.dataset;

	const { results } = await gifsicleRun({
		blobUrl: previewImg.src,
		fileName,
		cmd: `${fileName} #${frameRange.value}`
	});

	const resultUrl = URL.createObjectURL(results[0]);

	progressFrame.src = resultUrl;

	const img = new Image();
	img.src = resultUrl;

	img.onload = () => {
		frameCanvas.width = img.width;
		frameCanvas.height = img.height;
		ctxF.drawImage(img, 0, 0);

		const { data } = ctxF.getImageData(0, 0, frameCanvas.width, frameCanvas.height);
		const channels = generateBucketsByColor(data, img.width, 5);

		Object.values(channels).forEach((channel, ci) => {
			channel.forEach((bucket, bi) => {
				chart.data.labels[bi] = bucket.label;
				chart.data.datasets[ci].data[bi] = bucket.y;
			});
		});

		chart.options.plugins.title.text = `Frame #${frameRange.value}`;

		chart.update();
	};
}

function convertTo2D(data, imgWidth) {
	const objectArr = [[]];

	let row = 0;
	for (let i = 0; i < data.length; i = i + 4) {
		objectArr[row].push({
			R: data[i],
			G: data[i + 1],
			B: data[i + 2],
			A: data[i + 3],
		});

		if (i / 4 === imgWidth * (row + 1)) {
			objectArr.push([]);
			row++;
		}
	}

	return objectArr;
}

function generateBucketsByColor(data, imgWidth, numOfBuckets) {
	const originalImg = convertTo2D(data, imgWidth);

	const bucketSize = 255 / numOfBuckets;

	if (Math.floor(bucketSize) !== bucketSize) {
		alert("Invalid num of buckets");
		return;
	}

	const buckets = { R: [], G: [], B: [] };

	for (let k = 0; k < numOfBuckets; k++) {
		const startVal = k === 0 ? bucketSize * k : bucketSize * k + 1;
		const endVal = startVal + bucketSize - 1;

		const valCount = { R: 0, G: 0, B: 0 };

		for (let i = 0; i < originalImg.length; i++) {
			for (let j = 0; j < originalImg[i].length; j++) {
				if (
					originalImg[i][j]["R"] >= startVal &&
					originalImg[i][j]["R"] <= endVal
				)
					valCount.R++;

				if (
					originalImg[i][j]["G"] >= startVal &&
					originalImg[i][j]["G"] <= endVal
				)
					valCount.G++;

				if (
					originalImg[i][j]["B"] >= startVal &&
					originalImg[i][j]["B"] <= endVal
				)
					valCount.B++;
			}
		}

		for (const [key, value] of Object.entries(buckets)) {
			buckets[key].push({
				label: `${startVal}-${endVal}`,
				y: valCount[key],
				x: k,
			});
		}
	}

	return buckets;
}