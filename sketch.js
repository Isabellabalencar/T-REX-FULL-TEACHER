// Estado do jogo  
var gameState = "PLAY";  // Variável para controlar o estado do jogo

// T-Rex e animações  
var trex, trex_running, trex_collided;  

// Chão e solo invisível  
var ground, invisibleGround, groundImage;  

// Grupo de nuvens  
var cloudsGroup, cloudImage;  

// Grupo de obstáculos  
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;  

// Pontuação  
var score;  

// Imagens de Game Over e reinício  
var gameOverImg, restartImg;  

// Sons do jogo  
var jumpSound, checkPointSound, dieSound;  

function preload() {
  // Carrega animações do T-Rex
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  // Carrega imagens do chão e nuvem
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  // Carrega imagens dos obstáculos
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  // Carrega imagens de Game Over e reinício
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  // Carrega sons do jogo
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  // Cria a tela  
  createCanvas(600, 200);

  // Cria o T-Rex  
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  // Cria o chão  
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2; // Centraliza o chão

  // Cria o chão invisível para colisão  
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  // Inicializa os grupos de nuvens e obstáculos
  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  // Inicializa a pontuação
  score = 0;    

  gameOver = createSprite(300,100);
  gameOver.addImage("gameOverImg", gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage("restartImg",restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
}

function draw() {
  // Define o fundo branco  
  background("white");
  text("Pontuação: " + score, 500, 50);

  // Chama a função PLAY se o estado do jogo for "PLAY"
  if (gameState == "PLAY") {
    PLAY();
  }

  // Chama a função END se o estado do jogo for "END"
  if (gameState == "END") { 
    END(); 
  }

  // Impede que o T-Rex atravesse o chão  
  trex.collide(invisibleGround);

  // Desenha os sprites na tela  
  drawSprites();
}

function spawnObstacles() {
  // Gera um obstáculo a cada 60 quadros  
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + score / 100); // Aumenta a velocidade conforme a pontuação

    // Gera obstáculos aleatórios  
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1); break;
      case 2: obstacle.addImage(obstacle2); break;
      case 3: obstacle.addImage(obstacle3); break;
      case 4: obstacle.addImage(obstacle4); break;
      case 5: obstacle.addImage(obstacle5); break;
      case 6: obstacle.addImage(obstacle6); break;
      default: break;
    }

    // Define a escala e o tempo de vida do obstáculo  
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    // Adiciona o obstáculo ao grupo  
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  // Gera nuvens a cada 60 quadros  
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120)); // Define a altura aleatória da nuvem
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3; // A nuvem se move da direita para a esquerda
    
    // Define o tempo de vida da nuvem  
    cloud.lifetime = 200;

    // Ajusta a profundidade das nuvens em relação ao T-Rex  
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    // Adiciona a nuvem ao grupo de nuvens  
    cloudsGroup.add(cloud);
  }
}

function PLAY() {
  // Esconde Game Over e Restart
  gameOver.visible = false;
  restart.visible = false;

  // Aumenta a velocidade do chão conforme a pontuação
  ground.velocityX = -(4 + 3 * score / 100);

  // Atualiza a pontuação
  score = score + Math.round(getFrameRate() / 60);

  // Reinicia a posição do chão quando sai da tela
  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

  // Pula ao pressionar espaço, se estiver acima de 100 no eixo Y
  if (keyDown("space") && trex.y >= 100) {
    trex.velocityY = -12;
    jumpSound.play();
  }

  // Adiciona gravidade ao T-Rex
  trex.velocityY = trex.velocityY + 0.8;

  // Gera as nuvens
  spawnClouds();

  // Gera obstáculos
  spawnObstacles();

  // Verifica colisão com obstáculos
  if (obstaclesGroup.isTouching(trex)) {
    // Reproduz sons e muda o estado do jogo para END
    jumpSound.play();
    gameState = "END";
    dieSound.play();
  }
}

function END() {
  // Exibe Game Over e Restart
  gameOver.visible = true;
  restart.visible = true;

  // Muda a animação do T-Rex para "collided" quando o jogo termina
  trex.changeAnimation("collided", trex_collided);

  // Para o movimento do chão e do T-Rex
  ground.velocityX = 0;
  trex.velocityY = 0;

  // Define o tempo de vida dos obstáculos e nuvens para que eles não sejam destruídos
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);

  // Para o movimento dos obstáculos e nuvens
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0);

  // Reinicia o jogo quando o botão de restart é pressionado
  if (mousePressedOver(restart)) {
    reset();
  }
}

function reset() {
  // Reseta o estado do jogo para "PLAY"
  gameState = "PLAY";
  gameOver.visible = false;
  restart.visible = false;

  // Destroi todos os obstáculos e nuvens
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  // Restaura a animação do T-Rex para "running"
  trex.changeAnimation("running", trex_running);

  // Reseta a pontuação
  score = 0;
}
