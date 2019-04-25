"use strict";

GameStates.makeDrake = function( game, shared ) {

    // Create your own variables.
    var music;
    var bg;
    var leftA, rightA, upA, downA;
    var arrows;
    var tweenA, tweenB, tweenC, tweenD;
    var randomA,randomB,randomC, randomD;
    var count;
    var combo;
    var cursors;
    var textC;
    var anim;
    var health;
    var cropRect;
    var drakes;
    var bell;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        music.stop();
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {

            music = game.add.audio('Meow');
            bell = game.add.audio('bell');

            bg = game.add.image(0,0,'forestBG');

            game.physics.startSystem(Phaser.Physics.ARCADE);

            drakes = game.add.group();
            drakes.enableBody = true;
            for(var i=1; i<4; i++){
                var drake = drakes.create(i*170, 300, 'drake',10);
                drake.scale.setTo(2.5,2.5);
            }

            health = game.add.image(20,550,'health');

            //left arrow
            leftA = game.add.sprite(200, 32, 'mainarrows');
            leftA.scale.setTo(2.5,2.5);
            leftA.frame = 15;

            game.physics.arcade.enable(leftA);

            //down arrow
            downA = game.add.sprite(300, 32, 'mainarrows');
            downA.scale.setTo(2.5,2.5);
            downA.frame = 48;

            game.physics.arcade.enable(downA);

            //up arrow
            upA = game.add.sprite(400, 32, 'mainarrows');
            upA.scale.setTo(2.5,2.5);
            upA.frame = 45;

            game.physics.arcade.enable(upA);

            //right arrow
            rightA = game.add.sprite(500, 32, 'mainarrows');
            rightA.scale.setTo(2.5,2.5);
            rightA.frame = 75;

            game.physics.arcade.enable(rightA);

            arrows = game.add.group();
            arrows.enableBody = true;

            //left arrows
            for(var i=0; i<30; i++){
                var arrow = arrows.create(200,700,'userarrows');
                arrow.scale.setTo(2.5, 2.5);
                arrow.frame = 15;
            }

            //down arrows
            for(var i=30; i<60; i++){
                var arrow = arrows.create(300,700,'userarrows');
                arrow.scale.setTo(2.5, 2.5);
                arrow.frame = 48;
            }

            //up arrows
            for(var i=60; i<90; i++){
                var arrow = arrows.create(400,700,'userarrows');
                arrow.scale.setTo(2.5, 2.5);
                arrow.frame = 45;
            }

            //right arrows
            for(var i=90; i<120; i++){
                var arrow = arrows.create(500,700,'userarrows');
                arrow.scale.setTo(2.5, 2.5);
                arrow.frame = 75;
            }

            count = 0;
            combo = 0;

            cursors = game.input.keyboard.createCursorKeys();

            var textC = game.add.sprite(250, 250, 'countdown');
            textC.scale.setTo(2,2);
            anim = textC.animations.add('countdown');

            anim.onComplete.add(this.countDown,this);

            anim.play(2, false, true);

        },
    
        update: function () {
       
            game.physics.arcade.overlap(leftA, arrows, this.arrowHit, null, this);
            game.physics.arcade.overlap(downA, arrows, this.arrowHit, null, this);
            game.physics.arcade.overlap(upA, arrows, this.arrowHit, null, this);
            game.physics.arcade.overlap(rightA, arrows, this.arrowHit, null, this);

            if(randomA!=null||randomB!=null||randomC!=null||randomD!=null){
                if(randomA.y<=-50&&randomA.exists){
                    combo = 0;
                    this.damageTaken();
                }
                else if(randomB.y<=-50&&randomB.exists){
                    combo = 0;
                    this.damageTaken();
                }
                else if(randomC.y<=-50&&randomC.exists){
                    combo = 0
                    this.damageTaken();
                }
                else if(randomD.y<=-50&&randomD.exists){
                    combo = 0;
                    this.damageTaken();
                }
            }

        },

        countDown: function(){
            music.play();
            this.startDancing();
            this.playDance();
        },

        playDance: function(){
            drakes.forEach(function(drake){
                drake.animations.add('gif');
                drake.animations.play('gif', 5, true);
            });
        },

        startDancing: function(){

            randomA = arrows.getRandomExists();
            randomB = arrows.getRandomExists();
            while(randomB==randomA){
                if(arrows.getAll()==randomA)
                    break;
                randomB = arrows.getRandomExists();
            }

            randomC = arrows.getRandomExists();
            while(randomC==randomB){
                if(arrows.getAll()==randomB)
                    break;
                randomC = arrows.getRandomExists();
            }

            randomD = arrows.getRandomExists();
            while(randomD==randomC){
                if(arrows.getAll()==randomC)
                    break;
                randomD = arrows.getRandomExists();
            }

            randomA.y = 700;
            randomB.y = 700;
            randomC.y = 700;
            randomD.y = 700;


            tweenA = game.add.tween(randomA).to( { y: -100 }, 1000, Phaser.Easing.Default,false);
            tweenB = game.add.tween(randomB).to( { y: -100 }, 1000, Phaser.Easing.Default,false,500);
            tweenC = game.add.tween(randomC).to( { y: -100 }, 1000, Phaser.Easing.Default,false,1000);
            tweenD = game.add.tween(randomD).to( { y: -100 }, 1000, Phaser.Easing.Default,false,1500);

            tweenA.start();
            tweenB.start();
            tweenC.start();
            tweenD.start();

            count++;
            if(count<25)
                tweenC.onComplete.add(this.startDancing,this);

            music.onStop.add(this.resultWin,this);
        },

        arrowHit: function(mainarrow,userarrow){
            //left arrow
            if(userarrow.frame==15&&cursors.left.isDown){
                bell.play();
                combo++;
                userarrow.kill();
            }
            //down arrow
            else if(userarrow.frame==48&&cursors.down.isDown){
                bell.play();
                combo++;
                userarrow.kill();
            }
            //up arrow
            else if(userarrow.frame==45&&cursors.up.isDown){
                bell.play();
                combo++;
                userarrow.kill();
            }
            //right arrow
            else if(userarrow.frame==75&&cursors.right.isDown){
                bell.play();
                combo++;
                userarrow.kill();
            }

        },

        damageTaken: function(){
            if(health.width>0){
                cropRect = new Phaser.Rectangle(0, 0, health.width-0.7, health.height);
                health.crop(cropRect);
            }
            else
                this.resultLose();
        },

        resetValue: function(){
            randomA.y = 700;
            randomB.y = 700;
            randomC.y = 700;
            randomD.y = 700;
        },

        resultWin: function(){
            //this.game.state.restart();
            //music.stop();
            game.state.start("Game",true,false);
            //this.game.state.clearCurrentState();
            shared.numDrakes++;
        },

        resultLose: function(){
            music.stop();
            this.game.state.start("GameOver");
        },

        render: function(){
            this.game.debug.text("Minigame: "+game.state.current,32,30);
            this.game.debug.text("Combo: "+combo,32,45);
            this.game.debug.text("health: "+Phaser.Math.ceilTo(health.width),32,60)
        }
    };
};
