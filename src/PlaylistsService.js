const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistByPlaylistId(playlistId) {
    // prep FIRST query: Per requirement, first step needs id, name from playlists
    //    search playlist using playlistId
    const query = {
      text: `SELECT id, name 
      FROM playlists
      WHERE id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(query);

    /** prep SECOND query: fetch from playlist_song tables,
     *      then 'attach' songs table, but only use songs.title and songs.performer */
    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer 
        FROM playlist_songs 
        LEFT JOIN songs 
        ON playlist_songs.song_id = songs.id
        WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    // run query - fetch data
    const songsResult = await this._pool.query(songsQuery);

    // merge songResult rows inside playlistResult object property
    playlistResult.rows[0].songs = songsResult.rows;

    // merge songResult rows inside playlistResult object property
    playlistResult.rows[0].songs = songsResult.rows;

    // return playlistResult with songsResult contained
    return playlistResult.rows[0];
  }
}

module.exports = PlaylistsService;
