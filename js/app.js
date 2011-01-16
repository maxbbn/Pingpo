KISSY.app("Pingpo");

Pingpo.add("app",function(P){
    var S = KISSY;

    S.mix(P.Config,{
        loadpath : "js/",
        debug : false && console,
        wsurl : "auto"
    });

    function App(cfg){
        S.mix(P.Config,cfg);
        if(P.Config.wsurl == "auto"){
            P.Config.wsurl = "ws://"+window.location.host+":12010";
        }
        P.Config.detect = {
            canvas : typeof document.createElement("CANVAS").getContext,
            audio : typeof Audio,
            websoket : typeof WebSoket
        };
        var loadpath = P.Config.loadpath;
        P.add({
            "pp~game" : {
                    fullpath : loadpath + "game.js",
                    requires : ['pp~data',"pp~effect", "mod~netpanel","mod~fps",'pp~screen']
            },
            "pp~screen" : {
                    fullpath : loadpath + "screen.js"
            },
            "pp~data" : {
                    fullpath : loadpath + "data.js"
            },
            "pp~effect" : {
                    fullpath : loadpath + "effect.js"
            },
            "pp~test" : {
                    fullpath : loadpath + "test.js",
                    requires : ['pp~effect',"mod~fps"]
            },
            "mod~netpanel" : {
                    fullpath : loadpath + "mod~netpanel.js"
            },
            "mod~fps" : {
                   fullpath : loadpath + "mod~fps.js"
            }
        });
    }

    P["App"] = App;

})
