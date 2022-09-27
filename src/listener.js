class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      // parse message sent from main APP
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      // fetch all data needed via PlaylistService
      const playlist = await this._playlistsService.getPlaylistByPlaylistId(playlistId);

      // pass data from PlaylistsService to mail sender
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify({ playlist }));

      // For debug purspose
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Listener;
