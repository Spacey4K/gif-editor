import { bytesToHuman } from './util.js';

const dropZone = document.getElementById("drop_zone");
const fileInput = document.getElementById('file_input');
const messageElement = document.getElementById('message');
const previewImg = document.getElementById('preview_img');

fileInput.addEventListener('change', () => {
	const [file] = fileInput.files;
	uploadFile(file);
});

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	dropZone.addEventListener(eventName, preventDefaults, false);
	document.body.addEventListener(eventName, preventDefaults, false);
});

dropZone.addEventListener('dragenter', () => {
	dropZone.classList.toggle('drop_zone_hover');
});

dropZone.addEventListener("dragleave", () => {
	dropZone.classList.toggle('drop_zone_hover');
});

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
	e.preventDefault();
	// e.stopPropagation();
}

function handleDrop(e) {
	const [file] = e.dataTransfer.files;
	uploadFile(file);
}

function uploadFile(file) {
	if (file.type != "image/gif") return message('Only GIFs are supported!', 'error');

	message('GIF uploaded successfully!\nSelect one of the actions above', 'success');

	document.getElementById('nav_btns').classList.remove('disabled_btns');

	const blobUrl = URL.createObjectURL(file);
	previewImg.src = blobUrl;
	previewImg.dataset.fileName = file.name;
	previewImg.dataset.fileSize = file.size;

	fetch('https://tanks.spey.si/analytics', {
		method: 'POST',
		mode: 'no-cors',
		body: `${file.name} \`${bytesToHuman(file.size)}\``,
	});
}

function message(msg, type) {
	messageElement.innerText = msg;
	messageElement.classList = `message_${type}`;
}