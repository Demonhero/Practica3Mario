var game = function(){
	var Q= window.Q= Quintus()
			.include("Sprites, Scenes,Input, UI, Touch, TMX, Anim, 2D")
			.setup({ width:320, height:480 })
			.controls().touch()
	Q.Sprite.extend("Mario",{
			init: function(p) {
				this._super(p, {
					sprite: "mario_anim",
					sheet: "marioR",
					gravity: 0.65,
					frame: 0,
					x: 150,
					y:380,
					alive:true
				});
				this.add("2d, platformerControls, animation");
				this.on("bump.left, bump.right, bum.top", funtion(collision){});
				this.on("bump.left, bump.right, bum.top", this, "killed");
				this.on("dying", this, "die");
			},

			killed: function(collision){
				if(collision.obj.isA("Goomba")||collision.obj.isA("Bloopa")){
					this.p.alive=false;
					this.p.vx=0;
					this.p.vy= -150;
					this.play("death");
				}
			},

			die: function() { this.destroy(); },

			step: function(dt){
				id(this.p.alive){
					if(this.p.y >= 700){
						this.p.sheet = "marioR";
						this.p.frame = 0;
						this.p.x = 150;
						this.p.y = 380;
					}

					if(this.p.vx === 0) this.play("stand_right");
					if(this.p.vx >0) this.play("walk_right");
					if(this.p.vx <0) this.play("walk_left");
					if(this.p.vy >0 || this.p.vy <0) this.play("jump_right");
					if((this.p.vy >0 || this.p.vy <0)&& this.p.vx <0) this.play("jump_left");
				}
			}
	});

	Q.animations("mario_anim",{
		stand_right: {frames:[0], flip:false, loop:true},
		stand_left: {frames:[0], flip: "x", loop:true},
		walk_right: {frames: [1,2,3], rate: 1/10, flip:false, loop:true},
		walk_left: {frames: [1,2,3], rate: 1/10, flip: "x", loop:true},
		jump_right: {frames: [4], flip: false, loop: true},
		jump_left: {frames: [4], flip: "x", loop: true},
		death: {frames:[12], flip:false, rate:2, loop:false, trigger: "dying"}
	})

	Q.Sprite.exted("Goomba",{
		init: function(p, {
			sprite: "goomba_anim",
			sheet: "goomba",
			frame:0,
			x: 600,
			y:380,
			vx:100,
			alive:true
		});
		
		this.add("2d, aiBounce, animation");
		this.on("bump.left, bump.right, bump.botton", this, "kill");
		this.on("bump.top", this, "killed");
		this.on("dying", this, "die");
			
		},

		kill: function(collision){
			if(collision.obj.isA("Mario")){
				Q.stageScene("endGame", 1, { label: "You Died"});
			}
		},

		killed: function(collision){
			if(collision.obj.isA("Mario")){
				this.p.alive=false;
				this.p.vx=0;
				this.play("death");
				collision.obj.p.vy=-300;
			}

		},

		die: function() {
			this.destroy(); 
		},

		step: function(dt){
			if(this.p.alive){
				if(this.p.vx>0||this.p.vix<0)
					this.play("walk");
			}
		}
	});

	Q.animations("goomba_anim", {
		walk: {frames: [0,1], flip: false, rate: 1/5, loop: true},
		death: {frames: [2], flip: false, rate:1 loop: false, trigger: "dying"}
	});

	Q.Sprite.extend("Bloopa", {
		init: function(p) {
			this._super(p, {
				sprite: "bloopa_anim",
				sheet: "bloopa",
				gravity: 0.1,
				frame: 0,
				x: 500,
				y: 480,
				vy: 150,
				alive: true
			});

			this.add("2d, aiBounce, animation");
			this.on("bump.left, bump.right, bump.bottom", this, "kill");
			this.on("bump.top", this, "killed");
			this.on("dying", this, "die");
		},

		kill: function(collision) {
			if (collision.obj.isA("Mario")) {
				Q.stageScene("endGame", 1, { label: "You Died" });
			}
			else this.p.vy = -150;
		},

		killed: function(collision) {
			if (collision.obj.isA("Mario")) {
				this.p.alive = false;
				this.play("death");
				collision.obj.p.vy = -300;
			}
		},

		die: function() {
			this.destroy();
		},

		step: function(dt) {
			if (this.p.alive) {
				if (this.p.vy > 0) this.play("down");
				else this.play("up");
			}
		}
	});

	Q.animations("bloopa_anim", {
		up: { frames: [0], flip: false, loop: true },
		down: { frames: [1], flip: false, loop: true },
		death: { frames: [2], flip: false, rate: 1, loop: false, trigger: "dying" }
	});

	Q.Sprite.extend("Princess", {
		init: function(p) {
			this._super(p, {
				asset: "princess.png",
				frame: 0,
				x: 2000,
				y: 400
			});

			this.add("2d");
			this.on("bump.left, bump.right, bump.top", function(collision) {
				if (collision.obj.isA("Mario")) {
					Q.stageScene("winGame", 1, { label: "You Won!" });
				}
			})
		}
	});

	Q.Sprite.extend("Coin", {
		init: function(p) {
			this._super(p, {
				sheet: "coin_anim",
				frame: 0,
				sprite: "coin",
				gravity: 0,
				sensor: true,
				picked: false
			});

			this.add("tween, animation");
			this.on("sensor", function(collision) {
				if (!this.p.collision && collision.isA("Mario")) {
					Q.state.inc("score", 1);
					this.p.picked = true;
					this.animate({ y: this.p.y - 50 }, 0.2, Q.Easing.Linear, {
						callback: function() {
							this.destroy();
						},
					});
				}
			});
		},

		step: function(p) {
			this.play("switch");
		},
	});

	Q.animations("coin_anim", {
		switch: { frames: [0, 1, 2], loop: true, rate: 1/2 },
	});


				
}