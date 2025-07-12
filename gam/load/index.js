const contentSources = {
    '1': {
        url: '/gam/frame/repo.html',
        showMessage: true,
        messageText: '⚠️ Because this is a PC gam, you will have to have some patience in order for this to load! ✨ This is a special gam.',
        creditsText: 'Port by breadbb and 98corbins'
    },
    '2': {
        url: '/gam/frame/webfishing.html',
        showMessage: true,
        messageText: '✨ This is a special gam!',
        creditsText: 'Port by breadbb and aukak'
    },
    '3': {
        url: '/gam/frame/wolfenstein.html',
        showMessage: true,
        messageText: '👀 This gam is from 1992!',
        creditsText: 'id Software'
    },
    '4': {
        url: '/gam/frame/bfdi-branches.html',
        showMessage: true,
        messageText: '😃 This is an exclusive gam, does not save progress :/',
        creditsText: 'Port by breadbb'
    },
    '5': {
        url: '/gam/frame/fnf.html',
        showMessage: false,
        creditsText: 'Ninjamuffin99'
    },
    '6': {
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

    if (contentId && contentSources[contentId]) {
        const content = contentSources[contentId];
        try {
            videoBox.innerHTML = `<iframe width="100%" height="100%" src="${content.url}" frameborder="0" allowfullscreen class="video-iframe"></iframe>`;
        } catch (error) {}

        if (creditsText) {
            creditsText.textContent = `Credits: ${content.creditsText}`;
        }

        if (content.showMessage && message && messageText) {
            messageText.textContent = content.messageText;
            message.style.display = 'flex';
        }
    }

    if (closeMessage) {
        closeMessage.addEventListener('click', () => {
            message.style.display = 'none';
        });
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
    }

    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.returnValue = '';
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const workerUrl = 'https://aph.grady.lol';
    const panels = ['left', 'right'];

    fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panels })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(data => {
        panels.forEach(label => {
            const imgEl = document.querySelector(`.${label}-panel .panel-image`);
            if (!imgEl || !data[label]) return;

            imgEl.src = data[label].imageUrl;
            imgEl.style.cursor = 'pointer';
            imgEl.addEventListener('click', () => {
                window.open(data[label].link, '_blank');
            });
        });
    })
    .catch(() => {});
});
