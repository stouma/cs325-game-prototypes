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
    var count = 0;
    var currChest = 0;
    
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

            }

            chests.setAll('swapped', 'false');

        },
    
        update: function () {
            if(count==0){
                this.showTreasure();
                count++;
                //tweeng.stop();
            }
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
            //     random = chests.getRandom();

            // tweenC = game.add.tween(treasure).to({x: Math.abs((treasure.x-random.x)/2),y: random.y-150}, 600, "Cubic.easeIn");
            // tweenC2 = game.add.tween(treasure).to({x: random.x, y: random.y}, 1000, "Cubic.easeOut");

            // tweenC.chain(tweenC2);

            // tweenC.start();

            // tweenC.repeat(5,200);

            // tweenC.onRepeat.add(this.repeatSwap,this);
            for(var i = 0; i<4; i++){
                if(currChest==4)
                    currChest=0;
                this.repeatSwap();
            }

            // chests.forEach(function(chest){
            //     chest.inputEnabled = true;
            //     chest.input.useHandCursor = true;
            //     //if(chest===treasure)
            //         chest.events.onInputDown.add(this.resultWin,this);
            // });

            for(var i=0; i<4; i++){
                var chest = chests.getChildAt(i);
                chest.inputEnabled = true;
                chest.input.useHandCursor = true;
                if(chest===treasure)
                    chest.events.onInputDown.add(this.resultWin,this);
                else
                    chest.events.onInputDown.add(this.resultLose,this);
            }

        },

        repeatSwap: function(){
            //chests.forEach(function(chest){
                var random;
                random = chests.getRandom();
                //random = chests.getRandom(currChest,4-currChest);
                //while(chests.getChildAt(currChest)==random)
                var i = 0;
                while(chests.getChildAt(currChest).swapped==='true'){
                    random = chests.getRandom();
                    if(random.swapped==='false')
                        break;
                    i++;
                    if(i==4)
                        break;
                }

                //Chest to move coords
                var getCX = chests.getChildAt(currChest).x;
                var getCY = chests.getChildAt(currChest).y;

                //Random chest to swap coords
                var getRX = random.x;
                var getRY = random.y;

                tweenC = game.add.tween(chests.getChildAt(currChest)).to({x: Math.abs((getCX-getRX)/2), y: getRY-110*(game.rnd.integerInRange(1,2))}, 600, "Cubic.easeIn",false,1000);
                tweenC1 = game.add.tween(chests.getChildAt(currChest)).to({x: getRX, y: getRY}, 1000, "Cubic.easeOut");
                tweenC2 = game.add.tween(random).to({x: Math.abs((getCX-getRX)/2), y: getCY-110*(game.rnd.integerInRange(1,2))}, 600, "Cubic.easeIn",false,400);
                tweenC3 = game.add.tween(random).to({x: getCX, y: getCY}, 1000, "Cubic.easeOut");
                
                tweenC.chain(tweenC1);
                tweenC1.chain(tweenC2);
                tweenC2.chain(tweenC3);
                tweenC1.pendingDelete = false;
                tweenC2.pendingDelete = false;
                tweenC3.pendingDelete = false;
                //tweenC2.chain(tweenC3);
                //tweenC.delay(1000);
                //tweenC.repeat(3);
                //tweenC2.loop();
                tweenC.start();
                //tweenC2.start();

                currChest++;
                random.swapped = 'true';
                chests.bringToTop(random);
            //});
            //tweenC.start();
        },

        resultWin: function(){
            music.stop();
            this.game.state.start("Game");
        },

        resultLose: function(){
            music.stop();
            this.game.state.start("GameOver");
        }

        // debug: function(){
        //     var debugC = chests.getChildAt(0).swapped
        //     game.debug.text(""+debugC,32,32);
        // }
    };
};
