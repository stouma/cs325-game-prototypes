"use strict";

GameStates.makeLose = function( game ) {

	var loseLabel;
	var startLabel;
	var wkey;

	return{
		create: function(){
			game.stage.backgroundColor = '#000000';

			loseLabel = game.add.text(80,80, 'YOU LOSE!', {font: '50px Arial', fill: '#00FF00'});

			startLabel = game.add.text(80, 400, 'press the "W" key to restart', {font: '25px Arial', fill: '#ffffff'});

			wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);

			wkey.onDown.addOnce(this.restart, this);
		},

		restart: function(){
			game.state.start('MainMenu');
		}
	};
};