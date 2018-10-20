//import AnimatedTiles from './node_modules/phaser-animated-tiles/dist/AnimatedTiles';

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 720,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let cursors;
let player;
let showDebug = false;
let enemy;
let enemy2;
let enemies;
var pad;
function preload() {

  this.load.image('tiles', '../assets/tilesets/terrain_atlas.png');
  this.load.tilemapTiledJSON('map', '../assets/tilemaps/finalMap.json');
  //player and enemy images/spritesheets
  //this.load.image('arrow', 'assets/images/Arrow.png');
  this.load.spritesheet('baldric1', 'assets/images/baldric1.png', { frameWidth: 32, frameHeight: 32 });
  
}


function create() {
  const map = this.make.tilemap({ key: "map" });

  this.map = this.add.tilemap('map');	

  let tileset = this.map.addTilesetImage('terrain_atlas','tiles');


     //layers
      var belowPlayer1 = map.createStaticLayer('Below Player 1', tileset);
      var belowPlayer = map.createStaticLayer('Below Player', tileset);
      var mazeFloor = map.createStaticLayer('Maze Floor', tileset);
      var world = map.createStaticLayer('World', tileset);
      var abovePlayer0 = map.createStaticLayer('Above Player 0', tileset);
      var treeLayer = map.createStaticLayer('Tree Layer', tileset);
      var abovePlayer1 = map.createStaticLayer('Above Player 1', tileset);
      var abovePlayer2 = map.createStaticLayer('Above Player 2', tileset);
      

 //collisions
  belowPlayer.setCollisionByProperty({collides: true}, {recalculateFaces: true});
  world.setCollisionByProperty({collides: true}, {recalculateFaces: true});
  abovePlayer0.setCollisionByProperty({collides: true},{recalculateFaces: true});
  abovePlayer2.setDepth(10);
  abovePlayer1.setDepth(10);
  treeLayer.setDepth(10);



  //player actions
  player = this.physics.add.sprite(352, 1184, 'baldric1');
  this.physics.add.collider(player, world);
  this.physics.add.collider(player, belowPlayer);
  this.physics.add.collider(player, abovePlayer0);

  
  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('baldric1', { start: 9, end: 17 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'turn',
    frames: [ { key: 'baldric1', frame: 18 } ],
    frameRate: 20
});

this.anims.create({
    key: 'down',
    frames: this.anims.generateFrameNumbers('baldric1', { start: 18, end: 25 }),
    frameRate: 10,
    repeat: -1
});

  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('baldric1', { start: 0, end: 8 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('baldric1', { start: 27, end: 35 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
  key: 'space',
  frames: this.anims.generateFrameNumbers('baldric1dead', { start: 0, end: 5 }),
  frameRate: 10,
  repeat: -1
})
  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  camera.roundPixels = true;

  cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
  
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);

      player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);

      player.anims.play('right', true);
  }
  else if (cursors.up.isDown)
  {
      player.setVelocityY(-160);

      player.anims.play('up', true);
  }
  else if (cursors.down.isDown)
  {
      player.setVelocityY(160);

      player.anims.play('down', true);
  }
  else
  {
      player.setVelocityX(0);

      player.anims.play('turn');
  }


  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);
}
