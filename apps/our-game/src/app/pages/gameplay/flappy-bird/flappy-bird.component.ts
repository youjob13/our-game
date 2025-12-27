import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

interface GameState {
  curr: number;
  getReady: number;
  Play: number;
  gameOver: number;
}

interface Pipe {
  x: number;
  y: number;
}

interface BirdAnimation {
  sprite: HTMLImageElement;
}

interface Ground {
  sprite: HTMLImageElement;
  x: number;
  y: number;
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  update: () => void;
}

interface Background {
  sprite: HTMLImageElement;
  x: number;
  y: number;
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}

interface PipeSystem {
  top: { sprite: HTMLImageElement };
  bot: { sprite: HTMLImageElement };
  gap: number;
  moved: boolean;
  pipes: Pipe[];
  draw: (ctx: CanvasRenderingContext2D) => void;
  update: () => void;
}

interface Bird {
  animations: BirdAnimation[];
  rotation: number;
  x: number;
  y: number;
  speed: number;
  gravity: number;
  thrust: number;
  frame: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
  update: () => void;
  flap: () => void;
  setRotation: () => void;
  collisioned: () => boolean;
}

interface SoundEffects {
  start: HTMLAudioElement;
  flap: HTMLAudioElement;
  score: HTMLAudioElement;
  hit: HTMLAudioElement;
  die: HTMLAudioElement;
  played: boolean;
}

interface UI {
  getReady: { sprite: HTMLImageElement };
  gameOver: { sprite: HTMLImageElement };
  tap: { sprite: HTMLImageElement }[];
  score: {
    curr: number;
    best: number;
  };
  x: number;
  y: number;
  tx: number;
  ty: number;
  frame: number;
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  drawScore: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  update: () => void;
}

@Component({
  selector: 'sml-flappy-bird',
  templateUrl: './flappy-bird.component.html',
  styleUrl: './flappy-bird.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlappyBirdComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly RAD = Math.PI / 180;
  private readonly dx = 2;
  private readonly GAME_WIDTH = 276;
  private readonly GAME_HEIGHT = 414;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private frames = 0;
  private gameLoopInterval?: number;

  readonly isGameOver = signal(false);

  private readonly state: GameState = {
    curr: 0,
    getReady: 0,
    Play: 1,
    gameOver: 2,
  };

  private readonly SFX: SoundEffects = {
    start: new Audio(),
    flap: new Audio(),
    score: new Audio(),
    hit: new Audio(),
    die: new Audio(),
    played: false,
  };

  private readonly gnd: Ground = {
    sprite: new Image(),
    x: 0,
    y: 0,
    draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      this.gnd.y = parseFloat((canvas.height - this.gnd.sprite.height).toString());
      ctx.drawImage(this.gnd.sprite, this.gnd.x, this.gnd.y);
    },
    update: () => {
      if (this.state.curr !== this.state.Play) return;
      this.gnd.x -= this.dx;
      this.gnd.x = this.gnd.x % (this.gnd.sprite.width / 2);
    },
  };

  private readonly bg: Background = {
    sprite: new Image(),
    x: 0,
    y: 0,
    draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const y = parseFloat((canvas.height - this.bg.sprite.height).toString());
      ctx.drawImage(this.bg.sprite, this.bg.x, y);
    },
  };

  private readonly pipe: PipeSystem = {
    top: { sprite: new Image() },
    bot: { sprite: new Image() },
    gap: 85,
    moved: true,
    pipes: [],
    draw: (ctx: CanvasRenderingContext2D) => {
      for (const p of this.pipe.pipes) {
        ctx.drawImage(this.pipe.top.sprite, p.x, p.y);
        ctx.drawImage(
          this.pipe.bot.sprite,
          p.x,
          p.y + parseFloat(this.pipe.top.sprite.height.toString()) + this.pipe.gap,
        );
      }
    },
    update: () => {
      if (this.state.curr !== this.state.Play) return;
      if (this.frames % 100 === 0) {
        this.pipe.pipes.push({
          x: parseFloat(this.canvas.width.toString()),
          y: -210 * Math.min(Math.random() + 1, 1.8),
        });
      }
      this.pipe.pipes.forEach((pipe) => {
        pipe.x -= this.dx;
      });
      if (this.pipe.pipes.length && this.pipe.pipes[0].x < -this.pipe.top.sprite.width) {
        this.pipe.pipes.shift();
        this.pipe.moved = true;
      }
    },
  };

  private readonly bird: Bird = {
    animations: [
      { sprite: new Image() },
      { sprite: new Image() },
      { sprite: new Image() },
      { sprite: new Image() },
    ],
    rotation: 0,
    x: 50,
    y: 100,
    speed: 0,
    gravity: 0.125,
    thrust: 3.6,
    frame: 0,
    draw: (ctx: CanvasRenderingContext2D) => {
      const h = this.bird.animations[this.bird.frame].sprite.height;
      const w = this.bird.animations[this.bird.frame].sprite.width;
      ctx.save();
      ctx.translate(this.bird.x, this.bird.y);
      ctx.rotate(this.bird.rotation * this.RAD);
      ctx.drawImage(this.bird.animations[this.bird.frame].sprite, -w / 2, -h / 2);
      ctx.restore();
    },
    update: () => {
      const r = parseFloat(this.bird.animations[0].sprite.width.toString()) / 2;
      switch (this.state.curr) {
        case this.state.getReady:
          this.bird.rotation = 0;
          this.bird.y += this.frames % 10 === 0 ? Math.sin(this.frames * this.RAD) : 0;
          this.bird.frame += this.frames % 10 === 0 ? 1 : 0;
          break;
        case this.state.Play:
          this.bird.frame += this.frames % 5 === 0 ? 1 : 0;
          this.bird.y += this.bird.speed;
          this.bird.setRotation();
          this.bird.speed += this.bird.gravity;
          if (this.bird.y + r >= this.gnd.y || this.bird.collisioned()) {
            this.state.curr = this.state.gameOver;
            this.isGameOver.set(true);
          }
          break;
        case this.state.gameOver:
          this.bird.frame = 1;
          if (this.bird.y + r < this.gnd.y) {
            this.bird.y += this.bird.speed;
            this.bird.setRotation();
            this.bird.speed += this.bird.gravity * 2;
          } else {
            this.bird.speed = 0;
            this.bird.y = this.gnd.y - r;
            this.bird.rotation = 90;
            if (!this.SFX.played) {
              this.SFX.die.play();
              this.SFX.played = true;
            }
          }
          break;
      }
      this.bird.frame = this.bird.frame % this.bird.animations.length;
    },
    flap: () => {
      if (this.bird.y > 0) {
        this.SFX.flap.play();
        this.bird.speed = -this.bird.thrust;
      }
    },
    setRotation: () => {
      if (this.bird.speed <= 0) {
        this.bird.rotation = Math.max(-25, (-25 * this.bird.speed) / (-1 * this.bird.thrust));
      } else if (this.bird.speed > 0) {
        this.bird.rotation = Math.min(90, (90 * this.bird.speed) / (this.bird.thrust * 2));
      }
    },
    collisioned: () => {
      if (!this.pipe.pipes.length) return false;
      const birdSprite = this.bird.animations[0].sprite;
      const x = this.pipe.pipes[0].x;
      const y = this.pipe.pipes[0].y;
      const r = birdSprite.height / 4 + birdSprite.width / 4;
      const roof = y + parseFloat(this.pipe.top.sprite.height.toString());
      const floor = roof + this.pipe.gap;
      const w = parseFloat(this.pipe.top.sprite.width.toString());
      if (this.bird.x + r >= x) {
        if (this.bird.x + r < x + w) {
          if (this.bird.y - r <= roof || this.bird.y + r >= floor) {
            this.SFX.hit.play();
            return true;
          }
        } else if (this.pipe.moved) {
          this.UI.score.curr++;
          this.SFX.score.play();
          this.pipe.moved = false;
        }
      }
      return false;
    },
  };

  private readonly UI: UI = {
    getReady: { sprite: new Image() },
    gameOver: { sprite: new Image() },
    tap: [{ sprite: new Image() }, { sprite: new Image() }],
    score: {
      curr: 0,
      best: 0,
    },
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    frame: 0,
    draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      switch (this.state.curr) {
        case this.state.getReady:
          this.UI.y = parseFloat(((canvas.height - this.UI.getReady.sprite.height) / 2).toString());
          this.UI.x = parseFloat(((canvas.width - this.UI.getReady.sprite.width) / 2).toString());
          this.UI.tx = parseFloat(((canvas.width - this.UI.tap[0].sprite.width) / 2).toString());
          this.UI.ty = this.UI.y + this.UI.getReady.sprite.height - this.UI.tap[0].sprite.height;
          ctx.drawImage(this.UI.getReady.sprite, this.UI.x, this.UI.y);
          ctx.drawImage(this.UI.tap[this.UI.frame].sprite, this.UI.tx, this.UI.ty);
          break;
        case this.state.gameOver:
          this.UI.y = parseFloat(((canvas.height - this.UI.gameOver.sprite.height) / 2).toString());
          this.UI.x = parseFloat(((canvas.width - this.UI.gameOver.sprite.width) / 2).toString());
          this.UI.tx = parseFloat(((canvas.width - this.UI.tap[0].sprite.width) / 2).toString());
          this.UI.ty = this.UI.y + this.UI.gameOver.sprite.height - this.UI.tap[0].sprite.height;
          ctx.drawImage(this.UI.gameOver.sprite, this.UI.x, this.UI.y);
          ctx.drawImage(this.UI.tap[this.UI.frame].sprite, this.UI.tx, this.UI.ty);
          break;
      }
      this.UI.drawScore(ctx, canvas);
    },
    drawScore: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      switch (this.state.curr) {
        case this.state.Play:
          ctx.lineWidth = 2;
          ctx.font = '35px Squada One';
          ctx.fillText(this.UI.score.curr.toString(), canvas.width / 2 - 5, 50);
          ctx.strokeText(this.UI.score.curr.toString(), canvas.width / 2 - 5, 50);
          break;
        case this.state.gameOver: {
          ctx.lineWidth = 2;
          ctx.font = '40px Squada One';
          const sc = `SCORE : ${this.UI.score.curr}`;
          try {
            this.UI.score.best = Math.max(
              this.UI.score.curr,
              parseInt(localStorage.getItem('best') || '0', 10),
            );
            localStorage.setItem('best', this.UI.score.best.toString());
            const bs = `BEST : ${this.UI.score.best}`;
            ctx.fillText(sc, canvas.width / 2 - 80, canvas.height / 2 + 0);
            ctx.strokeText(sc, canvas.width / 2 - 80, canvas.height / 2 + 0);
            ctx.fillText(bs, canvas.width / 2 - 80, canvas.height / 2 + 30);
            ctx.strokeText(bs, canvas.width / 2 - 80, canvas.height / 2 + 30);
          } catch {
            ctx.fillText(sc, canvas.width / 2 - 85, canvas.height / 2 + 15);
            ctx.strokeText(sc, canvas.width / 2 - 85, canvas.height / 2 + 15);
          }
          break;
        }
      }
    },
    update: () => {
      if (this.state.curr === this.state.Play) return;
      this.UI.frame += this.frames % 10 === 0 ? 1 : 0;
      this.UI.frame = this.UI.frame % this.UI.tap.length;
    },
  };

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    const context = this.canvas.getContext('2d');
    if (!context) {
      console.error('Failed to get 2D context from canvas');
      return;
    }
    this.ctx = context;

    // Set internal resolution for game logic
    this.canvas.width = this.GAME_WIDTH;
    this.canvas.height = this.GAME_HEIGHT;

    this.canvas.tabIndex = 1;
    this.setupCanvasSize();
    this.setupEventListeners();
    this.loadAssets();
  }

  ngOnDestroy(): void {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
    }
  }

  private setupCanvasSize(): void {
    this.resizeCanvas();
    // Listen for window resize
    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    if (!this.canvas) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = this.GAME_WIDTH / this.GAME_HEIGHT;
    const viewportAspectRatio = viewportWidth / viewportHeight;

    let displayWidth: number;
    let displayHeight: number;

    // Fullscreen - use entire viewport
    if (viewportAspectRatio > aspectRatio) {
      // Viewport is wider - fit to height
      displayHeight = viewportHeight;
      displayWidth = displayHeight * aspectRatio;
    } else {
      // Viewport is taller - fit to width
      displayWidth = viewportWidth;
      displayHeight = displayWidth / aspectRatio;
    }

    // Set CSS size for display (internal resolution stays at GAME_WIDTH x GAME_HEIGHT)
    this.canvas.style.width = `${Math.round(displayWidth)}px`;
    this.canvas.style.height = `${Math.round(displayHeight)}px`;
  }

  private setupEventListeners(): void {
    // Click handler
    fromEvent(this.canvas, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.handleInput());

    // Keyboard handler
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((e) => e.keyCode === 32 || e.keyCode === 87 || e.keyCode === 38),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.handleInput());
  }

  private handleInput(): void {
    switch (this.state.curr) {
      case this.state.getReady:
        this.state.curr = this.state.Play;
        this.SFX.start.play();
        break;
      case this.state.Play:
        this.bird.flap();
        break;
      case this.state.gameOver:
        this.state.curr = this.state.getReady;
        this.bird.speed = 0;
        this.bird.y = 100;
        this.pipe.pipes = [];
        this.UI.score.curr = 0;
        this.SFX.played = false;
        this.isGameOver.set(false);
        break;
    }
  }

  private loadAssets(): void {
    const assetsToLoad = [
      { obj: this.gnd.sprite, src: '/flappy-bird/img/ground.png' },
      { obj: this.bg.sprite, src: '/flappy-bird/img/BG.png' },
      { obj: this.pipe.top.sprite, src: '/flappy-bird/img/toppipe.png' },
      { obj: this.pipe.bot.sprite, src: '/flappy-bird/img/botpipe.png' },
      { obj: this.UI.gameOver.sprite, src: '/flappy-bird/img/go.png' },
      { obj: this.UI.getReady.sprite, src: '/flappy-bird/img/getready.png' },
      { obj: this.UI.tap[0].sprite, src: '/flappy-bird/img/tap/t0.png' },
      { obj: this.UI.tap[1].sprite, src: '/flappy-bird/img/tap/t1.png' },
      { obj: this.bird.animations[0].sprite, src: '/flappy-bird/img/bird/b0.png' },
      { obj: this.bird.animations[1].sprite, src: '/flappy-bird/img/bird/b1.png' },
      { obj: this.bird.animations[2].sprite, src: '/flappy-bird/img/bird/b2.png' },
      { obj: this.bird.animations[3].sprite, src: '/flappy-bird/img/bird/b0.png' },
    ];

    const audioAssets = [
      { obj: this.SFX.start, src: '/flappy-bird/sfx/start.wav' },
      { obj: this.SFX.flap, src: '/flappy-bird/sfx/flap.wav' },
      { obj: this.SFX.score, src: '/flappy-bird/sfx/score.wav' },
      { obj: this.SFX.hit, src: '/flappy-bird/sfx/hit.wav' },
      { obj: this.SFX.die, src: '/flappy-bird/sfx/die.wav' },
    ];

    let loadedCount = 0;
    const totalAssets = assetsToLoad.length + audioAssets.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalAssets) {
        this.startGame();
      }
    };

    assetsToLoad.forEach((asset) => {
      asset.obj.onload = checkAllLoaded;
      asset.obj.onerror = () => {
        console.error(`Failed to load asset: ${asset.src}`);
        checkAllLoaded();
      };
      asset.obj.src = asset.src;
    });

    audioAssets.forEach((asset) => {
      asset.obj.oncanplaythrough = checkAllLoaded;
      asset.obj.onerror = () => {
        console.error(`Failed to load audio: ${asset.src}`);
        checkAllLoaded();
      };
      asset.obj.src = asset.src;
    });
  }

  private startGame(): void {
    this.gameLoopInterval = window.setInterval(() => {
      this.gameLoop();
    }, 20);
  }

  private gameLoop(): void {
    this.update();
    this.draw();
    this.frames++;
  }

  private update(): void {
    this.bird.update();
    this.gnd.update();
    this.pipe.update();
    this.UI.update();
  }

  private draw(): void {
    this.ctx.fillStyle = '#30c0df';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.bg.draw(this.ctx, this.canvas);
    this.pipe.draw(this.ctx);
    this.bird.draw(this.ctx);
    this.gnd.draw(this.ctx, this.canvas);
    this.UI.draw(this.ctx, this.canvas);
  }
}
