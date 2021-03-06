// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

require([
    'jquery',
    'termjs',
    'base/js/utils',
    'base/js/page',
    'terminal/js/terminado',
    'custom/custom',
], function(
    $, 
    termjs,
    utils,
    page,
    terminado
    ){
    page = new page.Page();
    // Test size: 25x80
    var termRowHeight = function(){ return 1.00 * $("#dummy-screen")[0].offsetHeight / 25;};
        // 1.02 here arrived at by trial and error to make the spacing look right
    var termColWidth =  function() { return 1.02 * $("#dummy-screen-rows")[0].offsetWidth / 80;};

    var base_url = utils.get_body_data('baseUrl');
    var ws_path = utils.get_body_data('wsPath');
    var ws_url = location.protocol.replace('http', 'ws') + "//" + location.host
                                    + base_url + ws_path;
    
    var header = $("#header")[0]
    function calculate_size() {
        height = window.innerHeight - header.offsetHeight;
        width = $('#terminado-container').width();
        var rows = Math.min(1000, Math.max(20, Math.floor(height/termRowHeight())-1));
        var cols = Math.min(1000, Math.max(40, Math.floor(width/termColWidth())-1));
        console.log("resize to :", rows , 'rows by ', cols, 'columns');
        return {rows: rows, cols: cols};
    }
    
    page.show_header();
    
    size = calculate_size();
    var terminal = terminado.make_terminal($("#terminado-container")[0], size, ws_url);
    
    page.show_site();
    
    window.onresize = function() { 
      var geom = calculate_size();
      terminal.term.resize(geom.cols, geom.rows);
      terminal.socket.send(JSON.stringify(["set_size", geom.rows, geom.cols,
                                    window.innerHeight, window.innerWidth]));
    };

});
