console.log('javascript');
let playButton = document.getElementById('play');
let songInfo = document.querySelector('.songinfo');
let songTime = document.querySelector('.songtime');
let currentSong = null;
let isPlaying = false;
let songs = [];

async function getSongs() {
    let a = await fetch('http://127.0.0.1:5500/Spotify%20Clone/songs/');
    let response = await a.text();

    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split('/songs/')[1]);
        }
    }
    return songs;
}

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

const updateSongTime = () => {
    if (currentSong && currentSong.duration) {
        songTime.innerText = formatTime(currentSong.currentTime) + ' / ' + formatTime(currentSong.duration);
    }
}

const playMusic = (track) => {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset current song to start
    }
    currentSong = new Audio('/Spotify Clone/songs/' + encodeURIComponent(track));
    console.log('Playing:', currentSong.src); // Debugging line
    currentSong.play().then(() => {
        playButton.src = 'pause.svg'; // Change play button to pause when a new song is played
        isPlaying = true;
        songInfo.innerText = track.replaceAll('%20', ' '); // Update song info
        currentSong.addEventListener('timeupdate', updateSongTime); // Update song time during playback
    }).catch(error => {
        console.error('Error playing the song:', error);
    });
    currentSong.addEventListener('loadedmetadata', updateSongTime); // Initial time display update when metadata is loaded
}

async function main() {
    // Getting the list of songs
    songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector('.songlist').getElementsByTagName('ul')[0];
    songUL.innerHTML = ''; // Clear existing list items if any

    for (const song of songs) {
        songUL.innerHTML += `<li> 
            <img src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll('%20', ' ')}</div>
                <div>Weekend</div>
            </div>
            <div class="playnow">
                <span>Playnow</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach((e, index) => {
        e.addEventListener('click', () => {
            console.log(e.querySelector('.info > div').innerHTML.trim());
            playMusic(e.querySelector('.info > div').innerHTML.trim());
        });
    });

    // Play the first song on page load
    if (songs.length > 0) {
        playMusic(songs[0]);
    }

    // Play/Pause button event listener
    playButton.addEventListener('click', () => {
        if (currentSong) {
            if (isPlaying) {
                currentSong.pause();
                playButton.src = 'play.svg';
            } else {
                currentSong.play().then(() => {
                    playButton.src = 'pause.svg';
                }).catch(error => {
                    console.error('Error resuming the song:', error);
                });
            }
            isPlaying = !isPlaying;
        }
    });
}

main();
