var ActionButtons = {
    
    defaultOptions:
    {
        addFileInputSelector: "#add-file-input",
        addFileButtonSelector: "#add-file-button",
        playButtonSelector: "#play-button",
        stopButtonSelector: "#stop-button",
        previousButtonSelector: "#previous-button",
        nextButtonSelector: "#next-button",
        playlist:null,
        player: null,
    },

    elements:
    {
        addFileInput: null,
        addFileButton: null,
        playButton: null,
        stopButton: null,
        previousButton: null,
        nextButton: null
    },

    init: function(options)
    {
        this.options = $.extend(this.defaultOptions, options);

        this.initElements();
        this.bindUIActions();
    },

    initElements: function()
    {
        this.elements.addFileButton = $(this.options.addFileButtonSelector);
        this.elements.addFileInput = $(this.options.addFileInputSelector);
        this.elements.playButton = $(this.options.playButtonSelector);
        this.elements.stopButton = $(this.options.stopButtonSelector);
        this.elements.previousButton = $(this.options.previousButtonSelector);
        this.elements.nextButton = $(this.options.nextButtonSelector);

        // Initialize play button label
        this.elements.playButton.html('Play');
    },

    bindUIActions: function()
    {
        this.elements.addFileInput.on('change', this.onFileInputChanged.bind(this));
        this.elements.addFileButton.on('click', this.openFileSelector.bind(this));
        this.elements.playButton.on('click', this.onPlayPause.bind(this));
        this.elements.stopButton.on('click', this.onStop.bind(this));
        this.elements.nextButton.on('click', this.onNext.bind(this));
        this.elements.previousButton.on('click', this.onPrevious.bind(this));

        this.options.player.onPlayEnd = this.onStop.bind(this, true);
    },

    // Events
    
    openFileSelector: function()
    {
        this.elements.addFileInput.click();
    },

    onFileInputChanged: function(ev)
    {
        for(var i = 0; i < ev.target.files.length; i++)
            this.options.playlist.addFile(ev.target.files[i]);
    },

    onPlayPause: function()
    {
        if(this.options.player.isPaused())
        {
            this.options.player.play();
            this.elements.playButton.html('Pause');
        }
        else
        {
            this.options.player.pause();
            this.elements.playButton.html('Play');
        }
    },

    onStop: function(noAction)
    {
        if(!(noAction === true))
            this.options.player.stop();
        this.elements.playButton.html('Play');
    },

    onPrevious: function()
    {
        var playing = !this.options.player.isPaused();
        
        this.options.player.stop();
        this.options.playlist.goToPreviousSong();
        
        if(playing)
            this.options.player.play();
    },

    onNext: function()
    {
        var playing = !this.options.player.isPaused();
        
        this.options.player.stop();
        this.options.playlist.goToNextSong();
        
        if(playing)
            this.options.player.play();
    }
};