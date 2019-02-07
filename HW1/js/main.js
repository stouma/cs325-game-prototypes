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
        game.load.audio('dogbark', ['assets/dogbark.mp3', 'assets/dogbark.ogg']);
        game.load.image('sky', 'assets/Inkedsky.jpg');
        game.load.image('ground', 'assets/Inkedplatform.jpg');
        game.load.image('doggo', 'assets/doggo.png');
        game.load.spritesheet('dude', 'assets/dude.png', 64, 63);
    }
    
    var platforms;
    var player;
    var cursors;

    var doggos;
    var score = 0;
    var scoreText;
    
    function create() {

        game.add.sprite(0, 0, 'sky');

        platforms = game.add.group();
        platforms.enableBody = true;

        var ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        //  Now let's create two ledges
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        // // Create a sprite at the center of the screen using the 'logo' image.
        // bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // // Anchor the sprite at its center, as opposed to its top-left corner.
        // // so it will be truly centered.
        // bouncy.anchor.setTo( 0.5, 0.5 );
        
        // // Turn on the arcade physics engine for this sprite.
        // game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // // Make it bounce off of the world bounds.
        // bouncy.body.collideWorldBounds = true;
        
       // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        doggos = game.add.group();
        doggos.enableBody = true;

        for (var i = 0; i < 12; i++)
        {
            //  Create a doggo inside of the 'doggos' group
            var doggo = doggos.create(i * 70, 0, 'doggo');

            //  Let gravity do its thing
            doggo.body.gravity.y = 300;

            //  Gives each doggo a slightly random bounce value
            doggo.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        //  The score
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        // // Add some text using a CSS style.
        // // Center it in X, and position its top 15 pixels from the top of the world.
        // var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        // var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        // text.anchor.setTo( 0.5, 0.0 );

        cursors = game.input.keyboard.createCursorKeys();
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        
        var hitPlatform = game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(doggos, platforms);

        //  Checks to see if the player overlaps with any of the doggos
        game.physics.arcade.overlap(player, doggos, collectDoggo, null, this);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }
    
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down && hitPlatform)
        {
            player.body.velocity.y = -350;
        }
    }
    function collectDoggo (player, doggo) {
    
    var bark = game.add.audio('dogbark');
    bark.play();
    // Removes the doggo from the screen
    doggo.kill();

    //  Add and update the score
    score += 1;
    scoreText.text = 'Score: ' + score;

    }
};
