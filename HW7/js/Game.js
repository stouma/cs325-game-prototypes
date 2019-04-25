"use strict";

GameStates.makeGame = function( game, shared ) {

    // Create your own variables.
    var player;
    var pUp, pDown, pLeft, pRight;
    var slime;
    var mimics;
    var drakes;
    var cursors;
    var ground,ground2;
    var trees,trees2;
    var top;
    var map;
    var music;
    //var countMWon, countDWon;
    
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
            map.addTilesetImage('ground', 'ground');
            map.addTilesetImage('trees', 'trees');

            //Add in each layer
            ground = map.createLayer('ground1');
            ground2 = map.createLayer('ground2');
            trees = map.createLayer('collision');
            trees2 = map.createLayer('collision2');

            map.setCollisionBetween(1,10000,true,'collision');
            map.setCollisionBetween(1,10000,true,'collision2');

            ground.resizeWorld();

            //Create mimics
            mimics = game.add.group();
            mimics.enableBody = true;
            //var chest = mimics.create(300, 300, 'mimic', 10);
            this.createMimics();

            //Create drakes
            drakes = game.add.group();
            drakes.enableBody = true;
            this.createDrakes();

            //Create slime
            slime = game.add.sprite(128, 22, 'slime');
            slime.scale.setTo(2,2);
            slime.frame = 2;

            //slimes physics
            game.physics.arcade.enable(slime);
            slime.body.collideWorldBounds = true;

            slime.animations.add('up', [0,4,8,12,16,20,24], 10, true);
            slime.animations.add('right', [1,5,9,13,17,21,25], 10, true);
            slime.animations.add('down', [2,6,10,14,18,22,26], 10, true);
            slime.animations.add('left', [3,7,11,15,19,23,27], 10, true);

            //Create player
            player = game.add.sprite(130, 22, 'hero');
            player.scale.setTo(2,2);
            player.frame = 1;

            //player physics
            game.physics.arcade.enable(player);
            player.body.collideWorldBounds = true;

            //Walking animations
            player.animations.add('down', [0,1,2], 10, true);
            player.animations.add('right', [3,4,5], 10, true);
            player.animations.add('left', [6,7,8], 10, true);
            player.animations.add('up', [9,10,11], 10, true);

            top = map.createLayer('toplayer');

            game.camera.follow(player);

            cursors = game.input.keyboard;
        },
    
        update: function () {

            //Reset players velocity (movement)
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;

            game.physics.arcade.overlap(player, mimics, this.mimicMayhem, null, this);

            game.physics.arcade.overlap(player, drakes, this.dancingDrake, null, this);

            game.physics.arcade.collide(player, trees);
            game.physics.arcade.collide(player, trees2);

            game.physics.arcade.collide(slime, trees);
            game.physics.arcade.collide(slime, trees2);

            game.physics.arcade.collide(mimics, trees);
            game.physics.arcade.collide(mimics, trees2);

            game.physics.arcade.collide(drakes, trees);
            game.physics.arcade.collide(drakes, trees2);

            var distance = game.math.distance(slime.x, slime.y, player.x, player.y);

            if(shared.numMimics>=3&&shared.numDrakes>=2)
                this.resultWin();

            // if(mimics.countLiving()==0&&drakes.countLiving()==0)
            //     this.resultWin();

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
            if(shared.numMimics<=3){
                for(var i=0; i<3-shared.numMimics; i++){
                    var mimic = mimics.create(game.rnd.integerInRange(0, 1024),game.rnd.integerInRange(0, 1024),'mimic',10);
                    game.physics.arcade.enable(mimic);
                    mimic.body.collideWorldBounds = true;
                    mimic.scale.setTo(2,2);
                    mimic.body.velocity.x = 0;
                    mimic.body.velocity.y = 0;
                    mimic.animations.add('up', [9,10,11], 10, true);
                    mimic.animations.add('right', [6,7,8], 10, true);
                    mimic.animations.add('down', [0,1,2], 10, true);
                    mimic.animations.add('left', [3,4,5], 10, true);

                }

                game.time.events.loop(Phaser.Timer.SECOND*3,this.mimicMove,this);
            }
        },

        createDrakes: function(){
            if(shared.numDrakes<=2){
                for(var i=0; i<2-shared.numDrakes; i++){
                    var drake = drakes.create(game.rnd.integerInRange(0, 1024),game.rnd.integerInRange(0, 1024),'drake',10);
                    game.physics.arcade.enable(drake);
                    drake.body.collideWorldBounds = true;
                    drake.scale.setTo(1.7,1.7);
                    drake.body.velocity.x = 0;
                    drake.body.velocity.y = 0;
                    drake.animations.add('up', [9,10,11], 10, true);
                    drake.animations.add('right', [6,7,8], 10, true);
                    drake.animations.add('down', [0,1,2], 10, true);
                    drake.animations.add('left', [3,4,5], 10, true);
                }

                game.time.events.loop(Phaser.Timer.SECOND*3,this.drakeMove,this);
            }
        },

        mimicMove: function(){
            mimics.forEach(function(mimic){

                var mimicMovement = game.rnd.integerInRange(0,4);
                var moveToX;
                var moveToY;

                //up
                if(mimicMovement==0){
                    moveToY = mimic.y-100;
                    mimic.animations.play('up');
                    game.physics.arcade.moveToXY(mimic,mimic.x,moveToY);
                    //tween1 = game.add.tween(mimic).to({y:-100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                //down
                else if(mimicMovement==1){
                    moveToY = mimic.y+100;
                    mimic.animations.play('down');
                    game.physics.arcade.moveToXY(mimic,mimic.x,moveToY);
                    //tween1 = game.add.tween(mimic).to({y:100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                //left
                else if(mimicMovement==2){
                    moveToX = mimic.x-100;
                    mimic.animations.play('left');
                    game.physics.arcade.moveToXY(mimic,moveToX,mimic.y);
                    //tween1 = game.add.tween(mimic).to({x:-100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                //right
                else if(mimicMovement==3){
                    moveToX = mimic.x+100;
                    mimic.animations.play('right');
                    game.physics.arcade.moveToXY(mimic,moveToX,mimic.y);
                    //tween1 = game.add.tween(mimic).to({x:100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                else{
                    mimic.frame = 1;
                }
           });
        },

        drakeMove: function(){
            drakes.forEach(function(drake){

                var drakeMovement = game.rnd.integerInRange(0,4);
                var moveToX;
                var moveToY;

                //up
                if(drakeMovement==0){
                    moveToY = drake.y-100;
                    drake.animations.play('up');
                    game.physics.arcade.moveToXY(drake,drake.x,moveToY);
                    //tween1 = game.add.tween(drake).to({y:-100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                //down
                else if(drakeMovement==1){
                    moveToY = drake.y+100;
                    drake.animations.play('down');
                    game.physics.arcade.moveToXY(drake,drake.x,moveToY);
                    //tween1 = game.add.tween(drake).to({y:100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                //left
                else if(drakeMovement==2){
                    moveToX = drake.x-100;
                    drake.animations.play('left');
                    game.physics.arcade.moveToXY(drake,moveToX,drake.y);
                    //tween1 = game.add.tween(drake).to({x:-100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                //right
                else if(drakeMovement==3){
                    moveToX = drake.x+100;
                    drake.animations.play('right');
                    game.physics.arcade.moveToXY(drake,moveToX,drake.y);
                    //tween1 = game.add.tween(drake).to({x:100,},2000,Phaser.Easing.Linear.None,true,1000,1000,true);
                }
                else{
                    drake.frame = 1;
                }
            });

        },

        mimicMayhem: function () {
            mimics.getRandomExists().kill();
            //mimic.kill();
            // if(mimics.checkProperty(mimic,'exists',false)){
                music.pause();
                //game.pause = true;
                game.state.start("MimicMayhem",false,false);
                // if(game.state.getCurrentState()=='Game')
                //     game.pause = false;
            //}
            //shared.numMimics--;
        },

        dancingDrake: function(){
            drakes.getRandomExists().kill();
            music.pause();
            //game.pause = true;
            game.state.start("DancingDrake",false,false);
            // if(game.state.getCurrentState()=='Game')
            //     game.pause = false;
            //shared.numDrakes--;
        },

        resultWin: function(){
            music.stop()
            this.game.state.start("Win");
        },

        render: function(){
            game.debug.text("Mimics: "+mimics.countLiving(),32,32);
            game.debug.text("Drakes: "+drakes.countLiving(),32,48);
        }
    };
};
