Strict

Import diddy
Import itanks

'
' TitleScreen
' 
Class TitleScreen Extends Screen

	Field playMenu:SimpleMenu
	Field leftMenu:SimpleMenu
	Field rightMenu:SimpleMenu
	Field bgImage:Image

	Field musicFormat:String
	
	Method New()
		name = "TitleScreen"
	End
	
	Method Start:Void()
		Local b:SimpleButton
		
		bgImage = LoadImage("graphics/mainMenu.png")
	
		game.screenFade.Start(50, False)
		playMenu = New SimpleMenu("ButtonOver", "ButtonClick", 480-174, 400, 10, False)
		b = playMenu.AddButton("playMenuButton.png", "playMenuButtonHover.png")
		
		leftMenu = New SimpleMenu("ButtonOver", "ButtonClick", 20, 430, 10, False)
		b = leftMenu.AddButton("helpMenuButton.png", "helpMenuButtonHover.png")
		b = leftMenu.AddButton("creditsMenuButton.png", "creditsMenuButtonHover.png")

		rightMenu = New SimpleMenu("ButtonOver", "ButtonClick", 750, 430, 30, False)
		b = rightMenu.AddButton("menuExitButton.png", "menuExitButtonHover.png")

#If TARGET="glfw"
		musicFormat="wav"
#Elseif TARGET="html5"
		musicFormat="ogg"
#Elseif TARGET="flash"
		musicFormat="mp3"
#Elseif TARGET="android"
		musicFormat="ogg"
#Elseif TARGET="xna"
		musicFormat="wav"
#Elseif TARGET="ios"
		musicFormat="m4a"
#End		
		
'		game.MusicPlay("happy."+musicFormat, True)
	End
	
	Method Render:Void()
		Cls
		
		
		DrawImage(bgImage, 0, 0, 0)
	End
	
	Method ExtraRender:Void()
		playMenu.Draw()
		leftMenu.Draw()
		rightMenu.Draw()
	End
	
	Method Update:Void()
		playMenu.Update()
		leftMenu.Update()
		rightMenu.Update()
		
		If playMenu.Clicked("playMenuButton") Then
			game.screenFade.Start(50, True)
			game.nextScreen = gGameScreen
		End
		
		If leftMenu.Clicked("creditsMenuButton") Then
			game.screenFade.Start(50, True)
			game.nextScreen = gCreditsScreen
		End
		
		If leftMenu.Clicked("helpMenuButton") Then
			game.screenFade.Start(50, True)
			game.nextScreen = gHelpScreen
		End

		
'		If menu.Clicked("continue") Then
'			game.screenFade.Start(50, True)
'			game.nextScreen = gTitleScreen
'		End
		
		If KeyHit(KEY_ESCAPE) Or rightMenu.Clicked("menuExitButton")
			game.screenFade.Start(50, True)
			game.nextScreen = game.exitScreen
		End
	End
End


Class BackgroundScreen Extends Screen

	Field bgImage:Image
	Field imageName:String
	
	Method New(imageName:String)
		name = "CreditsScreen"
		Self.imageName = imageName
	End
	
	Method Start:Void()
		bgImage = LoadImage(imageName)
	End
	
	Method Render:Void()
		Cls
		DrawImage(bgImage, 0, 0, 0)
	End
	
	Method ExtraRender:Void()
	End
	
	Method Update:Void()
		If KeyHit(KEY_ESCAPE) Then
			game.screenFade.Start(50, True)
			game.nextScreen = gTitleScreen
		End
	End
End

