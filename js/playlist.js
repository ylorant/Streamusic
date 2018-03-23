var Playlist = 
{
    defaultOptions:
    {
        playlistSelector: "#playlist"
    },

    addFileInput: null,
    addFileButton: null,
    playlist: [],
    songInfo: {},
    currentItem: 0,
    playlistElement: null,

    init: function(options)
    {
        this.options = $.extend(this.defaultOptions, options);
        this.initElements();
        this.bindUIActions();
    },

    initElements: function()
    {
        this.playlistElement = $(this.options.playlistSelector);
    },

    bindUIActions: function()
    {

    },

    // Events

    onID3TagsRead: function(songIndex, data)
    {
        this.songInfo[songIndex] = data.tags;
        this.render();
    },

    onID3TagsError: function(songIndex, err)
    {
        console.warn(err);
    },

    // Actions
    addFile: function(file)
    {
        // Get the new index by getting the total length before inserting as the last index is length - 1
        var newIndex = this.playlist.length;

        this.playlist.push(file);

        // Read the file to get the media tags
        jsmediatags.read(file,
        {
            onSuccess: this.onID3TagsRead.bind(this, newIndex),
            onError: this.onID3TagsError.bind(this, newIndex)
        });

        this.render();
    },

    getCurrentSong: function()
    {
        return {
            file: this.playlist[this.currentItem],
            info: this.songInfo[this.currentItem]
        };
    },

    goToNextSong: function()
    {
        if(this.currentItem + 1 >= this.playlist.length)
            return false;

        this.currentItem++;
        this.render();

        return true;
    },

    goToPreviousSong: function()
    {
        if(this.currentItem <= 0)
            return false;

        this.currentItem--;
        this.render();

        return true;
    },

    render()
    {
        this.playlistElement.empty();

        for(var i = 0; i < this.playlist.length; i++)
        {
            var itemText = "";

            // If ID3Tags are present, show them
            if(this.songInfo[i])
            {
                if(this.songInfo[i].artist)
                    itemText += this.songInfo[i].artist + " - ";
                
                if(this.songInfo[i].title)
                    itemText += this.songInfo[i].title;            
            }

            if(!itemText)
                itemText = this.playlist[i].name;

            var element = document.createElement('li');
            $(element).html(itemText);

            if(i == this.currentItem)
                $(element).addClass('active');

            this.playlistElement.append(element);
        }
    }
};