
Import globals
Import vector

Class DeathAnimation

	Field position:Vector	
	
	Field explosionDelay:Float
	Field smokeDelay:Float
	
	Field explosionStop:Float
	Field smokeStop:Float
	
	Field started:Bool
	Field finished:Bool
	
	Field start:Float
	
	Method New()
		position = New Vector()
		explosionDelay = 0
		explosionStop = 1200

		smokeDelay = 1000
		smokeStop = 2000
		
		started = False 
		finished = False 
	End
	
	Method Begin:Void(p:Vector)
		position.Set( p.X, p.Y )
		start = Millisecs()
		explosionDelay += start
		explosionStop += start
		
		smokeDelay += start
		smokeStop += start
		 
		started = True		
	End
	
	Method Finished:Bool()
		Local time:Float = Millisecs()
		If time - start > smokeStop Then 
			finished = True 
		End
		Return finished
	End
	
	Method Update:Void()
		Local time:Float = Millisecs()
		If time - explosionDelay > 0 And time - explosionStop <= 0 Then
			gEmitterExplosion.EmitAt(1, position.X, position.Y)		
		End
		
		If time - smokeDelay > 0 And time - smokeStop <= 0 And time Mod 5 = 0 Then
			gEmitterSmoke.EmitAt(1, position.X, position.Y)
		End
	End
End
