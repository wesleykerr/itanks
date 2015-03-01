Strict

Import mojo
Import diddy

Import screens
Import game_screen
Import tank
Import vector


' The overall Game object, handling loading, mouse position, high-level game control and rendering...
Class iTanks Extends DiddyApp

	Method OnCreate:Int()
		Super.OnCreate()
		drawFPSOn = False
		
		gTitleScreen = New TitleScreen()
		gCreditsScreen = New BackgroundScreen("graphics/CreditsScreen.png")
		gHelpScreen = New BackgroundScreen("graphics/howToPlay.png")
		gGameScreen = New GameScreen()
		
		Local tmpImage:Image		
		images.Load("Projectile.png")
		images.LoadAnim("TankBase.png", 64, 64, 16, tmpImage)
		images.LoadAnim("TankExplode.png", 64, 64, 1, tmpImage)
		images.LoadAnim("Weapon.png", 64, 64, 16, tmpImage)
		images.LoadAnim("TankBaseBlue.png", 64, 64, 16, tmpImage)
		images.LoadAnim("TankExplodeBlue.png", 64, 64, 1, tmpImage)
		images.LoadAnim("WeaponBlue.png", 64, 64, 16, tmpImage)
		images.Load("Health.png")
		images.Load("HealthBG.png")
		
		images.Load("Win.png")
		images.Load("Fail.png")
		images.LoadAnim("CountDown.png", 350, 300, 4, tmpImage)
		
		sounds.Load("bounce")
		sounds.Load("shoot")
		sounds.Load("explosion")
		sounds.Load("tankExplosion")

		gTitleScreen.PreStart()
		Return 0
	End
End

' Here we go!

Function Main:Int ()
	game = New iTanks()	
	Return 0
End