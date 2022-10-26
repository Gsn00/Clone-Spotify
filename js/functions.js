window.onload = function() {

	var audioPlayer = document.getElementById('audioplayer');
	var current = 0;
	var playBtn = document.getElementById('playBtn');
	var pauseBtn = document.getElementById('pauseBtn');
	var loaded = false;
	var interval;

	var isProgressBarDrag = false;
	var html = document.getElementsByTagName('html')[0];
	var body = document.getElementsByTagName('body')[0];
	var bar = document.getElementsByClassName('player-control-progress')[0];
	var barFill = document.getElementsByClassName('player-control-progress-fill')[0];
	var barPointer = document.getElementsByClassName('player-control-progress-pointer')[0];

	var isVolumeBarDrag = false;
	var volume = 1.0;
	var volumeOn = document.getElementById('volumeOn');
	var volumeOff = document.getElementById('volumeOff');
	var volumeBar = document.getElementsByClassName('player-control-volume')[0];
	var volumeBarFill = document.getElementsByClassName('player-control-volume-fill')[0];
	var volumeBarPointer = document.getElementsByClassName('player-control-volume-pointer')[0];

	playBtn.addEventListener('click', (e) => {
		e.preventDefault();

		playBtn.style.display = 'none';
		pauseBtn.style.display = 'inline';

		audioPlayer.play();

		return false;
	});

	pauseBtn.addEventListener('click', (e) => {
		e.preventDefault();

		pauseBtn.style.display = 'none';
		playBtn.style.display = 'inline';

		audioPlayer.pause();

		return false;
	});

	const playSong = (file) => {
		if (!loaded) {
			audioPlayer.innerHTML = `<source src="`+file+`" type="audio/mp3"/>`;
			loaded = true;
		}
		audioPlayer.play();

		playBtn.style.display = 'none';
		pauseBtn.style.display = 'inline';
	}

	const refreshBar = () => {
		let currTime = document.getElementById('currTime');
		interval = setInterval(function() {
			document.getElementById('maxTime').textContent = parseSecondToMinute(audioPlayer.duration);
			currTime.textContent = parseSecondToMinute(audioPlayer.currentTime);

			let percent = audioPlayer.currentTime / audioPlayer.duration * 100;
			barFill.style.width = percent+'%';
			barPointer.style.left = percent+'%';
		}, 1000);
	}

	const parseSecondToMinute = (timeinseconds) => {	
		let minutes = Math.floor(timeinseconds / 60);
		let seconds = (timeinseconds - (60 * minutes))+'';
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
		let secondsFixed = seconds.split('.')[0];

		return minutes+':'+secondsFixed;
	}

	const parsePercentToSecond = (percent) => {
		let seconds = audioPlayer.duration * percent / 100;
		return seconds;
	}

	document.querySelectorAll('.main-col').forEach(item => {
		item.addEventListener('click', (e) => {
			let image = item.getAttribute('data-image');
			let artist = item.getAttribute('data-artist');
			let song = item.getAttribute('data-song');
			let file = item.getAttribute('data-file');

			let playerArtist = document.getElementsByClassName('player-artist');
			playerArtist[0].innerHTML = 
			`
			<img src="`+image+`">
			<div>
				<h3>`+song+`</h3>
				<p>`+artist+`</p>
			</div>
			`;

			playSong(file);
			refreshBar();
		});
	});

	//Progress bar

	const progressBarClick = () => {
		let bar = document.getElementsByClassName('player-control-progress')[0];
		let barFill = document.getElementsByClassName('player-control-progress-fill')[0];
		let barPointer = document.getElementsByClassName('player-control-progress-pointer')[0];
		bar.addEventListener('click', (e) => {
			let mouseX = e.pageX - bar.offsetLeft;
			let percent = mouseX / bar.offsetWidth * 100;
			barFill.style.width = percent+'%';
			barPointer.style.left = percent+'%';
			current = parsePercentToSecond(percent);
			setSongTime(current);
		});
	}
	progressBarClick();

	const progressBarMouseDown = () => {
		bar.addEventListener('mousedown', (e) => {
			isProgressBarDrag = true;
			disableSelect();
		});
	}
	progressBarMouseDown();

	const progressBarMouseUp = () => {
		bar.addEventListener('mouseup', (e) => {
			isProgressBarDrag = false;
			enableSelect();
			setSongTime(current);
		});
		body.addEventListener('mouseup', (e) => {
			isProgressBarDrag = false;
			enableSelect();
		});
	}
	progressBarMouseUp();

	const progressBarDrag = () => {
		body.addEventListener('mousemove', (e) => {
			if (isProgressBarDrag) {
				let mouseX = e.pageX - bar.offsetLeft;
				let percent = mouseX / bar.offsetWidth * 100;
				if (percent > 100) percent = 100;
				if (percent < 0) percent = 0;
				barFill.style.width = percent+'%';
				barPointer.style.left = percent+'%';
				current = parsePercentToSecond(percent);
			}
		});
	}	
	progressBarDrag();

	//Volume bar

	const volumeOnClick = () => {
		volumeOn.addEventListener('click', (e) => {
			e.preventDefault();
			audioPlayer.muted = true;
			volumeBarFill.style.width = 0;
			volumeBarPointer.style.left = 0;
			volumeOn.style.display = 'none';
			volumeOff.style.display = 'block';
			return false;
		});
	}
	volumeOnClick();

	const volumeOffClick = () => {
		volumeOff.addEventListener('click', (e) => {
			e.preventDefault();
			audioPlayer.muted = false;
			volumeBarFill.style.width = volume*100+'%';
			volumeBarPointer.style.left = volume*100+'%';
			volumeOff.style.display = 'none';
			volumeOn.style.display = 'block';
			return false;
		});
	}
	volumeOffClick();

	const volumeBarClick = () => {
		volumeBar.addEventListener('click', (e) => {
			let mouseX = e.pageX - volumeBar.offsetLeft;
			let percent = mouseX / volumeBar.offsetWidth * 100;
			volumeBarFill.style.width = percent+'%';
			volumeBarPointer.style.left = percent+'%';
			volume = percent / 100;
			audioPlayer.volume = volume;
			if (audioPlayer.muted) {
				volumeOff.click();
				audioPlayer.muted = false;
			}
		});
	}
	volumeBarClick();

	const volumeBarMouseDown = () => {
		volumeBar.addEventListener('mousedown', (e) => {
			isVolumeBarDrag = true;
			disableSelect();
		});
	}
	volumeBarMouseDown();

	const volumeBarMouseUp = () => {
		body.addEventListener('mouseup', (e) => {
			isVolumeBarDrag = false;
			enableSelect();
		});
	}
	volumeBarMouseUp();

	const volumeBarDrag = () => {
		body.addEventListener('mousemove', (e) => {
			if (isVolumeBarDrag) {
				let mouseX = e.pageX - volumeBar.offsetLeft;
				let percent = mouseX / volumeBar.offsetWidth * 100;
				if (percent > 100) percent = 100;
				if (percent < 0) percent = 0;
				volumeBarFill.style.width = percent+'%';
				volumeBarPointer.style.left = percent+'%';
				volume = percent / 100;
				audioPlayer.volume = volume;
				if (audioPlayer.muted) {
					volumeOff.click();
					audioPlayer.muted = false;
				}
			}
		});
	}	
	volumeBarDrag();

	const setSongTime = (seconds) => {
		audioPlayer.currentTime = seconds;
	}

	const disableSelect = () => {
		html.style = "user-select: none;";
		body.style = "user-select: none;";
	}

	const enableSelect = () => {
		html.style = "user-select: auto;";
		body.style = "user-select: auto;";
	}
}