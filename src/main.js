var consts = {
    "canvas.size": [1280, 720]
};

// indexed by gamepad
var players = Array(4);

// using this as my basis for JS OOP
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript?redirectlocale=en-US&redirectslug=JavaScript%2FIntroduction_to_Object-Oriented_JavaScript
function Player() {
    this.gamepad = undefined;
    this.state = 'new';
}

Player.prototype.connect = function (gamepad) {
    if (this.state == 'new') {
        console.log('connected');
        this.gamepad = gamepad;
        this.state = 'added';
    }
};

Player.prototype.update = function () {
    switch (this.state) {
        case 'added':
            this.sprite = game.add.sprite(20, 20, 
                                          'player_boy');
            this.state = 'idle';
            //let it fall through to idle
        case 'idle':
        case 'moving':
            if (this.gamepad.buttons[14].pressed) {
                this.sprite.x -= 1;
                this.state = 'moving';
            } else if  (this.gamepad.buttons[15].pressed) {
                this.sprite.x += 1;
                this.state = 'moving';
            } else if (this.gamepad.buttons[12].pressed) {
                this.sprite.y -= 1;
                this.state = 'moving';
            } else if (this.gamepad.buttons[13].pressed) {
                this.sprite.y += 1;
                this.state = 'moving';
            } else {
                this.state = 'idle';
            }
            break;
    }
};

var game = undefined;


window.onload = function() {
    var width = consts['canvas.size'][0];
    var height = consts['canvas.size'][1];
    game = new Phaser.Game(width, height, Phaser.AUTO, '', { 
        preload: preload, 
        create: create,
        update: update
    });

    function preload () {
        game.load.image('logo', 'assets/gfx/phaser.png');
        game.load.image('player', 'assets/gfx/player_boy.png');
    }

    function on_gamepadconnected(ev) {
        console.log('gamepad connected: ' + ev);
        var gamepad = ev.gamepad;
        console.log(ev);
        players[gamepad.index].on_connect(gamepad);
    }

    function on_gamepaddisconnected(ev){
        console.log(ev);
        players[gamepad.index].on_disconnect();
    }

    function create () {
        for (var p = 0; p < players.length; ++p){
            players[p] = new Player();
        }
        /* these don't work cross-browser
        window.addEventListener('gamepadconnected', on_gamepadconnected);
        window.addEventListener('MozGamepadConnected', on_gamepadconnected);
        window.addEventListener('webkitgamepadconnected', on_gamepadconnected);
        window.addEventListener('gamepaddisconnected', on_gamepaddisconnected);
        window.addEventListener('MozGamepadDisconnected', on_gamepaddisconnected);
        window.addEventListener('webkitgamepaddisconnected', on_gamepaddisconnected);
        */
        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }

    function update () {
        var gamepads = undefined;
        if (navigator.getGamepads){
            gamepads = navigator.getGamepads();
        } else if (navigator.webkitGamepads){
            gamepads = navigator.webkitGetGamepads();
        } else {
            gamepads = [];
        }
        if (gamepads.length > 0) {
            console.log(gamepads);
        
        }
        for (var p = 0; p < players.length; ++p){
            var player = players[p];
            if (gamepads[p] !== undefined){ 
                player.connect(gamepads[p]);
            }
            player.update();
        }
    }
};
