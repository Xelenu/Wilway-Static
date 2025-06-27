// Object to map video IDs to iframe sources, notification, and credits settings
        const videoSources = {
            '1': {
                url: '/gam/frame/repo.html',
                showNotification: true,
                notificationText: '⚠️ This game is very large, so you will have to be patient for it to load! ✨ This is a special game.',
                creditsText: 'Port by breadbb and 98corbins'
            },
            '2': {
                url: 'https://www.youtube.com/embed/9bZkp7q19f0',
                showNotification: false,
                notificationText: '',
                creditsText: 'Another Creator'
            },
            // Add more video IDs and their settings here, e.g.:
            // 'video3': {
            //     url: 'https://www.youtube.com/embed/VIDEO_ID',
            //     showNotification: true,
            //     notificationText: 'Custom text for video3',
            //     creditsText: 'Custom Creator'
            // },
        };

        // Function to load iframe based on URL parameter
        function loadVideo() {
            const urlParams = new URLSearchParams(window.location.search);
            const videoId = urlParams.get('id');
            const container = document.getElementById('video-container');

            if (videoId && videoSources[videoId]) {
                // Clear the default ":c" text
                container.innerHTML = '';
                // Create iframe
                const iframe = document.createElement('iframe');
                iframe.src = videoSources[videoId].url;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.id = 'video-iframe';
                container.appendChild(iframe);
            }
            // If no valid ID, keep the default ":c" text
        }

        // Function to load notification based on URL parameter
        function loadNotification() {
            const urlParams = new URLSearchParams(window.location.search);
            const videoId = urlParams.get('id');
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notification-text');

            // Hide notification by default
            notification.style.display = 'none';

            if (videoId && videoSources[videoId] && videoSources[videoId].showNotification) {
                notificationText.textContent = videoSources[videoId].notificationText;
                notification.style.display = 'flex';
            }
        }

        // New function to load credits text based on URL parameter
        function loadCredits() {
            const urlParams = new URLSearchParams(window.location.search);
            const videoId = urlParams.get('id');
            const creditsText = document.getElementById('credits-text');

            if (videoId && videoSources[videoId] && videoSources[videoId].creditsText) {
                creditsText.textContent = `Credits: ${videoSources[videoId].creditsText}`;
            } else {
                creditsText.textContent = 'Credits: Unknown';
            }
        }

        // Function to trigger fullscreen for the iframe
        function toggleFullscreen() {
            const iframe = document.getElementById('video-iframe');
            if (iframe) {
                if (!document.fullscreenElement) {
                    iframe.requestFullscreen().catch(err => {
                        console.error(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
            }
        }

        // Add event listener for beforeunload to show exit warning
        window.addEventListener('beforeunload', function(event) {
            event.preventDefault();
            event.returnValue = 'Changes made may not be saved';
        });

        // Run functions when the page loads
        window.onload = function() {
            loadVideo();
            loadNotification();
            loadCredits();
            // Add event listener for fullscreen button
            document.getElementById('fullscreen-button').addEventListener('click', toggleFullscreen);
            // Add event listener to close the notification
            document.getElementById('close-notification').addEventListener('click', function() {
                document.getElementById('notification').style.display = 'none';
            });
        };
