const config = {
  renderer: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

// General declarations
let messageToPlayer;
let isGameStarted = false;
let gameOver = false;
let bird;
let cursors;
let hasLanded = false;
let hasBumped = false;

// Reset function
function reset(scene) {
  isGameStarted = false;
  gameOver = false;
  hasLanded = false;
  hasBumped = false;
  scene.restart();
}

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('pipe-top', 'assets/pipe-top.png');
  this.load.image('pipe-bottom', 'assets/pipe-bottom.png');
  this.load.spritesheet('bird', 'assets/bird.png', {
    frameWidth: 34,
    frameHeight: 24,
  });
}

function create() {
  // Add background
  this.add.image(0, 0, 'background').setOrigin(0, 0);
  const roads = this.physics.add.staticGroup();
  const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

  // Add columns
  const topColumns = this.physics.add.staticGroup({
    key: 'pipe-top',
    repeat: 1,
    setXY: { x: 200, y: 80, stepX: 300 },
  });
  const bottomColumns = this.physics.add.staticGroup({
    key: 'pipe-bottom',
    repeat: 1,
    setXY: { x: 350, y: 341, stepX: 300 },
  });

  // Add bird
  bird = this.physics.add.sprite(0, 50, 'bird');
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

  // Add collision for bird
  this.physics.add.overlap(bird, road, () => (hasLanded = true), null, this);
  this.physics.add.collider(bird, road);
  this.physics.add.overlap(
    bird,
    topColumns,
    () => (hasBumped = true),
    null,
    this
  );
  this.physics.add.overlap(
    bird,
    bottomColumns,
    () => (hasBumped = true),
    null,
    this
  );
  this.physics.add.collider(bird, topColumns);
  this.physics.add.collider(bird, bottomColumns);

  // Add cursor keys detection
  cursors = this.input.keyboard.createCursorKeys();

  // Add message to player
  messageToPlayer = this.add.text(
    config.width / 2, // For centering with setOrigin
    550,
    'Instructions: Press space bar to start',
    {
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold',
      fontSize: '20px',
      color: '#dcf685',
      stroke: '#000',
      strokeThickness: 2,
      align: 'center',
    }
  );
  messageToPlayer.setShadow(1, 1, '#0008', 2).setOrigin(0.5);
}

function update() {
  // Starting position
  if (!isGameStarted) {
    bird.setVelocityY(-160);
  }
  // Start game with space
  if (cursors.space.isDown && !isGameStarted) {
    isGameStarted = true;
    messageToPlayer.setText(
      "Press the 🠝-key to stay upright\nAnd don't hit the columns or ground"
    );
  }
  // Bird movement
  const isMoving = !hasLanded && !hasBumped && isGameStarted;
  const isCrashed = hasBumped || hasLanded;

  bird.body.velocity.x = isMoving ? 50 : 0;

  if (cursors.up.isDown && isMoving) {
    bird.setVelocityY(-160);
  }

  // Game over
  if (isCrashed) {
    messageToPlayer.setText(
      'Oh no! You crashed!\nPress space bar to try again'
    );
    gameOver = true;
  }

  if (bird.x > 750) {
    bird.setVelocityY(40);
    messageToPlayer.setText(
      'Congrats! You won!\nPress space bar to play again'
    );
    gameOver = true;
  }

  if (cursors.space.isDown && gameOver) {
    reset(this.scene);
  }
}
