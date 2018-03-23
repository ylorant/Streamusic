var Player = 
{
    DEFAULT_ALBUM_ART: "images/album-art.png",
    TEXT_SIZES: [48, 40, 32, 28, 24, 20, 16],

    defaultOptions:
    {
        albumArtSelector: "#album-art",
        titleSelector: "#song-title",
        artistSelector: "#song-artist",
        albumSelector: "#song-album",
        progressSelector: "#song-progress-fill",
        audioSelector: "#audio",
        playlist: null
    },

    elements: 
    {
        albumArt: null,
        title: null,
        artist: null,
        album: null,
        progress: null,
        audio: null
    },

    songInfo: {},
    songFile: null,
    playlist: null,
    playing: false,
    blob: null, // BlobURL handle
    onPlayEnd: null,

    init: function(options)
    {
        this.options = $.extend(this.defaultOptions, options);

        this.blob = window.URL || window.webkitURL;
        if (!this.blob) {
            console.log('Your browser does not support Blob URLs :(');
            return;           
        }

        this.initElements();
        this.bindUIActions();
    },

    initElements: function()
    {
        // Initializing elements JQuery handles
        this.elements.albumArt = $(this.options.albumArtSelector);
        this.elements.title = $(this.options.titleSelector);
        this.elements.artist = $(this.options.artistSelector);
        this.elements.album = $(this.options.albumSelector);
        this.elements.progress = $(this.options.progressSelector);
        this.elements.audio = document.querySelector(this.options.audioSelector);

        // Filling default values
        this.elements.albumArt.attr('src', this.DEFAULT_ALBUM_ART);
        this.elements.title.html('-');
        this.elements.artist.html('-');
        this.elements.album.html('-');
        this.elements.progress.css('width', '0px');
        this.elements.audio.src = '';
    },

    bindUIActions: function()
    {
        // Re-render the progress bar on audio time update
        this.elements.audio.addEventListener('timeupdate', this.render.bind(this, true));
        this.elements.audio.addEventListener('ended', this.onMusicEnd.bind(this));
    },

    // Events

    onMusicEnd: function()
    {
        this.stop();
        var canPlay = this.options.playlist.goToNextSong();

        if(canPlay)
            this.play();
        else if(this.onPlayEnd)
            this.onPlayEnd();
    },

    // Actions

    loadSongFromPlaylist: function()
    {
        var song = this.options.playlist.getCurrentSong();
        var blobURL = this.blob.createObjectURL(song.file);

        this.elements.audio.src = blobURL;
        this.songInfo = song.info;
        this.songFile = song.file;
        this.render();
    },

    play: function()
    {
        // If not playing, load song into the audio tag
        if(!this.playing)
            this.loadSongFromPlaylist();
        
        this.playing = true;
        this.elements.audio.play();
    },

    pause: function()
    {
        this.elements.audio.pause();
    },

    stop: function()
    {
        this.elements.audio.pause();
        this.elements.audio.currentTime = 0;

        this.playing = false;
    },

    isPaused: function()
    {
        return this.elements.audio.paused || !this.playing;
    },

    getAlbumArtAsBase64: function()
    {
        var picture = this.songInfo.picture; // create reference to track art
        var base64String = "";
        for (var i = 0; i < picture.data.length; i++) {
            base64String += String.fromCharCode(picture.data[i]);
        }
        
        return "data:" + picture.format + ";base64," + window.btoa(base64String);
    },

    render: function(renderProgressOnly)
    {
        if(!renderProgressOnly)
        {
            this.elements.title.html(this.songInfo.title || this.songFile.name);
            this.elements.artist.html(this.songInfo.artist || 'Artiste inconnu');
            this.elements.album.html(this.songInfo.album || 'Album inconnu');

            if(this.songInfo.picture)
                this.elements.albumArt.attr('src', this.getAlbumArtAsBase64());
            else
                this.elements.albumArt.attr('src', this.DEFAULT_ALBUM_ART);
            
                this.autoSizeText();
        }

        var progressSize = this.elements.progress.parent().innerWidth();
        var elapsedPc = this.elements.audio.currentTime / this.elements.audio.duration;

        this.elements.progress.css('width', Math.floor(progressSize * elapsedPc) + "px");
    },

    autoSizeText: function()
    {
        var elements = [
            this.elements.title,
            this.elements.artist,
            this.elements.album
        ];

        for(var j = 0; j < elements.length; j++)
        {
            for(var i = 48; i >= 16; i--)
            {
                elements[j].css('font-size', i);

                // If the element is going out of frame and we're not on the smallest size, reduce the size
                if(elements[j][0].scrollHeight <= elements[j].innerHeight())
                    break;
            }
        }  
    }
};