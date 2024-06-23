document.addEventListener('DOMContentLoaded', () => {
    const targetDisplay = document.getElementById('targetDisplay');
    const targetContainer = document.getElementById('targetContainer');
    const countdown = document.getElementById('countdown');
    const countdownContainer = document.getElementById('countdownContainer');
    const slideshow = document.getElementById('slideshow');
    const progressBar = document.getElementById('progressBar');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const stopButton = document.getElementById('stopButton');
    const backButton = document.getElementById('backButton');
    let slideshowInterval;
    let progressInterval;
    const interval = 30000; // 30 seconds

    // Load settings from localStorage
    const settings = JSON.parse(localStorage.getItem('slideshowSettings'));
    if (settings) {
        targetDisplay.textContent = `Target: ${settings.target}`;
    }

    function startCountdown(seconds, callback) {
        countdown.textContent = seconds;
        const intervalId = setInterval(() => {
            seconds--;
            countdown.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(intervalId);
                callback();
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

    // Navigate back to main page
    backButton.addEventListener('click', () => {
        window.location.href = "../main_page/main_page.html";
    });

    // Display target for 3 seconds, then start countdown
    targetContainer.style.display = 'block';
    setTimeout(() => {
        targetContainer.style.display = 'none';
        countdownContainer.style.display = 'block';
        startCountdown(3, () => {
            countdownContainer.style.display = 'none';
            slideshow.style.display = 'block';
            progressBarContainer.style.display = 'block';
            startSlideshow();
        });
    }, 3000);
});
