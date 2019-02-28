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
    var cursors;
    var sky;
    var map;
    var walls;
    var layer;
    var plants;
    var mailboxes;
    var framing;
    var letters;
    var green;
    var blue;
    var red;
    var music;
    var text;
    var timer;

    function Win() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('Win');

    }

    function gameOver(){

        game.state.start('GameOver');
    }

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
            plants = map.createLayer('plants');

            //Resize map
            layer.scale.setTo(1.5, 1.5);
            walls.scale.setTo(1.5, 1.5);
            plants.scale.setTo(1.5, 1.5);

            walls.resizeWorld();

            mailboxes = game.add.group();
            mailboxes.enableBody = true;

            var mailbox = mailboxes.create(100, 655, 'mailbox', 0);
            mailbox = mailboxes.create(430, 655, 'mailbox', 0);
            mailbox = mailboxes.create(600, 655, 'mailbox', 0);
            mailbox = mailboxes.create(820, 655, 'mailbox', 0);
            mailbox = mailboxes.create(1075, 655, 'mailbox', 0);
            mailbox = mailboxes.create(1350, 655, 'mailbox', 0);
            mailbox = mailboxes.create(1560, 655, 'mailbox', 0);
            mailbox = mailboxes.create(1795, 655, 'mailbox', 0);

            mailboxes.forEach(function(mail){
                mail.body.collideWorldBounds = true;
                mail.body.gravity.y = 300;
                mail.body.velocity.x = 0;
            });

            // The player and its settings
            player = game.add.sprite(32, game.world.height, 'dude');

            //  We need to enable physics on the player
            game.physics.arcade.enable(player);

            player.body.collideWorldBounds = true;

            //  Our two animations, walking left and right.
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);

            game.camera.follow(player);

            cursors = game.input.keyboard.createCursorKeys();

            //Create frame for inventory
            framing = game.add.sprite(700, 5, 'frame');
            framing.scale.setTo(3, 3);
            framing.fixedToCamera = true;

            letters = game.add.group();
            letters.enableBody = true;
            
            for(var i=0; i<3; i++)
            {
                //Create green letters
                green = letters.create(700, 5, 'green');
                green.scale.setTo(1.5, 1.5);
                green.fixedToCamera = true;

                //Create red letters
                red = letters.create(700, 5, 'red');
                red.scale.setTo(1.5, 1.5);
                red.fixedToCamera = true;

                //Create blue letters
                if(i<2)
                {
                    blue = letters.create(700, 5, 'blue');
                    blue.scale.setTo(1.5, 1.5);
                    blue.fixedToCamera = true;
                }
            }

            for(var i=0; i<letters.length; i++)
            {
                letters.bringToTop(letters.getRandom());
            }

            blue = letters.create(700, 5, 'blue');
            blue.scale.setTo(1.5, 1.5);
            blue.fixedToCamera = true;
            letters.sendToBack(letters.getTop());


            //Text for which color letter
            text = game.add.text(5, 5, 'Letter: ' + letters.getTop().key, { fontSize: '32px', fill: '#000' });
            text.fixedToCamera = true;

            timer = game.time.create(false);
            timer.fixedToCamera = true;
            timer.add(Phaser.Timer.SECOND * 30, this.timesUp, this);
            timer.start();
            //game.time.events.add(Phaser.Timer.SECOND * 30, timesUp, this);

        },
        
        update: function() {

            var count = 0;
            mailboxes.forEach(function(mail){
                if(mail.frame == 1)
                {
                    count++;
                }
                if(count == (mailboxes.length))
                {
                    Win();
                }
            });

            //  Checks to see if the player overlaps with any of the mailboxes
            game.physics.arcade.overlap(player, mailboxes, this.deliverLetter, null, this);

            //  Reset the players velocity (movement)
            player.body.velocity.x = 0;

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

        deliverLetter: function(player, mailbox) {

            var paper = game.add.audio('paper');

            if(cursors.up.isDown && mailbox.frame === 0)
            {
                if(letters.getTop().key === 'blue' && (mailboxes.getChildIndex(mailbox) == 1 || mailboxes.getChildIndex(mailbox) == 5))
                {
                    paper.play();
                    mailbox.frame = 1;
                    letters.remove(letters.getTop());
                    letters.updateZ();
                    text.text = 'Letter: ' + letters.getTop().key;
                }

                if(letters.getTop().key === 'green' && (mailboxes.getChildIndex(mailbox) == 0 || mailboxes.getChildIndex(mailbox) == 3 || mailboxes.getChildIndex(mailbox) == 7))
                {
                    paper.play();
                    mailbox.frame = 1;
                    letters.remove(letters.getTop());
                    letters.updateZ();
                    text.text = 'Letter: ' + letters.getTop().key;
                }

                if(letters.getTop().key === 'red' && (mailboxes.getChildIndex(mailbox) == 2 || mailboxes.getChildIndex(mailbox) == 4 || mailboxes.getChildIndex(mailbox) == 6))
                {
                    paper.play();
                    mailbox.frame = 1;
                    letters.remove(letters.getTop());
                    letters.updateZ();
                    text.text = 'Letter: ' + letters.getTop().key;
                }
            }
        },

        timesUp: function(){
            timer.stop();
            gameOver();
        },

        render: function(){
            game.debug.text("Time: " + timer.duration, 500, 32, { fontSize: '32px', fill: '#000' });
            //console.log('length: ' + letters.length);
        },
    };
};
