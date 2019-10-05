function CrateDigger() { }

CrateDigger.prototype = {
    init: function() {
        // randomize background color
        const colors = ['#d2f7f5', '#ffc4c8', '#b9edce'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.style.backgroundColor = randomColor;
        this.randomVids = ['NTKm1r0chcM','cOtpFkNIHcU','3zN7M5o2D1A','2-n2T4hAR14','GnY_iGiwhAY','LhH4FltFnWk','m4B808xRP3k','ojqgDoHQOCI','HciMsdrDgkE','NgRBZTo9SH4','E1rmG1syhFg','2cB9szCRiy4','KHWo-e-wgdY','BBAj8e6osf0','HXBD2o5lO1k','rA1szVDuak4','11gUJQgdPxU','R55Ht7G3g14','Bppib7KyjG0','Y1WuWl7T8X4','UGeQvHzNsnY','Q-vRj-sL8fI','atTHGvUEwu0','1ohBWtXKs7A','bHqrhWlTemM','AlpJFdMLIr4','N3Gg7ZJHF48','iyc0JBYF_h4','j4a87eWIgCQ','iutAo2Ppiro','lrtL5jgriYg','u0cXTr1dXJ0','YrLWAzLM1qw','JNcnbVgxSB0','EcE2fYPFpjA','NrS0VLanzKg','eybbtmw4oqo','rcgwXj-ULxc','wiDVfi5dVp0','MuNRbxKAJII','jifb-DuqrbE','dgodkV4EstI','5Ah8GivE3xg','XECq0l3fYjc','cSgIBlMVpJ0','kPbVenisik0','cuzrLHtvjmU','DxibGYf97ek','Oy_C7C7-5Io','Fded4j9_-ck']
        
        // inject youtube iframe api
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        this.player;
        this.pads = {};
        for (let i = 1; i < 10; i++) {
            this.pads[i] = {};
        }
        this.attachKeyListeners();
        this.attachSearchListeners();
    },
    onYouTubeIframeAPIReady: function() {
        this.player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: 'tJLGq8O4baE',
            events: {
                'onReady': this.onPlayerReady.bind(this),
                'onStateChange': this.onStateChange.bind(this)
            }
        });
    },
    onStateChange: function(event) {
        if(this.player.getPlayerState() === 1) {
            this.resetAllPads();
        }
    },
    onPlayerReady: function(event) {
        //event.target.playVideo();
        this.renderPads();
        this.renderHandles();
        this.resetAllPads();
        let randomInt = Math.floor(Math.random() * 10)
    },
    renderPads: function() {
        let padsContainerHtml = document.getElementById('pads');
        for (let i = 1; i < 10; i++) {
            let padHtml = document.createElement('div');
            padHtml.className = 'pad';
            padHtml.innerText = i;
            //padHtml.setAttribute('onClick', 'playPad(this)');
            padHtml.setAttribute('data-id', i);
            let timeDisplayHtml = document.createElement('div');
            timeDisplayHtml.innerText = this.pads[i]['timestamp'];
            padHtml.append(timeDisplayHtml);
            this.pads[i]['element'] = padHtml;
            padsContainerHtml.append(padHtml);
            if (i % 3 === 0) {
                padsContainerHtml.append(document.createElement('br'));
            }
        }
    },
    playPad: function(el) {
        const id = el.getAttribute('data-id');
        const timestamp = this.pads[id]['timestamp']
        this.player.seekTo(timestamp)
        this.player.playVideo();
    },
    renderHandles: function() {
        // Attach 10 handles
        this.handleContainer = document.getElementById('sampler');
        // Build 10 handles and put em in the shits
        this.handles = [];
        for (let i = 1; i < 10; i++) {
            const width = 612;
            const defaultX = (i * 0.1) * width;
            let handle = this.buildHandle(i, defaultX);
            this.handles.push(handle);
            this.handleContainer.append(handle.element);
        }
        this.attachHandleListeners();
    },
    buildHandle: function(padId, defaultX) {
        let $this = this;
        let handleElement = document.createElement('div');
        handleElement.className = 'cd-handle';
        handleElement.style.left = defaultX + 'px';
        let infoElement = document.createElement('span');
        infoElement.className = 'cd-handle-info'
        infoElement.innerText = padId;
        handleElement.append(infoElement);

        let handle = {
            element: handleElement,
            x: defaultX,
            padId: padId,
            updatePosition: function(x) {
                this.x = x;
                this.element.style.left = x + "px";
                //let timestamp = $this.xPosToTimestamp(x);
                //this.timeDisplay.innerText = timestamp;
                //document.getElementById(timestampClass).innerText = timestamp;
            }
        };

        return handle;
    },
    attachSearchListeners: function() {
        let $this = this;
        let searchBar = document.getElementById('video-link-input');
        let loadButton = document.getElementById('load-video');
        let randomButton = document.getElementById('random-video');
        loadButton.onclick = function() {
            let url = searchBar.value;
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = url.match(regExp);
            let videoId;
            if (match&&match[7].length==11) {
                videoId = match[7];
            }

            $this.player.loadVideoById(videoId);
        }
        randomButton.onclick = function() {
            let random = Math.floor(Math.random() * $this.randomVids.length);
            $this.player.loadVideoById($this.randomVids[random]);
        }
        
    },
    attachHandleListeners: function() {
        let $this = this;

        // Update handle position upon drag.
        for (let handle of this.handles) {
            handle.element.addEventListener('mousedown', function() {
                document.onmousemove = function(e) {
                    const ytpBarX = document.getElementById('sampler').getBoundingClientRect().x;
                    const handleX = e.clientX - ytpBarX;
                    //const isBehindRightHandle = (handleX < $this.rightHandle.x);
                    const isWithinProgressBar = (handleX >= 0 && handleX <= 612);
                    if (isWithinProgressBar) {
                        handle.updatePosition(handleX);
                        let timestamp = (handleX / 612) * $this.player.getDuration();
                        //handleX to timestamp
                        $this.assignTimeToPad(handle.padId, timestamp);
                    }
                };
                document.onmouseup = function() {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    let newTime = $this.xPosToSeconds($this.leftHandle.x);
                    $this.playVideo(newTime);
                };
            }, false);
            handle.element.ondragstart = function() {
                return false;
            };
        }
        // Negate default dragging behavior.
    },
    attachKeyListeners: function() {
        let $this = this;
        let keys = [];
        for (let i = 1; i < 10; i++) {
            keys.push(i + '');
        }
        document.addEventListener('keydown', function(e) {
            if (keys.includes(e.key)) {
                const timestamp = $this.pads[e.key]['timestamp'];
                $this.player.seekTo(timestamp);
                $this.player.playVideo();
                $this.pads[e.key]['element'].style.backgroundColor = '#ccc';
            }
        });
        document.addEventListener('keyup', function(e) {
            if (keys.includes(e.key)) {
                $this.pads[e.key]['element'].style.backgroundColor = 'white';
            }
        });
        // TODO mouse click event listener
    },
    assignTimeToPad: function(padId, timestamp) {
        this.pads[padId]['timestamp'] = timestamp;
        this.pads[padId]['element'].children[0].innerText = this.readableTimestamp(timestamp);
    },
    readableTimestamp: function(seconds) {
        let mm = Math.floor(seconds / 60);
        let ss = ((seconds % 60 < 10) ? '0' : '') + Math.floor(seconds % 60);
        return mm + ':' + ss;
    },
    resetAllPads: function() {
        for (let i = 1; i < 10; i++) {
            let timestamp = Math.floor(this.player.getDuration() * (0.1 * i));
            this.assignTimeToPad(i, timestamp);
        }
    }
};

const crateDigger = new CrateDigger();
crateDigger.init();

function onYouTubeIframeAPIReady() {
    crateDigger.onYouTubeIframeAPIReady();
}
