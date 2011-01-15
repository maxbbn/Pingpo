KISSY.app("Pingpo");
KISSY.mix(Pingpo.Config,{
        //kissybase : "http://localhost/svn/assets/lib/kissy/1.1.6/",
        kissybase : "http://a.tbcdn.cn/s/kissy/1.1.6/",
        srcbase   : "/svn/assets/game/",
        debug : true && console,
        //wsserver : "ws://t-wenlong:12010"
        wsserver : "ws://pc-game:12010"
        //wsserver : "ws://192.168.1.198:12010"
        //wsserver : "ws://localhost:12010"
});

Pingpo.add({
    "pp~game" : {
            fullpath : Pingpo.Config.srcbase + "js/src/game.js",
            requires : ['pp~screen','pp~connction','pp~data',"pp~effect", "mod~netpanel"]
    },
    "pp~screen" : {
            fullpath : Pingpo.Config.srcbase + "js/src/screen.js"
    },
    "pp~connction" : {
            fullpath : Pingpo.Config.srcbase + "js/src/screen.js"
    },
    "pp~data" : {
            fullpath : Pingpo.Config.srcbase + "js/src/data.js"
    },
    "pp~effect" : {
            fullpath : Pingpo.Config.srcbase + "js/src/effect.js"
    },
    "pp~test" : {
            fullpath : Pingpo.Config.srcbase + "js/src/test.js"
    },
    "mod~netpanel" : {
            fullpath : Pingpo.Config.srcbase + "js/src/mod/mod~netpanel.js"
    }
});
