"use strict";

GameStates.makeGame = function( game, shared ) {

    // Create your own variables.
    var player;
    var pUp, pDown, pLeft, pRight;
    var slime;
    var mimics;
    var cursors;
    var ground;
    var map;
    var music;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        music.stop();
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {

            //Play music
            music = game.add.audio('fieldMusic');
            music.loop = true;
            music.play();

            game.physics.startSystem(Phaser.Physics.ARCADE);

            //Create map
            map = game.add.tilemap('forest');
            map.addTilesetImage('forest_tiles', 'tiles');

            //Add in each layer
            ground = map.createLayer('ground');

            ground.resizeWorld();

            //Create mimics
            mimics = game.add.group();
            mimics.enableBody = true;
            //var chest = mimics.create(300, 300, 'mimic', 10);
            this.createMimics();

            //Create slime
            slime = game.add.sprite(30, 32, 'slime');
            slime.scale.setTo(2,2);
            slime.frame = 2;

            //Slimes physics
            game.physics.arcade.enable(slime);
            slime.body.collideWorldBounds = true;

            slime.animations.add('up', [0,4,8,12,16,20,24], 10, true);
            slime.animations.add('right', [1,5,9,13,17,21,25], 10, true);
            slime.animations.add('down', [2,6,10,14,18,22,26], 10, true);
            slime.animations.add('left', [3,7,11,15,19,23,27], 10, true);

            //Create player
            player = game.add.sprite(32, 32, 'hero');
            player.scale.setTo(2,2);

            //Player physics
            game.physics.arcade.enable(player);
            player.body.collideWorldBounds = true;

            //Walking animations
            player.animations.add('down', [0,1,2], 10, true);
            player.animations.add('right', [3,4,5], 10, true);
            player.animations.add('left', [6,7,8], 10, true);
            player.animations.add('up', [9,10,11], 10, true);

            game.camera.follow(player);

            cursors = game.input.keyboard;
        },
    
        update: function () {

            //Reset players velocity (movement)
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;

            game.physics.arcade.overlap(player, mimics, this.mimicMayhem, null, this);

            var distance = game.math.distance(slime.x, slime.y, player.x, player.y);

            // If the distance > MIN_DISTANCE then move
            if (distance > 64) {
                // Calculate the angle to the target
                var rotation = game.math.angleBetween(slime.x, slime.y, player.x, player.y);

                // Calculate velocity vector based on rotation and this.MAX_SPEED
                slime.body.velocity.x = Math.cos(rotation) * 150;
                slime.body.velocity.y = Math.sin(rotation) * 150;
            } 
            else {
                slime.body.velocity.setTo(0, 0);
            }

            //slime.moveToObject(slime,player,50);

            if (cursors.addKey(Phaser.Keyboard.A).isDown)
            {
                //  Move to the left
                player.body.velocity.x = -150;

                player.animations.play('left');
                slime.animations.play('left');

                pUp = false;
                pDown = false;
                pLeft = true;
                pRight = false;
            }
            else if (cursors.addKey(Phaser.Keyboard.D).isDown)
            {
                //  Move to the right
                player.body.velocity.x = 150;

                player.animations.play('right');
                slime.animations.play('right');

                pUp = false;
                pDown = false;
                pLeft = false;
                pRight = true;
            }
            else if(cursors.addKey(Phaser.Keyboard.W).isDown)
            {
                // Move up
                player.body.velocity.y = -150;
            
                player.animations.play('up');
                slime.animations.play('up');

                pUp = true;
                pDown = false;
                pLeft = false;
                pRight = false;
            }
            else if(cursors.addKey(Phaser.Keyboard.S).isDown)
            {
                // Move down
                player.body.velocity.y = 150;

                player.animations.play('down');
                slime.animations.play('down');

                pUp = false;
                pDown = true;
                pLeft = false;
                pRight = false;
            }
            else
            {
                //  Stand still
                player.animations.stop();
                if(pUp){
                    player.frame = 10;
                    slime.frame = 8;
                }
                if(pDown){
                    player.frame = 1;
                    slime.frame = 10;
                }
                if(pLeft){
                    player.frame = 7;
                    slime.frame = 11;
                }
                if(pRight){
                    player.frame = 4;
                    slime.frame = 9;
                }
            }

        },

        createMimics: function(){
            var tween;
            for(var i=0; i<12; i++){
                //mimics.forEach(function(mimic){
                var mimic = mimics.create(game.rnd.integerInRange(0, 2048),game.rnd.integerInRange(0, 2048),'mimic',10);
                game.physics.arcade.enable(mimic);
                mimic.body.collideWorldBounds = true;
                mimic.scale.setTo(2,2);
                mimic.body.velocity.x = 0;
                mimic.body.velocity.y = 0;
                mimic.animations.add('up', [9,10,11], 10, true);
                mimic.animations.add('right', [6,7,8], 10, true);
                mimic.animations.add('down', [0,1,2], 10, true);
                mimic.animations.add('left', [3,4,5], 10, true);
                //});

            }

            mimics.forEach(function(mimic){

                var mimicMovement = game.rnd.integerInRange(0,4);

                //up
                if(mimicMovement=0){
                    mimic.animations.play('up');
                    tween = game.add.tween(mimics).to({y:-100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                //down
                if(mimicMovement=1){
                    mimic.animations.play('down');
                    tween = game.add.tween(mimics).to({y:100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                //left
                if(mimicMovement=2){
                    mimic.animations.play('left');
                    tween = game.add.tween(mimics).to({x:-100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                //right
                if(mimicMovement=3){
                    mimic.animations.play('right');
                    tween = game.add.tween(mimics).to({x:100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                else{
                    mimic.frame = 10;
                }
            });

            tween.onLoop.add(this.enemyMove,this);
        },

        enemyMove: function(){
            mimics.forEach(function(mimic){
                mimic.y = game.rnd.integerInRange(-20,20);
            });
        },

        mimicMayhem: function () {
            music.pause();
            this.game.state.start("MimicMayhem");
            mimics.getRandom().kill();
        }
    };
};
