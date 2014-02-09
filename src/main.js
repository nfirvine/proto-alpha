var consts = {
    "canvas.size": [1280, 720]
};

window.onload = function() {
    var width = consts['canvas.size'][0];
    var height = consts['canvas.size'][1];
    var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create });

    function preload () {
        game.load.image('logo', 'assets/gfx/phaser.png');
    }

    function create () {
        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }
};
