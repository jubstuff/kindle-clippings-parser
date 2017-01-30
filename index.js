var through = require( 'through' );
var split = require( 'split' );

var SECTION_SEP_PATTERN = '==========';

module.exports = function ( stream ) {
  return stream
    .pipe( split( SECTION_SEP_PATTERN ) )
    .pipe( through( function write( section ) {
      section = section.trim();
      if ( ! section ) {
        return;
      }

      var lines = section.split( /\r?\n/ );
      var metas = lines[1];
      var json = {
        title: lines[0].trim(),
        content: lines.slice( 2 ).join( '\n' ).trim(),
        type: metas.match( /- (.+?) .*?\|/ )[1],
        pos: metas.match( /(?:Pos\.)(.+)\|/ )[1].trim(),
        date: metas.match( / il (.+)/ )[1]
      };
      this.emit( 'data', json );
    } ) );
};
