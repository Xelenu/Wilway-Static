const contentSources = {
    '1': {
        url: '/gam/frame/repo.html',
        showMessage: true,
        messageText: '⚠️ Because this is a PC gam, you will have to have some patience in order for this to load! ⭐ This is an exclusive gam.',
        creditsText: 'Port by breadbb and 98corbins'
    },
    '2': {
        url: '/gam/frame/webfishing.html',
        showMessage: false,
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
        messageText: '✨ This is a special gam, based on the show BFDI!',
        creditsText: 'Port by breadbb'
    },
    '5': {
        url: '/core/gam-scripts/baldis-fun-new-school-plus-ultimate-edition/',
        showMessage: false,
        creditsText: 'Wilway'
    },
    '6': {
        url: '/core/gam-scripts/kittytoy/',
        showMessage: true,
        messageText: '😉 This gam was ported by us 🤑 Saves progress!',
        creditsText: 'Wilway'
    },
    '7': {
        url: '/gam/frame/wbwwb.html',
        showMessage: true,
        messageText: '✍️ Every game file indivisually imported by us! Enjoy.',
        creditsText: 'Nicky Case'
    },
    '8': {
        url: '/core/gam-scripts/slope/',
        showMessage: false,
        creditsText: 'Y8'
    },
    '9': {
        url: '/core/gam-scripts/cross-the-road/',
        showMessage: false,
        creditsText: 'Rubicon'
    },
    '10': {
        url: '/core/gam-scripts/obby-bike/',
        showMessage: false,
        creditsText: 'some indie dev'
    },
    '11': {
        url: '/core/gam-scripts/stickman-survival/',
        showMessage: false,
        creditsText: 'i forgot'
    },
    '12': {
        url: '/core/gam-scripts/eggycar/',
        showMessage: false,
        creditsText: 'Beedo Gams'
    },
    '13': {
        url: '/core/gam-scripts/1v1lol/',
        showMessage: false,
        creditsText: 'JustPley.LOL'
    },
    '14': {
        url: '/core/gam-scripts/monkeymart/',
        showMessage: false,
        creditsText: 'TinyDobbins'
    },
    '15': {
        url: '/core/gam-scripts/snowrider3d/',
        showMessage: false,
        creditsText: 'New Gamr'
    },
    '16': {
        url: '/core/gam-scripts/ovo/',
        showMessage: false,
        creditsText: 'Dedra Gams'
    },
    '17': {
        url: '/core/gam-scripts/bitlife/',
        showMessage: false,
        creditsText: 'Candywriter'
    },
    '18': {
        url: '/core/gam-scripts/badparenting/',
        showMessage: false,
        creditsText: '2OO2'
    },
    '19': {
        url: '/core/gam-scripts/bacon-may-die/',
        showMessage: false,
        creditsText: 'SnoutUp Gams'
    },
    '20': {
        url: '/core/gam-scripts/2048/',
        showMessage: false,
        creditsText: 'Gabriele Cirulli'
    },
    '21': {
        url: '/core/gam-scripts/9007199254740992/',
        showMessage: false,
        creditsText: 'Gabriele Cirulli'
    },
    '22': {
        url: '/core/gam-scripts/amazing-rope-police/',
        showMessage: false,
        creditsText: 'HGAMS'
    },
    '23': {
        url: '/core/gam-scripts/brawl-stars/',
        showMessage: false,
        creditsText: 'Supercell'
    },
    '24': {
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
