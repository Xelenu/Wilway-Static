const videoSources = {
            '1': {
                url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                showNotification: true,
                notificationText: 'Welcome to Video 1!',
                creditsText: 'Video by Example Creator'
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
                videoBox.innerHTML = `<iframe width="100%" height="100%" src="${video.url}" frameborder="0" allowfullscreen></iframe>`;
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
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    document.documentElement.requestFullscreen();
                }
            });

            window.addEventListener('beforeunload', (event) => {
                event.preventDefault();
                event.returnValue = '';
            });
        };
