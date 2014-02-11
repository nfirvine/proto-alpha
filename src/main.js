var consts = {
    "canvas.size": [1280, 720]
};

// indexed by gamepad
const NUM_PLAYERS = 4;
var players = Array(NUM_PLAYERS);

// using this as my basis for JS OOP
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript?redirectlocale=en-US&redirectslug=JavaScript%2FIntroduction_to_Object-Oriented_JavaScript
function Player(index) {
    this.index = index;
    this.tune = {
        "accel_mul": 100,
        "body": {
            "linearDamping": 100
        }
    }
    this.gamepad = undefined;
    this.gamepad_text = game.add.text(0, 40*index, '', {font: '30px monospace', 
                                      fill: '#ffffff', align: 'left'});
    this.state = 'new';
}

Player.prototype.connect = function (gamepad) {
    if (this.state == 'new') {
        console.log('connected player ' + players.indexOf(this) + ' to gamepad: ' + gamepad);
        this.gamepad = gamepad;
        this.state = 'added';
    }
};

Player.prototype.disconnect = function ( ){
}

Player.prototype.update = function () {
    if (this.gamepad) {
        var text = this.gamepad.axes + '\n';
        for (var b = 0; b < this.gamepad.buttons.length; ++b){
            if (this.gamepad.buttons[b]) {
                text += b.toString() + ' ';
            }
        }
        this.gamepad_text.content = text;
    }
    switch (this.state) {
        case 'new':
            break;
        case 'added':
            this.sprite = game.add.sprite(20, 64*this.index, 
                                          'player_boy');
            this.sprite.body.allowGravity = false;
            this.sprite.body.linearDamping = this.tune.body.linearDamping;
            this.state = 'idle';
            //let it fall through to idle
        case 'idle':
        case 'moving':
            if (this.gamepad.buttons[14] || this.gamepad.axes[0] == -1) {
            //    this.sprite.body.acceleration = new Phaser.Point(-1,0);
                this.state = 'moving';
            } else if  (this.gamepad.buttons[15] || this.gamepad.axes[0] == 1) {
             //   this.sprite.x += 1;
                this.state = 'moving';
            } else if (this.gamepad.buttons[12] || this.gamepad.axes[1] == -1) {
              //  this.sprite.y -= 1;
                this.state = 'moving';
            } else if (this.gamepad.buttons[13] || this.gamepad.axes[1] == 1) {
               // this.sprite.y += 1;
                this.state = 'moving';
            } else {
                this.state = 'idle';
            }
            this.sprite.body.acceleration = new Phaser.Point(
                this.gamepad.axes[0] * this.tune.accel_mul, 
                this.gamepad.axes[1] * this.tune.accel_mul);
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
        game.load.image('player_boy', 'assets/gfx/player_boy.png');
    }

    function on_gamepadconnected(gamepad) {
        console.log('gamepad connected: ' + gamepad);
        players[gamepad.index].connect(gamepad);
    }

    function on_gamepaddisconnected(gamepad){
        console.log('gamepad disconnected: ' + gamepad)
        players[gamepad.index].disconnect();
    }

    function create () {
        for (var p = 0; p < NUM_PLAYERS; ++p){
            players[p] = new Player(p);
        }

        var gamepadjs = new Gamepad();
        gamepadjs.bind('connected', on_gamepadconnected);
        gamepadjs.bind('disconnected', on_gamepaddisconnected);
        gamepadjs.init();
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
        for (var p = 0; p < NUM_PLAYERS; ++p){
            var player = players[p];
            player.update();
        }
    }
};
