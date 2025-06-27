const videoSources = {
    '1': {
        url: '/game/frame/repo.html',
        showNotification: true,
        notificationText: '⚠️ Because this is a PC game, you will have to have some patience in order for this to load! ✨ This is a special game.',
        creditsText: 'Port by breadbb and 98corbins'
    },
    '2': {
        url: 'https://www.youtube.com/embed/VIDEO_ID_2',
        showNotification: false,
        creditsText: 'Another Creator'
    }
};

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    const videoBox = document.querySelector('.video-box');
    const creditsText = document.querySelector('.credits-text');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const closeNotification = document.getElementById('closeNotification');

    if (videoId && videoSources[videoId]) {
        const video = videoSources[videoId];
        videoBox.innerHTML = `<iframe width="100%" height="100%" src="${video.url}" frameborder="0" allowfullscreen class="video-iframe"></iframe>`;
        creditsText.textContent = `Credits: ${video.creditsText}`;
        if (video.showNotification) {
            notificationText.textContent = video.notificationText;
            notification.style.display = 'flex';
        }
    }

    closeNotification.addEventListener('click', () => {
        notification.style.display = 'none';
    });

    const fullscreenButton = document.querySelector('.fullscreen-button');
    fullscreenButton.addEventListener('click', () => {
        const iframe = document.querySelector('.video-box .video-iframe');
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (iframe) {
            iframe.requestFullscreen();
        }
    });

    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.returnValue = '';
    });
};
