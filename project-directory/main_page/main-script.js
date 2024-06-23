document.addEventListener('DOMContentLoaded', () => {
    const displayTime = document.getElementById('displayTime');
    const numImages = document.getElementById('numImages');
    const target = document.getElementById('target');
    const customTarget = document.getElementById('customTarget');
    const userModeButton = document.getElementById('userMode');
    const ownModeButton = document.getElementById('ownMode');
    const userImagesButton = document.querySelector('a[href="user_page/userimage.html"]');
    const ownImagesButton = document.querySelector('a[href="own_page/ownimage.html"]');

    // 初期状態では設定項目をクリアにしておく
    displayTime.value = "";
    numImages.value = "";
    target.value = "";
    customTarget.value = "";
    customTarget.style.display = 'none';

    function validateSettings() {
        const isDisplayTimeValid = displayTime.value !== "";
        const isNumImagesValid = numImages.value !== "" && numImages.value >= 1 && numImages.value <= 100;
        const isTargetValid = target.value !== "" && (target.value !== "custom" || customTarget.value !== "");

        const isValid = isDisplayTimeValid && isNumImagesValid && isTargetValid;

        userImagesButton.style.opacity = isValid ? "1" : "0.5";
        ownImagesButton.style.opacity = isValid ? "1" : "0.5";
        userImagesButton.style.pointerEvents = isValid ? "auto" : "none";
        ownImagesButton.style.pointerEvents = isValid ? "auto" : "none";

        return isValid;
    }

    displayTime.addEventListener('change', validateSettings);
    numImages.addEventListener('input', validateSettings);
    target.addEventListener('change', () => {
        if (target.value === 'custom') {
            customTarget.style.display = 'inline-block';
        } else {
            customTarget.style.display = 'none';
        }
        validateSettings();
    });
    customTarget.addEventListener('input', validateSettings);

    document.querySelectorAll('.mode-selection a').forEach(button => {
        button.addEventListener('click', (event) => {
            if (!validateSettings()) {
                event.preventDefault();
                alert("Please fill out all settings before proceeding.");
            } else {
                const settings = {
                    displayTime: displayTime.value,
                    numImages: numImages.value,
                    target: target.value === 'custom' ? customTarget.value : target.value
                };
                localStorage.setItem('slideshowSettings', JSON.stringify(settings));
            }
        });
    });

    // モード選択のスタイル変更
    userModeButton.addEventListener('click', () => {
        selectMode(userModeButton);
    });

    ownModeButton.addEventListener('click', () => {
        selectMode(ownModeButton);
    });

    function selectMode(selectedButton) {
        userModeButton.classList.remove('selected');
        ownModeButton.classList.remove('selected');
        selectedButton.classList.add('selected');
    }
});
