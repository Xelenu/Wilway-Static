const C3 = self.C3;
self.C3_GetObjectRefTable = function() {
  return [
    C3.Plugins.Sprite,
    C3.Behaviors.Pin,
    C3.Behaviors.DragnDrop,
    C3.Behaviors.Fade,
    C3.Plugins.NinePatch,
    C3.Plugins.Text,
    C3.Behaviors.Tween,
    C3.Behaviors.destroy,
    C3.Behaviors.solid,
    C3.Plugins.TiledBg,
    C3.Plugins.Spritefont2,
    C3.Behaviors.Sin,
    C3.Behaviors.Platform,
    C3.Behaviors.MoveTo,
    C3.Plugins.Tilemap,
    C3.Behaviors.Physics,
    C3.Behaviors.jumpthru,
    C3.Behaviors.Bullet,
    C3.Plugins.Arr,
    C3.Behaviors.LOS,
    C3.Behaviors.Rotate,
    C3.Behaviors.Timer,
    C3.Plugins.AJAX,
    C3.Plugins.Audio,
    C3.Plugins.Browser,
    C3.Plugins.Keyboard,
    C3.Plugins.LocalStorage,
    C3.Plugins.PlatformInfo,
    C3.Plugins.Touch,
    C3.Plugins.Dictionary,
    C3.Plugins.Eponesh_GameScore,
    C3.Plugins.System.Cnds.IsGroupActive,
    C3.Plugins.System.Cnds.OnLayoutStart,
    C3.Plugins.System.Acts.SetVar,
    C3.Plugins.Sprite.Acts.Destroy,
    C3.Plugins.Sprite.Acts.SetPos,
    C3.Plugins.Sprite.Exps.X,
    C3.Plugins.Sprite.Exps.Y,
    C3.Behaviors.Pin.Acts.PinByProperties,
    C3.Behaviors.Pin.Acts.Pin,
    C3.Plugins.Sprite.Acts.SetAnim,
    C3.Plugins.Sprite.Acts.SetEffectParam,
    C3.Plugins.Arr.Exps.At,
    C3.Plugins.Sprite.Acts.SetInstanceVar,
    C3.Behaviors.Platform.Acts.SetEnabled,
    C3.Plugins.System.Cnds.CompareVar,
    C3.Plugins.System.Exps.int,
    C3.Plugins.System.Exps.replace,
    C3.Plugins.System.Exps.layoutname,
    C3.Plugins.PlatformInfo.Cnds.IsOnMobile,
    C3.Plugins.Sprite.Acts.SetAnimFrame,
    C3.Plugins.System.Cnds.ForEach,
    C3.Plugins.Sprite.Cnds.CompareInstanceVar,
    C3.Plugins.Sprite.Cnds.AngleWithin,
    C3.Plugins.Sprite.Exps.Height,
    C3.Plugins.System.Cnds.Else,
    C3.Behaviors.MoveTo.Acts.MoveToPosition,
    C3.Plugins.System.Exps.loopindex,
    C3.Behaviors.Platform.Acts.SetMaxSpeed,
    C3.Plugins.System.Exps.random,
    C3.Plugins.Sprite.Cnds.IsOverlapping,
    C3.Plugins.TiledBg.Acts.SetInstanceVar,
    C3.Plugins.TiledBg.Exps.Y,
    C3.Plugins.TiledBg.Exps.Height,
    C3.Plugins.TiledBg.Exps.X,
    C3.Behaviors.Timer.Acts.StartTimer,
    C3.Behaviors.Platform.Exps.MaxSpeed,
    C3.Plugins.Sprite.Acts.SetMirrored,
    C3.Plugins.Sprite.Acts.StopAnim,
    C3.Plugins.Sprite.Acts.SetVisible,
    C3.Plugins.System.Cnds.TriggerOnce,
    C3.Plugins.System.Acts.CreateObject,
    C3.Plugins.System.Exps.viewportwidth,
    C3.Plugins.System.Exps.viewportheight,
    C3.Plugins.Text.Acts.SetText,
    C3.Plugins.Dictionary.Exps.Get,
    C3.Plugins.System.Cnds.Compare,
    C3.Plugins.Text.Acts.SetVisible,
    C3.Behaviors.DragnDrop.Acts.SetEnabled,
    C3.Plugins.LocalStorage.Acts.CheckItemExists,
    C3.Plugins.NinePatch.Cnds.CompareInstanceVar,
    C3.Plugins.NinePatch.Acts.SetInstanceVar,
    C3.Plugins.NinePatch.Exps.Y,
    C3.Plugins.Text.Cnds.CompareInstanceVar,
    C3.Plugins.Spritefont2.Cnds.CompareInstanceVar,
    C3.Plugins.NinePatch.Acts.SetY,
    C3.Plugins.NinePatch.Acts.SetPos,
    C3.Plugins.System.Exps.layoutwidth,
    C3.Plugins.System.Acts.AddVar,
    C3.Plugins.System.Cnds.Every,
    C3.Plugins.System.Acts.SubVar,
    C3.Plugins.Spritefont2.Acts.SetText,
    C3.Plugins.Audio.Cnds.IsTagPlaying,
    C3.Plugins.Audio.Acts.Stop,
    C3.Plugins.Audio.Acts.Play,
    C3.Plugins.Sprite.Exps.AnimationName,
    C3.Plugins.Eponesh_GameScore.Cnds.IsAdsPreloaderPlaying,
    C3.Plugins.Audio.Acts.SetPaused,
    C3.Plugins.Audio.Acts.SetVolume,
    C3.Plugins.Touch.Cnds.OnTouchObject,
    C3.Plugins.Eponesh_GameScore.Cnds.IsAdsRewardedAvailable,
    C3.Plugins.Touch.Cnds.OnTouchStart,
    C3.Plugins.Touch.Cnds.IsTouchingObject,
    C3.Plugins.System.Acts.Wait,
    C3.Plugins.System.Acts.RestartLayout,
    C3.Plugins.Sprite.Cnds.CompareFrame,
    C3.Plugins.System.Acts.GoToLayout,
    C3.Plugins.AJAX.Acts.Request,
    C3.Plugins.Touch.Cnds.OnTouchEnd,
    C3.Plugins.Arr.Cnds.CompareXY,
    C3.Plugins.Sprite.Exps.Count,
    C3.Plugins.System.Exps.projectversion,
    C3.Plugins.Text.Acts.SetInstanceVar,
    C3.Plugins.Text.Exps.FaceSize,
    C3.Plugins.Eponesh_GameScore.Cnds.IsSocialsSupportsShare,
    C3.Behaviors.Fade.Acts.RestartFade,
    C3.Plugins.AJAX.Cnds.OnComplete,
    C3.Plugins.Dictionary.Acts.JSONLoad,
    C3.Plugins.AJAX.Exps.LastData,
    C3.Plugins.Sprite.Exps.AnimationFrame,
    C3.Plugins.System.Exps.layeropacity,
    C3.Plugins.System.Acts.SetLayerOpacity,
    C3.Plugins.System.Acts.SetLayerScale,
    C3.Plugins.Eponesh_GameScore.Cnds.PlatformType,
    C3.Plugins.Browser.Cnds.IsFullscreen,
    C3.Plugins.Browser.Acts.LockOrientation,
    C3.Plugins.Browser.Acts.RequestFullScreen,
    C3.Plugins.System.Cnds.For,
    C3.Plugins.System.Exps.rgba255,
    C3.Plugins.System.Exps.tokenat,
    C3.Plugins.Arr.Acts.SetXY,
    C3.Plugins.Sprite.Acts.SetOpacity,
    C3.Plugins.Sprite.Acts.MoveToBottom,
    C3.Plugins.Sprite.Acts.SetSize,
    C3.Behaviors.Fade.Acts.StartFade,
    C3.Behaviors.Tween.Acts.TweenOneProperty,
    C3.Plugins.NinePatch.Exps.X,
    C3.Plugins.Spritefont2.Acts.SetVisible,
    C3.Plugins.System.Cnds.PickByEvaluate,
    C3.Plugins.TiledBg.Cnds.CompareX,
    C3.Plugins.TiledBg.Acts.SetX,
    C3.Plugins.System.Exps.dt,
    C3.Plugins.TiledBg.Cnds.CompareInstanceVar,
    C3.Plugins.Sprite.Acts.SetAnimSpeed,
    C3.Plugins.Sprite.Exps.ImagePointX,
    C3.Plugins.Sprite.Exps.ImagePointY,
    C3.Plugins.Sprite.Acts.SetScale,
    C3.Plugins.Sprite.Cnds.OnAnyAnimFinished,
    C3.Behaviors.solid.Acts.SetEnabled,
    C3.Behaviors.Physics.Acts.SetEnabled,
    C3.Behaviors.Physics.Acts.SetWorldGravity,
    C3.Behaviors.Physics.Acts.ApplyForceAtAngle,
    C3.Behaviors.Fade.Acts.SetWaitTime,
    C3.Behaviors.Bullet.Acts.SetAngleOfMotion,
    C3.Behaviors.Bullet.Acts.SetSpeed,
    C3.Plugins.Sprite.Acts.MoveToTop,
    C3.Behaviors.MoveTo.Cnds.OnArrived,
    C3.Plugins.System.Cnds.Repeat,
    C3.Plugins.Sprite.Exps.AnimationFrameCount,
    C3.Behaviors.Bullet.Acts.SetAcceleration,
    C3.Plugins.Sprite.Cnds.OnAnimFinished,
    C3.Plugins.Sprite.Cnds.IsOnScreen,
    C3.Plugins.TiledBg.Acts.SetWidth,
    C3.Plugins.NinePatch.Exps.Width,
    C3.Plugins.Sprite.Cnds.IsAnimPlaying,
    C3.Plugins.Audio.Acts.PlayByName,
    C3.Plugins.Keyboard.Cnds.IsKeyDown,
    C3.Behaviors.Platform.Cnds.OnJump,
    C3.Plugins.Sprite.Acts.AddInstanceVar,
    C3.Behaviors.Platform.Cnds.IsJumping,
    C3.Behaviors.Platform.Cnds.IsFalling,
    C3.Behaviors.Platform.Cnds.OnLand,
    C3.Behaviors.Platform.Cnds.IsMoving,
    C3.Behaviors.Platform.Cnds.OnStop,
    C3.Behaviors.Platform.Cnds.OnMove,
    C3.Behaviors.Sin.Acts.SetMagnitude,
    C3.Plugins.System.Exps.choose,
    C3.Behaviors.Sin.Acts.SetEnabled,
    C3.Behaviors.Platform.Acts.SimulateControl,
    C3.Behaviors.Platform.Cnds.IsOnFloor,
    C3.Plugins.Sprite.Cnds.IsMirrored,
    C3.Plugins.Sprite.Cnds.CompareX,
    C3.Behaviors.Bullet.Acts.SetEnabled,
    C3.Behaviors.Rotate.Acts.SetEnabled,
    C3.Behaviors.Rotate.Acts.SetSpeed,
    C3.Behaviors.Pin.Acts.Unpin,
    C3.Behaviors.Tween.Cnds.OnTweensFinished,
    C3.Plugins.Sprite.Acts.SetAngle,
    C3.Plugins.System.Exps.anglelerp,
    C3.Plugins.Sprite.Exps.Angle,
    C3.Plugins.Sprite.Cnds.IsBetweenAngles,
    C3.Plugins.System.Exps.rgba,
    C3.Behaviors.Tween.Acts.StopTweens,
    C3.Behaviors.MoveTo.Acts.SetMaxSpeed,
    C3.Plugins.Sprite.Acts.SetX,
    C3.Behaviors.Timer.Cnds.OnTimer,
    C3.Plugins.Sprite.Acts.Spawn,
    C3.Plugins.Sprite.Exps.Width,
    C3.Behaviors.MoveTo.Cnds.IsMoving,
    C3.Behaviors.MoveTo.Acts.Stop,
    C3.Behaviors.MoveTo.Acts.SetEnabled,
    C3.Plugins.Sprite.Acts.SetPosToObject,
    C3.Behaviors.Fade.Exps.FadeInTime,
    C3.Plugins.System.Acts.Scroll,
    C3.Plugins.System.Exps.scrollx,
    C3.Plugins.System.Exps.scrolly,
    C3.Plugins.System.Acts.SetObjectTimescale,
    C3.Plugins.System.Acts.GoToLayoutByName,
    C3.Plugins.Sprite.Cnds.OnCollision,
    C3.Plugins.Sprite.Acts.StartAnim,
    C3.Plugins.TiledBg.Exps.Count,
    C3.Behaviors.LOS.Cnds.HasLOSToObject,
    C3.Plugins.Sprite.Acts.SubInstanceVar,
    C3.Behaviors.Platform.Cnds.IsByWall,
    C3.Plugins.Sprite.Cnds.CompareY,
    C3.Plugins.Keyboard.Cnds.OnKey,
    C3.Plugins.Arr.Acts.SetSize,
    C3.Plugins.System.Exps.loadingprogress,
    C3.Plugins.Eponesh_GameScore.Acts.GameStart,
    C3.Plugins.Eponesh_GameScore.Acts.GameplayStart,
    C3.Plugins.Eponesh_GameScore.Acts.GameplayStop,
    C3.Plugins.Eponesh_GameScore.Cnds.IsAdsFullscreenPlaying,
    C3.Plugins.Eponesh_GameScore.Cnds.IsAdsRewardedPlaying,
    C3.Plugins.Audio.Cnds.IsSilent,
    C3.Plugins.Audio.Acts.SetSilent,
    C3.Plugins.System.Acts.SetTimescale,
    C3.Plugins.Eponesh_GameScore.Cnds.OnResume,
    C3.Plugins.Eponesh_GameScore.Cnds.IsAdsStickyPlaying,
    C3.Plugins.Eponesh_GameScore.Acts.AdsShowSticky,
    C3.Plugins.Eponesh_GameScore.Acts.AdsShowFullscreen,
    C3.Plugins.Eponesh_GameScore.Acts.AdsShowRewarded,
    C3.Plugins.Eponesh_GameScore.Cnds.OnAdsRewardedReward,
    C3.Plugins.Eponesh_GameScore.Cnds.IsPlayerReady,
    C3.Plugins.Eponesh_GameScore.Cnds.Language,
    C3.Plugins.Eponesh_GameScore.Acts.PlayerReset,
    C3.Plugins.Eponesh_GameScore.Acts.PlayerSync,
    C3.Plugins.Eponesh_GameScore.Exps.PlayerGet,
    C3.Plugins.Eponesh_GameScore.Acts.PlayerSet,
    C3.Plugins.System.Exps.left,
    C3.Plugins.System.Exps.len,
    C3.Plugins.Eponesh_GameScore.Acts.LeaderboardSetRecord,
    C3.Plugins.Eponesh_GameScore.Acts.LeaderboardPublishRecord,
    C3.Plugins.Eponesh_GameScore.Acts.LeaderboardOpen,
    C3.Plugins.Eponesh_GameScore.Acts.SocialsInvite,
    C3.Plugins.Eponesh_GameScore.Acts.GamesCollectionsOpen
  ];
};
self.C3_JsPropNameTable = [{
    class: 0
  },
  {
    state: 0
  },
  {
    num: 0
  },
  {
    id: 0
  },
  {
    Pin: 0
  },
  {
    DragDrop: 0
  },
  {
    Fade: 0
  },
  {
    Fade2: 0
  },
  {
    Button: 0
  },
  {
    RibbonSimple: 0
  },
  {
    RibbonGala: 0
  },
  {
    TextTest: 0
  },
  {
    sizeDefault: 0
  },
  {
    TextButton: 0
  },
  {
    startY: 0
  },
  {
    Tween: 0
  },
  {
    Window: 0
  },
  {
    Fade3: 0
  },
  {
    TextNotification: 0
  },
  {
    TextPrompt: 0
  },
  {
    PromptButton: 0
  },
  {
    DestroyOutsideLayout: 0
  },
  {
    TextLevelNumber: 0
  },
  {
    Solid: 0
  },
  {
    LevelBorder: 0
  },
  {
    PromptArrow: 0
  },
  {
    Icon: 0
  },
  {
    MaskBottom: 0
  },
  {
    MaskTop: 0
  },
  {
    TextInfo: 0
  },
  {
    TextSpriteFont: 0
  },
  {
    Health: 0
  },
  {
    HealthMask: 0
  },
  {
    TextBarGreen: 0
  },
  {
    Sine: 0
  },
  {
    Scull: 0
  },
  {
    TextLogo: 0
  },
  {
    TextSpriteFontWords: 0
  },
  {
    Bg: 0
  },
  {
    jumping: 0
  },
  {
    startX: 0
  },
  {
    Platform: 0
  },
  {
    MoveTo: 0
  },
  {
    HeroBase: 0
  },
  {
    Hero: 0
  },
  {
    Portal: 0
  },
  {
    PortalFrame: 0
  },
  {
    CoinPrize: 0
  },
  {
    dec: 0
  },
  {
    Sine2: 0
  },
  {
    Sine3: 0
  },
  {
    ParticleEffect: 0
  },
  {
    Shadow: 0
  },
  {
    onY: 0
  },
  {
    offY: 0
  },
  {
    Spikes: 0
  },
  {
    TriggerReversal: 0
  },
  {
    dir: 0
  },
  {
    TriggerJump: 0
  },
  {
    move: 0
  },
  {
    posX: 0
  },
  {
    Water: 0
  },
  {
    Tilemap: 0
  },
  {
    destroy: 0
  },
  {
    Physics: 0
  },
  {
    Jumpthru: 0
  },
  {
    Wall: 0
  },
  {
    Ceiling: 0
  },
  {
    Sand: 0
  },
  {
    Bullet: 0
  },
  {
    Coin: 0
  },
  {
    WallPlatformerInvisible: 0
  },
  {
    Ice: 0
  },
  {
    ArraySkins: 0
  },
  {
    IceFloe: 0
  },
  {
    damage: 0
  },
  {
    Lava: 0
  },
  {
    maxSpeed: 0
  },
  {
    startAngle: 0
  },
  {
    Fireball: 0
  },
  {
    live: 0
  },
  {
    direct: 0
  },
  {
    health: 0
  },
  {
    hitHero: 0
  },
  {
    seeHero: 0
  },
  {
    LineOfSight: 0
  },
  {
    Rotate: 0
  },
  {
    Zombie: 0
  },
  {
    IslandLava: 0
  },
  {
    SpikesFalling: 0
  },
  {
    SpikesFallingPiece: 0
  },
  {
    IslandFalling: 0
  },
  {
    lockX: 0
  },
  {
    invulnerability: 0
  },
  {
    HeroHitBox: 0
  },
  {
    classSub: 0
  },
  {
    direction: 0
  },
  {
    ZombiePart: 0
  },
  {
    TilemapBackground: 0
  },
  {
    Cloud: 0
  },
  {
    Blood: 0
  },
  {
    reverse: 0
  },
  {
    Pig: 0
  },
  {
    PigPart: 0
  },
  {
    Checkpoint: 0
  },
  {
    CheckpointFire: 0
  },
  {
    CheckpointFlash: 0
  },
  {
    Creeper: 0
  },
  {
    CreeperPart: 0
  },
  {
    Explosion: 0
  },
  {
    Elevator: 0
  },
  {
    ElevatorBackground: 0
  },
  {
    roundCounter: 0
  },
  {
    BossPig: 0
  },
  {
    BossPigPart: 0
  },
  {
    BossStars: 0
  },
  {
    Spark: 0
  },
  {
    Arrow: 0
  },
  {
    Bow: 0
  },
  {
    Skeleton: 0
  },
  {
    SkeletonPart: 0
  },
  {
    legsSkin: 0
  },
  {
    Spider: 0
  },
  {
    SpiderPart: 0
  },
  {
    Enderman: 0
  },
  {
    EndermanPart: 0
  },
  {
    BossGhast: 0
  },
  {
    BossGhastPart: 0
  },
  {
    BossGhastBall: 0
  },
  {
    Chicken: 0
  },
  {
    TilemapFront: 0
  },
  {
    eggNum: 0
  },
  {
    BossChicken: 0
  },
  {
    BossChickenEgg: 0
  },
  {
    Sword: 0
  },
  {
    BossDragon: 0
  },
  {
    BossDragonBall: 0
  },
  {
    timerOn: 0
  },
  {
    timerOff: 0
  },
  {
    Timer: 0
  },
  {
    Discharger: 0
  },
  {
    WallThrow: 0
  },
  {
    Saw: 0
  },
  {
    Stick: 0
  },
  {
    BossHerobrine: 0
  },
  {
    BossHerobrinePart: 0
  },
  {
    TriggerHerobrine: 0
  },
  {
    BossHerobrineMagia: 0
  },
  {
    LavaBackground: 0
  },
  {
    AJAX: 0
  },
  {
    Audio: 0
  },
  {
    Browser: 0
  },
  {
    Keyboard: 0
  },
  {
    LocalStorage: 0
  },
  {
    PlatformInfo: 0
  },
  {
    Touch: 0
  },
  {
    Dictionary: 0
  },
  {
    GamePush: 0
  },
  {
    Enemyes: 0
  },
  {
    previousIslandX: 0
  },
  {
    previousIslandY: 0
  },
  {
    levelSelectPage: 0
  },
  {
    iconHeroSkinHue: 0
  },
  {
    sound: 0
  },
  {
    soundVolume: 0
  },
  {
    music: 0
  },
  {
    currentMusic: 0
  },
  {
    musicVolume: 0
  },
  {
    ads: 0
  },
  {
    bossChickenAttackDistance: 0
  },
  {
    bossChickenAttackStrength: 0
  },
  {
    bossChickenHealthDefault: 0
  },
  {
    bossChickenSpeedDefault: 0
  },
  {
    bossChickenTimeBetweenAttacks: 0
  },
  {
    bossDragonHealthDefault: 0
  },
  {
    bossDragonAttackStrength: 0
  },
  {
    bossDragonBallDamage: 0
  },
  {
    bossFlyingFoxAttackHeight: 0
  },
  {
    bossFlyingFoxHitWait: 0
  },
  {
    bossFlyingFoxSpeedFall: 0
  },
  {
    bossFlyingFoxSpeedFly: 0
  },
  {
    bossFlyingFoxSpeedKick: 0
  },
  {
    bossGhastHealthDefault: 0
  },
  {
    bossGhastAttackStrength: 0
  },
  {
    bossHerobrinHealthDefault: 0
  },
  {
    bossPigHealthDefault: 0
  },
  {
    bossPigAttackStrength: 0
  },
  {
    bossSlimeAttackStrength: 0
  },
  {
    bossSlimeHealthDefault: 0
  },
  {
    bossSlimeSpeedDefault: 0
  },
  {
    bossSpiderAttackStrength: 0
  },
  {
    bossSpiderSpeedDefault: 0
  },
  {
    bossSpiderHealthDefault: 0
  },
  {
    chickenAttackDistance: 0
  },
  {
    chickenAttackStrength: 0
  },
  {
    chickenHealthDefault: 0
  },
  {
    chickenSpeedDefault: 0
  },
  {
    chickenTimeBetweenAttacks: 0
  },
  {
    coins: 0
  },
  {
    coinsDefault: 0
  },
  {
    coinsPerAds: 0
  },
  {
    coinsPerAdsMax: 0
  },
  {
    coinsPerAdsMin: 0
  },
  {
    coinsPerAdsSelected: 0
  },
  {
    coinsPerAdsIncreaseDirect: 0
  },
  {
    coinsPerBossSlime: 0
  },
  {
    coinsPerBossChicken: 0
  },
  {
    coinsPerBossPig: 0
  },
  {
    coinsPerBossSpider: 0
  },
  {
    coinsPerBossGhast: 0
  },
  {
    coinsPerBossDragon: 0
  },
  {
    coinsPerBossHerobrine: 0
  },
  {
    coinsForHero2LevelUpgrade: 0
  },
  {
    coinsForHeroNextLevelsUpgrade: 0
  },
  {
    coinsPerChicken: 0
  },
  {
    coinsPerCreeper: 0
  },
  {
    coinsPerLevel: 0
  },
  {
    coinsPerEnderman: 0
  },
  {
    coinsPerPig: 0
  },
  {
    coinsPerPiglin: 0
  },
  {
    coinsPerSkeleton: 0
  },
  {
    coinsPerSlime: 0
  },
  {
    coinsPerSpider: 0
  },
  {
    coinsPerSpiderSmall: 0
  },
  {
    coinsPerZombie: 0
  },
  {
    countEnemiesInLevel: 0
  },
  {
    countEnemiesInLevelDead: 0
  },
  {
    countLevels: 0
  },
  {
    countSkins: 0
  },
  {
    creeperAttackDistance: 0
  },
  {
    creeperAttackStrength: 0
  },
  {
    creeperSpeedDefault: 0
  },
  {
    creeperHealthDefault: 0
  },
  {
    creeperTimeAttack: 0
  },
  {
    dischargerDamage: 0
  },
  {
    endermanAttackDistance: 0
  },
  {
    endermanAttackStrength: 0
  },
  {
    endermanSpeedDefault: 0
  },
  {
    endermanHealthDefault: 0
  },
  {
    endermanTimeHandDown: 0
  },
  {
    endermanTimeHandUp: 0
  },
  {
    flyingFoxSpeedFall: 0
  },
  {
    flyingFoxSpeedFly: 0
  },
  {
    flyingFoxAttackHeight: 0
  },
  {
    flyingFoxHitWait: 0
  },
  {
    gameName: 0
  },
  {
    heroHealth: 0
  },
  {
    heroHealthMax: 0
  },
  {
    heroHealthUpgradeStep: 0
  },
  {
    heroHealthDefault: 0
  },
  {
    heroHitDamage: 0
  },
  {
    heroHitDamageDefault: 0
  },
  {
    heroHitDamageUpgradeStep: 0
  },
  {
    heroLevel: 0
  },
  {
    heroMaxSpeedDefault: 0
  },
  {
    heroMaxSpeedSand: 0
  },
  {
    heroMaxSpeedIce: 0
  },
  {
    heroAccelerationIce: 0
  },
  {
    heroAccelerationDefault: 0
  },
  {
    heroDecelerationIce: 0
  },
  {
    heroDecelerationDefault: 0
  },
  {
    language: 0
  },
  {
    layersScale: 0
  },
  {
    layersScaleBoss: 0
  },
  {
    layersScaleBigBoss: 0
  },
  {
    layersScaleDefault: 0
  },
  {
    layersScaleTarget: 0
  },
  {
    layersScaleWin: 0
  },
  {
    level: 0
  },
  {
    levelAvailable: 0
  },
  {
    loadLanguage: 0
  },
  {
    loadHeroLevel: 0
  },
  {
    loadLevel: 0
  },
  {
    loadSkins: 0
  },
  {
    lock: 0
  },
  {
    mode: 0
  },
  {
    modePrevious: 0
  },
  {
    online: 0
  },
  {
    pause: 0
  },
  {
    pigAttackDistance: 0
  },
  {
    pigAttackStrength: 0
  },
  {
    pigHealthDefault: 0
  },
  {
    pigSpeedDefault: 0
  },
  {
    pigTimeHeadDown: 0
  },
  {
    pigTimeHeadUp: 0
  },
  {
    piglinHealthDefault: 0
  },
  {
    playerLastX: 0
  },
  {
    playerLastY: 0
  },
  {
    platform: 0
  },
  {
    portalAnimationSpeed: 0
  },
  {
    save: 0
  },
  {
    sawDamage: 0
  },
  {
    screenPrevious: 0
  },
  {
    scrollMarkerLevelStartX: 0
  },
  {
    skeletonAttackDistance: 0
  },
  {
    skeletonAttackStrength: 0
  },
  {
    skeletonSpeedDefault: 0
  },
  {
    skeletonHealthDefault: 0
  },
  {
    skeletonTimeAim: 0
  },
  {
    skin: 0
  },
  {
    skinNumber: 0
  },
  {
    skinNumberAd: 0
  },
  {
    spiderAttackDistance: 0
  },
  {
    spiderAttackStrength: 0
  },
  {
    spiderHealthDefault: 0
  },
  {
    spiderHealthDefaultSmall: 0
  },
  {
    spiderSpeedDefault: 0
  },
  {
    spiderSpeedDefaultSmall: 0
  },
  {
    spiderTimeHeadDown: 0
  },
  {
    spiderTimeHeadUp: 0
  },
  {
    spikeFallingDamage: 0
  },
  {
    spikeSpeedOn: 0
  },
  {
    spikeSpeedOff: 0
  },
  {
    spikeDamage: 0
  },
  {
    triggerNum: 0
  },
  {
    timerTouchLevel: 0
  },
  {
    triggerTouchLevel: 0
  },
  {
    timeDefaultForAnyLevel: 0
  },
  {
    touchStartX: 0
  },
  {
    transition: 0
  },
  {
    zombieAttackDistance: 0
  },
  {
    zombieAttackStrength: 0
  },
  {
    zombieSpeedDefault: 0
  },
  {
    zombieHealthDefault: 0
  },
  {
    zombieTimeHandDown: 0
  },
  {
    zombieTimeHandUp: 0
  },
  {
    text: 0
  },
  {
    timeAction: 0
  },
  {
    explosionAnimation: 0
  },
  {
    explosionX: 0
  },
  {
    explosionY: 0
  },
  {
    explosionDamage: 0
  },
  {
    explosionScale: 0
  },
  {
    soundDecrease: 0
  },
  {
    centerX: 0
  },
  {
    centerY: 0
  },
  {
    sparkX: 0
  },
  {
    sparkY: 0
  },
  {
    sparkTime: 0
  },
  {
    sparkAngle: 0
  },
  {
    sparkSpeed: 0
  },
  {
    sparkTop: 0
  },
  {
    coinX: 0
  },
  {
    coinY: 0
  },
  {
    coinsCount: 0
  },
  {
    countCoins: 0
  },
  {
    layer: 0
  },
  {
    countBlobs: 0
  },
  {
    slimeX: 0
  },
  {
    slimeY: 0
  },
  {
    rivalX: 0
  },
  {
    legFrontBackNum: 0
  },
  {
    spiderX: 0
  },
  {
    spiderY: 0
  },
  {
    legAnimation: 0
  },
  {
    creeperNum: 0
  },
  {
    pieceX: 0
  },
  {
    pieceY: 0
  },
  {
    attackType: 0
  },
  {
    layout: 0
  },
  {
    nextAttack: 0
  },
  {
    testText: 0
  },
  {
    testText2: 0
  },
  {
    testText3: 0
  },
  {
    testNum: 0
  },
  {
    testTextLeaks: 0
  },
  {
    loadSkinsComplete: 0
  },
  {
    loadTexts: 0
  },
  {
    setAnotherLanguage: 0
  },
  {
    skins: 0
  },
  {
    adsInterstitial: 0
  },
  {
    loadAllTexts: 0
  },
  {
    loadGameStart: 0
  },
  {
    loadPlayerFields: 0
  },
  {
    score: 0
  },
  {
    coinsSave: 0
  },
  {
    skinStirngForLoad: 0
  },
  {
    skinStirngForSave: 0
  }
];

self.InstanceType = {
  Button: class extends self.ISpriteInstance {},
  RibbonSimple: class extends self.IWorldInstance {},
  RibbonGala: class extends self.IWorldInstance {},
  TextTest: class extends self.ITextInstance {},
  TextButton: class extends self.ITextInstance {},
  Window: class extends self.IWorldInstance {},
  TextNotification: class extends self.ITextInstance {},
  TextPrompt: class extends self.ITextInstance {},
  PromptButton: class extends self.ISpriteInstance {},
  TextLevelNumber: class extends self.ITextInstance {},
  LevelBorder: class extends self.ISpriteInstance {},
  PromptArrow: class extends self.ISpriteInstance {},
  Icon: class extends self.ISpriteInstance {},
  MaskBottom: class extends self.ITiledBackgroundInstance {},
  MaskTop: class extends self.ITiledBackgroundInstance {},
  TextInfo: class extends self.ITextInstance {},
  TextSpriteFont: class extends self.ISpriteFontInstance {},
  Health: class extends self.IWorldInstance {},
  HealthMask: class extends self.ITiledBackgroundInstance {},
  TextBarGreen: class extends self.ISpriteFontInstance {},
  Scull: class extends self.ISpriteInstance {},
  TextLogo: class extends self.ISpriteFontInstance {},
  TextSpriteFontWords: class extends self.ISpriteFontInstance {},
  Bg: class extends self.ISpriteInstance {},
  HeroBase: class extends self.ISpriteInstance {},
  Hero: class extends self.ISpriteInstance {},
  Portal: class extends self.ISpriteInstance {},
  PortalFrame: class extends self.ISpriteInstance {},
  CoinPrize: class extends self.ISpriteInstance {},
  ParticleEffect: class extends self.ISpriteInstance {},
  Shadow: class extends self.ISpriteInstance {},
  Spikes: class extends self.ISpriteInstance {},
  TriggerReversal: class extends self.ISpriteInstance {},
  TriggerJump: class extends self.ISpriteInstance {},
  Water: class extends self.ITiledBackgroundInstance {},
  Tilemap: class extends self.ITilemapInstance {},
  Wall: class extends self.ISpriteInstance {},
  Ceiling: class extends self.ISpriteInstance {},
  Sand: class extends self.ITiledBackgroundInstance {},
  Coin: class extends self.ISpriteInstance {},
  WallPlatformerInvisible: class extends self.ITiledBackgroundInstance {},
  Ice: class extends self.ITiledBackgroundInstance {},
  ArraySkins: class extends self.IArrayInstance {},
  IceFloe: class extends self.ISpriteInstance {},
  Lava: class extends self.ISpriteInstance {},
  Fireball: class extends self.ISpriteInstance {},
  Zombie: class extends self.ISpriteInstance {},
  IslandLava: class extends self.ISpriteInstance {},
  SpikesFalling: class extends self.ISpriteInstance {},
  SpikesFallingPiece: class extends self.ISpriteInstance {},
  IslandFalling: class extends self.ITiledBackgroundInstance {},
  HeroHitBox: class extends self.ISpriteInstance {},
  ZombiePart: class extends self.ISpriteInstance {},
  TilemapBackground: class extends self.ITilemapInstance {},
  Cloud: class extends self.ISpriteInstance {},
  Blood: class extends self.ISpriteInstance {},
  Pig: class extends self.ISpriteInstance {},
  PigPart: class extends self.ISpriteInstance {},
  Checkpoint: class extends self.ISpriteInstance {},
  CheckpointFire: class extends self.ISpriteInstance {},
  CheckpointFlash: class extends self.ISpriteInstance {},
  Creeper: class extends self.ISpriteInstance {},
  CreeperPart: class extends self.ISpriteInstance {},
  Explosion: class extends self.ISpriteInstance {},
  Elevator: class extends self.ISpriteInstance {},
  ElevatorBackground: class extends self.ITiledBackgroundInstance {},
  BossPig: class extends self.ISpriteInstance {},
  BossPigPart: class extends self.ISpriteInstance {},
  BossStars: class extends self.ISpriteInstance {},
  Spark: class extends self.ISpriteInstance {},
  Arrow: class extends self.ISpriteInstance {},
  Bow: class extends self.ISpriteInstance {},
  Skeleton: class extends self.ISpriteInstance {},
  SkeletonPart: class extends self.ISpriteInstance {},
  Spider: class extends self.ISpriteInstance {},
  SpiderPart: class extends self.ISpriteInstance {},
  Enderman: class extends self.ISpriteInstance {},
  EndermanPart: class extends self.ISpriteInstance {},
  BossGhast: class extends self.ISpriteInstance {},
  BossGhastPart: class extends self.ISpriteInstance {},
  BossGhastBall: class extends self.ISpriteInstance {},
  Chicken: class extends self.ISpriteInstance {},
  TilemapFront: class extends self.ITilemapInstance {},
  BossChicken: class extends self.ISpriteInstance {},
  BossChickenEgg: class extends self.ISpriteInstance {},
  Sword: class extends self.ISpriteInstance {},
  BossDragon: class extends self.ISpriteInstance {},
  BossDragonBall: class extends self.ISpriteInstance {},
  Discharger: class extends self.ISpriteInstance {},
  WallThrow: class extends self.ISpriteInstance {},
  Saw: class extends self.ISpriteInstance {},
  Stick: class extends self.ISpriteInstance {},
  BossHerobrine: class extends self.ISpriteInstance {},
  BossHerobrinePart: class extends self.ISpriteInstance {},
  TriggerHerobrine: class extends self.ISpriteInstance {},
  BossHerobrineMagia: class extends self.ISpriteInstance {},
  LavaBackground: class extends self.ISpriteInstance {},
  AJAX: class extends self.IInstance {},
  Audio: class extends self.IInstance {},
  Browser: class extends self.IInstance {},
  Keyboard: class extends self.IInstance {},
  LocalStorage: class extends self.IInstance {},
  PlatformInfo: class extends self.IInstance {},
  Touch: class extends self.IInstance {},
  Dictionary: class extends self.IDictionaryInstance {},
  GamePush: class extends C3.Plugins.Eponesh_GameScore.Instance {},
  Enemyes: class extends self.ISpriteInstance {}
}