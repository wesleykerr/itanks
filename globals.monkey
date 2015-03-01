
Import diddy

Import game_screen
Import screens
Import tank
Import world

'world information that could eventually be put into a manager
'necessary currently for collision detection between projectile and tanks
Global gTanks:ArrayList<Tank>

Global gAlive:Int
Global gGameOver:Bool

Global gWorld:World

'screens
Global gTitleScreen:TitleScreen
Global gCreditsScreen:BackgroundScreen
Global gHelpScreen:BackgroundScreen
Global gGameScreen:GameScreen

'managers
Global gProjectileManager:ProjectileManager

'particle system
Global gPS:ParticleSystem
Global gGroupExplosion:ParticleGroup
Global gGroupSmoke:ParticleGroup
Global gEmitterExplosion:Emitter
Global gEmitterSmoke:Emitter

