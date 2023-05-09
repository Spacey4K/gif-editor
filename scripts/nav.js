const buttons = document.querySelectorAll('.nav_btn');

buttons.forEach((button) => {
	button.addEventListener('click', () => {
		if (button.classList.contains('active_btn')) return;

		const current = document.querySelector('.active_btn');
		current.classList.toggle('active_btn');
		button.classList.toggle('active_btn');

		document.getElementById(`app_${current.dataset.app}`).classList.toggle('active_app');
		document.getElementById(`app_${button.dataset.app}`).classList.toggle('active_app');
	});
});