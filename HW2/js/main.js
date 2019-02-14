"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {

        game.load.image('dude', 'assets/dude4.png');
    
    }

    var player;

    function create() {


        player = game.add.sprite(game.world.centerX, game.world.centerY, 'dude');

        game.physics.enable(player, Phaser.Physics.ARCADE);

    }

    function update() {

        //  only move when you click
        if (game.input.mousePointer.isDown)
        {

            //  400 is the speed it will move towards the mouse
            game.physics.arcade.moveToPointer(player, 400);

            //  if it's overlapping the mouse, don't move any more
            if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
            {
                player.body.velocity.setTo(0, 0);
            }
        }
        else
        {  
            player.body.velocity.setTo(0, 0);
        }
    }
}
