"use strict";

GameStates.makeMayhem = function( game, shared ) {

    // Create your own variables.
    var player;
    var chests;
    var treasure;
    var gems;
    var tweeng;
    var tweenC,tweenC1,tweenC2,tweenC3;
    var music;
    var bg;
    var currChest = 0;
    var count = 0;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        music.stop();
        game.state.start('MainMenu');

    }
    
    return {

        // preload: function(){
        //     game.load.image('forestBG', 'assets/forest_bg.png');
        //     game.load.audio('mayhemMusic', ['assets/HDJ_Boss.mp3']);
        //     game.load.spritesheet('chest','assets/chest.png', 64, 128);
        //     game.load.image('gems','assets/gems.png');
        // },
    
        create: function () {

            //Play music
            music = game.add.audio('mayhemMusic');
            music.loop = true;
            music.play();

            bg = game.add.image(0,0,'forestBG');

            
            chests = game.add.group();
            chests.enableBody = true;

            for(var i=0; i<4; i++){

                var chest = chests.create((i+0.5)*180, 200, 'chest');
                chest.scale.setTo(1.5, 1.5);
                chest.frame = 0;
                chest.swapped = false;

            }

            this.showTreasure();


        },
    
        update: function () {
            // if(count==0){
            //     this.showTreasure();
            //     count++;

            // }
        },

        showTreasure: function () {
            treasure = chests.getRandom();
            treasure.frame = 1;

            gems = game.add.image(treasure.x+14,treasure.y+80,'gems');

            tweeng = game.add.tween(gems).to( { y: treasure.y-50 }, 1000, "Quart.easeOut",false,1000,0,true);
            tweeng.start();

            tweeng.onComplete.add(this.mayhemTime, this);
        },

        mayhemTime: function(){
            gems.kill();
            treasure.frame = 0;

            
            // var random;
            // random = chests.getRandom();
            // while(treasure==random)
            //      random = chests.getRandom();

            // tweenC = game.add.tween(treasure).to({x: random.x}, 600, "Cubic.easeIn",false,1000);
            // tweenC2 = game.add.tween(random).to({x: treasure.x}, 600, "Cubic.easeOut",false,1000);

            // // tweenC.chain(tweenC2);

            // tweenC.start();
            // tweenC2.start();

            // tweenC.repeat(5,200);

            // tweenC.onRepeat.add(this.repeatSwap,this);
           // for(var i = 0; i<2; i++){
           //      if(currChest==4)
           //          currChest=0;
            count=0;
            this.repeatSwap();
            //}

            // chests.forEach(function(chest){
            //     chest.inputEnabled = true;
            //     chest.input.useHandCursor = true;
            //     //if(chest===treasure)
            //         chest.events.onInputDown.add(this.resultWin,this);
            // });

            // for(var i=0; i<4; i++){
            //     var chest = chests.getChildAt(i);
            //     //chest.inputEnabled = true;
            //     chest.input.useHandCursor = true;
            //     if(chest===treasure)
            //         chest.events.onInputDown.add(this.resultWin,this);
            //     else
            //         chest.events.onInputDown.add(this.resultLose,this);
            // }

        },

        repeatSwap: function(){
            if(currChest==4)
                currChest = 0;
            var random;
            random = chests.getRandom();
            var swapped = 0;
            for(var i=0; i<4; i++){
                if(chests.getChildAt(i).swapped===true)
                    swapped++;
            }
            //var i = 0;
            while(random.swapped===true){
                if(swapped==4)
                    break;
                random = chests.getRandom();
                if(random.swapped===false)
                    break;
                // i++;
                // if(i==4)
                //     break;
            }

            //Chest to move coords
            var getCX = chests.getChildAt(currChest).x;
            var getCY = chests.getChildAt(currChest).y;

            //Random chest to swap coords
            var getRX = random.x;
            var getRY = random.y;

            //var move = game.rnd.integerInRange(1,2);

            // if(move==1){

                // tweenC = game.add.tween(chests.getChildAt(currChest)).to({x: Math.abs((getCX-getRX)/2), y: getRY-110*move}, 1000, "Cubic.easeIn",false,1000);
                // tweenC1 = game.add.tween(chests.getChildAt(currChest)).to({x: getRX, y: getRY}, 1000, "Cubic.easeOut");
                // tweenC2 = game.add.tween(random).to({x: Math.abs((getCX-getRX)/2), y: getCY-110*move}, 1000, "Cubic.easeIn",false,1000);
                // tweenC3 = game.add.tween(random).to({x: getCX, y: getCY}, 1000, "Cubic.easeOut");

                // tweenC.chain(tweenC1);
                // tweenC2.chain(tweenC3);
            // }
            // else{
            
                 tweenC = game.add.tween(chests.getChildAt(currChest)).to({x: getRX}, 600, "Cubic.easeIn",false,700);
                 tweenC2 = game.add.tween(random).to({x: getCX}, 600, "Cubic.easeIn",false,700);
            // } 

            tweenC.start();
            tweenC2.start();

            currChest++;
            count++;
            random.swapped = 'true';
            chests.bringToTop(random);

            if(count<5)
                 tweenC2.onComplete.add(this.repeatSwap,this);

            if(count==5){
                for(var i=0; i<4; i++){
                    var chest = chests.getChildAt(i);
                    chest.inputEnabled = true;
                    chest.input.useHandCursor = true;
                    if(chest===treasure)
                        chest.events.onInputDown.add(this.resultWin,this);
                    else
                        chest.events.onInputDown.add(this.resultLose,this);
                }
            }

        },

        resultWin: function(){
            //this.game.state.restart();
            music.stop();
            game.state.start("Game",true,false);
            //game.state.clearCurrentState();
            shared.numMimics++;
        },

        resultLose: function(){
            music.stop();
            this.game.state.start("GameOver");
        },

        render: function(){
            this.game.debug.text("Minigame: "+game.state.current,32,30);
            //var debugC = chests.getChildAt(0).swapped;
            //this.game.debug.text("Property: "+debugC,32,45);
            this.game.debug.text("count: "+count,32,45);
        }
    };
};
