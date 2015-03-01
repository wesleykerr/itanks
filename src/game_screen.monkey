
Import diddy
Import itanks

Import aitank
Import globals
Import tank
Import vector
Import world

'
'GameScreen 
'
Class GameScreen Extends Screen
	Field menu:SimpleMenu
	
	Field won:Bool
	
	Field movement:Vector
	Field mousePosition:Vector = New Vector(0,0)
	Field numberOfPlayers:Float = 1
	Field comparator:TankComparator = New TankComparator()
	
	'Still keep a reference to the player's tank
	Field tank:Tank
	
	Field running:Bool
	Field start:Float
	Field delay:Float = 2000
	
	Method Start:Void()
		game.screenFade.Start(50, False)
		menu = New SimpleMenu("ButtonOver", "ButtonClick", 960-204, 0, 10, True)
		Local b:SimpleButton = menu.AddButton("quitInGameButton.png", "quitInGameButtonHover.png")
		
		gGameOver = False
		won = True
		
		gWorld = New World("World3")
				
		gProjectileManager = New ProjectileManager()
		gTanks = New ArrayList<Tank>()
		
		Local playersToPlace:Int = numberOfPlayers
		
		While gWorld.spawnPoints.Size() > 0
			Local spawn:Int = Rnd(0, gWorld.spawnPoints.Size())
			
			If playersToPlace > 0
				tank = New Tank(gWorld.spawnPoints.Get(spawn).vector)
				tank.rotation = Float(gWorld.spawnPoints.Get(spawn).rotation)
				gTanks.Add(tank)
				playersToPlace = playersToPlace - 1
			Else
				Local aitank:AITank = New AITank(gWorld.spawnPoints.Get(spawn).vector)
				aitank.rotation = Float(gWorld.spawnPoints.Get(spawn).rotation)
				gTanks.Add(aitank)
			End
			
			gWorld.spawnPoints.RemoveAt(spawn)
		End

		LoadParticleSystem()

		running = False 
		start = Millisecs()
		'menu.Centre()
	End
	
	Method Render:Void()
		Cls
		
		SetColor(255, 255, 255)
		DrawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
		
		gWorld.RenderBackground()		
		gProjectileManager.OnRender()
		
		'render all of the tanks
		gTanks.Sort(False, comparator)
		Local t:Tank
		For t = Eachin gTanks
			t.OnRender()
		End
		
		gWorld.RenderForeground()
		gPS.Render()		
		menu.Draw()
		
		If gGameOver And won Then
			DrawImage(game.images.Find("Win").image, 480, 320, 0, 1, 1)
		End
		
		If gGameOver And Not won Then
			DrawImage(game.images.Find("Fail").image, 480, 320, 0, 1, 1)
		End
	End
	
	Method Update:Void()
		menu.Update()
		
		If Not running Then
			Local currentTime:Float = Millisecs()
			If currentTime - start > delay Then
				running = True
			Else
				Return
			End
		End
		
		If Not gGameOver And tank.health <= 0 Then
			'game over you lose
			gGameOver = True 
			won = False 
		End
		
		' Count the number of tanks that are alive
		gAlive = 0
		Local t:Tank
		For t = Eachin gTanks
			If t.health > 0 Then
				gAlive += 1
			End
		End
		
		If gAlive = 1 Then
			gGameOver = True
		End
		
		If gWorld.started = False
		
			ProcessInput()
		
			For t = Eachin gTanks
				t.OnUpdate()
			End
		End
		
		gPS.Update(dt.frametime)
		gProjectileManager.OnUpdate()
	End
	
	'Private
	
	Method ProcessInput:Void()
		If menu.Clicked("quitInGameButton") Then
			game.screenFade.Start(50, True)
			game.nextScreen = gTitleScreen
		End

		If gGameOver Then
			Return
		End

		tank.forward = KeyDown(KEY_W) = 1
		tank.backward = KeyDown(KEY_S) = 1
		tank.left = KeyDown(KEY_A) = 1
		tank.right = KeyDown(KEY_D) = 1
		
		mousePosition.X = game.mouseX
		mousePosition.Y = game.mouseY
		tank.weapon.AimAt(mousePosition)
		
		'gWorld.LineOfSight(tank.position, mousePosition)
		
		If MouseHit(MOUSE_LEFT) = 1 Then
			tank.weapon.Fire()
		End If
	End
	
	Method LoadParticleSystem:Void()
	
		Local parser:XMLParser = New XMLParser()
		Local doc:XMLDocument = parser.ParseFile("psystem.xml")
		gPS = New ParticleSystem(doc)

		gGroupSmoke = gPS.GetGroup("group1")
		gEmitterSmoke = gPS.GetEmitter("emit1")

		gGroupExplosion = gPS.GetGroup("group2")
		gEmitterExplosion = gPS.GetEmitter("emit2")
		
		Local speck:Image = LoadImage("speck.png",,Image.MidHandle)
		gEmitterSmoke.ParticleImage = speck
		gEmitterExplosion.ParticleImage = speck
	End
End


Class TankComparator Extends AbstractComparator
	Method Compare:Int(o1:Object, o2:Object) 
		Local t1:Tank= Tank(o1)
		Local t2:Tank= Tank(o2)
		
		If t1.position.Y < t2.position.Y Then Return -1
		If t1.position.Y > t2.position.Y Then Return 1
		Return 0
	End
End
