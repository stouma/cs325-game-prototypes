"use strict";

GameStates.makeWin = function( game ) {

	var winLabel;
	var startLabel;
	var wkey;

	return{
		create: function(){

			game.stage.backgroundColor = '#ff6b6b';

			var victory = game.add.sprite(150, 0, 'Victory');
			victory.animations.add('gif');
			victory.animations.play('gif', 2, true);

			//winLabel = game.add.text(80,80, 'YOU WON!', {font: '50px Arial', fill: '#00FF00'});

			startLabel = game.add.text(250, 550, 'press the "W" key to restart', {font: '25px Arial', fill: '#ffffff'});

			wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);

			wkey.onDown.addOnce(this.restart, this);
		},

		restart: function(){
			game.state.start('MainMenu');
		}
	};
};