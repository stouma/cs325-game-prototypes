"use strict";

GameStates.makeGame = function( game, shared ) {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    var player;
    var map;
    var layer;
    var walls;
    var objects;
    var cursors;
    var framing;
    var gletter;
    var rletter;
    var bletter;
    var houses;
    var sky;
    var music;

    // function quitGame() {

    //     //  Here you should destroy anything you no longer need.
    //     //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //     //  Then let's go back to the main menu.
    //     game.state.start('MainMenu');

    // }
    
    return {

        create: function() {

            music = game.add.audio('music');
            music.loop = true;
            music.play();

            game.physics.startSystem(Phaser.Physics.ARCADE);

            //Create sky background color
            game.stage.backgroundColor = '#b9dff7';
            sky = game.add.sprite(0, 0, 'sky');
            sky.scale.setTo(1.2, 0.7);

            game.stage.backgroundColor = '#90caf9';

            //Create map
            map = game.add.tilemap('town');
            map.addTilesetImage('RowHouseTileSet', 'tiles');

            //Add in each layer
            walls = map.createLayer('walls');
            layer = map.createLayer('stairs');
            objects = map.createLayer('plants');

            //Resize map
            layer.scale.setTo(1.5, 1.5);
            walls.scale.setTo(1.5, 1.5);
            objects.scale.setTo(1.5, 1.5);

            walls.resizeWorld();

            //Create player
            player = game.add.sprite(32, game.world.height, 'dude');

            game.physics.arcade.enable(player);

            player.body.collideWorldBounds = true;

            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);

            game.camera.follow(player);

            //Create keyboard inputs
            cursors = game.input.keyboard.createCursorKeys();

            
            houses = game.add.group();
            map.createFromObjects('object', 2, 'house', 0, true, false, houses);

            //Text for which color letter
            var text = game.add.text(5, 5, 'Letter: blue', { fontSize: '32px', fill: '#000' });
            text.fixedToCamera = true;

            //Create frame for inventory
            framing = game.add.sprite(700, 5, 'frame');
            framing.scale.setTo(3, 3);
            framing.fixedToCamera = true;

            //Create red letter
            rletter = game.add.sprite(700, 5, 'red');
            rletter.scale.setTo(1.5, 1.5);
            rletter.fixedToCamera = true;

            //Create green letter
            gletter = game.add.sprite(700, 5, 'green');
            gletter.scale.setTo(1.5, 1.5);
            gletter.fixedToCamera = true;

            //Create blue letter
            bletter = game.add.sprite(700, 5, 'blue');
            bletter.scale.setTo(1.5, 1.5);
            bletter.fixedToCamera = true;

            // // // When you click on the sprite, you go back to the MainMenu.
            // // framing.inputEnabled = true;
            // // framing.events.onInputDown.add( function() { quitGame(); }, this );

        },

        update: function() {

            //game.physics.arcade.overlap(player, houses, deliverLetter, null, this);
        
            player.body.velocity.x = 0;
            //player.body.velocity.y = 0;

            if (cursors.left.isDown)
            {
                //  Move to the left
                player.body.velocity.x = -250;

                player.animations.play('left');
            }
            else if (cursors.right.isDown)
            {
                //  Move to the right
                player.body.velocity.x = 250;

                player.animations.play('right');
            }
            else
            {
                //  Stand still
                player.animations.stop();

                player.frame = 4;
            }

        },

        deliverLetter: function(){
            // if(cursors.up.isDown)
            // {
            //     houses.forEach(function(houses){
            //         if(text == 'Letter: blue'){
            //             bletter.kill();
            //             text = 'Letter: green';
            //         }
            //     });
            // }
            bletter.kill();
            text = 'Letter: green';
        }

    };
};
