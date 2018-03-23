(function($) {
    $(document).ready(function()
    {
        Playlist.init({});
        Player.init({
            playlist: Playlist
        });
        
        ActionButtons.init({
            player: Player,
            playlist: Playlist
        });
    });
})(jQuery);