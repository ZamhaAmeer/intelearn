const flappyHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Flappy Bird</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    
    * {
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: #71c5cf;
      font-family: 'Press Start 2P', cursive, sans-serif;
    }

    #gameCanvas {
      display: block;
      width: 100vw;
      height: 100vh;
      background-color: #71c5cf;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>

  <script>
    // Force 1x pixel ratio for smooth performance
    Object.defineProperty(window, 'devicePixelRatio', { get: () => 1 });
    
    window.onerror = function(msg, url, line, col, err) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: msg + ' at ' + line + ':' + col }));
      }
    };

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // Audio Synthesizer
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initAudio() {
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function playJumpSound() {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch (e) {}
    }

    function playScoreSound() {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } catch (e) {}
    }

    function playHitSound() {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch (e) {}
    }

    // Bird Colors
    const BIRD_COLORS = [
      { body: '#F6A830', wing: '#E58E1B', belly: '#FFF' }, // Yellow/Orange
      { body: '#4FC3F7', wing: '#0288D1', belly: '#E0F7FA' }, // Blue
      { body: '#E57373', wing: '#C62828', belly: '#FFEBEE' }, // Red
      { body: '#81C784', wing: '#2E7D32', belly: '#E8F5E9' }  // Green
    ];
    let selectedBirdIndex = 0;

    // Game Variables
    let state = 'START'; // 'START', 'PLAYING', 'GAMEOVER'
    let frames = 0;
    let score = 0;
    let bestScore = parseInt(localStorage.getItem('flappy_best_score') || '0', 10);

    const groundHeight = 100;
    let groundOffset = 0;

    const bird = {
      x: 80,
      y: 200,
      radius: 18,
      gravity: 0.45,
      jump: -7.5,
      velocity: 0,
      rotation: 0,
      wingPos: 0,
      reset: function() {
        this.x = Math.min(100, width * 0.25);
        this.y = height / 2;
        this.velocity = 0;
        this.rotation = 0;
      },
      flap: function() {
        this.velocity = this.jump;
        playJumpSound();
      },
      update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        // Wing flapping animation
        this.wingPos = Math.sin(frames * 0.3) * 6;

        // Rotation based on velocity
        if (this.velocity < 0) {
          this.rotation = -0.3;
        } else {
          this.rotation = Math.min(Math.PI / 2, this.rotation + 0.05);
        }

        // Ceiling collision
        if (this.y - this.radius < 0) {
          this.y = this.radius;
          this.velocity = 0;
        }

        // Ground collision
        if (this.y + this.radius >= height - groundHeight) {
          this.y = height - groundHeight - this.radius;
          gameOver();
        }
      },
      draw: function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const colors = BIRD_COLORS[selectedBirdIndex];

        // Body
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.body;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // Belly
        ctx.beginPath();
        ctx.arc(-4, 4, this.radius * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = colors.belly;
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.arc(6, -6, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.fill();
        ctx.stroke();

        // Pupil
        ctx.beginPath();
        ctx.arc(8, -6, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();

        // Beak
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(22, 4);
        ctx.lineTo(10, 10);
        ctx.closePath();
        ctx.fillStyle = '#FF5722';
        ctx.fill();
        ctx.stroke();

        // Wing
        ctx.beginPath();
        ctx.ellipse(-6, 2 + this.wingPos * 0.5, 9, 6, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = colors.wing;
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }
    };

    // Pipes
    const pipes = {
      items: [],
      gap: 150,
      width: 60,
      dx: 2.5,
      reset: function() {
        this.items = [];
      },
      update: function() {
        if (frames % 100 === 0) {
          const minHeight = 60;
          const maxHeight = height - groundHeight - this.gap - minHeight;
          const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

          this.items.push({
            x: width,
            top: topHeight,
            bottom: height - groundHeight - topHeight - this.gap,
            passed: false
          });
        }

        for (let i = 0; i < this.items.length; i++) {
          let p = this.items[i];
          p.x -= this.dx;

          // Check score
          if (!p.passed && p.x + this.width < bird.x) {
            p.passed = true;
            score++;
            if (score > bestScore) {
              bestScore = score;
              localStorage.setItem('flappy_best_score', bestScore.toString());
            }
            playScoreSound();
          }

          // Collision detection
          const birdBox = {
            left: bird.x - bird.radius + 3,
            right: bird.x + bird.radius - 3,
            top: bird.y - bird.radius + 3,
            bottom: bird.y + bird.radius - 3
          };

          const topPipeBox = {
            left: p.x,
            right: p.x + this.width,
            top: 0,
            bottom: p.top
          };

          const bottomPipeBox = {
            left: p.x,
            right: p.x + this.width,
            top: height - groundHeight - p.bottom,
            bottom: height - groundHeight
          };

          if (checkCollision(birdBox, topPipeBox) || checkCollision(birdBox, bottomPipeBox)) {
            gameOver();
          }
        }

        // Remove offscreen pipes
        if (this.items.length > 0 && this.items[0].x < -this.width) {
          this.items.shift();
        }
      },
      draw: function() {
        for (let i = 0; i < this.items.length; i++) {
          let p = this.items[i];

          // Top Pipe
          drawPipe(p.x, 0, this.width, p.top, true);

          // Bottom Pipe
          const bottomY = height - groundHeight - p.bottom;
          drawPipe(p.x, bottomY, this.width, p.bottom, false);
        }
      }
    };

    function checkCollision(r1, r2) {
      return !(r1.right < r2.left || 
               r1.left > r2.right || 
               r1.bottom < r2.top || 
               r1.top > r2.bottom);
    }

    function drawPipe(x, y, w, h, isTop) {
      ctx.save();
      
      // Main Body Gradient
      const grad = ctx.createLinearGradient(x, 0, x + w, 0);
      grad.addColorStop(0, '#73C02F');
      grad.addColorStop(0.3, '#ABF34D');
      grad.addColorStop(0.7, '#73C02F');
      grad.addColorStop(1, '#4A821E');

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x, y, w, h);

      // Pipe Rim
      const rimHeight = 24;
      const rimExtra = 4;
      const rimX = x - rimExtra;
      const rimW = w + (rimExtra * 2);
      const rimY = isTop ? y + h - rimHeight : y;

      ctx.fillStyle = grad;
      ctx.fillRect(rimX, rimY, rimW, rimHeight);
      ctx.strokeRect(rimX, rimY, rimW, rimHeight);

      ctx.restore();
    }

    // Clouds Background
    const clouds = [
      { x: 50, y: 80, scale: 1 },
      { x: 250, y: 120, scale: 0.8 },
      { x: 450, y: 60, scale: 1.2 }
    ];

    function drawClouds() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      clouds.forEach(c => {
        c.x -= 0.5;
        if (c.x < -100) c.x = width + 100;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.scale(c.scale, c.scale);
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.arc(15, -10, 22, 0, Math.PI * 2);
        ctx.arc(35, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // Ground
    function drawGround() {
      groundOffset = (groundOffset + 2.5) % 20;

      const gY = height - groundHeight;

      // Base Dirt
      ctx.fillStyle = '#DED895';
      ctx.fillRect(0, gY, width, groundHeight);

      // Top Grass
      ctx.fillStyle = '#73C02F';
      ctx.fillRect(0, gY, width, 16);

      // Grass stripe border
      ctx.fillStyle = '#559A1D';
      ctx.fillRect(0, gY + 16, width, 4);

      // Border line
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(0, gY);
      ctx.lineTo(width, gY);
      ctx.stroke();

      // Diagonal ground pattern
      ctx.fillStyle = '#C9C27A';
      for (let x = -groundOffset; x < width + 20; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, gY + 20);
        ctx.lineTo(x + 10, gY + 20);
        ctx.lineTo(x - 5, height);
        ctx.lineTo(x - 15, height);
        ctx.fill();
      }
    }

    function gameOver() {
      if (state !== 'GAMEOVER') {
        state = 'GAMEOVER';
        playHitSound();
      }
    }

    function resetGame() {
      score = 0;
      frames = 0;
      bird.reset();
      pipes.reset();
      state = 'PLAYING';
    }

    // Input Handlers
    function handleAction(e) {
      if (e) e.preventDefault();
      initAudio();

      if (state === 'START') {
        if (e && e.clientY && e.clientY > height * 0.55 && e.clientY < height * 0.70) {
          selectedBirdIndex = (selectedBirdIndex + 1) % BIRD_COLORS.length;
          return;
        }
        resetGame();
      } else if (state === 'PLAYING') {
        bird.flap();
      } else if (state === 'GAMEOVER') {
        resetGame();
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        handleAction(e);
      }
    });

    canvas.addEventListener('pointerdown', handleAction);

    // Draw UI Screens
    function drawScore() {
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.font = '28px "Press Start 2P", sans-serif';
      ctx.textAlign = 'center';

      if (state === 'PLAYING') {
        ctx.strokeText(score.toString(), width / 2, 70);
        ctx.fillText(score.toString(), width / 2, 70);
      }
    }

    function drawStartScreen() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';

      // Title
      ctx.font = '24px "Press Start 2P", sans-serif';
      ctx.strokeText('FLAPPY BIRD', width / 2, height * 0.28);
      ctx.fillText('FLAPPY BIRD', width / 2, height * 0.28);

      // Subtitle
      ctx.font = '12px "Press Start 2P", sans-serif';
      ctx.lineWidth = 4;
      ctx.strokeText('TAP TO START', width / 2, height * 0.42);
      ctx.fillText('TAP TO START', width / 2, height * 0.42);

      // Character Select Box
      const boxY = height * 0.58;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 3;
      ctx.fillRect(width / 2 - 110, boxY, 220, 65);
      ctx.strokeRect(width / 2 - 110, boxY, 220, 65);

      ctx.fillStyle = '#000';
      ctx.font = '9px "Press Start 2P", sans-serif';
      ctx.fillText('BIRD COLOR (TAP)', width / 2, boxY + 20);

      // Draw Selected Bird Preview in box
      ctx.save();
      ctx.translate(width / 2, boxY + 45);
      const colors = BIRD_COLORS[selectedBirdIndex];
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = colors.body;
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(4, -4, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF';
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(6, 0); ctx.lineTo(14, 2); ctx.lineTo(6, 6);
      ctx.fillStyle = '#FF5722'; ctx.fill(); ctx.stroke();
      ctx.restore();

      // Best Score
      ctx.fillStyle = '#FFF';
      ctx.font = '11px "Press Start 2P", sans-serif';
      ctx.strokeText('BEST SCORE: ' + bestScore, width / 2, height * 0.82);
      ctx.fillText('BEST SCORE: ' + bestScore, width / 2, height * 0.82);
    }

    function drawGameOverScreen() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#E53935';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';

      ctx.font = '24px "Press Start 2P", sans-serif';
      ctx.strokeText('GAME OVER', width / 2, height * 0.32);
      ctx.fillText('GAME OVER', width / 2, height * 0.32);

      // Score Panel
      const panelW = 240;
      const panelH = 120;
      const panelX = width / 2 - panelW / 2;
      const panelY = height * 0.40;

      ctx.fillStyle = '#F57C00';
      ctx.fillRect(panelX, panelY, panelW, panelH);
      ctx.lineWidth = 4;
      ctx.strokeRect(panelX, panelY, panelW, panelH);

      ctx.fillStyle = '#FFF';
      ctx.font = '12px "Press Start 2P", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('SCORE: ' + score, panelX + 25, panelY + 45);
      ctx.fillText('BEST : ' + bestScore, panelX + 25, panelY + 85);

      // Restart Hint
      ctx.textAlign = 'center';
      ctx.font = '12px "Press Start 2P", sans-serif';
      ctx.strokeText('TAP TO PLAY AGAIN', width / 2, height * 0.76);
      ctx.fillText('TAP TO PLAY AGAIN', width / 2, height * 0.76);
    }

    // Main Loop
    function loop() {
      ctx.clearRect(0, 0, width, height);

      // Background
      drawClouds();

      if (state === 'PLAYING') {
        frames++;
        bird.update();
        pipes.update();
      }

      pipes.draw();
      drawGround();
      bird.draw();
      drawScore();

      if (state === 'START') {
        bird.y = height / 2 + Math.sin(Date.now() * 0.005) * 8;
        drawStartScreen();
      } else if (state === 'GAMEOVER') {
        drawGameOverScreen();
      }

      requestAnimationFrame(loop);
    }

    loop();
  </script>
</body>
</html>`;

export default flappyHtml;
