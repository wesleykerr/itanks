
Import globals
Import tank

Class AITank Extends Tank

	'AITank inherits a baseSpeed that should be about 1
	Field search:AStarSearch
	Field path:ArrayList<Vector>
	Field pathIndex:Int
		
	Field state:String 
	Field movingForward:Bool
	Field turning:Int
	
	Field target:Tank
	Field targetAlive:Bool
	
	Field extraDelay:Float

	Method New(v:Vector)
		Super.New(v)
		
		search = New AStarSearch()
		state = "NONE"
		image = game.images.Find("TankBase")
		explodeImage = game.images.Find("TankExplode")
	
		
		extraDelay = (Rnd() * 3000) + 2000
		weapon.lastFired = Rnd(0,1000)
		weapon.cooldown += extraDelay
		weapon.image = game.images.Find("Weapon") 
	End
	
	'--------------------------------------------------------------------------
	Method OnUpdate:Void()		
		'Determine who is visible.  If we can see every tank, then we just need to 
		'attack one of them
		
		If gAlive = 1 Or health <= 0 Then
			Super.OnUpdate()
			Return
		End
		
		Local visible:ArrayList<Tank> = New ArrayList<Tank>()
		Local closest:Tank = Null
		Local distance:Float = 100000 'I am lazy
		
		targetAlive = False 
		For Local tank:Tank = Eachin gTanks
			If Self = tank Then
				Continue
			End
			
			If tank.health <= 0 Then
				Continue
			End
			
			Local test:Bool = gWorld.LineOfSight(Self.position, tank.position)
			If test Then
				visible.Add(tank)
				If target = tank Then
					targetAlive = True
				End
			Else			
				' if it isn't visible, keep track of the distance in case
				' we need to find a path to the closest one
				Local d:Float = tank.position.Subtract(position).Length()
				If d < distance Then
					closest = tank
					distance = d
				End
			End
		End
		
		If visible.Size() = 0 Then
			If state <> "PATH" Then
				state = "PATH"
				path = search.FindPath(position, New Vector(closest.position.X, closest.position.Y))
				pathIndex = 0
				If path.Size() > 0
					pathIndex = 1
				End
 			End
			
			'continue following path...
			FollowPath()
		Else
			'begin facing our opponent		
			If state = "PATH" Then
				StopPathFollowing()
			End
			
			state = "ATTACK"
			
			If Not targetAlive Or Rnd(0, 1000) < 10 Then
				target = visible.Get( Rnd(visible.Size()) )			
			End
			Self.weapon.AimAt( target.position )
			Self.weapon.Fire()
			
			If Rnd(0, 1000) < 10 Then
				'swap directions
				movingForward = Not movingForward
			End
			
			If movingForward Then
				forward = True
				backward = False
			Else 
				backward = True
				forward = False
			End
			
			If Rnd(0, 1000) < 100 Then
				'turning = Rnd(0,3)
				turning = 0
			End
			
			If turning = 0 Then
				left = False 
				right = False
			Else If turning = 1 Then
				left = True
				right = False
			Else
				left = False
				right = True
			End
		End
		
		Super.OnUpdate()	
	End
	
	'--------------------------------------------------------------------------
	Method OnRender:Void()
		Super.OnRender()
	End
	
	'--------------------------------------------------------------------------
	Method FollowPath:Void()
		If path.Size() = 0 Then
			Return
		End
		
		Local target:Vector = path.Get(pathIndex)
		
		'are we facing it?
		Local direction:Vector = target.Subtract(position)
		Local distance:Float = direction.Length()
		
		If distance < 32 Then
			pathIndex += 1
			If pathIndex >= path.Size()
				state = "NONE"
				Return 
			End
			target = path.Get(pathIndex)
			direction = target.Subtract(position)
		End

		direction.Normalize()
		Local desiredRotation:Float = ATan2( direction.Y, direction.X )
		Local angleDiff = AngleDiff(rotation, desiredRotation)
		If Abs(angleDiff) < 2 
			forward = True 
			backward = False 
		Else If Abs(angleDiff) > 178
			backward = True
			forward = False
		Else
'			forward = False
'			backward = False 
			
			If angleDiff < 0 Then
				left = True
				right = False
			Else
				right = True
				left = False 
			End
			
		End
	End
	
	'--------------------------------------------------------------------------
	Method StopPathFollowing:Void()
		path.Clear()
		pathIndex = 0
		
		forward = False
		left = False
		right = False
	End
End

'--------------------------------------------------------------------------
Function WrapValue:Float(value:Float)
	Local max:Float = 360
	While value > max 
		value -= max
	End
	
	While value < 0
		value += max
	End
	Return value
End

'--------------------------------------------------------------------------
Function AngleDiff:Float(actual:Float, target:Float)
	Return -1 * ( WrapValue(actual + 180 - target) - 180 )
End

'--------------------------------------------------------------------------
Class SteeringOutput
	Field velocity:Vector
	Field rotation:Float
	
	Method New()
		velocity = New Vector(0,0)
		rotation = 0
	End
End

'--------------------------------------------------------------------------
Class SteeringBehavior Abstract
	Field steeringOutput:SteeringOutput
	Field target:Vector
	Field ai:AITank
	
	Method New(ai:AITank)
		Self.ai = ai
		steeringOutput = New SteeringOutput()
	End

	Method GetSteering:SteeringBehavior() Abstract
End

'--------------------------------------------------------------------------
Class Seek
	Method New(ai:AITank)
		Super.New(ai)
	End
	
	Method GetSteering:SteeringOutput()
		Local steering:SteeringOutput = New SteeringOutput()
		
		steering.velocity = target.Subtract(ai.position)
		steering.velocity.Normalize()
		steering.velocity.ScaleLocal(ai.speed)
		
		steering.rotation = 0
		Return steering
	End
End

'--------------------------------------------------------------------------
