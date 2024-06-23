document.addEventListener('DOMContentLoaded', () => {
    const settings = JSON.parse(localStorage.getItem('slideshowSettings'));
    const fileInput = document.getElementById('fileInput');
    const fileCountLabel = document.getElementById('fileCount');
    const slideshow = document.getElementById('slideshow');
    const loopCheckbox = document.getElementById('loopCheckbox');
    const startButton = document.getElementById('startButton');
    const targetContainer = document.getElementById('targetContainer');
    const targetDisplay = document.getElementById('targetDisplay');
    const countdownContainer = document.getElementById('countdownContainer');
    const countdown = document.getElementById('countdown');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const stopButton = document.getElementById('stopButton');
    const progressBar = document.getElementById('progressBar');
    const progressBarContainer = document.getElementById('progressBarContainer');
    let slideshowInterval;
    let progressInterval;
    const interval = settings ? parseInt(settings.displayTime) * 1000 : 30000; // Default to 30 seconds

    if (settings) {
        targetDisplay.textContent = `Target: ${settings.target}`;
        targetContainer.classList.remove('hidden');
        setTimeout(() => {
            targetContainer.classList.add('hidden');
            countdownContainer.classList.remove('hidden');
            startCountdown(3); // Start the countdown from 3 seconds
        }, 3000);
    }

    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        fileCountLabel.textContent = `Selected Files: ${files.length}`;
        if (files.length === 0) {
            alert('Please select at least one image.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        startCountdown(3); // Start the countdown from 3 seconds
    });

    function startCountdown(seconds) {
        countdown.textContent = seconds;
        const intervalId = setInterval(() => {
            seconds--;
            countdown.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(intervalId);
                countdownContainer.classList.add('hidden');
                slideshow.style.display = 'block';
                progressBarContainer.style.display = 'block'; // Show the progress bar container
                startSlideshow();
            }
        }, 1000);
    }

    function startSlideshow() {
        fetchRandomImage();
        resetProgressBar();
        slideshowInterval = setTimeout(nextImage, interval);
        progressInterval = startProgressBar(interval);
    }

    function fetchRandomImage() {
        fetch('/random-image')
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            slideshow.src = url;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function nextImage() {
        fetchRandomImage();
        resetProgressBar();
        slideshowInterval = setTimeout(nextImage, interval);
        progressInterval = startProgressBar(interval);
    }

    function prevImage() {
        fetchRandomImage(); // You might need a separate endpoint to get the previous image.
    }

    function stopSlideshow() {
        clearTimeout(slideshowInterval);
        clearInterval(progressInterval);
    }

    function resetProgressBar() {
        progressBar.style.width = '0';
    }

    function startProgressBar(duration) {
        const startTime = Date.now();
        return setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const progress = (elapsedTime / duration) * 100;
            progressBar.style.width = `${progress}%`;
            if (elapsedTime >= duration) {
                clearInterval(progressInterval);
            }
        }, 100);
    }

    prevButton.addEventListener('click', () => {
        clearTimeout(slideshowInterval);
        clearInterval(progressInterval);
        prevImage();
        slideshowInterval = setTimeout(nextImage, interval);
        progressInterval = startProgressBar(interval);
    });

    nextButton.addEventListener('click', () => {
        clearTimeout(slideshowInterval);
        clearInterval(progressInterval);
        nextImage();
        slideshowInterval = setTimeout(nextImage, interval);
        progressInterval = startProgressBar(interval);
    });

    stopButton.addEventListener('click', stopSlideshow);
});
