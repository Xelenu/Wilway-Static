const contentSources = {
    '1': {
        url: '/gam/frame/repo.html',
        showMessage: true,
        messageText: '⚠️ Because this is a PC game, you will have to have some patience in order for this to load! ✨ This is a special game.',
        creditsText: 'Port by breadbb and 98corbins'
    },
    '2': {
        url: '/gam/frame/webfishing.html',
        showMessage: true,
        messageText: '✨ This is a special game!',
        creditsText: 'Port by breadbb and aukak'
    },
    '3': {
        url: '/gam/frame/fnf.html',
        showMessage: false,
        creditsText: 'Ninjamuffin99'
    },
    '4': {
        url: '/gam/frame/wolfenstein.html',
        showMessage: true,
        messageText: '👀 This game is from 1992!',
        creditsText: 'id Software'
    },
    '5': {
        url: 'https://example.com',
        showMessage: false,
        creditsText: '...'
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

    console.log('Content ID:', contentId); // Debug contentId
    console.log('Message element:', message); // Debug message element
    console.log('Message text element:', messageText); // Debug messageText element

    if (contentId && contentSources[contentId]) {
        const content = contentSources[contentId];
        try {
            videoBox.innerHTML = `<iframe width="100%" height="100%" src="${content.url}" frameborder="0" allowfullscreen class="video-iframe"></iframe>`;
            console.log('Iframe loaded with URL:', content.url);
        } catch (error) {
            console.error('Failed to load iframe:', error);
        }
        if (creditsText) {
            creditsText.textContent = `Credits: ${content.creditsText}`;
        } else {
            console.warn('Credits text element not found');
        }
        if (content.showMessage && message && messageText) {
            messageText.textContent = content.messageText;
            message.style.display = 'flex';
            console.log('Notification shown with text:', content.messageText);
        } else {
            console.warn('Notification not shown: showMessage=', content.showMessage, 'message=', message, 'messageText=', messageText);
        }
    } else {
        console.warn('Invalid content ID or no content found for ID:', contentId);
    }

    if (closeMessage) {
        closeMessage.addEventListener('click', () => {
            message.style.display = 'none';
            console.log('Notification closed');
        });
    } else {
        console.warn('Close message element not found');
    }

    const fullscreenButton = document.querySelector('.fullscreen-button');
    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', () => {
            const iframe = document.querySelector('.video-box .video-iframe');
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (iframe) {
                iframe.requestFullscreen();
            }
        });
    } else {
        console.warn('Fullscreen button not found');
    }

    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.returnValue = '';
    });
};
