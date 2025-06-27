const contentSources = {
    '1': {
        url: '/gam/frame/repo.html',
        showMessage: true,
        messageText: '⚠️ Because this is a PC game, you will have to have some patience in order for this to load! ✨ This is a special game.',
        creditsText: 'Port by breadbb and 98corbins'
    },
    '2': {
        url: 'https://www.youtube.com/embed/VIDEO_ID_2',
        showMessage: false,
        creditsText: 'Another Creator'
    }
};

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('id');
    const videoBox = document.querySelector('.video-box');
    const creditsText = document.querySelector('.credits-text');
    const message = document.getElementById('message');
    const messageText = document.getElementById('messageText');
    const closeMessage = document.getElementById('closeMessage');

    if (contentId && contentSources[contentId]) {
        const content = contentSources[contentId];
        videoBox.innerHTML = `<iframe width="100%" height="100%" src="${content.url}" frameborder="0" allowfullscreen class="video-iframe"></iframe>`;
        creditsText.textContent = `Credits: ${content.creditsText}`;
        if (content.showMessage) {
            messageText.textContent = content.messageText;
            message.style.display = 'flex';
        }
    }

    closeMessage.addEventListener('click', () => {
        message.style.display = 'none';
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
