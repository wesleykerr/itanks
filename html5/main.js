
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}
	
	game_canvas=document.getElementById( "GameCanvas" );
	
	game_console=document.getElementById( "GameConsole" );

	try{
	
		bbInit();
		bbMain();
		
		if( game_runner!=null ) game_runner();
		
	}catch( err ){
	
		showError( err );
	}
}

//Globals
var game_canvas;
var game_console;
var game_runner;

//${METADATA_BEGIN}
var META_DATA="[graphics/againInGameButton.png];type=image/png;width=205;height=83;\n[graphics/againInGameButtonHover.png];type=image/png;width=205;height=83;\n[graphics/bg1.png];type=image/png;width=960;height=640;\n[graphics/bg2.png];type=image/png;width=960;height=640;\n[graphics/Concrete.png];type=image/png;width=960;height=640;\n[graphics/continue.png];type=image/png;width=207;height=44;\n[graphics/continueMO.png];type=image/png;width=207;height=44;\n[graphics/creditsMenuButton.png];type=image/png;width=217;height=81;\n[graphics/creditsMenuButtonHover.png];type=image/png;width=217;height=81;\n[graphics/CreditsScreen.png];type=image/png;width=960;height=640;\n[graphics/Fail.png];type=image/png;width=660;height=420;\n[graphics/Health.png];type=image/png;width=52;height=7;\n[graphics/HealthBG.png];type=image/png;width=52;height=7;\n[graphics/helpMenuButton.png];type=image/png;width=204;height=85;\n[graphics/helpMenuButtonHover.png];type=image/png;width=204;height=85;\n[graphics/howToPlay.png];type=image/png;width=960;height=640;\n[graphics/mainMenu.png];type=image/png;width=960;height=640;\n[graphics/menuExitButton.png];type=image/png;width=182;height=100;\n[graphics/menuExitButtonHover.png];type=image/png;width=182;height=100;\n[graphics/newgame.png];type=image/png;width=200;height=40;\n[graphics/newgameMO.png];type=image/png;width=200;height=40;\n[graphics/options.png];type=image/png;width=207;height=44;\n[graphics/optionsMO.png];type=image/png;width=207;height=44;\n[graphics/playMenuButton.png];type=image/png;width=348;height=165;\n[graphics/playMenuButtonHover.png];type=image/png;width=348;height=165;\n[graphics/Projectile.png];type=image/png;width=8;height=8;\n[graphics/quit.png];type=image/png;width=67;height=32;\n[graphics/quitInGameButton.png];type=image/png;width=204;height=92;\n[graphics/quitInGameButtonHover.png];type=image/png;width=204;height=92;\n[graphics/quitMO.png];type=image/png;width=67;height=32;\n[graphics/slider.png];type=image/png;width=25;height=35;\n[graphics/slider_bar.png];type=image/png;width=187;height=24;\n[graphics/TankBase.png];type=image/png;width=64;height=1024;\n[graphics/TankBaseBlue.png];type=image/png;width=64;height=1024;\n[graphics/TankExplode.png];type=image/png;width=64;height=64;\n[graphics/TankExplodeBlue.png];type=image/png;width=64;height=64;\n[graphics/TempTank.png];type=image/png;width=64;height=64;\n[graphics/TempTank_Weapon.png];type=image/png;width=64;height=64;\n[graphics/TileSheet.png];type=image/png;width=512;height=512;\n[graphics/Weapon.png];type=image/png;width=66;height=1024;\n[graphics/WeaponBlue.png];type=image/png;width=64;height=1024;\n[graphics/Win.png];type=image/png;width=660;height=420;\n[mojo_font.png];type=image/png;width=864;height=13;\n[music/happy.mp3];type=audio/mpeg;\n[music/happy.ogg];type=audio/ogg;length=169613;hertz=22255;\n[music/happy.wav];type=audio/x-wav;length=169613;hertz=22255;\n[sounds/bounce.ogg];type=audio/ogg;length=8931;hertz=44100;\n[sounds/bounce.wav];type=audio/x-wav;length=8931;hertz=44100;\n[sounds/ButtonClick.mp3];type=audio/mpeg;\n[sounds/ButtonClick.ogg];type=audio/ogg;length=4637;hertz=44100;\n[sounds/ButtonClick.wav];type=audio/x-wav;length=4637;hertz=44100;\n[sounds/ButtonOver.mp3];type=audio/mpeg;\n[sounds/ButtonOver.ogg];type=audio/ogg;length=2124;hertz=44100;\n[sounds/ButtonOver.wav];type=audio/x-wav;length=2124;hertz=44100;\n[sounds/explosion.ogg];type=audio/ogg;length=30075;hertz=44100;\n[sounds/explosion.wav];type=audio/x-wav;length=30075;hertz=44100;\n[sounds/shoot.ogg];type=audio/ogg;length=11784;hertz=44100;\n[sounds/shoot.wav];type=audio/x-wav;length=11784;hertz=44100;\n[sounds/tankExplosion.ogg];type=audio/ogg;length=17227;hertz=44100;\n[sounds/tankExplosion.wav];type=audio/x-wav;length=17227;hertz=44100;\n[speck.png];type=image/png;width=8;height=8;\n";

//${METADATA_END}
function getMetaData( path,key ){	
	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

function loadString( path ){
	if( path=="" ) return "";
//${TEXTFILES_BEGIN}
		else if( path=="psystem.xml" ) return "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\r\n<psystem>\r\n\t<groups>\r\n\t\t<group Name=\"group1\" MaxParticles=\"5000\">\r\n\t\t\t<constantforce Name=\"gravity\" X=\"0\" Y=\"0\" Enabled=\"true\" />\r\n\t\t</group>\r\n\t\t\r\n\t\t<group Name=\"group2\" MaxParticles=\"5000\">\r\n\t\t\t<constantforce Name=\"gravity\" X=\"0\" Y=\"0\" Enabled=\"true\" />\r\n\t\t</group>\r\n\t\t\r\n\t</groups>\r\n\t<emitters>\r\n\t\t<emitter Name=\"emit1\"\r\n\t\t\t\tGroup=\"group1\"\r\n\t\t\t\tStartRed=\"100\" EndRed=\"255\"\r\n\t\t\t\tStartGreen=\"100\" EndGreen=\"255\"\r\n\t\t\t\tStartBlue=\"100\" EndBlue=\"255\"\r\n\t\t\t\tLife=\"2\"\r\n\t\t\t\tLifeSpread=\"1.5\"\r\n\t\t\t\tAlphaInterpolationTime=\"0.5\"\r\n\t\t\t\tParticleImage=\"speck\"\r\n\t\t\t\tScale=\"1.5\"\r\n\t\t\t\tScaleSpread=\"2\"\r\n\t\t\t\tPolarVelocityAngle=\"0\"\r\n\t\t\t\tPolarVelocityAngleSpread=\"360\"\r\n\t\t\t\tPolarVelocityAmplitude=\"20\"\r\n\t\t\t\tPolarVelocityAmplitudeSpread=\"30\" />\r\n\r\n\t\t<emitter Name=\"emit2\"\r\n\t\t\t\tGroup=\"group2\"\r\n\t\t\t\tStartRed=\"255\" EndRed=\"255\"\r\n\t\t\t\tStartGreen=\"0\" EndGreen=\"255\"\r\n\t\t\t\tStartBlue=\"0\" EndBlue=\"0\"\r\n\t\t\t\tLife=\"0.5\"\r\n\t\t\t\tLifeSpread=\"0.5\"\r\n\t\t\t\tAlphaInterpolationTime=\"0.5\"\r\n\t\t\t\tParticleImage=\"speck\"\r\n\t\t\t\tScale=\"1.5\"\r\n"+
"\t\t\t\tScaleSpread=\"2\"\r\n\t\t\t\tPolarVelocityAngle=\"0\"\r\n\t\t\t\tPolarVelocityAngleSpread=\"360\"\r\n\t\t\t\tPolarVelocityAmplitude=\"40\"\r\n\t\t\t\tPolarVelocityAmplitudeSpread=\"50\" />\r\n\r\n\t</emitters>\r\n</psystem>\r\n";
		else if( path=="worlds/World1.txt" ) return "[Background Image]\r\ngraphics/bg1.png\r\n\r\n[Spawn Points]\r\n160, 160, 45\r\n800, 530, 45\r\n760, 150, 45\r\n\r\n[Background Tiles]\r\n 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17\r\n 17, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0, 68, 69, 70,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0, 84, 85, 86,  0,  0,  1,  2,  2,  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, "+
" 4,  5, 13,  9,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  7,  8,  9,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  2, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  5, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  5, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 19, 20, 21,  0, 71, 72, 73,  0,  0,  0,  0,  0,  7,  8, 12, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 35, 36, 37,  0, 87, 88, 89,  0,  0,  0,  0,  0,  0,  0,  7, 17\r\n 17,  0,  0,  0,  0, 22, 23, 24,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, "+
" 0, 17\r\n 17,  0,  0,  0,  0, 38, 39, 40,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34\r\n\r\n[Foreground Tiles]\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  "+
"0,  0,  0, 52, 53, 54,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0, 68, 69, 70,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 55, 56, 5"+
"7,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 71, 72, 73,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,  0\r\n 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34";
		else if( path=="worlds/World2.txt" ) return "[Background Image]\r\ngraphics/bg2.png\r\n\r\n[Spawn Points]\r\n160, 160\r\n800, 530\r\n760, 150\r\n\r\n[Background Tiles]\r\n 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17\r\n 17, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17\r\n 17,  5, 13,  9,  0,  0,  0,  0, 68, 69, 70,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  5,  6,  0,  0,  0,  0,  0, 84, 85, 86,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  8,  9,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 74, 75, 76,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, "+
" 0,  0,  0, 90, 91, 92,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 71, 72, 73,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  0,  0,  0,  0,  0, 87, 88, 89,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5, 11,  2,  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  5,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  5,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17, 65, 66, 67,  0,  0,  0,  0,  0,  0,  7,  8,  8,  8,  9,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17, 81, 82, 83,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 17,"+
"  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  7,  8,  9,  0,  0,  0,  0, 17\r\n 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17\r\n 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34\r\n\r\n[Foreground Tiles]\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0, 52, 53, 54,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0, 68, 69, 70,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  "+
"0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 58, 59, 60,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 74, 75, 76,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 55, 56, 57,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 71, 72, 73,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0, 49, 50, 51,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  "+
"0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0\r\n  0, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,  0\r\n 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34";
		return "";

//${TEXTFILES_END}
}

function loadImage( path,onloadfun ){
	var ty=getMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;

	var image=new Image();
	
	image.meta_width=parseInt( getMetaData( path,"width" ) );
	image.meta_height=parseInt( getMetaData( path,"height" ) );
	image.onload=onloadfun;
	image.src="data/"+path;
	
	return image;
}

function loadAudio( path ){
	var audio=new Audio( "data/"+path );
	return audio;
}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	var str="";
	push_err();
	err_stack.reverse();
	for( var i=0;i<err_stack.length;++i ){
		str+=err_stack[i]+"\n";
	}
	err_stack.reverse();
	pop_err();
	return str;
}

function print( str ){
	if( game_console ){
		game_console.value+=str+"\n";
	}
	if( window.console!=undefined ){
		window.console.log( str );
	}
}

function showError( err ){
	if( err.length ) alert( "Monkey runtime error: "+err+"\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_array( arr,index ){
	if( index>=0 && index<arr.length ) return arr;
	error( "Array index out of range" );
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_starts_with( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_ends_with( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

var dead=false;

var KEY_LMB=1;
var KEY_RMB=2;
var KEY_MMB=3;
var KEY_TOUCH0=0x180;

function eatEvent( e ){
	if( e.stopPropagation ){
		e.stopPropagation();
		e.preventDefault();
	}else{
		e.cancelBubble=true;
		e.returnValue=false;
	}
}

function keyToChar( key ){
	switch( key ){
	case 8:
	case 9:
	case 13:
	case 27:
	case 32:
		return key;
	case 33:
	case 34:
	case 35:
	case 36:
	case 37:
	case 38:
	case 39:
	case 40:
	case 45:
		return key | 0x10000;
	case 46:
		return 127;
	}
	return 0;
}

//***** gxtkApp class *****

function gxtkApp(){

	this.graphics=new gxtkGraphics( this,game_canvas );
	this.input=new gxtkInput( this );
	this.audio=new gxtkAudio( this );

	this.loading=0;
	this.maxloading=0;

	this.updateRate=0;
	
	this.startMillis=(new Date).getTime();
	
	this.suspended=false;
	
	var app=this;
	var canvas=game_canvas;
	
	function gxtkMain(){
		canvas.onkeydown=function( e ){
			app.input.OnKeyDown( e.keyCode );
			var chr=keyToChar( e.keyCode );
			if( chr ) app.input.PutChar( chr );
			if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
		}

		canvas.onkeyup=function( e ){
			app.input.OnKeyUp( e.keyCode );
		}

		canvas.onkeypress=function( e ){
			if( e.charCode ){
				app.input.PutChar( e.charCode );
			}else if( e.which ){
				app.input.PutChar( e.which );
			}
		}

		canvas.onmousedown=function( e ){
			switch( e.button ){
			case 0:app.input.OnKeyDown( KEY_LMB );break;
			case 1:app.input.OnKeyDown( KEY_MMB );break;
			case 2:app.input.OnKeyDown( KEY_RMB );break;
			}
			eatEvent( e );
		}
		
		canvas.onmouseup=function( e ){
			switch( e.button ){
			case 0:app.input.OnKeyUp( KEY_LMB );break;
			case 1:app.input.OnKeyUp( KEY_MMB );break;
			case 2:app.input.OnKeyUp( KEY_RMB );break;
			}
			eatEvent( e );
		}
		
		canvas.onmouseout=function( e ){
			app.input.OnKeyUp( KEY_LMB );
			app.input.OnKeyUp( KEY_MMB );
			app.input.OnKeyUp( KEY_RMB );
			eatEvent( e );
		}

		canvas.onmousemove=function( e ){
			var x=e.clientX+document.body.scrollLeft;
			var y=e.clientY+document.body.scrollTop;
			var c=canvas;
			while( c ){
				x-=c.offsetLeft;
				y-=c.offsetTop;
				c=c.offsetParent;
			}
			app.input.OnMouseMove( x,y );
			eatEvent( e );
		}

		canvas.onfocus=function( e ){
			//app.InvokeOnResume();
		}
		
		canvas.onblur=function( e ){
			//app.InvokeOnSuspend();
		}

		canvas.focus();

		app.InvokeOnCreate();
		app.InvokeOnRender();
	}
	
	game_runner=gxtkMain;
}

var timerSeq=0;

gxtkApp.prototype.SetFrameRate=function( fps ){

	var seq=++timerSeq;
	
	if( !fps ) return;
	
	var app=this;
	var updatePeriod=1000.0/fps;
	var nextUpdate=(new Date).getTime()+updatePeriod;
	
	function timeElapsed(){
		if( seq!=timerSeq ) return;

		var time;		
		var updates=0;

		for(;;){
			nextUpdate+=updatePeriod;

			app.InvokeOnUpdate();
			if( seq!=timerSeq ) return;
			
			if( nextUpdate>(new Date).getTime() ) break;
			
			if( ++updates==7 ){
				nextUpdate=(new Date).getTime();
				break;
			}
		}
		app.InvokeOnRender();
		if( seq!=timerSeq ) return;
			
		var delay=nextUpdate-(new Date).getTime();
		setTimeout( timeElapsed,delay>0 ? delay : 0 );
	}
	
	setTimeout( timeElapsed,updatePeriod );
}

gxtkApp.prototype.IncLoading=function(){
	++this.loading;
	if( this.loading>this.maxloading ) this.maxloading=this.loading;
	if( this.loading==1 ) this.SetFrameRate( 0 );
}

gxtkApp.prototype.DecLoading=function(){
	--this.loading;
	if( this.loading!=0 ) return;
	this.maxloading=0;
	this.SetFrameRate( this.updateRate );
}

gxtkApp.prototype.GetMetaData=function( path,key ){
	return getMetaData( path,key );
}

gxtkApp.prototype.Die=function( err ){
	dead=true;
	this.audio.OnSuspend();
	showError( err );
}

gxtkApp.prototype.InvokeOnCreate=function(){
	if( dead ) return;
	
	try{
		this.OnCreate();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnUpdate=function(){
	if( dead || this.suspended || !this.updateRate || this.loading ) return;
	
	try{
		this.input.BeginUpdate();
		this.OnUpdate();		
		this.input.EndUpdate();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnSuspend=function(){
	if( dead || this.suspended ) return;
	
	try{
		this.suspended=true;
		this.OnSuspend();
		this.audio.OnSuspend();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnResume=function(){
	if( dead || !this.suspended ) return;
	
	try{
		this.audio.OnResume();
		this.OnResume();
		this.suspended=false;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnRender=function(){
	if( dead || this.suspended ) return;
	
	try{
		this.graphics.BeginRender();
		if( this.loading ){
			this.OnLoading();
		}else{
			this.OnRender();
		}
		this.graphics.EndRender();
	}catch( ex ){
		this.Die( ex );
	}
}

//***** GXTK API *****

gxtkApp.prototype.GraphicsDevice=function(){
	return this.graphics;
}

gxtkApp.prototype.InputDevice=function(){
	return this.input;
}

gxtkApp.prototype.AudioDevice=function(){
	return this.audio;
}

gxtkApp.prototype.AppTitle=function(){
	return document.URL;
}

gxtkApp.prototype.LoadState=function(){
	//use cookies for file:// URLS in FF and IE...
	if( document.URL.toLowerCase().substr(0,7)=="file://" &&
			(navigator.userAgent.indexOf( "Firefox" )!=-1 || navigator.userAgent.indexOf( "MSIE" )!=-1) ){
		var bits=document.cookie.split( ";" )
		if( bits.length!=1 ) return "";
		bits=bits[0].split( "=" );
		if( bits.length!=2 || bits[0]!=".mojostate" ) return "";
		return unescape( bits[1] );
	}else{
		var state=localStorage.getItem( ".mojostate@"+document.URL );
		if( state ) return state;
	}
	return "";
}

gxtkApp.prototype.SaveState=function( state ){
	//use cookies for file:// URLS in FF and IE...
	if( document.URL.toLowerCase().substr(0,7)=="file://" &&
			(navigator.userAgent.indexOf( "Firefox" )!=-1 || navigator.userAgent.indexOf( "MSIE" )!=-1) ){
		var exdate=new Date();
		exdate.setDate( exdate.getDate()+3650 );
		document.cookie=".mojostate="+escape( state )+"; expires="+exdate.toUTCString()
	}else{
		localStorage.setItem( ".mojostate@"+document.URL,state );
	}
}

gxtkApp.prototype.LoadString=function( path ){
	return loadString( path );
}

gxtkApp.prototype.SetUpdateRate=function( fps ){
	this.updateRate=fps;
	
	if( !this.loading ) this.SetFrameRate( fps );
}

gxtkApp.prototype.MilliSecs=function(){
	return ((new Date).getTime()-this.startMillis)|0;
}

gxtkApp.prototype.Loading=function(){
	return this.loading;
}

gxtkApp.prototype.OnCreate=function(){
}

gxtkApp.prototype.OnUpdate=function(){
}

gxtkApp.prototype.OnSuspend=function(){
}

gxtkApp.prototype.OnResume=function(){
}

gxtkApp.prototype.OnRender=function(){
}

gxtkApp.prototype.OnLoading=function(){
}

//***** gxtkGraphics class *****

function gxtkGraphics( app,canvas ){
	this.app=app;
	this.canvas=canvas;
	this.gc=canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1.0;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.gc.save();
}

gxtkGraphics.prototype.EndRender=function(){
	this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.canvas.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.canvas.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	
	var app=this.app;
	
	function onloadfun(){
		app.DecLoading();
	}

	app.IncLoading();

	var image=loadImage( path,onloadfun );
	if( image ) return new gxtkSurface( image,this );

	app.DecLoading();
	return null;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<6 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tgc=this.tmpCanvas.getContext( "2d" );
	
	tgc.globalCompositeOperation="copy";

	tgc.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tgc.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tgc.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

//***** Class gxtkInput *****

function gxtkInput( app ){
	this.app=app;
	this.keyStates=new Array( 512 );
	this.charQueue=new Array( 32 );
	this.charPut=0;
	this.charGet=0;
	this.mouseX=0;
	this.mouseY=0;
	this.joyX=0;
	this.joyY=0;
	this.joyZ=0;
	this.accelX=0;
	this.accelY=0;
	this.accelZ=0;
	for( var i=0;i<512;++i ){
		this.keyStates[i]=0;
	}
}

gxtkInput.prototype.BeginUpdate=function(){
}

gxtkInput.prototype.EndUpdate=function(){
	for( var i=0;i<512;++i ){
		this.keyStates[i]&=0x100;
	}
	this.charGet=0;
	this.charPut=0;
}

gxtkInput.prototype.OnKeyDown=function( key ){
	if( (this.keyStates[key]&0x100)==0 ){
		this.keyStates[key]|=0x100;
		++this.keyStates[key];	
	}
}

gxtkInput.prototype.OnKeyUp=function( key ){
	this.keyStates[key]&=0xff;
}

gxtkInput.prototype.PutChar=function( char ){
	if( this.charPut-this.charGet<32 ){
		this.charQueue[this.charPut & 31]=char;
		this.charPut+=1;
	}
}

gxtkInput.prototype.OnMouseMove=function( x,y ){
	this.mouseX=x;
	this.mouseY=y;
}

//***** GXTK API *****

gxtkInput.prototype.SetKeyboardEnabled=function( enabled ){
	return 0;
}

gxtkInput.prototype.KeyDown=function( key ){
	if( key>0 && key<512 ){
		if( key==KEY_TOUCH0 ) key=KEY_LMB;
		return this.keyStates[key] >> 8;
	}
	return 0;
}

gxtkInput.prototype.KeyHit=function( key ){
	if( key>0 && key<512 ){
		if( key==KEY_TOUCH0 ) key=KEY_LMB;
		return this.keyStates[key] & 0xff;
	}
	return 0;
}

gxtkInput.prototype.GetChar=function(){
	if( this.charPut!=this.charGet ){
		var char=this.charQueue[this.charGet & 31];
		this.charGet+=1;
		return char;
	}
	return 0;
}

gxtkInput.prototype.MouseX=function(){
	return this.mouseX;
}

gxtkInput.prototype.MouseY=function(){
	return this.mouseY;
}

gxtkInput.prototype.JoyX=function( index ){
	return this.joyX;
}

gxtkInput.prototype.JoyY=function( index ){
	return this.joyY;
}

gxtkInput.prototype.JoyZ=function( index ){
	return this.joyZ;
}

gxtkInput.prototype.TouchX=function( index ){
	return this.mouseX;
}

gxtkInput.prototype.TouchY=function( index ){
	return this.mouseY;
}

gxtkInput.prototype.AccelX=function(){
	return 0;
}

gxtkInput.prototype.AccelY=function(){
	return 0;
}

gxtkInput.prototype.AccelZ=function(){
	return 0;
}


//***** gxtkChannel class *****
function gxtkChannel(){
	this.audio=null;
	this.sample=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
}

//***** gxtkAudio class *****
function gxtkAudio( app ){
	this.app=app;
	this.okay=typeof(Audio)!="undefined";
	this.nextchan=0;
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
	}
}

gxtkAudio.prototype.OnSuspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.audio ) chan.audio.pause();
	}
}

gxtkAudio.prototype.OnResume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.audio ) chan.audio.play();
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	var audio=loadAudio( path );
	if( audio ) return new gxtkSample( audio );
	return null;
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];
	
	if( chan.sample==sample && chan.audio ){	//&& !chan.audio.paused ){
		chan.audio.loop=(flags&1)!=0;
		chan.audio.volume=chan.volume;
		try{
			chan.audio.currentTime=0;
		}catch(ex){
		}
		chan.audio.play();
		return;
	}

	if( chan.audio ) chan.audio.pause();
	
	var audio=sample.AllocAudio();
	
	if( audio ){
		for( var i=0;i<33;++i ){
			if( this.channels[i].audio==audio ){
				this.channels[i].audio=null;
				break;
			}
		}
		audio.loop=(flags&1)!=0;
		audio.volume=chan.volume;
		audio.play();
	}
	
	chan.audio=audio;
	chan.sample=sample;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	if( chan.audio ) chan.audio.pause();
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.audio && !chan.audio.paused && !chan.audio.ended ) return 1;
	return 0;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.audio ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.MusicState=function(){

	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){

	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.insts=new Array( 8 );
	this.insts[0]=audio;
}

gxtkSample.prototype.Discard=function(){
	if( this.audio ){
		this.audio=null;
		for( var i=0;i<8;++i ){
			this.insts[i]=null;
		}
	}
}

gxtkSample.prototype.AllocAudio=function(){
	for( var i=0;i<8;++i ){
		var audio=this.insts[i];
		if( audio ){
			//Ok, this is ugly but seems to work best...no idea how/why!
			if( audio.paused ){
				if( audio.currentTime==0 ) return audio;
				audio.currentTime=0;
			}else if( audio.ended ){
				audio.pause();
			}
		}else{
			audio=new Audio( this.audio.src );
			this.insts[i]=audio;
			return audio;
		}
	}
	return null;
}
var diddy = new Object();

diddy.systemMillisecs=function(){
	return new Date().getTime();
};

diddy.flushKeys=function(){
	for( var i = 0; i < 512; ++i )
	{
		bb_input_device.keyStates[i]=0;
	}
};

diddy.getUpdateRate=function(){
	return bb_app_device.updateRate;
};

diddy.showMouse=function()
{
	document.getElementById("GameCanvas").style.cursor='default';
}
diddy.setGraphics=function(w, h)
{
	var canvas=document.getElementById( "GameCanvas" );
	canvas.width  = w;
	canvas.height = h;
	//return window.innerHeight;
}
diddy.setMouse=function(x, y)
{
}
diddy.showKeyboard=function()
{
}
diddy.launchBrowser=function(address)
{
	window.open(address);
}
diddy.launchEmail=function(email, subject, text)
{
	location.href="mailto:"+email+"&subject="+subject+"&body="+text+"";
}

diddy.realMod=function(value, amount)
{
	return value % amount;
}
diddy.startVibrate=function(millisecs)
{
}
diddy.stopVibrate=function()
{
}

diddy.getDayOfMonth=function(){
	return new Date().getDate();
}

diddy.getDayOfWeek=function(){
	return new Date().getDay()+1;
}

diddy.getMonth=function(){
	return new Date().getMonth()+1;
}

diddy.getYear=function(){
	return new Date().getFullYear();
}

diddy.getHours=function(){
	return new Date().getHours();
}

diddy.getMinutes=function(){
	return new Date().getMinutes();
}

diddy.getSeconds=function(){
	return new Date().getSeconds();
}

diddy.getMilliSeconds=function(){
	return new Date().getMilliseconds();
}

diddy.startGps=function(){

}
diddy.getLatitiude=function(){
	return ""
}
diddy.getLongitude=function(){
	return ""
}
diddy.showAlertDialog=function(title, message)
{
}
diddy.getInputString=function()
{
	return "";
}
// Browser detect from http://www.quirksmode.org/js/detect.html
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

diddy.getBrowserName=function(){
	return BrowserDetect.browser;
};

diddy.getBrowserVersion=function(){
	return BrowserDetect.version;
};

diddy.getBrowserOS=function(){
	return BrowserDetect.OS;
};


diddy.hideMouse=function()
{
	document.getElementById("GameCanvas").style.cursor= "url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
}
function bb_app_App(){
	Object.call(this);
}
function bb_app_new(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<109>";
	bb_app_device=bb_app_new2.call(new bb_app_AppDevice,this);
	pop_err();
	return this;
}
bb_app_App.prototype.bbm_OnCreate=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.bbm_OnUpdate=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.bbm_OnSuspend=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.bbm_OnResume=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.bbm_OnRender=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.bbm_OnLoading=function(){
	push_err();
	pop_err();
	return 0;
}
function bb_framework_DiddyApp(){
	bb_app_App.call(this);
	this.bb_exitScreen=null;
	this.bb_screenFade=null;
	this.bb_images=null;
	this.bb_sounds=null;
	this.bb_inputCache=null;
	this.bb_virtualResOn=true;
	this.bb_mouseX=0;
	this.bb_mouseY=0;
	this.bb_FPS=60;
	this.bb_useFixedRateLogic=false;
	this.bb_frameRate=200.0;
	this.bb_ms=0.0;
	this.bb_numTicks=.0;
	this.bb_lastNumTicks=.0;
	this.bb_lastTime=.0;
	this.bb_currentScreen=null;
	this.bb_debugOn=false;
	this.bb_musicFile="";
	this.bb_musicOkay=0;
	this.bb_musicVolume=100;
	this.bb_mojoMusicVolume=1.0;
	this.bb_soundVolume=100;
	this.bb_drawFPSOn=false;
	this.bb_tmpMs=.0;
	this.bb_maxMs=50;
	this.bb_debugKeyOn=false;
	this.bb_debugKey=112;
	this.bb_mouseHit=0;
	this.bb_nextScreen=null;
}
bb_framework_DiddyApp.prototype=extend_class(bb_app_App);
function bb_framework_new(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<85>";
	bb_app_new.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<86>";
	dbg_object(this).bb_exitScreen=bb_framework_new3.call(new bb_framework_ExitScreen);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<87>";
	dbg_object(this).bb_screenFade=bb_framework_new4.call(new bb_framework_ScreenFade);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<88>";
	dbg_object(this).bb_images=bb_framework_new6.call(new bb_framework_ImageBank);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<89>";
	dbg_object(this).bb_sounds=bb_framework_new8.call(new bb_framework_SoundBank);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<90>";
	dbg_object(this).bb_inputCache=bb_inputcache_new.call(new bb_inputcache_InputCache);
	pop_err();
	return this;
}
bb_framework_DiddyApp.prototype.bbm_SetScreenSize=function(bbt_w,bbt_h){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<122>";
	bb_framework_SCREEN_WIDTH=bbt_w;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<123>";
	bb_framework_SCREEN_HEIGHT=bbt_h;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<124>";
	bb_framework_SCREEN_WIDTH2=bb_framework_SCREEN_WIDTH/2.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<125>";
	bb_framework_SCREEN_HEIGHT2=bb_framework_SCREEN_HEIGHT/2.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<127>";
	bb_framework_SCREENX_RATIO=(bb_framework_DEVICE_WIDTH)/bb_framework_SCREEN_WIDTH;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<128>";
	bb_framework_SCREENY_RATIO=(bb_framework_DEVICE_HEIGHT)/bb_framework_SCREEN_HEIGHT;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<130>";
	if(bb_framework_SCREENX_RATIO!=1.0 || bb_framework_SCREENY_RATIO!=1.0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<131>";
		this.bb_virtualResOn=true;
	}
	pop_err();
}
bb_framework_DiddyApp.prototype.bbm_ResetFixedRateLogic=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<301>";
	this.bb_ms=1000.0/this.bb_frameRate;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<302>";
	this.bb_numTicks=0.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<303>";
	this.bb_lastNumTicks=1.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<304>";
	this.bb_lastTime=(bb_app_Millisecs());
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<305>";
	if(bb_framework_dt!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<306>";
		dbg_object(bb_framework_dt).bb_delta=1.0;
	}
	pop_err();
}
bb_framework_DiddyApp.prototype.bbm_OnCreate=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<95>";
	bb_framework_DEVICE_WIDTH=bb_graphics_DeviceWidth();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<96>";
	bb_framework_DEVICE_HEIGHT=bb_graphics_DeviceHeight();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<98>";
	this.bbm_SetScreenSize((bb_framework_DEVICE_WIDTH),(bb_framework_DEVICE_HEIGHT));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<101>";
	this.bb_mouseX=((bb_input_MouseX()/bb_framework_SCREENX_RATIO)|0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<102>";
	this.bb_mouseY=((bb_input_MouseY()/bb_framework_SCREENY_RATIO)|0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<105>";
	bb_random_Seed=diddy.systemMillisecs();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<107>";
	bb_framework_dt=bb_framework_new9.call(new bb_framework_DeltaTimer,(this.bb_FPS));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<109>";
	bb_app_SetUpdateRate(this.bb_FPS);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<112>";
	bb_framework_Cache();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<115>";
	if(this.bb_useFixedRateLogic){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<116>";
		this.bbm_ResetFixedRateLogic();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<118>";
	pop_err();
	return 0;
}
bb_framework_DiddyApp.prototype.bbm_DrawDebug=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<213>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<214>";
	bb_framework_Draw(0,0,0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<215>";
	var bbt_y=10;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<216>";
	var bbt_gap=10;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<217>";
	bb_graphics_DrawText("Screen             = "+dbg_object(this.bb_currentScreen).bb_name,0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<218>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<219>";
	bb_graphics_DrawText("Delta              = "+bb_functions_FormatNumber(dbg_object(bb_framework_dt).bb_delta,2,0,0),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<220>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<221>";
	bb_graphics_DrawText("Frame Time         = "+String(dbg_object(bb_framework_dt).bb_frametime),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<222>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<223>";
	bb_graphics_DrawText("Screen Width       = "+String(bb_framework_SCREEN_WIDTH),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<224>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<225>";
	bb_graphics_DrawText("Screen Height      = "+String(bb_framework_SCREEN_HEIGHT),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<226>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<227>";
	bb_graphics_DrawText("VMouseX            = "+String(dbg_object(this).bb_mouseX),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<228>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<229>";
	bb_graphics_DrawText("VMouseY            = "+String(dbg_object(this).bb_mouseY),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<230>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<231>";
	bb_graphics_DrawText("MouseX             = "+String(bb_input_MouseX()),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<232>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<233>";
	bb_graphics_DrawText("MouseY             = "+String(bb_input_MouseY()),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<234>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<235>";
	bb_graphics_DrawText("Music File         = "+this.bb_musicFile,0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<236>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<237>";
	bb_graphics_DrawText("MusicOkay          = "+String(this.bb_musicOkay),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<238>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<239>";
	bb_graphics_DrawText("Music State        = "+String(bb_audio_MusicState()),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<240>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<241>";
	bb_graphics_DrawText("Music Volume       = "+String(dbg_object(this).bb_musicVolume),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<242>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<243>";
	bb_graphics_DrawText("Mojo Music Volume  = "+String(dbg_object(this).bb_mojoMusicVolume),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<244>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<245>";
	bb_graphics_DrawText("Sound Volume       = "+String(dbg_object(this).bb_soundVolume),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<246>";
	bbt_y+=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<247>";
	bb_graphics_DrawText("Sound Channel      = "+String(bb_framework_channel),0.0,(bbt_y),0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<248>";
	bbt_y+=bbt_gap;
	pop_err();
}
bb_framework_DiddyApp.prototype.bbm_DrawFPS=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<252>";
	bb_graphics_DrawText(String(bb_framework_totalFPS),0.0,0.0,0.0,0.0);
	pop_err();
}
bb_framework_DiddyApp.prototype.bbm_OnRender=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<136>";
	bb_framework_Update();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<137>";
	if(this.bb_virtualResOn){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<138>";
		bb_graphics_PushMatrix();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<139>";
		bb_graphics_Scale(bb_framework_SCREENX_RATIO,bb_framework_SCREENY_RATIO);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<141>";
	this.bb_currentScreen.bbm_Render();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<142>";
	if(this.bb_virtualResOn){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<143>";
		bb_graphics_PopMatrix();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<145>";
	this.bb_currentScreen.bbm_ExtraRender();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<146>";
	if(dbg_object(this.bb_screenFade).bb_active){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<146>";
		this.bb_screenFade.bbm_Render();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<147>";
	this.bb_currentScreen.bbm_DebugRender();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<148>";
	if(this.bb_debugOn){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<149>";
		this.bbm_DrawDebug();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<151>";
	if(this.bb_drawFPSOn){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<152>";
		this.bbm_DrawFPS();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<154>";
	pop_err();
	return 0;
}
bb_framework_DiddyApp.prototype.bbm_OverrideUpdate=function(){
	push_err();
	pop_err();
}
bb_framework_DiddyApp.prototype.bbm_SetMojoMusicVolume=function(bbt_volume){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<272>";
	if(bbt_volume<0.0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<272>";
		bbt_volume=0.0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<273>";
	if(bbt_volume>1.0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<273>";
		bbt_volume=1.0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<274>";
	this.bb_mojoMusicVolume=bbt_volume;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<275>";
	bb_audio_SetMusicVolume(this.bb_mojoMusicVolume);
	pop_err();
}
bb_framework_DiddyApp.prototype.bbm_Update=function(bbt_fixedRateLogicDelta){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<191>";
	bb_framework_dt.bbm_UpdateDelta();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<192>";
	if(this.bb_useFixedRateLogic){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<193>";
		dbg_object(bb_framework_dt).bb_delta=bbt_fixedRateLogicDelta;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<195>";
	this.bb_inputCache.bbm_ReadInput();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<196>";
	this.bb_inputCache.bbm_HandleEvents(this.bb_currentScreen);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<198>";
	if(this.bb_debugKeyOn){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<199>";
		if((bb_input_KeyHit(this.bb_debugKey))!=0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<200>";
			this.bb_debugOn=!this.bb_debugOn;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<204>";
	this.bb_mouseX=((bb_input_MouseX()/bb_framework_SCREENX_RATIO)|0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<205>";
	this.bb_mouseY=((bb_input_MouseY()/bb_framework_SCREENY_RATIO)|0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<206>";
	this.bb_mouseHit=bb_input_MouseHit(0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<208>";
	if(dbg_object(this.bb_screenFade).bb_active){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<208>";
		this.bb_screenFade.bbm_Update2();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<209>";
	this.bb_currentScreen.bbm_Update2();
	pop_err();
}
bb_framework_DiddyApp.prototype.bbm_OnUpdate=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<158>";
	this.bbm_OverrideUpdate();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<159>";
	if(this.bb_useFixedRateLogic){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<160>";
		var bbt_now=bb_app_Millisecs();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<161>";
		if((bbt_now)<this.bb_lastTime){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<162>";
			this.bb_numTicks=this.bb_lastNumTicks;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<164>";
			this.bb_tmpMs=(bbt_now)-this.bb_lastTime;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<165>";
			if(this.bb_tmpMs>(this.bb_maxMs)){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<165>";
				this.bb_tmpMs=(this.bb_maxMs);
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<166>";
			this.bb_numTicks=this.bb_tmpMs/this.bb_ms;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<169>";
		this.bb_lastTime=(bbt_now);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<170>";
		this.bb_lastNumTicks=this.bb_numTicks;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<171>";
		for(var bbt_i=1;(bbt_i)<=Math.floor(this.bb_numTicks);bbt_i=bbt_i+1){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<172>";
			this.bbm_Update(1.0);
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<176>";
		var bbt_re=diddy.realMod(this.bb_numTicks,1.0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<177>";
		if(bbt_re>0.0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<178>";
			this.bbm_Update(bbt_re);
		}
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<181>";
		this.bbm_Update(0.0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<184>";
	pop_err();
	return 0;
}
function bb_itanks_iTanks(){
	bb_framework_DiddyApp.call(this);
}
bb_itanks_iTanks.prototype=extend_class(bb_framework_DiddyApp);
function bb_itanks_new(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<12>";
	bb_framework_new.call(this);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<12>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_itanks_iTanks.prototype.bbm_OnCreate=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<15>";
	bb_framework_DiddyApp.prototype.bbm_OnCreate.call(this);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<16>";
	this.bb_drawFPSOn=false;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<18>";
	bb_globals_gTitleScreen=bb_screens_new.call(new bb_screens_TitleScreen);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<19>";
	bb_globals_gCreditsScreen=bb_screens_new2.call(new bb_screens_BackgroundScreen,"graphics/CreditsScreen.png");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<20>";
	bb_globals_gHelpScreen=bb_screens_new2.call(new bb_screens_BackgroundScreen,"graphics/howToPlay.png");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<21>";
	bb_globals_gGameScreen=bb_game_screen_new.call(new bb_game_screen_GameScreen);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<23>";
	var bbt_tmpImage=null;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<24>";
	this.bb_images.bbm_Load2("Projectile.png","",true,false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<25>";
	this.bb_images.bbm_LoadAnim2("TankBase.png",64,64,16,bbt_tmpImage,true,false,"");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<26>";
	this.bb_images.bbm_LoadAnim2("TankExplode.png",64,64,1,bbt_tmpImage,true,false,"");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<27>";
	this.bb_images.bbm_LoadAnim2("Weapon.png",64,64,16,bbt_tmpImage,true,false,"");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<28>";
	this.bb_images.bbm_LoadAnim2("TankBaseBlue.png",64,64,16,bbt_tmpImage,true,false,"");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<29>";
	this.bb_images.bbm_LoadAnim2("TankExplodeBlue.png",64,64,1,bbt_tmpImage,true,false,"");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<30>";
	this.bb_images.bbm_LoadAnim2("WeaponBlue.png",64,64,16,bbt_tmpImage,true,false,"");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<31>";
	this.bb_images.bbm_Load2("Health.png","",true,false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<32>";
	this.bb_images.bbm_Load2("HealthBG.png","",true,false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<34>";
	this.bb_images.bbm_Load2("Win.png","",true,false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<35>";
	this.bb_images.bbm_Load2("Fail.png","",true,false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<37>";
	this.bb_sounds.bbm_Load4("bounce","",false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<38>";
	this.bb_sounds.bbm_Load4("shoot","",false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<39>";
	this.bb_sounds.bbm_Load4("explosion","",false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<40>";
	this.bb_sounds.bbm_Load4("tankExplosion","",false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<42>";
	bb_globals_gTitleScreen.bbm_PreStart();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<43>";
	pop_err();
	return 0;
}
function bb_app_AppDevice(){
	gxtkApp.call(this);
	this.bb_app=null;
	this.bb_updateRate=0;
}
bb_app_AppDevice.prototype=extend_class(gxtkApp);
function bb_app_new2(bbt_app){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<47>";
	dbg_object(this).bb_app=bbt_app;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<48>";
	bb_graphics_SetGraphicsContext(bb_graphics_new.call(new bb_graphics_GraphicsContext,this.GraphicsDevice()));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<49>";
	bb_input_SetInputDevice(this.InputDevice());
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<50>";
	bb_audio_SetAudioDevice(this.AudioDevice());
	pop_err();
	return this;
}
function bb_app_new3(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<44>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_app_AppDevice.prototype.OnCreate=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<54>";
	bb_graphics_SetFont(null,32);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<55>";
	var bbt_=this.bb_app.bbm_OnCreate();
	pop_err();
	return bbt_;
}
bb_app_AppDevice.prototype.OnUpdate=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<59>";
	var bbt_=this.bb_app.bbm_OnUpdate();
	pop_err();
	return bbt_;
}
bb_app_AppDevice.prototype.OnSuspend=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<63>";
	var bbt_=this.bb_app.bbm_OnSuspend();
	pop_err();
	return bbt_;
}
bb_app_AppDevice.prototype.OnResume=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<67>";
	var bbt_=this.bb_app.bbm_OnResume();
	pop_err();
	return bbt_;
}
bb_app_AppDevice.prototype.OnRender=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<71>";
	bb_graphics_BeginRender();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<72>";
	var bbt_r=this.bb_app.bbm_OnRender();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<73>";
	bb_graphics_EndRender();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<74>";
	pop_err();
	return bbt_r;
}
bb_app_AppDevice.prototype.OnLoading=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<78>";
	bb_graphics_BeginRender();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<79>";
	var bbt_r=this.bb_app.bbm_OnLoading();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<80>";
	bb_graphics_EndRender();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<81>";
	pop_err();
	return bbt_r;
}
bb_app_AppDevice.prototype.SetUpdateRate=function(bbt_hertz){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<85>";
	gxtkApp.prototype.SetUpdateRate.call(this,bbt_hertz);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<86>";
	this.bb_updateRate=bbt_hertz;
	pop_err();
	return 0;
}
function bb_graphics_GraphicsContext(){
	Object.call(this);
	this.bb_device=null;
	this.bb_defaultFont=null;
	this.bb_font=null;
	this.bb_firstChar=0;
	this.bb_matrixSp=0;
	this.bb_ix=1.0;
	this.bb_iy=.0;
	this.bb_jx=.0;
	this.bb_jy=1.0;
	this.bb_tx=.0;
	this.bb_ty=.0;
	this.bb_tformed=0;
	this.bb_matDirty=0;
	this.bb_color_r=.0;
	this.bb_color_g=.0;
	this.bb_color_b=.0;
	this.bb_alpha=.0;
	this.bb_blend=0;
	this.bb_scissor_x=.0;
	this.bb_scissor_y=.0;
	this.bb_scissor_width=.0;
	this.bb_scissor_height=.0;
	this.bb_matrixStack=new_number_array(192);
}
function bb_graphics_new(bbt_device){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<207>";
	dbg_object(this).bb_device=bbt_device;
	pop_err();
	return this;
}
function bb_graphics_new2(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<204>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
var bb_graphics_context;
function bb_graphics_SetGraphicsContext(bbt_gc){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<246>";
	bb_graphics_context=bbt_gc;
	pop_err();
	return 0;
}
var bb_input_device;
function bb_input_SetInputDevice(bbt_dev){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<40>";
	bb_input_device=bbt_dev;
	pop_err();
	return 0;
}
var bb_audio_device;
function bb_audio_SetAudioDevice(bbt_dev){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<56>";
	bb_audio_device=bbt_dev;
	pop_err();
	return 0;
}
var bb_app_device;
function bb_framework_Screen(){
	Object.call(this);
	this.bb_name="";
}
function bb_framework_new2(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<408>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_framework_Screen.prototype.bbm_Render=function(){
}
bb_framework_Screen.prototype.bbm_ExtraRender=function(){
	push_err();
	pop_err();
}
bb_framework_Screen.prototype.bbm_DebugRender=function(){
	push_err();
	pop_err();
}
bb_framework_Screen.prototype.bbm_OnTouchHit=function(bbt_x,bbt_y,bbt_pointer){
	push_err();
	pop_err();
}
bb_framework_Screen.prototype.bbm_OnTouchClick=function(bbt_x,bbt_y,bbt_pointer){
	push_err();
	pop_err();
}
bb_framework_Screen.prototype.bbm_OnTouchFling=function(bbt_releaseX,bbt_releaseY,bbt_velocityX,bbt_velocityY,bbt_velocitySpeed,bbt_pointer){
	push_err();
	pop_err();
}
bb_framework_Screen.prototype.bbm_OnTouchReleased=function(bbt_x,bbt_y,bbt_pointer){
	push_err();
	pop_err();
}
bb_framework_Screen.prototype.bbm_OnTouchDragged=function(bbt_x,bbt_y,bbt_dx,bbt_dy,bbt_pointer){
	push_err();
	pop_err();
}
bb_framework_Screen.prototype.bbm_OnTouchLongPress=function(bbt_x,bbt_y,bbt_pointer){
	push_err();
	pop_err();
}
bb_framework_Screen.prototype.bbm_Start=function(){
}
bb_framework_Screen.prototype.bbm_PreStart=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<412>";
	dbg_object(bb_framework_game).bb_currentScreen=this;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<413>";
	this.bbm_Start();
	pop_err();
}
bb_framework_Screen.prototype.bbm_PostFadeOut=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<423>";
	dbg_object(bb_framework_game).bb_nextScreen.bbm_PreStart();
	pop_err();
}
bb_framework_Screen.prototype.bbm_PostFadeIn=function(){
	push_err();
	pop_err();
}
bb_framework_Screen.prototype.bbm_Update2=function(){
}
function bb_framework_ExitScreen(){
	bb_framework_Screen.call(this);
}
bb_framework_ExitScreen.prototype=extend_class(bb_framework_Screen);
function bb_framework_new3(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<393>";
	bb_framework_new2.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<394>";
	this.bb_name="exit";
	pop_err();
	return this;
}
bb_framework_ExitScreen.prototype.bbm_Start=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<398>";
	bb_functions_ExitApp();
	pop_err();
}
bb_framework_ExitScreen.prototype.bbm_Render=function(){
	push_err();
	pop_err();
}
bb_framework_ExitScreen.prototype.bbm_Update2=function(){
	push_err();
	pop_err();
}
function bb_framework_ScreenFade(){
	Object.call(this);
	this.bb_active=false;
	this.bb_ratio=0.0;
	this.bb_counter=.0;
	this.bb_fadeTime=.0;
	this.bb_fadeMusic=false;
	this.bb_fadeOut=false;
	this.bb_fadeSound=false;
}
function bb_framework_new4(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<311>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_framework_ScreenFade.prototype.bbm_Render=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<381>";
	if(!this.bb_active){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<383>";
	bb_graphics_SetAlpha(1.0-this.bb_ratio);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<384>";
	bb_graphics_SetColor(0.0,0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<385>";
	bb_graphics_DrawRect(0.0,0.0,(bb_framework_DEVICE_WIDTH),(bb_framework_DEVICE_HEIGHT));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<386>";
	bb_graphics_SetAlpha(1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<387>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	pop_err();
}
bb_framework_ScreenFade.prototype.bbm_CalcRatio=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<362>";
	this.bb_ratio=this.bb_counter/this.bb_fadeTime;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<363>";
	if(this.bb_ratio<0.0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<364>";
		this.bb_ratio=0.0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<365>";
		if(this.bb_fadeMusic){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<366>";
			bb_framework_game.bbm_SetMojoMusicVolume(0.0);
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<369>";
	if(this.bb_ratio>1.0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<370>";
		this.bb_ratio=1.0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<371>";
		if(this.bb_fadeMusic){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<372>";
			bb_framework_game.bbm_SetMojoMusicVolume((dbg_object(bb_framework_game).bb_musicVolume)/100.0);
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<375>";
	if(this.bb_fadeOut){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<376>";
		this.bb_ratio=1.0-this.bb_ratio;
	}
	pop_err();
}
bb_framework_ScreenFade.prototype.bbm_Update2=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<340>";
	if(!this.bb_active){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<341>";
	this.bb_counter+=dbg_object(bb_framework_dt).bb_delta;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<342>";
	this.bbm_CalcRatio();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<343>";
	if(this.bb_fadeSound){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<344>";
		for(var bbt_i=0;bbt_i<=31;bbt_i=bbt_i+1){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<345>";
			bb_audio_SetChannelVolume(bbt_i,this.bb_ratio*((dbg_object(bb_framework_game).bb_soundVolume)/100.0));
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<348>";
	if(this.bb_fadeMusic){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<349>";
		bb_framework_game.bbm_SetMojoMusicVolume(this.bb_ratio*((dbg_object(bb_framework_game).bb_musicVolume)/100.0));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<351>";
	if(this.bb_counter>this.bb_fadeTime){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<352>";
		this.bb_active=false;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<353>";
		if(this.bb_fadeOut){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<354>";
			dbg_object(bb_framework_game).bb_currentScreen.bbm_PostFadeOut();
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<356>";
			dbg_object(bb_framework_game).bb_currentScreen.bbm_PostFadeIn();
		}
	}
	pop_err();
}
bb_framework_ScreenFade.prototype.bbm_Start2=function(bbt_fadeTime,bbt_fadeOut,bbt_fadeSound,bbt_fadeMusic){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<321>";
	if(this.bb_active){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<322>";
	this.bb_active=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<323>";
	dbg_object(this).bb_fadeTime=bbt_fadeTime;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<324>";
	dbg_object(this).bb_fadeOut=bbt_fadeOut;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<325>";
	dbg_object(this).bb_fadeMusic=bbt_fadeMusic;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<326>";
	dbg_object(this).bb_fadeSound=bbt_fadeSound;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<327>";
	if(bbt_fadeOut){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<328>";
		this.bb_ratio=1.0;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<330>";
		this.bb_ratio=0.0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<332>";
		if(dbg_object(this).bb_fadeMusic){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<333>";
			bb_framework_game.bbm_SetMojoMusicVolume(0.0);
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<336>";
	this.bb_counter=0.0;
	pop_err();
}
function bb_framework_GameImage(){
	Object.call(this);
	this.bb_w2=.0;
	this.bb_h2=.0;
	this.bb_w=0;
	this.bb_h=0;
	this.bb_image=null;
	this.bb_name="";
	this.bb_midhandled=0;
}
function bb_framework_new5(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<580>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_framework_GameImage.prototype.bbm_CalcSize=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<625>";
	if(this.bb_image!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<626>";
		this.bb_w=this.bb_image.bbm_Width();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<627>";
		this.bb_h=this.bb_image.bbm_Height();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<628>";
		this.bb_w2=((this.bb_w/2)|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<629>";
		this.bb_h2=((this.bb_h/2)|0);
	}
	pop_err();
}
bb_framework_GameImage.prototype.bbm_MidHandle=function(bbt_midhandle){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<634>";
	if(bbt_midhandle){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<635>";
		this.bb_image.bbm_SetHandle(this.bb_w2,this.bb_h2);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<636>";
		dbg_object(this).bb_midhandled=1;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<638>";
		this.bb_image.bbm_SetHandle(0.0,0.0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<639>";
		dbg_object(this).bb_midhandled=0;
	}
	pop_err();
}
bb_framework_GameImage.prototype.bbm_MidHandle2=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<644>";
	var bbt_=dbg_object(this).bb_midhandled==1;
	pop_err();
	return bbt_;
}
bb_framework_GameImage.prototype.bbm_Load=function(bbt_file,bbt_midhandle){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<600>";
	this.bb_name=bb_functions_StripAll(bbt_file.toUpperCase());
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<601>";
	this.bb_image=bb_functions_LoadBitmap(bbt_file,0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<602>";
	this.bbm_CalcSize();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<603>";
	this.bbm_MidHandle(bbt_midhandle);
	pop_err();
}
bb_framework_GameImage.prototype.bbm_LoadAnim=function(bbt_file,bbt_w,bbt_h,bbt_total,bbt_tmpImage,bbt_midhandle){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<607>";
	this.bb_name=bb_functions_StripAll(bbt_file.toUpperCase());
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<608>";
	this.bb_image=bb_functions_LoadAnimBitmap(bbt_file,bbt_w,bbt_h,bbt_total,bbt_tmpImage);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<609>";
	this.bbm_CalcSize();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<610>";
	this.bbm_MidHandle(bbt_midhandle);
	pop_err();
}
function bb_boxes_StringObject(){
	Object.call(this);
	this.bb_value="";
}
function bb_boxes_new(bbt_value){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/boxes.monkey<59>";
	dbg_object(this).bb_value=String(bbt_value);
	pop_err();
	return this;
}
function bb_boxes_new2(bbt_value){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/boxes.monkey<63>";
	dbg_object(this).bb_value=String(bbt_value);
	pop_err();
	return this;
}
function bb_boxes_new3(bbt_value){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/boxes.monkey<67>";
	dbg_object(this).bb_value=bbt_value;
	pop_err();
	return this;
}
function bb_boxes_new4(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/boxes.monkey<55>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_map_Map(){
	Object.call(this);
	this.bb_root=null;
}
function bb_map_new(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<13>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_map_Map.prototype.bbm_Compare=function(bbt_lhs,bbt_rhs){
}
bb_map_Map.prototype.bbm_FindNode=function(bbt_key){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<124>";
	var bbt_node=this.bb_root;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<126>";
	while((bbt_node)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<127>";
		var bbt_cmp=this.bbm_Compare(bbt_key,dbg_object(bbt_node).bb_key);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<128>";
		if(bbt_cmp>0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<129>";
			bbt_node=dbg_object(bbt_node).bb_right;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<130>";
			if(bbt_cmp<0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<131>";
				bbt_node=dbg_object(bbt_node).bb_left;
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<133>";
				pop_err();
				return bbt_node;
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<136>";
	pop_err();
	return bbt_node;
}
bb_map_Map.prototype.bbm_Contains=function(bbt_key){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<31>";
	var bbt_=this.bbm_FindNode(bbt_key)!=null;
	pop_err();
	return bbt_;
}
bb_map_Map.prototype.bbm_Get=function(bbt_key){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<68>";
	var bbt_node=this.bbm_FindNode(bbt_key);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<69>";
	if((bbt_node)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<69>";
		var bbt_=dbg_object(bbt_node).bb_value;
		pop_err();
		return bbt_;
	}
	pop_err();
	return null;
}
bb_map_Map.prototype.bbm_RotateLeft=function(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<218>";
	var bbt_child=dbg_object(bbt_node).bb_right;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<219>";
	dbg_object(bbt_node).bb_right=dbg_object(bbt_child).bb_left;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<220>";
	if((dbg_object(bbt_child).bb_left)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<221>";
		dbg_object(dbg_object(bbt_child).bb_left).bb_parent=bbt_node;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<223>";
	dbg_object(bbt_child).bb_parent=dbg_object(bbt_node).bb_parent;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<224>";
	if((dbg_object(bbt_node).bb_parent)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<225>";
		if(bbt_node==dbg_object(dbg_object(bbt_node).bb_parent).bb_left){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<226>";
			dbg_object(dbg_object(bbt_node).bb_parent).bb_left=bbt_child;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<228>";
			dbg_object(dbg_object(bbt_node).bb_parent).bb_right=bbt_child;
		}
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<231>";
		this.bb_root=bbt_child;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<233>";
	dbg_object(bbt_child).bb_left=bbt_node;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<234>";
	dbg_object(bbt_node).bb_parent=bbt_child;
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbm_RotateRight=function(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<238>";
	var bbt_child=dbg_object(bbt_node).bb_left;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<239>";
	dbg_object(bbt_node).bb_left=dbg_object(bbt_child).bb_right;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<240>";
	if((dbg_object(bbt_child).bb_right)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<241>";
		dbg_object(dbg_object(bbt_child).bb_right).bb_parent=bbt_node;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<243>";
	dbg_object(bbt_child).bb_parent=dbg_object(bbt_node).bb_parent;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<244>";
	if((dbg_object(bbt_node).bb_parent)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<245>";
		if(bbt_node==dbg_object(dbg_object(bbt_node).bb_parent).bb_right){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<246>";
			dbg_object(dbg_object(bbt_node).bb_parent).bb_right=bbt_child;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<248>";
			dbg_object(dbg_object(bbt_node).bb_parent).bb_left=bbt_child;
		}
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<251>";
		this.bb_root=bbt_child;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<253>";
	dbg_object(bbt_child).bb_right=bbt_node;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<254>";
	dbg_object(bbt_node).bb_parent=bbt_child;
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbm_InsertFixup=function(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<179>";
	while(((dbg_object(bbt_node).bb_parent)!=null) && dbg_object(dbg_object(bbt_node).bb_parent).bb_color==-1 && ((dbg_object(dbg_object(bbt_node).bb_parent).bb_parent)!=null)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<180>";
		if(dbg_object(bbt_node).bb_parent==dbg_object(dbg_object(dbg_object(bbt_node).bb_parent).bb_parent).bb_left){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<181>";
			var bbt_uncle=dbg_object(dbg_object(dbg_object(bbt_node).bb_parent).bb_parent).bb_right;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<182>";
			if(((bbt_uncle)!=null) && dbg_object(bbt_uncle).bb_color==-1){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<183>";
				dbg_object(dbg_object(bbt_node).bb_parent).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<184>";
				dbg_object(bbt_uncle).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<185>";
				dbg_object(dbg_object(bbt_uncle).bb_parent).bb_color=-1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<186>";
				bbt_node=dbg_object(bbt_uncle).bb_parent;
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<188>";
				if(bbt_node==dbg_object(dbg_object(bbt_node).bb_parent).bb_right){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<189>";
					bbt_node=dbg_object(bbt_node).bb_parent;
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<190>";
					this.bbm_RotateLeft(bbt_node);
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<192>";
				dbg_object(dbg_object(bbt_node).bb_parent).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<193>";
				dbg_object(dbg_object(dbg_object(bbt_node).bb_parent).bb_parent).bb_color=-1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<194>";
				this.bbm_RotateRight(dbg_object(dbg_object(bbt_node).bb_parent).bb_parent);
			}
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<197>";
			var bbt_uncle2=dbg_object(dbg_object(dbg_object(bbt_node).bb_parent).bb_parent).bb_left;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<198>";
			if(((bbt_uncle2)!=null) && dbg_object(bbt_uncle2).bb_color==-1){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<199>";
				dbg_object(dbg_object(bbt_node).bb_parent).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<200>";
				dbg_object(bbt_uncle2).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<201>";
				dbg_object(dbg_object(bbt_uncle2).bb_parent).bb_color=-1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<202>";
				bbt_node=dbg_object(bbt_uncle2).bb_parent;
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<204>";
				if(bbt_node==dbg_object(dbg_object(bbt_node).bb_parent).bb_left){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<205>";
					bbt_node=dbg_object(bbt_node).bb_parent;
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<206>";
					this.bbm_RotateRight(bbt_node);
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<208>";
				dbg_object(dbg_object(bbt_node).bb_parent).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<209>";
				dbg_object(dbg_object(dbg_object(bbt_node).bb_parent).bb_parent).bb_color=-1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<210>";
				this.bbm_RotateLeft(dbg_object(dbg_object(bbt_node).bb_parent).bb_parent);
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<214>";
	dbg_object(this.bb_root).bb_color=1;
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbm_Set=function(bbt_key,bbt_value){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<35>";
	var bbt_node=this.bb_root;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<36>";
	var bbt_parent=null;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<36>";
	var bbt_cmp=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<38>";
	while((bbt_node)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<39>";
		bbt_parent=bbt_node;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<40>";
		bbt_cmp=this.bbm_Compare(bbt_key,dbg_object(bbt_node).bb_key);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<41>";
		if(bbt_cmp>0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<42>";
			bbt_node=dbg_object(bbt_node).bb_right;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<43>";
			if(bbt_cmp<0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<44>";
				bbt_node=dbg_object(bbt_node).bb_left;
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<46>";
				dbg_object(bbt_node).bb_value=bbt_value;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<47>";
				pop_err();
				return 0;
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<51>";
	bbt_node=bb_map_new3.call(new bb_map_Node,bbt_key,bbt_value,-1,bbt_parent);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<53>";
	if(!((bbt_parent)!=null)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<54>";
		this.bb_root=bbt_node;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<55>";
		pop_err();
		return 0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<58>";
	if(bbt_cmp>0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<59>";
		dbg_object(bbt_parent).bb_right=bbt_node;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<61>";
		dbg_object(bbt_parent).bb_left=bbt_node;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<64>";
	this.bbm_InsertFixup(bbt_node);
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbm_DeleteFixup=function(bbt_node,bbt_parent){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<259>";
	while(bbt_node!=this.bb_root && (!((bbt_node)!=null) || dbg_object(bbt_node).bb_color==1)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<261>";
		if(bbt_node==dbg_object(bbt_parent).bb_left){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<263>";
			var bbt_sib=dbg_object(bbt_parent).bb_right;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<265>";
			if(dbg_object(bbt_sib).bb_color==-1){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<266>";
				dbg_object(bbt_sib).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<267>";
				dbg_object(bbt_parent).bb_color=-1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<268>";
				this.bbm_RotateLeft(bbt_parent);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<269>";
				bbt_sib=dbg_object(bbt_parent).bb_right;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<272>";
			if((!((dbg_object(bbt_sib).bb_left)!=null) || dbg_object(dbg_object(bbt_sib).bb_left).bb_color==1) && (!((dbg_object(bbt_sib).bb_right)!=null) || dbg_object(dbg_object(bbt_sib).bb_right).bb_color==1)){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<273>";
				dbg_object(bbt_sib).bb_color=-1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<274>";
				bbt_node=bbt_parent;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<275>";
				bbt_parent=dbg_object(bbt_parent).bb_parent;
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<277>";
				if(!((dbg_object(bbt_sib).bb_right)!=null) || dbg_object(dbg_object(bbt_sib).bb_right).bb_color==1){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<278>";
					dbg_object(dbg_object(bbt_sib).bb_left).bb_color=1;
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<279>";
					dbg_object(bbt_sib).bb_color=-1;
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<280>";
					this.bbm_RotateRight(bbt_sib);
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<281>";
					bbt_sib=dbg_object(bbt_parent).bb_right;
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<283>";
				dbg_object(bbt_sib).bb_color=dbg_object(bbt_parent).bb_color;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<284>";
				dbg_object(bbt_parent).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<285>";
				dbg_object(dbg_object(bbt_sib).bb_right).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<286>";
				this.bbm_RotateLeft(bbt_parent);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<287>";
				bbt_node=this.bb_root;
			}
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<290>";
			var bbt_sib2=dbg_object(bbt_parent).bb_left;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<292>";
			if(dbg_object(bbt_sib2).bb_color==-1){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<293>";
				dbg_object(bbt_sib2).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<294>";
				dbg_object(bbt_parent).bb_color=-1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<295>";
				this.bbm_RotateRight(bbt_parent);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<296>";
				bbt_sib2=dbg_object(bbt_parent).bb_left;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<299>";
			if((!((dbg_object(bbt_sib2).bb_right)!=null) || dbg_object(dbg_object(bbt_sib2).bb_right).bb_color==1) && (!((dbg_object(bbt_sib2).bb_left)!=null) || dbg_object(dbg_object(bbt_sib2).bb_left).bb_color==1)){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<300>";
				dbg_object(bbt_sib2).bb_color=-1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<301>";
				bbt_node=bbt_parent;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<302>";
				bbt_parent=dbg_object(bbt_parent).bb_parent;
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<304>";
				if(!((dbg_object(bbt_sib2).bb_left)!=null) || dbg_object(dbg_object(bbt_sib2).bb_left).bb_color==1){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<305>";
					dbg_object(dbg_object(bbt_sib2).bb_right).bb_color=1;
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<306>";
					dbg_object(bbt_sib2).bb_color=-1;
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<307>";
					this.bbm_RotateLeft(bbt_sib2);
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<308>";
					bbt_sib2=dbg_object(bbt_parent).bb_left;
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<310>";
				dbg_object(bbt_sib2).bb_color=dbg_object(bbt_parent).bb_color;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<311>";
				dbg_object(bbt_parent).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<312>";
				dbg_object(dbg_object(bbt_sib2).bb_left).bb_color=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<313>";
				this.bbm_RotateRight(bbt_parent);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<314>";
				bbt_node=this.bb_root;
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<318>";
	if((bbt_node)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<318>";
		dbg_object(bbt_node).bb_color=1;
	}
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbm_RemoveNode=function(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<140>";
	var bbt_splice=null;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<140>";
	var bbt_child=null;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<142>";
	if(!((dbg_object(bbt_node).bb_left)!=null)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<143>";
		bbt_splice=bbt_node;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<144>";
		bbt_child=dbg_object(bbt_node).bb_right;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<145>";
		if(!((dbg_object(bbt_node).bb_right)!=null)){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<146>";
			bbt_splice=bbt_node;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<147>";
			bbt_child=dbg_object(bbt_node).bb_left;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<149>";
			bbt_splice=dbg_object(bbt_node).bb_left;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<150>";
			while((dbg_object(bbt_splice).bb_right)!=null){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<151>";
				bbt_splice=dbg_object(bbt_splice).bb_right;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<153>";
			bbt_child=dbg_object(bbt_splice).bb_left;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<154>";
			dbg_object(bbt_node).bb_key=dbg_object(bbt_splice).bb_key;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<155>";
			dbg_object(bbt_node).bb_value=dbg_object(bbt_splice).bb_value;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<158>";
	var bbt_parent=dbg_object(bbt_splice).bb_parent;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<160>";
	if((bbt_child)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<161>";
		dbg_object(bbt_child).bb_parent=bbt_parent;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<164>";
	if(!((bbt_parent)!=null)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<165>";
		this.bb_root=bbt_child;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<166>";
		pop_err();
		return 0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<169>";
	if(bbt_splice==dbg_object(bbt_parent).bb_left){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<170>";
		dbg_object(bbt_parent).bb_left=bbt_child;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<172>";
		dbg_object(bbt_parent).bb_right=bbt_child;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<175>";
	if(dbg_object(bbt_splice).bb_color==1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<175>";
		this.bbm_DeleteFixup(bbt_child,bbt_parent);
	}
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbm_Remove=function(bbt_key){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<73>";
	var bbt_node=this.bbm_FindNode(bbt_key);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<74>";
	if(!((bbt_node)!=null)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<74>";
		pop_err();
		return 0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<75>";
	this.bbm_RemoveNode(bbt_node);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<76>";
	pop_err();
	return 1;
}
function bb_map_StringMap(){
	bb_map_Map.call(this);
}
bb_map_StringMap.prototype=extend_class(bb_map_Map);
function bb_map_new2(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<518>";
	bb_map_new.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<518>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_map_StringMap.prototype.bbm_Compare=function(bbt_lhs,bbt_rhs){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<521>";
	var bbt_=string_compare(dbg_object(bbt_lhs).bb_value,dbg_object(bbt_rhs).bb_value);
	pop_err();
	return bbt_;
}
function bb_framework_ImageBank(){
	bb_map_StringMap.call(this);
	this.bb_path="graphics/";
}
bb_framework_ImageBank.prototype=extend_class(bb_map_StringMap);
function bb_framework_new6(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<504>";
	bb_map_new2.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<504>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_framework_ImageBank.prototype.bbm_Load2=function(bbt_name,bbt_nameoverride,bbt_midhandle,bbt_ignoreCache){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<510>";
	var bbt_storeKey=bbt_nameoverride.toUpperCase();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<511>";
	if(bbt_storeKey==""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<511>";
		bbt_storeKey=bb_functions_StripAll(bbt_name.toUpperCase());
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<512>";
	if(!bbt_ignoreCache && this.bbm_Contains(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<512>";
		var bbt_=this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey));
		pop_err();
		return bbt_;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<515>";
	if(this.bbm_Contains(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<515>";
		dbg_object(this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))).bb_image.bbm_Discard();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<517>";
	var bbt_i=bb_framework_new5.call(new bb_framework_GameImage);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<518>";
	bbt_i.bbm_Load(this.bb_path+bbt_name,bbt_midhandle);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<519>";
	dbg_object(bbt_i).bb_name=bbt_storeKey;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<520>";
	this.bbm_Set((bb_boxes_new3.call(new bb_boxes_StringObject,dbg_object(bbt_i).bb_name)),bbt_i);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<521>";
	pop_err();
	return bbt_i;
}
bb_framework_ImageBank.prototype.bbm_LoadAnim2=function(bbt_name,bbt_w,bbt_h,bbt_total,bbt_tmpImage,bbt_midhandle,bbt_ignoreCache,bbt_nameoverride){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<526>";
	var bbt_storeKey=bbt_nameoverride.toUpperCase();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<527>";
	if(bbt_storeKey==""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<527>";
		bbt_storeKey=bb_functions_StripAll(bbt_name.toUpperCase());
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<528>";
	if(!bbt_ignoreCache && this.bbm_Contains(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<528>";
		var bbt_=this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey));
		pop_err();
		return bbt_;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<531>";
	if(this.bbm_Contains(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<531>";
		dbg_object(this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))).bb_image.bbm_Discard();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<533>";
	var bbt_i=bb_framework_new5.call(new bb_framework_GameImage);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<534>";
	bbt_i.bbm_LoadAnim(this.bb_path+bbt_name,bbt_w,bbt_h,bbt_total,bbt_tmpImage,bbt_midhandle);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<535>";
	dbg_object(bbt_i).bb_name=bbt_storeKey;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<536>";
	this.bbm_Set((bb_boxes_new3.call(new bb_boxes_StringObject,dbg_object(bbt_i).bb_name)),bbt_i);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<537>";
	pop_err();
	return bbt_i;
}
bb_framework_ImageBank.prototype.bbm_Find=function(bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<558>";
	bbt_name=bbt_name.toUpperCase();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<565>";
	var bbt_i=this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_name));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<566>";
	bb_assert_AssertNotNull((bbt_i),"Image '"+bbt_name+"' not found in the ImageBank");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<567>";
	pop_err();
	return bbt_i;
}
function bb_framework_GameSound(){
	Object.call(this);
	this.bb_sound=null;
	this.bb_name="";
	this.bb_pan=0.0;
	this.bb_rate=1.0;
	this.bb_volume=1.0;
	this.bb_loop=0;
	this.bb_channel=0;
	this.bb_loopChannelList=bb_collections_new6.call(new bb_collections_IntArrayList);
}
function bb_framework_new7(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<811>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_framework_GameSound.prototype.bbm_Load3=function(bbt_file){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<823>";
	if((bbt_file.indexOf(".wav")!=-1) || (bbt_file.indexOf(".ogg")!=-1) || (bbt_file.indexOf(".mp3")!=-1)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<824>";
		this.bb_sound=bb_functions_LoadSoundSample(bb_framework_path+bbt_file);
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<831>";
		this.bb_sound=bb_functions_LoadSoundSample(bb_framework_path+bbt_file+".wav");
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<835>";
	this.bb_name=bb_functions_StripAll(bbt_file.toUpperCase());
	pop_err();
}
bb_framework_GameSound.prototype.bbm_Play=function(bbt_playChannel){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<839>";
	this.bb_channel=bb_framework_PlayFx(this.bb_sound,this.bb_pan,this.bb_rate,this.bb_volume*((dbg_object(bb_framework_game).bb_soundVolume)/100.0),this.bb_loop,bbt_playChannel);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<840>";
	if(this.bb_loop==1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<841>";
		this.bb_loopChannelList.bbm_Add(bb_boxes_new5.call(new bb_boxes_IntObject,this.bb_channel));
	}
	pop_err();
}
function bb_framework_SoundBank(){
	bb_map_StringMap.call(this);
}
bb_framework_SoundBank.prototype=extend_class(bb_map_StringMap);
function bb_framework_new8(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<777>";
	bb_map_new2.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<777>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
var bb_framework_path;
bb_framework_SoundBank.prototype.bbm_Load4=function(bbt_name,bbt_nameoverride,bbt_ignoreCache){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<783>";
	var bbt_storeKey=bbt_nameoverride.toUpperCase();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<784>";
	if(bbt_storeKey==""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<784>";
		bbt_storeKey=bb_functions_StripAll(bbt_name.toUpperCase());
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<785>";
	if(!bbt_ignoreCache && this.bbm_Contains(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<785>";
		var bbt_=this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey));
		pop_err();
		return bbt_;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<788>";
	if(this.bbm_Contains(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<788>";
		dbg_object(this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_storeKey))).bb_sound.bbm_Discard();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<790>";
	var bbt_s=bb_framework_new7.call(new bb_framework_GameSound);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<791>";
	bbt_s.bbm_Load3(bbt_name);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<792>";
	dbg_object(bbt_s).bb_name=bbt_storeKey;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<793>";
	this.bbm_Set((bb_boxes_new3.call(new bb_boxes_StringObject,dbg_object(bbt_s).bb_name)),bbt_s);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<794>";
	pop_err();
	return bbt_s;
}
bb_framework_SoundBank.prototype.bbm_Find=function(bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<798>";
	bbt_name=bbt_name.toUpperCase();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<805>";
	var bbt_i=this.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,bbt_name));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<806>";
	bb_assert_AssertNotNull((bbt_i),"Sound '"+bbt_name+"' not found in the SoundBank");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<807>";
	pop_err();
	return bbt_i;
}
function bb_inputcache_InputCache(){
	Object.call(this);
	this.bb_keyHitEnumerator=null;
	this.bb_keyDownEnumerator=null;
	this.bb_keyReleasedEnumerator=null;
	this.bb_keyHitWrapper=null;
	this.bb_keyDownWrapper=null;
	this.bb_keyReleasedWrapper=null;
	this.bb_touchData=new_object_array(32);
	this.bb_monitorTouch=false;
	this.bb_monitorMouse=false;
	this.bb_touchDownCount=0;
	this.bb_touchHitCount=0;
	this.bb_touchReleasedCount=0;
	this.bb_maxTouchDown=-1;
	this.bb_maxTouchHit=-1;
	this.bb_maxTouchReleased=-1;
	this.bb_minTouchDown=-1;
	this.bb_minTouchHit=-1;
	this.bb_minTouchReleased=-1;
	this.bb_touchHit=new_number_array(32);
	this.bb_touchHitTime=new_number_array(32);
	this.bb_touchDown=new_number_array(32);
	this.bb_touchDownTime=new_number_array(32);
	this.bb_touchReleasedTime=new_number_array(32);
	this.bb_touchReleased=new_number_array(32);
	this.bb_touchX=new_number_array(32);
	this.bb_touchY=new_number_array(32);
	this.bb_currentTouchDown=new_number_array(32);
	this.bb_currentTouchHit=new_number_array(32);
	this.bb_currentTouchReleased=new_number_array(32);
	this.bb_mouseDownCount=0;
	this.bb_mouseHitCount=0;
	this.bb_mouseReleasedCount=0;
	this.bb_mouseHit=new_number_array(3);
	this.bb_mouseHitTime=new_number_array(3);
	this.bb_mouseDown=new_number_array(3);
	this.bb_mouseDownTime=new_number_array(3);
	this.bb_mouseReleasedTime=new_number_array(3);
	this.bb_mouseReleased=new_number_array(3);
	this.bb_currentMouseDown=new_number_array(3);
	this.bb_currentMouseHit=new_number_array(3);
	this.bb_currentMouseReleased=new_number_array(3);
	this.bb_keyDownCount=0;
	this.bb_keyHitCount=0;
	this.bb_keyReleasedCount=0;
	this.bb_monitorKeyCount=0;
	this.bb_monitorKey=new_bool_array(512);
	this.bb_keyHit=new_number_array(512);
	this.bb_keyHitTime=new_number_array(512);
	this.bb_keyDown=new_number_array(512);
	this.bb_keyDownTime=new_number_array(512);
	this.bb_keyReleasedTime=new_number_array(512);
	this.bb_keyReleased=new_number_array(512);
	this.bb_currentKeysDown=new_number_array(512);
	this.bb_currentKeysHit=new_number_array(512);
	this.bb_currentKeysReleased=new_number_array(512);
	this.bb_flingThreshold=250.0;
	this.bb_longPressTime=1000;
}
function bb_inputcache_new(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<176>";
	this.bb_keyHitEnumerator=bb_inputcache_new4.call(new bb_inputcache_KeyEventEnumerator,this,3);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<177>";
	this.bb_keyDownEnumerator=bb_inputcache_new4.call(new bb_inputcache_KeyEventEnumerator,this,1);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<178>";
	this.bb_keyReleasedEnumerator=bb_inputcache_new4.call(new bb_inputcache_KeyEventEnumerator,this,2);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<179>";
	this.bb_keyHitWrapper=bb_inputcache_new10.call(new bb_inputcache_EnumWrapper,this.bb_keyHitEnumerator);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<180>";
	this.bb_keyDownWrapper=bb_inputcache_new10.call(new bb_inputcache_EnumWrapper,this.bb_keyDownEnumerator);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<181>";
	this.bb_keyReleasedWrapper=bb_inputcache_new10.call(new bb_inputcache_EnumWrapper,this.bb_keyReleasedEnumerator);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<182>";
	for(var bbt_i=0;bbt_i<this.bb_touchData.length;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<183>";
		dbg_array(this.bb_touchData,bbt_i)[bbt_i]=bb_inputcache_new12.call(new bb_inputcache_TouchData)
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<189>";
	this.bb_monitorTouch=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<190>";
	this.bb_monitorMouse=true;
	pop_err();
	return this;
}
bb_inputcache_InputCache.prototype.bbm_ReadInput=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<283>";
	var bbt_newval=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<284>";
	var bbt_now=bb_app_Millisecs();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<287>";
	if(this.bb_monitorTouch){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<288>";
		this.bb_touchDownCount=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<289>";
		this.bb_touchHitCount=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<290>";
		this.bb_touchReleasedCount=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<291>";
		this.bb_maxTouchDown=-1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<292>";
		this.bb_maxTouchHit=-1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<293>";
		this.bb_maxTouchReleased=-1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<294>";
		this.bb_minTouchDown=-1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<295>";
		this.bb_minTouchHit=-1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<296>";
		this.bb_minTouchReleased=-1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<297>";
		for(var bbt_i=0;bbt_i<32;bbt_i=bbt_i+1){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<299>";
			bbt_newval=bb_input_TouchHit(bbt_i);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<300>";
			if(!((dbg_array(this.bb_touchHit,bbt_i)[bbt_i])!=0) && ((bbt_newval)!=0)){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<301>";
				dbg_array(this.bb_touchHitTime,bbt_i)[bbt_i]=bbt_now
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<303>";
			dbg_array(this.bb_touchHit,bbt_i)[bbt_i]=bbt_newval
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<305>";
			bbt_newval=bb_input_TouchDown(bbt_i);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<306>";
			if(((bbt_newval)!=0) && !((dbg_array(this.bb_touchDown,bbt_i)[bbt_i])!=0)){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<307>";
				dbg_array(this.bb_touchDownTime,bbt_i)[bbt_i]=bbt_now
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<310>";
			if(((dbg_array(this.bb_touchDown,bbt_i)[bbt_i])!=0) && !((bbt_newval)!=0)){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<311>";
				dbg_array(this.bb_touchReleasedTime,bbt_i)[bbt_i]=bbt_now
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<312>";
				dbg_array(this.bb_touchReleased,bbt_i)[bbt_i]=1
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<314>";
				dbg_array(this.bb_touchReleased,bbt_i)[bbt_i]=0
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<316>";
			dbg_array(this.bb_touchDown,bbt_i)[bbt_i]=bbt_newval
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<318>";
			dbg_array(this.bb_touchX,bbt_i)[bbt_i]=bb_input_TouchX(bbt_i)
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<319>";
			dbg_array(this.bb_touchY,bbt_i)[bbt_i]=bb_input_TouchY(bbt_i)
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<321>";
			if((dbg_array(this.bb_touchDown,bbt_i)[bbt_i])!=0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<322>";
				dbg_array(this.bb_currentTouchDown,this.bb_touchDownCount)[this.bb_touchDownCount]=bbt_i
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<323>";
				this.bb_touchDownCount+=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<324>";
				if(this.bb_minTouchDown<0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<324>";
					this.bb_minTouchDown=bbt_i;
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<325>";
				this.bb_maxTouchDown=bbt_i;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<327>";
			if((dbg_array(this.bb_touchHit,bbt_i)[bbt_i])!=0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<328>";
				dbg_array(this.bb_currentTouchHit,this.bb_touchHitCount)[this.bb_touchHitCount]=bbt_i
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<329>";
				this.bb_touchHitCount+=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<330>";
				if(this.bb_minTouchHit<0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<330>";
					this.bb_minTouchHit=bbt_i;
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<331>";
				this.bb_maxTouchHit=bbt_i;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<333>";
			if((dbg_array(this.bb_touchReleased,bbt_i)[bbt_i])!=0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<334>";
				dbg_array(this.bb_currentTouchReleased,this.bb_touchReleasedCount)[this.bb_touchReleasedCount]=bbt_i
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<335>";
				this.bb_touchReleasedCount+=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<336>";
				if(this.bb_minTouchReleased<0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<336>";
					this.bb_minTouchReleased=bbt_i;
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<337>";
				this.bb_maxTouchReleased=bbt_i;
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<343>";
	if(this.bb_monitorMouse){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<344>";
		this.bb_mouseDownCount=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<345>";
		this.bb_mouseHitCount=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<346>";
		this.bb_mouseReleasedCount=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<347>";
		for(var bbt_i2=0;bbt_i2<3;bbt_i2=bbt_i2+1){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<349>";
			bbt_newval=bb_input_MouseHit(bbt_i2);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<350>";
			if(!((dbg_array(this.bb_mouseHit,bbt_i2)[bbt_i2])!=0) && ((bbt_newval)!=0)){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<351>";
				dbg_array(this.bb_mouseHitTime,bbt_i2)[bbt_i2]=bbt_now
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<353>";
			dbg_array(this.bb_mouseHit,bbt_i2)[bbt_i2]=bbt_newval
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<355>";
			bbt_newval=bb_input_MouseDown(bbt_i2);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<356>";
			if(((bbt_newval)!=0) && !((dbg_array(this.bb_mouseDown,bbt_i2)[bbt_i2])!=0)){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<357>";
				dbg_array(this.bb_mouseDownTime,bbt_i2)[bbt_i2]=bbt_now
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<360>";
			if(((dbg_array(this.bb_mouseDown,bbt_i2)[bbt_i2])!=0) && !((bbt_newval)!=0)){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<361>";
				dbg_array(this.bb_mouseReleasedTime,bbt_i2)[bbt_i2]=bbt_now
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<362>";
				dbg_array(this.bb_mouseReleased,bbt_i2)[bbt_i2]=1
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<364>";
				dbg_array(this.bb_mouseReleased,bbt_i2)[bbt_i2]=0
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<366>";
			dbg_array(this.bb_mouseDown,bbt_i2)[bbt_i2]=bbt_newval
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<368>";
			if((dbg_array(this.bb_mouseDown,bbt_i2)[bbt_i2])!=0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<369>";
				dbg_array(this.bb_currentMouseDown,this.bb_mouseDownCount)[this.bb_mouseDownCount]=bbt_i2
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<370>";
				this.bb_mouseDownCount+=1;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<372>";
			if((dbg_array(this.bb_mouseHit,bbt_i2)[bbt_i2])!=0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<373>";
				dbg_array(this.bb_currentMouseHit,this.bb_mouseHitCount)[this.bb_mouseHitCount]=bbt_i2
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<374>";
				this.bb_mouseHitCount+=1;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<376>";
			if((dbg_array(this.bb_mouseReleased,bbt_i2)[bbt_i2])!=0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<377>";
				dbg_array(this.bb_currentMouseReleased,this.bb_mouseReleasedCount)[this.bb_mouseReleasedCount]=bbt_i2
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<378>";
				this.bb_mouseReleasedCount+=1;
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<384>";
	this.bb_keyDownCount=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<385>";
	this.bb_keyHitCount=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<386>";
	this.bb_keyReleasedCount=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<387>";
	if(this.bb_monitorKeyCount>0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<388>";
		for(var bbt_i3=8;bbt_i3<=222;bbt_i3=bbt_i3+1){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<389>";
			if(dbg_array(this.bb_monitorKey,bbt_i3)[bbt_i3]){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<391>";
				bbt_newval=bb_input_KeyHit(bbt_i3);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<392>";
				if(!((dbg_array(this.bb_keyHit,bbt_i3)[bbt_i3])!=0) && ((bbt_newval)!=0)){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<393>";
					dbg_array(this.bb_keyHitTime,bbt_i3)[bbt_i3]=bbt_now
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<395>";
				dbg_array(this.bb_keyHit,bbt_i3)[bbt_i3]=bbt_newval
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<397>";
				bbt_newval=bb_input_KeyDown(bbt_i3);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<398>";
				if(((bbt_newval)!=0) && !((dbg_array(this.bb_keyDown,bbt_i3)[bbt_i3])!=0)){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<399>";
					dbg_array(this.bb_keyDownTime,bbt_i3)[bbt_i3]=bbt_now
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<402>";
				if(((dbg_array(this.bb_keyDown,bbt_i3)[bbt_i3])!=0) && !((bbt_newval)!=0)){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<403>";
					dbg_array(this.bb_keyReleasedTime,bbt_i3)[bbt_i3]=bbt_now
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<404>";
					dbg_array(this.bb_keyReleased,bbt_i3)[bbt_i3]=1
				}else{
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<406>";
					dbg_array(this.bb_keyReleased,bbt_i3)[bbt_i3]=0
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<408>";
				dbg_array(this.bb_keyDown,bbt_i3)[bbt_i3]=bbt_newval
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<410>";
				if((dbg_array(this.bb_keyDown,bbt_i3)[bbt_i3])!=0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<411>";
					dbg_array(this.bb_currentKeysDown,this.bb_keyDownCount)[this.bb_keyDownCount]=bbt_i3
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<412>";
					this.bb_keyDownCount+=1;
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<414>";
				if((dbg_array(this.bb_keyHit,bbt_i3)[bbt_i3])!=0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<415>";
					dbg_array(this.bb_currentKeysHit,this.bb_keyHitCount)[this.bb_keyHitCount]=bbt_i3
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<416>";
					this.bb_keyHitCount+=1;
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<418>";
				if((dbg_array(this.bb_keyReleased,bbt_i3)[bbt_i3])!=0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<419>";
					dbg_array(this.bb_currentKeysReleased,this.bb_keyReleasedCount)[this.bb_keyReleasedCount]=bbt_i3
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<420>";
					this.bb_keyReleasedCount+=1;
				}
			}
		}
	}
	pop_err();
}
bb_inputcache_InputCache.prototype.bbm_HandleEvents=function(bbt_screen){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<429>";
	for(var bbt_i=0;bbt_i<this.bb_touchHitCount;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<430>";
		var bbt_pointer=dbg_array(this.bb_currentTouchHit,bbt_i)[bbt_i];
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<431>";
		var bbt_x=((dbg_array(this.bb_touchX,bbt_pointer)[bbt_pointer])|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<432>";
		var bbt_y=((dbg_array(this.bb_touchY,bbt_pointer)[bbt_pointer])|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<433>";
		dbg_array(this.bb_touchData,bbt_pointer)[bbt_pointer].bbm_Reset(bbt_x,bbt_y);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<434>";
		bbt_screen.bbm_OnTouchHit(bbt_x,bbt_y,bbt_pointer);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<438>";
	for(var bbt_i2=0;bbt_i2<this.bb_touchReleasedCount;bbt_i2=bbt_i2+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<439>";
		var bbt_pointer2=dbg_array(this.bb_currentTouchReleased,bbt_i2)[bbt_i2];
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<440>";
		var bbt_x2=((dbg_array(this.bb_touchX,bbt_pointer2)[bbt_pointer2])|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<441>";
		var bbt_y2=((dbg_array(this.bb_touchY,bbt_pointer2)[bbt_pointer2])|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<442>";
		dbg_array(this.bb_touchData,bbt_pointer2)[bbt_pointer2].bbm_Update3(bbt_x2,bbt_y2);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<443>";
		if(!dbg_object(dbg_array(this.bb_touchData,bbt_pointer2)[bbt_pointer2]).bb_movedTooFar && !dbg_object(dbg_array(this.bb_touchData,bbt_pointer2)[bbt_pointer2]).bb_firedLongPress){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<444>";
			bbt_screen.bbm_OnTouchClick(bbt_x2,bbt_y2,bbt_pointer2);
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<449>";
			if(dbg_object(dbg_array(this.bb_touchData,bbt_pointer2)[bbt_pointer2]).bb_touchVelocityX*dbg_object(dbg_array(this.bb_touchData,bbt_pointer2)[bbt_pointer2]).bb_touchVelocityX+dbg_object(dbg_array(this.bb_touchData,bbt_pointer2)[bbt_pointer2]).bb_touchVelocityY*dbg_object(dbg_array(this.bb_touchData,bbt_pointer2)[bbt_pointer2]).bb_touchVelocityY>=this.bb_flingThreshold*this.bb_flingThreshold){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<451>";
				bbt_screen.bbm_OnTouchFling(bbt_x2,bbt_y2,dbg_object(dbg_array(this.bb_touchData,bbt_pointer2)[bbt_pointer2]).bb_touchVelocityX,dbg_object(dbg_array(this.bb_touchData,bbt_pointer2)[bbt_pointer2]).bb_touchVelocityY,dbg_object(dbg_array(this.bb_touchData,bbt_pointer2)[bbt_pointer2]).bb_touchVelocitySpeed,bbt_pointer2);
			}
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<454>";
		bbt_screen.bbm_OnTouchReleased(bbt_x2,bbt_y2,bbt_pointer2);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<457>";
	for(var bbt_i3=0;bbt_i3<this.bb_touchDownCount;bbt_i3=bbt_i3+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<458>";
		var bbt_pointer3=dbg_array(this.bb_currentTouchDown,bbt_i3)[bbt_i3];
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<459>";
		var bbt_x3=((dbg_array(this.bb_touchX,bbt_pointer3)[bbt_pointer3])|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<460>";
		var bbt_y3=((dbg_array(this.bb_touchY,bbt_pointer3)[bbt_pointer3])|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<461>";
		dbg_array(this.bb_touchData,bbt_pointer3)[bbt_pointer3].bbm_Update3(bbt_x3,bbt_y3);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<462>";
		bbt_screen.bbm_OnTouchDragged(bbt_x3,bbt_y3,dbg_object(dbg_array(this.bb_touchData,bbt_pointer3)[bbt_pointer3]).bb_distanceMovedX,dbg_object(dbg_array(this.bb_touchData,bbt_pointer3)[bbt_pointer3]).bb_distanceMovedY,bbt_pointer3);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<464>";
		if(!dbg_object(dbg_array(this.bb_touchData,bbt_pointer3)[bbt_pointer3]).bb_testedLongPress && dbg_object(bb_framework_dt).bb_currentticks-(dbg_object(dbg_array(this.bb_touchData,bbt_pointer3)[bbt_pointer3]).bb_firstTouchTime)>=(this.bb_longPressTime)){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<465>";
			dbg_object(dbg_array(this.bb_touchData,bbt_pointer3)[bbt_pointer3]).bb_testedLongPress=true;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<466>";
			if(!dbg_object(dbg_array(this.bb_touchData,bbt_pointer3)[bbt_pointer3]).bb_movedTooFar){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<468>";
				bbt_screen.bbm_OnTouchLongPress(bbt_x3,bbt_y3,bbt_pointer3);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<469>";
				dbg_object(dbg_array(this.bb_touchData,bbt_pointer3)[bbt_pointer3]).bb_firedLongPress=true;
			}
		}
	}
	pop_err();
}
function bb_inputcache_InputEventEnumerator(){
	Object.call(this);
	this.bb_ic=null;
	this.bb_eventType=0;
}
function bb_inputcache_new2(bbt_ic,bbt_eventType){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<536>";
	dbg_object(this).bb_ic=bbt_ic;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<537>";
	dbg_object(this).bb_eventType=bbt_eventType;
	pop_err();
	return this;
}
function bb_inputcache_new3(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<528>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_inputcache_KeyEventEnumerator(){
	bb_inputcache_InputEventEnumerator.call(this);
	this.bb_event=null;
}
bb_inputcache_KeyEventEnumerator.prototype=extend_class(bb_inputcache_InputEventEnumerator);
function bb_inputcache_new4(bbt_ic,bbt_eventType){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<552>";
	bb_inputcache_new2.call(this,bbt_ic,bbt_eventType);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<553>";
	dbg_object(this).bb_event=bb_inputcache_new9.call(new bb_inputcache_KeyEvent);
	pop_err();
	return this;
}
function bb_inputcache_new5(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<546>";
	bb_inputcache_new3.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<546>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_inputcache_InputEvent(){
	Object.call(this);
	this.bb_eventType=0;
}
function bb_inputcache_new6(bbt_eventType){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<503>";
	dbg_object(this).bb_eventType=bbt_eventType;
	pop_err();
	return this;
}
function bb_inputcache_new7(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<477>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_inputcache_KeyEvent(){
	bb_inputcache_InputEvent.call(this);
}
bb_inputcache_KeyEvent.prototype=extend_class(bb_inputcache_InputEvent);
function bb_inputcache_new8(bbt_eventType){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<522>";
	bb_inputcache_new6.call(this,bbt_eventType);
	pop_err();
	return this;
}
function bb_inputcache_new9(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<508>";
	bb_inputcache_new7.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<508>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_inputcache_EnumWrapper(){
	Object.call(this);
	this.bb_wrappedEnum=null;
}
function bb_inputcache_new10(bbt_wrappedEnum){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<593>";
	dbg_object(this).bb_wrappedEnum=bbt_wrappedEnum;
	pop_err();
	return this;
}
function bb_inputcache_new11(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<587>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_inputcache_TouchData(){
	Object.call(this);
	this.bb_firstTouchX=0;
	this.bb_firstTouchY=0;
	this.bb_lastTouchX=0;
	this.bb_lastTouchY=0;
	this.bb_firstTouchTime=0;
	this.bb_testedLongPress=false;
	this.bb_firedLongPress=false;
	this.bb_flingSamplesX=new_number_array(10);
	this.bb_flingSamplesY=new_number_array(10);
	this.bb_flingSamplesTime=new_number_array(10);
	this.bb_flingSampleCount=0;
	this.bb_flingSampleNext=0;
	this.bb_movedTooFar=false;
	this.bb_touchVelocityX=.0;
	this.bb_touchVelocityY=.0;
	this.bb_touchVelocitySpeed=.0;
	this.bb_distanceMovedX=0;
	this.bb_distanceMovedY=0;
}
function bb_inputcache_new12(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<613>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_inputcache_TouchData.prototype.bbm_AddFlingSample=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<660>";
	dbg_array(this.bb_flingSamplesX,this.bb_flingSampleNext)[this.bb_flingSampleNext]=bbt_x
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<661>";
	dbg_array(this.bb_flingSamplesY,this.bb_flingSampleNext)[this.bb_flingSampleNext]=bbt_y
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<662>";
	dbg_array(this.bb_flingSamplesTime,this.bb_flingSampleNext)[this.bb_flingSampleNext]=((dbg_object(bb_framework_dt).bb_currentticks)|0)
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<663>";
	if(this.bb_flingSampleCount<10){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<663>";
		this.bb_flingSampleCount+=1;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<664>";
	this.bb_flingSampleNext+=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<665>";
	if(this.bb_flingSampleNext>=10){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<665>";
		this.bb_flingSampleNext=0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<668>";
	var bbt_first=this.bb_flingSampleNext-this.bb_flingSampleCount;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<669>";
	var bbt_last=this.bb_flingSampleNext-1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<670>";
	while(bbt_first<0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<671>";
		bbt_first+=10;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<673>";
	while(bbt_last<0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<674>";
		bbt_last+=10;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<678>";
	if(this.bb_flingSampleCount>0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<680>";
		var bbt_secs=(dbg_array(this.bb_flingSamplesTime,bbt_last)[bbt_last]-dbg_array(this.bb_flingSamplesTime,bbt_first)[bbt_first])/1000.0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<681>";
		this.bb_touchVelocityX=(dbg_array(this.bb_flingSamplesX,bbt_last)[bbt_last]-dbg_array(this.bb_flingSamplesX,bbt_first)[bbt_first])/bbt_secs;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<682>";
		this.bb_touchVelocityY=(dbg_array(this.bb_flingSamplesY,bbt_last)[bbt_last]-dbg_array(this.bb_flingSamplesY,bbt_first)[bbt_first])/bbt_secs;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<683>";
		this.bb_touchVelocitySpeed=Math.sqrt(this.bb_touchVelocityX*this.bb_touchVelocityX+this.bb_touchVelocityY*this.bb_touchVelocityY);
	}
	pop_err();
}
bb_inputcache_TouchData.prototype.bbm_Reset=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<638>";
	this.bb_firstTouchX=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<639>";
	this.bb_firstTouchY=bbt_y;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<640>";
	this.bb_lastTouchX=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<641>";
	this.bb_lastTouchY=bbt_y;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<642>";
	this.bb_firstTouchTime=((dbg_object(bb_framework_dt).bb_currentticks)|0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<643>";
	this.bb_testedLongPress=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<644>";
	this.bb_firedLongPress=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<645>";
	for(var bbt_i=0;bbt_i<10;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<646>";
		dbg_array(this.bb_flingSamplesX,bbt_i)[bbt_i]=0
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<647>";
		dbg_array(this.bb_flingSamplesY,bbt_i)[bbt_i]=0
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<648>";
		dbg_array(this.bb_flingSamplesTime,bbt_i)[bbt_i]=0
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<650>";
	this.bb_flingSampleCount=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<651>";
	this.bb_flingSampleNext=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<652>";
	this.bb_movedTooFar=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<653>";
	this.bb_touchVelocityX=0.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<654>";
	this.bb_touchVelocityY=0.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<655>";
	this.bb_touchVelocitySpeed=0.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<656>";
	this.bbm_AddFlingSample(bbt_x,bbt_y);
	pop_err();
}
bb_inputcache_TouchData.prototype.bbm_Update3=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<689>";
	this.bb_distanceMovedX=bbt_x-this.bb_lastTouchX;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<690>";
	this.bb_distanceMovedY=bbt_y-this.bb_lastTouchY;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<691>";
	this.bb_lastTouchX=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<692>";
	this.bb_lastTouchY=bbt_y;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<694>";
	this.bbm_AddFlingSample(bbt_x,bbt_y);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<696>";
	if(!this.bb_movedTooFar){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<698>";
		var bbt_dx=bbt_x-this.bb_firstTouchX;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<699>";
		var bbt_dy=bbt_y-this.bb_firstTouchY;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<700>";
		if((bbt_dx*bbt_dx+bbt_dy*bbt_dy)>400.0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/inputcache.monkey<701>";
			this.bb_movedTooFar=true;
		}
	}
	pop_err();
}
var bb_framework_game;
function bbMain(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<50>";
	bb_framework_game=(bb_itanks_new.call(new bb_itanks_iTanks));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/itanks.monkey<51>";
	pop_err();
	return 0;
}
function bb_graphics_Image(){
	Object.call(this);
	this.bb_surface=null;
	this.bb_width=0;
	this.bb_height=0;
	this.bb_frames=[];
	this.bb_flags=0;
	this.bb_tx=.0;
	this.bb_ty=.0;
	this.bb_source=null;
}
var bb_graphics_DefaultFlags;
function bb_graphics_new3(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<62>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_graphics_Image.prototype.bbm_SetHandle=function(bbt_tx,bbt_ty){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<106>";
	dbg_object(this).bb_tx=bbt_tx;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<107>";
	dbg_object(this).bb_ty=bbt_ty;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<108>";
	dbg_object(this).bb_flags=dbg_object(this).bb_flags&-2;
	pop_err();
	return 0;
}
bb_graphics_Image.prototype.bbm_ApplyFlags=function(bbt_iflags){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<177>";
	this.bb_flags=bbt_iflags;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<179>";
	if((this.bb_flags&2)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<180>";
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<180>";
		var bbt_=this.bb_frames;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<180>";
		var bbt_2=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<180>";
		while(bbt_2<bbt_.length){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<180>";
			var bbt_f=dbg_array(bbt_,bbt_2)[bbt_2];
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<180>";
			bbt_2=bbt_2+1;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<181>";
			dbg_object(bbt_f).bb_x+=1;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<183>";
		this.bb_width-=2;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<186>";
	if((this.bb_flags&4)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<187>";
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<187>";
		var bbt_3=this.bb_frames;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<187>";
		var bbt_4=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<187>";
		while(bbt_4<bbt_3.length){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<187>";
			var bbt_f2=dbg_array(bbt_3,bbt_4)[bbt_4];
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<187>";
			bbt_4=bbt_4+1;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<188>";
			dbg_object(bbt_f2).bb_y+=1;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<190>";
		this.bb_height-=2;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<193>";
	if((this.bb_flags&1)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<194>";
		this.bbm_SetHandle((this.bb_width)/2.0,(this.bb_height)/2.0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<197>";
	if(this.bb_frames.length==1 && dbg_object(dbg_array(this.bb_frames,0)[0]).bb_x==0 && dbg_object(dbg_array(this.bb_frames,0)[0]).bb_y==0 && this.bb_width==this.bb_surface.Width() && this.bb_height==this.bb_surface.Height()){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<198>";
		this.bb_flags|=65536;
	}
	pop_err();
	return 0;
}
bb_graphics_Image.prototype.bbm_Load5=function(bbt_path,bbt_nframes,bbt_iflags){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<129>";
	this.bb_surface=dbg_object(bb_graphics_context).bb_device.LoadSurface(bbt_path);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<130>";
	if(!((this.bb_surface)!=null)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<130>";
		pop_err();
		return null;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<132>";
	this.bb_width=((this.bb_surface.Width()/bbt_nframes)|0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<133>";
	this.bb_height=this.bb_surface.Height();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<135>";
	this.bb_frames=new_object_array(bbt_nframes);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<137>";
	for(var bbt_i=0;bbt_i<bbt_nframes;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<138>";
		dbg_array(this.bb_frames,bbt_i)[bbt_i]=bb_graphics_new4.call(new bb_graphics_Frame,bbt_i*this.bb_width,0)
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<141>";
	this.bbm_ApplyFlags(bbt_iflags);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<143>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_graphics_Image.prototype.bbm_Grab=function(bbt_x,bbt_y,bbt_iwidth,bbt_iheight,bbt_nframes,bbt_iflags,bbt_source){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<148>";
	dbg_object(this).bb_source=bbt_source;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<149>";
	this.bb_surface=dbg_object(bbt_source).bb_surface;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<151>";
	this.bb_width=bbt_iwidth;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<152>";
	this.bb_height=bbt_iheight;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<154>";
	this.bb_frames=new_object_array(bbt_nframes);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<156>";
	var bbt_ix=bbt_x+dbg_object(dbg_array(dbg_object(bbt_source).bb_frames,0)[0]).bb_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<157>";
	var bbt_iy=bbt_y+dbg_object(dbg_array(dbg_object(bbt_source).bb_frames,0)[0]).bb_y;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<159>";
	for(var bbt_i=0;bbt_i<bbt_nframes;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<160>";
		if(bbt_ix+this.bb_width>dbg_object(bbt_source).bb_width){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<161>";
			bbt_ix=dbg_object(dbg_array(dbg_object(bbt_source).bb_frames,0)[0]).bb_x;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<162>";
			bbt_iy+=this.bb_height;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<164>";
		if(bbt_ix+this.bb_width>dbg_object(bbt_source).bb_width || bbt_iy+this.bb_height>dbg_object(bbt_source).bb_height){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<165>";
			error("Image frame outside surface");
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<167>";
		dbg_array(this.bb_frames,bbt_i)[bbt_i]=bb_graphics_new4.call(new bb_graphics_Frame,bbt_ix,bbt_iy)
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<168>";
		bbt_ix+=this.bb_width;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<171>";
	this.bbm_ApplyFlags(bbt_iflags);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<173>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_graphics_Image.prototype.bbm_GrabImage=function(bbt_x,bbt_y,bbt_width,bbt_height,bbt_frames,bbt_flags){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<101>";
	if(dbg_object(this).bb_frames.length!=1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<101>";
		pop_err();
		return null;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<102>";
	var bbt_=(bb_graphics_new3.call(new bb_graphics_Image)).bbm_Grab(bbt_x,bbt_y,bbt_width,bbt_height,bbt_frames,bbt_flags,this);
	pop_err();
	return bbt_;
}
bb_graphics_Image.prototype.bbm_Width=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<73>";
	pop_err();
	return this.bb_width;
}
bb_graphics_Image.prototype.bbm_Height=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<77>";
	pop_err();
	return this.bb_height;
}
bb_graphics_Image.prototype.bbm_Frames=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<85>";
	var bbt_=this.bb_frames.length;
	pop_err();
	return bbt_;
}
bb_graphics_Image.prototype.bbm_Discard=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<112>";
	if(((this.bb_surface)!=null) && !((this.bb_source)!=null)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<113>";
		this.bb_surface.Discard();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<114>";
		this.bb_surface=null;
	}
	pop_err();
	return 0;
}
function bb_graphics_Frame(){
	Object.call(this);
	this.bb_x=0;
	this.bb_y=0;
}
function bb_graphics_new4(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<54>";
	dbg_object(this).bb_x=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<55>";
	dbg_object(this).bb_y=bbt_y;
	pop_err();
	return this;
}
function bb_graphics_new5(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<49>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_graphics_LoadImage(bbt_path,bbt_frameCount,bbt_flags){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<272>";
	var bbt_=(bb_graphics_new3.call(new bb_graphics_Image)).bbm_Load5(bbt_path,bbt_frameCount,bbt_flags);
	pop_err();
	return bbt_;
}
function bb_graphics_LoadImage2(bbt_path,bbt_frameWidth,bbt_frameHeight,bbt_frameCount,bbt_flags){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<276>";
	var bbt_atlas=(bb_graphics_new3.call(new bb_graphics_Image)).bbm_Load5(bbt_path,1,0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<277>";
	if((bbt_atlas)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<277>";
		var bbt_=bbt_atlas.bbm_GrabImage(0,0,bbt_frameWidth,bbt_frameHeight,bbt_frameCount,bbt_flags);
		pop_err();
		return bbt_;
	}
	pop_err();
	return null;
}
function bb_graphics_SetFont(bbt_font,bbt_firstChar){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<537>";
	if(!((bbt_font)!=null)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<538>";
		if(!((dbg_object(bb_graphics_context).bb_defaultFont)!=null)){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<539>";
			dbg_object(bb_graphics_context).bb_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<541>";
		bbt_font=dbg_object(bb_graphics_context).bb_defaultFont;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<542>";
		bbt_firstChar=32;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<544>";
	dbg_object(bb_graphics_context).bb_font=bbt_font;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<545>";
	dbg_object(bb_graphics_context).bb_firstChar=bbt_firstChar;
	pop_err();
	return 0;
}
var bb_graphics_renderDevice;
function bb_graphics_SetMatrix(bbt_ix,bbt_iy,bbt_jx,bbt_jy,bbt_tx,bbt_ty){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<326>";
	dbg_object(bb_graphics_context).bb_ix=bbt_ix;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<327>";
	dbg_object(bb_graphics_context).bb_iy=bbt_iy;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<328>";
	dbg_object(bb_graphics_context).bb_jx=bbt_jx;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<329>";
	dbg_object(bb_graphics_context).bb_jy=bbt_jy;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<330>";
	dbg_object(bb_graphics_context).bb_tx=bbt_tx;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<331>";
	dbg_object(bb_graphics_context).bb_ty=bbt_ty;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<332>";
	dbg_object(bb_graphics_context).bb_tformed=((bbt_ix!=1.0 || bbt_iy!=0.0 || bbt_jx!=0.0 || bbt_jy!=1.0 || bbt_tx!=0.0 || bbt_ty!=0.0)?1:0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<333>";
	dbg_object(bb_graphics_context).bb_matDirty=1;
	pop_err();
	return 0;
}
function bb_graphics_SetMatrix2(bbt_m){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<322>";
	bb_graphics_SetMatrix(dbg_array(bbt_m,0)[0],dbg_array(bbt_m,1)[1],dbg_array(bbt_m,2)[2],dbg_array(bbt_m,3)[3],dbg_array(bbt_m,4)[4],dbg_array(bbt_m,5)[5]);
	pop_err();
	return 0;
}
function bb_graphics_SetColor(bbt_r,bbt_g,bbt_b){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<281>";
	dbg_object(bb_graphics_context).bb_color_r=bbt_r;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<282>";
	dbg_object(bb_graphics_context).bb_color_g=bbt_g;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<283>";
	dbg_object(bb_graphics_context).bb_color_b=bbt_b;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<284>";
	dbg_object(bb_graphics_context).bb_device.SetColor(bbt_r,bbt_g,bbt_b);
	pop_err();
	return 0;
}
function bb_graphics_SetAlpha(bbt_alpha){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<292>";
	dbg_object(bb_graphics_context).bb_alpha=bbt_alpha;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<293>";
	dbg_object(bb_graphics_context).bb_device.SetAlpha(bbt_alpha);
	pop_err();
	return 0;
}
function bb_graphics_SetBlend(bbt_blend){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<301>";
	dbg_object(bb_graphics_context).bb_blend=bbt_blend;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<302>";
	dbg_object(bb_graphics_context).bb_device.SetBlend(bbt_blend);
	pop_err();
	return 0;
}
function bb_graphics_DeviceWidth(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<264>";
	var bbt_=dbg_object(bb_graphics_context).bb_device.Width();
	pop_err();
	return bbt_;
}
function bb_graphics_DeviceHeight(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<268>";
	var bbt_=dbg_object(bb_graphics_context).bb_device.Height();
	pop_err();
	return bbt_;
}
function bb_graphics_SetScissor(bbt_x,bbt_y,bbt_width,bbt_height){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<310>";
	dbg_object(bb_graphics_context).bb_scissor_x=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<311>";
	dbg_object(bb_graphics_context).bb_scissor_y=bbt_y;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<312>";
	dbg_object(bb_graphics_context).bb_scissor_width=bbt_width;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<313>";
	dbg_object(bb_graphics_context).bb_scissor_height=bbt_height;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<314>";
	dbg_object(bb_graphics_context).bb_device.SetScissor(((bbt_x)|0),((bbt_y)|0),((bbt_width)|0),((bbt_height)|0));
	pop_err();
	return 0;
}
function bb_graphics_BeginRender(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<250>";
	bb_graphics_renderDevice=dbg_object(bb_graphics_context).bb_device;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<251>";
	dbg_object(bb_graphics_context).bb_matrixSp=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<252>";
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<253>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<254>";
	bb_graphics_SetAlpha(1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<255>";
	bb_graphics_SetBlend(0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<256>";
	bb_graphics_SetScissor(0.0,0.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	pop_err();
	return 0;
}
function bb_graphics_EndRender(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<260>";
	bb_graphics_renderDevice=null;
	pop_err();
	return 0;
}
var bb_framework_DEVICE_WIDTH;
var bb_framework_DEVICE_HEIGHT;
var bb_framework_SCREEN_WIDTH;
var bb_framework_SCREEN_HEIGHT;
var bb_framework_SCREEN_WIDTH2;
var bb_framework_SCREEN_HEIGHT2;
var bb_framework_SCREENX_RATIO;
var bb_framework_SCREENY_RATIO;
function bb_input_MouseX(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<92>";
	var bbt_=bb_input_device.MouseX();
	pop_err();
	return bbt_;
}
function bb_input_MouseY(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<96>";
	var bbt_=bb_input_device.MouseY();
	pop_err();
	return bbt_;
}
var bb_random_Seed;
function bb_framework_DeltaTimer(){
	Object.call(this);
	this.bb_targetfps=60.0;
	this.bb_lastticks=.0;
	this.bb_delta=.0;
	this.bb_frametime=.0;
	this.bb_currentticks=.0;
}
function bb_framework_new9(bbt_fps){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<492>";
	this.bb_targetfps=bbt_fps;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<493>";
	this.bb_lastticks=(bb_app_Millisecs());
	pop_err();
	return this;
}
function bb_framework_new10(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<484>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_framework_DeltaTimer.prototype.bbm_UpdateDelta=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<497>";
	this.bb_currentticks=(bb_app_Millisecs());
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<498>";
	this.bb_frametime=this.bb_currentticks-this.bb_lastticks;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<499>";
	this.bb_delta=this.bb_frametime/(1000.0/this.bb_targetfps);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<500>";
	this.bb_lastticks=this.bb_currentticks;
	pop_err();
}
function bb_app_Millisecs(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<157>";
	var bbt_=bb_app_device.MilliSecs();
	pop_err();
	return bbt_;
}
var bb_framework_dt;
function bb_app_SetUpdateRate(bbt_hertz){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<149>";
	var bbt_=bb_app_device.SetUpdateRate(bbt_hertz);
	pop_err();
	return bbt_;
}
function bb_framework_Sprite(){
	Object.call(this);
	this.bb_image=null;
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_alpha=1.0;
	this.bb_hitBoxX=0;
	this.bb_hitBoxY=0;
	this.bb_hitBoxWidth=0;
	this.bb_hitBoxHeight=0;
	this.bb_visible=false;
	this.bb_name="";
	this.bb_red=255;
	this.bb_green=255;
	this.bb_blue=255;
	this.bb_rotation=.0;
	this.bb_scaleX=1.0;
	this.bb_scaleY=1.0;
	this.bb_frame=0;
}
bb_framework_Sprite.prototype.bbm_SetHitBox=function(bbt_hitX,bbt_hitY,bbt_hitWidth,bbt_hitHeight){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1126>";
	this.bb_hitBoxX=bbt_hitX;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1127>";
	this.bb_hitBoxY=bbt_hitY;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1128>";
	this.bb_hitBoxWidth=bbt_hitWidth;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1129>";
	this.bb_hitBoxHeight=bbt_hitHeight;
	pop_err();
}
function bb_framework_new11(bbt_img,bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<948>";
	dbg_object(this).bb_image=bbt_img;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<949>";
	dbg_object(this).bb_x=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<950>";
	dbg_object(this).bb_y=bbt_y;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<951>";
	dbg_object(this).bb_alpha=1.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<952>";
	this.bbm_SetHitBox(((-dbg_object(bbt_img).bb_w2)|0),((-dbg_object(bbt_img).bb_h2)|0),dbg_object(bbt_img).bb_w,dbg_object(bbt_img).bb_h);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<953>";
	dbg_object(this).bb_visible=true;
	pop_err();
	return this;
}
function bb_framework_new12(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<905>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_framework_Sprite.prototype.bbm_Draw=function(bbt_offsetx,bbt_offsety,bbt_rounded){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1090>";
	if(this.bb_x-bbt_offsetx+(dbg_object(this.bb_image).bb_w)<0.0 || this.bb_x-bbt_offsetx-(dbg_object(this.bb_image).bb_w)>=bb_framework_SCREEN_WIDTH || this.bb_y-bbt_offsety+(dbg_object(this.bb_image).bb_h)<0.0 || this.bb_y-bbt_offsety-(dbg_object(this.bb_image).bb_h)>=bb_framework_SCREEN_HEIGHT){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1091>";
	if(dbg_object(this).bb_alpha>1.0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1091>";
		dbg_object(this).bb_alpha=1.0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1092>";
	if(dbg_object(this).bb_alpha<0.0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1092>";
		dbg_object(this).bb_alpha=0.0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1093>";
	bb_graphics_SetAlpha(dbg_object(this).bb_alpha);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1094>";
	bb_graphics_SetColor((this.bb_red),(this.bb_green),(this.bb_blue));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1095>";
	if(bbt_rounded){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1096>";
		bb_graphics_DrawImage2(dbg_object(this.bb_image).bb_image,Math.floor(this.bb_x-bbt_offsetx+0.5),Math.floor(this.bb_y-bbt_offsety+0.5),this.bb_rotation,this.bb_scaleX,this.bb_scaleY,this.bb_frame);
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1098>";
		bb_graphics_DrawImage2(dbg_object(this.bb_image).bb_image,this.bb_x-bbt_offsetx,this.bb_y-bbt_offsety,this.bb_rotation,this.bb_scaleX,this.bb_scaleY,this.bb_frame);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1101>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1102>";
	bb_graphics_SetAlpha(1.0);
	pop_err();
}
bb_framework_Sprite.prototype.bbm_Draw2=function(bbt_rounded){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1086>";
	this.bbm_Draw(0.0,0.0,bbt_rounded);
	pop_err();
}
bb_framework_Sprite.prototype.bbm_Draw3=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1082>";
	this.bbm_Draw(0.0,0.0,false);
	pop_err();
}
function bb_framework_Particle(){
	bb_framework_Sprite.call(this);
}
bb_framework_Particle.prototype=extend_class(bb_framework_Sprite);
var bb_framework_MAX_PARTICLES;
function bb_framework_new13(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1133>";
	bb_framework_new12.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1133>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
var bb_framework_particles;
function bb_framework_Cache(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1148>";
	for(var bbt_i=0;bbt_i<=bb_framework_MAX_PARTICLES-1;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<1149>";
		dbg_array(bb_framework_particles,bbt_i)[bbt_i]=bb_framework_new13.call(new bb_framework_Particle)
	}
	pop_err();
}
function bb_framework_FPSCounter(){
	Object.call(this);
}
var bb_framework_startTime;
var bb_framework_fpsCount;
var bb_framework_totalFPS;
function bb_framework_Update(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<469>";
	if(bb_app_Millisecs()-bb_framework_startTime>=1000){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<470>";
		bb_framework_totalFPS=bb_framework_fpsCount;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<471>";
		bb_framework_fpsCount=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<472>";
		bb_framework_startTime=bb_app_Millisecs();
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<474>";
		bb_framework_fpsCount+=1;
	}
	pop_err();
}
function bb_framework_Draw(bbt_x,bbt_y,bbt_ax,bbt_ay){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<479>";
	bb_graphics_DrawText("FPS: "+String(bb_framework_totalFPS),(bbt_x),(bbt_y),bbt_ax,bbt_ay);
	pop_err();
}
function bb_graphics_PushMatrix(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<341>";
	var bbt_sp=dbg_object(bb_graphics_context).bb_matrixSp;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<342>";
	var bbt_=bbt_sp+0;
	dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_)[bbt_]=dbg_object(bb_graphics_context).bb_ix
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<343>";
	var bbt_2=bbt_sp+1;
	dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_2)[bbt_2]=dbg_object(bb_graphics_context).bb_iy
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<344>";
	var bbt_3=bbt_sp+2;
	dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_3)[bbt_3]=dbg_object(bb_graphics_context).bb_jx
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<345>";
	var bbt_4=bbt_sp+3;
	dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_4)[bbt_4]=dbg_object(bb_graphics_context).bb_jy
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<346>";
	var bbt_5=bbt_sp+4;
	dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_5)[bbt_5]=dbg_object(bb_graphics_context).bb_tx
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<347>";
	var bbt_6=bbt_sp+5;
	dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_6)[bbt_6]=dbg_object(bb_graphics_context).bb_ty
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<348>";
	dbg_object(bb_graphics_context).bb_matrixSp=bbt_sp+6;
	pop_err();
	return 0;
}
function bb_graphics_Transform(bbt_ix,bbt_iy,bbt_jx,bbt_jy,bbt_tx,bbt_ty){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<358>";
	var bbt_ix2=bbt_ix*dbg_object(bb_graphics_context).bb_ix+bbt_iy*dbg_object(bb_graphics_context).bb_jx;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<359>";
	var bbt_iy2=bbt_ix*dbg_object(bb_graphics_context).bb_iy+bbt_iy*dbg_object(bb_graphics_context).bb_jy;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<360>";
	var bbt_jx2=bbt_jx*dbg_object(bb_graphics_context).bb_ix+bbt_jy*dbg_object(bb_graphics_context).bb_jx;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<361>";
	var bbt_jy2=bbt_jx*dbg_object(bb_graphics_context).bb_iy+bbt_jy*dbg_object(bb_graphics_context).bb_jy;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<362>";
	var bbt_tx2=bbt_tx*dbg_object(bb_graphics_context).bb_ix+bbt_ty*dbg_object(bb_graphics_context).bb_jx+dbg_object(bb_graphics_context).bb_tx;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<363>";
	var bbt_ty2=bbt_tx*dbg_object(bb_graphics_context).bb_iy+bbt_ty*dbg_object(bb_graphics_context).bb_jy+dbg_object(bb_graphics_context).bb_ty;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<364>";
	bb_graphics_SetMatrix(bbt_ix2,bbt_iy2,bbt_jx2,bbt_jy2,bbt_tx2,bbt_ty2);
	pop_err();
	return 0;
}
function bb_graphics_Transform2(bbt_coords){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<582>";
	var bbt_out=new_number_array(bbt_coords.length);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<583>";
	for(var bbt_i=0;bbt_i<bbt_coords.length-1;bbt_i=bbt_i+2){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<584>";
		var bbt_x=dbg_array(bbt_coords,bbt_i)[bbt_i];
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<584>";
		var bbt_=bbt_i+1;
		var bbt_y=dbg_array(bbt_coords,bbt_)[bbt_];
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<585>";
		dbg_array(bbt_out,bbt_i)[bbt_i]=bbt_x*dbg_object(bb_graphics_context).bb_ix+bbt_y*dbg_object(bb_graphics_context).bb_jx+dbg_object(bb_graphics_context).bb_tx
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<586>";
		var bbt_2=bbt_i+1;
		dbg_array(bbt_out,bbt_2)[bbt_2]=bbt_x*dbg_object(bb_graphics_context).bb_iy+bbt_y*dbg_object(bb_graphics_context).bb_jy+dbg_object(bb_graphics_context).bb_ty
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<588>";
	pop_err();
	return bbt_out;
}
function bb_graphics_Scale(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<372>";
	bb_graphics_Transform(bbt_x,0.0,0.0,bbt_y,0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_PopMatrix(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<352>";
	var bbt_sp=dbg_object(bb_graphics_context).bb_matrixSp-6;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<353>";
	var bbt_=bbt_sp+0;
	var bbt_2=bbt_sp+1;
	var bbt_3=bbt_sp+2;
	var bbt_4=bbt_sp+3;
	var bbt_5=bbt_sp+4;
	var bbt_6=bbt_sp+5;
	bb_graphics_SetMatrix(dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_)[bbt_],dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_2)[bbt_2],dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_3)[bbt_3],dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_4)[bbt_4],dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_5)[bbt_5],dbg_array(dbg_object(bb_graphics_context).bb_matrixStack,bbt_6)[bbt_6]);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<354>";
	dbg_object(bb_graphics_context).bb_matrixSp=bbt_sp;
	pop_err();
	return 0;
}
function bb_graphics_DebugRenderDevice(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<237>";
	if(!((bb_graphics_renderDevice)!=null)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<237>";
		error("Rendering operations can only be performed inside OnRender");
	}
	pop_err();
	return 0;
}
function bb_graphics_ValidateMatrix(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<230>";
	if((dbg_object(bb_graphics_context).bb_matDirty)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<231>";
		dbg_object(bb_graphics_context).bb_device.SetMatrix(dbg_object(bb_graphics_context).bb_ix,dbg_object(bb_graphics_context).bb_iy,dbg_object(bb_graphics_context).bb_jx,dbg_object(bb_graphics_context).bb_jy,dbg_object(bb_graphics_context).bb_tx,dbg_object(bb_graphics_context).bb_ty);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<232>";
		dbg_object(bb_graphics_context).bb_matDirty=0;
	}
	pop_err();
	return 0;
}
function bb_graphics_DrawRect(bbt_x,bbt_y,bbt_w,bbt_h){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<388>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<390>";
	bb_graphics_ValidateMatrix();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<391>";
	bb_graphics_renderDevice.DrawRect(bbt_x,bbt_y,bbt_w,bbt_h);
	pop_err();
	return 0;
}
function bb_graphics_Translate(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<368>";
	bb_graphics_Transform(1.0,0.0,0.0,1.0,bbt_x,bbt_y);
	pop_err();
	return 0;
}
function bb_graphics_DrawImage(bbt_image,bbt_x,bbt_y,bbt_frame){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<436>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<438>";
	var bbt_f=dbg_array(dbg_object(bbt_image).bb_frames,bbt_frame)[bbt_frame];
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<440>";
	if((dbg_object(bb_graphics_context).bb_tformed)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<441>";
		bb_graphics_PushMatrix();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<443>";
		bb_graphics_Translate(bbt_x-dbg_object(bbt_image).bb_tx,bbt_y-dbg_object(bbt_image).bb_ty);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<445>";
		bb_graphics_ValidateMatrix();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<447>";
		if((dbg_object(bbt_image).bb_flags&65536)!=0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<448>";
			dbg_object(bb_graphics_context).bb_device.DrawSurface(dbg_object(bbt_image).bb_surface,0.0,0.0);
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<450>";
			dbg_object(bb_graphics_context).bb_device.DrawSurface2(dbg_object(bbt_image).bb_surface,0.0,0.0,dbg_object(bbt_f).bb_x,dbg_object(bbt_f).bb_y,dbg_object(bbt_image).bb_width,dbg_object(bbt_image).bb_height);
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<453>";
		bb_graphics_PopMatrix();
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<455>";
		bb_graphics_ValidateMatrix();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<457>";
		if((dbg_object(bbt_image).bb_flags&65536)!=0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<458>";
			dbg_object(bb_graphics_context).bb_device.DrawSurface(dbg_object(bbt_image).bb_surface,bbt_x-dbg_object(bbt_image).bb_tx,bbt_y-dbg_object(bbt_image).bb_ty);
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<460>";
			dbg_object(bb_graphics_context).bb_device.DrawSurface2(dbg_object(bbt_image).bb_surface,bbt_x-dbg_object(bbt_image).bb_tx,bbt_y-dbg_object(bbt_image).bb_ty,dbg_object(bbt_f).bb_x,dbg_object(bbt_f).bb_y,dbg_object(bbt_image).bb_width,dbg_object(bbt_image).bb_height);
		}
	}
	pop_err();
	return 0;
}
function bb_graphics_Rotate(bbt_angle){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<376>";
	bb_graphics_Transform(Math.cos((bbt_angle)*D2R),-Math.sin((bbt_angle)*D2R),Math.sin((bbt_angle)*D2R),Math.cos((bbt_angle)*D2R),0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_DrawImage2(bbt_image,bbt_x,bbt_y,bbt_rotation,bbt_scaleX,bbt_scaleY,bbt_frame){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<467>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<469>";
	var bbt_f=dbg_array(dbg_object(bbt_image).bb_frames,bbt_frame)[bbt_frame];
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<471>";
	bb_graphics_PushMatrix();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<473>";
	bb_graphics_Translate(bbt_x,bbt_y);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<474>";
	bb_graphics_Rotate(bbt_rotation);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<475>";
	bb_graphics_Scale(bbt_scaleX,bbt_scaleY);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<477>";
	bb_graphics_Translate(-dbg_object(bbt_image).bb_tx,-dbg_object(bbt_image).bb_ty);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<479>";
	bb_graphics_ValidateMatrix();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<481>";
	if((dbg_object(bbt_image).bb_flags&65536)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<482>";
		dbg_object(bb_graphics_context).bb_device.DrawSurface(dbg_object(bbt_image).bb_surface,0.0,0.0);
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<484>";
		dbg_object(bb_graphics_context).bb_device.DrawSurface2(dbg_object(bbt_image).bb_surface,0.0,0.0,dbg_object(bbt_f).bb_x,dbg_object(bbt_f).bb_y,dbg_object(bbt_image).bb_width,dbg_object(bbt_image).bb_height);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<487>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
function bb_graphics_DrawText(bbt_text,bbt_x,bbt_y,bbt_xalign,bbt_yalign){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<562>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<564>";
	if(!((dbg_object(bb_graphics_context).bb_font)!=null)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<564>";
		pop_err();
		return 0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<566>";
	var bbt_w=dbg_object(bb_graphics_context).bb_font.bbm_Width();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<567>";
	var bbt_h=dbg_object(bb_graphics_context).bb_font.bbm_Height();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<569>";
	bbt_x-=(bbt_w*bbt_text.length)*bbt_xalign;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<570>";
	bbt_y-=(bbt_h)*bbt_yalign;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<572>";
	for(var bbt_i=0;bbt_i<bbt_text.length;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<573>";
		var bbt_ch=bbt_text.charCodeAt(bbt_i)-dbg_object(bb_graphics_context).bb_firstChar;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<574>";
		if(bbt_ch>=0 && bbt_ch<dbg_object(bb_graphics_context).bb_font.bbm_Frames()){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<575>";
			bb_graphics_DrawImage(dbg_object(bb_graphics_context).bb_font,bbt_x+(bbt_i*bbt_w),bbt_y,bbt_ch);
		}
	}
	pop_err();
	return 0;
}
function bb_assert_AssertError(bbt_msg){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/assert.monkey<105>";
	print(bbt_msg);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/assert.monkey<106>";
	error(bbt_msg);
	pop_err();
}
function bb_assert_Assert(bbt_val,bbt_msg){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/assert.monkey<12>";
	if(!bbt_val){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/assert.monkey<12>";
		bb_assert_AssertError(bbt_msg);
	}
	pop_err();
}
function bb_functions_RSet(bbt_str,bbt_n,bbt_char){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<196>";
	var bbt_rep="";
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<197>";
	for(var bbt_i=1;bbt_i<=bbt_n;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<198>";
		bbt_rep=bbt_rep+bbt_char;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<200>";
	bbt_str=bbt_rep+bbt_str;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<201>";
	var bbt_=bbt_str.slice(bbt_str.length-bbt_n);
	pop_err();
	return bbt_;
}
function bb_functions_FormatNumber(bbt_number,bbt_decimal,bbt_comma,bbt_padleft){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<247>";
	bb_assert_Assert(bbt_decimal>-1 && bbt_comma>-1 && bbt_padleft>-1,"Negative numbers not allowed in FormatNumber()");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<249>";
	var bbt_str=String(bbt_number);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<250>";
	var bbt_dl=bbt_str.indexOf(".",0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<251>";
	if(bbt_decimal==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<251>";
		bbt_decimal=-1;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<252>";
	bbt_str=bbt_str.slice(0,bbt_dl+bbt_decimal+1);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<254>";
	if((bbt_comma)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<255>";
		while(bbt_dl>bbt_comma){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<256>";
			bbt_str=bbt_str.slice(0,bbt_dl-bbt_comma)+","+bbt_str.slice(bbt_dl-bbt_comma);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<257>";
			bbt_dl-=bbt_comma;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<261>";
	if((bbt_padleft)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<262>";
		var bbt_paddedLength=bbt_padleft+bbt_decimal+1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<263>";
		if(bbt_paddedLength<bbt_str.length){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<263>";
			bbt_str="Error";
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<264>";
		bbt_str=bb_functions_RSet(bbt_str,bbt_paddedLength," ");
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<266>";
	pop_err();
	return bbt_str;
}
function bb_audio_MusicState(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<97>";
	var bbt_=bb_audio_device.MusicState();
	pop_err();
	return bbt_;
}
function bb_framework_SoundPlayer(){
	Object.call(this);
}
var bb_framework_channel;
var bb_framework_playerChannelState;
function bb_framework_PlayFx(bbt_s,bbt_pan,bbt_rate,bbt_volume,bbt_loop,bbt_playChannel){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<877>";
	if(bbt_playChannel==-1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<878>";
		var bbt_cnt=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<879>";
		bb_framework_channel+=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<880>";
		if(bb_framework_channel>31){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<880>";
			bb_framework_channel=0;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<881>";
		while(dbg_array(bb_framework_playerChannelState,bb_framework_channel)[bb_framework_channel]==1){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<882>";
			bb_framework_channel+=1;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<883>";
			if(bb_framework_channel>31){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<883>";
				bb_framework_channel=0;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<884>";
			bbt_cnt=1;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<885>";
			if(bbt_cnt>62){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<885>";
				break;
			}
		}
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<888>";
		bb_framework_channel=bbt_playChannel;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<889>";
		dbg_array(bb_framework_playerChannelState,bbt_playChannel)[bbt_playChannel]=0
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<892>";
	bb_audio_StopChannel(bb_framework_channel);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<893>";
	bb_audio_PlaySound(bbt_s,bb_framework_channel,bbt_loop);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<894>";
	bb_audio_SetChannelPan(bb_framework_channel,bbt_pan);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<895>";
	bb_audio_SetChannelRate(bb_framework_channel,bbt_rate);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<896>";
	bb_audio_SetChannelVolume(bb_framework_channel,bbt_volume);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<897>";
	if((bbt_loop)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<898>";
		dbg_array(bb_framework_playerChannelState,bb_framework_channel)[bb_framework_channel]=1
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/framework.monkey<900>";
	pop_err();
	return bb_framework_channel;
}
function bb_input_TouchHit(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<121>";
	var bbt_=bb_input_device.KeyHit(384+bbt_index);
	pop_err();
	return bbt_;
}
function bb_input_TouchDown(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<117>";
	var bbt_=bb_input_device.KeyDown(384+bbt_index);
	pop_err();
	return bbt_;
}
function bb_input_TouchX(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<109>";
	var bbt_=bb_input_device.TouchX(bbt_index);
	pop_err();
	return bbt_;
}
function bb_input_TouchY(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<113>";
	var bbt_=bb_input_device.TouchY(bbt_index);
	pop_err();
	return bbt_;
}
function bb_input_MouseHit(bbt_button){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<104>";
	var bbt_=bb_input_device.KeyHit(1+bbt_button);
	pop_err();
	return bbt_;
}
function bb_input_MouseDown(bbt_button){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<100>";
	var bbt_=bb_input_device.KeyDown(1+bbt_button);
	pop_err();
	return bbt_;
}
function bb_input_KeyHit(bbt_key){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<77>";
	var bbt_=bb_input_device.KeyHit(bbt_key);
	pop_err();
	return bbt_;
}
function bb_input_KeyDown(bbt_key){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/input.monkey<73>";
	var bbt_=bb_input_device.KeyDown(bbt_key);
	pop_err();
	return bbt_;
}
function bb_audio_SetMusicVolume(bbt_volume){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<101>";
	bb_audio_device.SetMusicVolume(bbt_volume);
	pop_err();
	return 0;
}
function bb_audio_SetChannelVolume(bbt_channel,bbt_volume){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<77>";
	bb_audio_device.SetVolume(bbt_channel,bbt_volume);
	pop_err();
	return 0;
}
function bb_screens_TitleScreen(){
	bb_framework_Screen.call(this);
	this.bb_bgImage=null;
	this.bb_playMenu=null;
	this.bb_leftMenu=null;
	this.bb_rightMenu=null;
	this.bb_musicFormat="";
}
bb_screens_TitleScreen.prototype=extend_class(bb_framework_Screen);
function bb_screens_new(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<18>";
	bb_framework_new2.call(this);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<19>";
	this.bb_name="TitleScreen";
	pop_err();
	return this;
}
bb_screens_TitleScreen.prototype.bbm_Start=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<23>";
	var bbt_b=null;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<25>";
	this.bb_bgImage=bb_graphics_LoadImage("graphics/mainMenu.png",1,bb_graphics_DefaultFlags);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<27>";
	dbg_object(bb_framework_game).bb_screenFade.bbm_Start2(50.0,false,false,false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<28>";
	this.bb_playMenu=bb_simplegui_new3.call(new bb_simplegui_SimpleMenu,"ButtonOver","ButtonClick",306,400,10,false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<29>";
	bbt_b=this.bb_playMenu.bbm_AddButton("playMenuButton.png","playMenuButtonHover.png","");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<31>";
	this.bb_leftMenu=bb_simplegui_new3.call(new bb_simplegui_SimpleMenu,"ButtonOver","ButtonClick",20,430,10,false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<32>";
	bbt_b=this.bb_leftMenu.bbm_AddButton("helpMenuButton.png","helpMenuButtonHover.png","");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<33>";
	bbt_b=this.bb_leftMenu.bbm_AddButton("creditsMenuButton.png","creditsMenuButtonHover.png","");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<35>";
	this.bb_rightMenu=bb_simplegui_new3.call(new bb_simplegui_SimpleMenu,"ButtonOver","ButtonClick",750,430,30,false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<36>";
	bbt_b=this.bb_rightMenu.bbm_AddButton("menuExitButton.png","menuExitButtonHover.png","");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<41>";
	this.bb_musicFormat="ogg";
	pop_err();
}
bb_screens_TitleScreen.prototype.bbm_Render=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<56>";
	bb_graphics_Cls(0.0,0.0,0.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<59>";
	bb_graphics_DrawImage(this.bb_bgImage,0.0,0.0,0);
	pop_err();
}
bb_screens_TitleScreen.prototype.bbm_ExtraRender=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<63>";
	this.bb_playMenu.bbm_Draw3();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<64>";
	this.bb_leftMenu.bbm_Draw3();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<65>";
	this.bb_rightMenu.bbm_Draw3();
	pop_err();
}
bb_screens_TitleScreen.prototype.bbm_Update2=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<69>";
	this.bb_playMenu.bbm_Update2();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<70>";
	this.bb_leftMenu.bbm_Update2();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<71>";
	this.bb_rightMenu.bbm_Update2();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<73>";
	if((this.bb_playMenu.bbm_Clicked("playMenuButton"))!=0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<74>";
		dbg_object(bb_framework_game).bb_screenFade.bbm_Start2(50.0,true,false,false);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<75>";
		dbg_object(bb_framework_game).bb_nextScreen=(bb_globals_gGameScreen);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<78>";
	if((this.bb_leftMenu.bbm_Clicked("creditsMenuButton"))!=0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<79>";
		dbg_object(bb_framework_game).bb_screenFade.bbm_Start2(50.0,true,false,false);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<80>";
		dbg_object(bb_framework_game).bb_nextScreen=(bb_globals_gCreditsScreen);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<83>";
	if((this.bb_leftMenu.bbm_Clicked("helpMenuButton"))!=0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<84>";
		dbg_object(bb_framework_game).bb_screenFade.bbm_Start2(50.0,true,false,false);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<85>";
		dbg_object(bb_framework_game).bb_nextScreen=(bb_globals_gHelpScreen);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<94>";
	if(((bb_input_KeyHit(27))!=0) || ((this.bb_rightMenu.bbm_Clicked("menuExitButton"))!=0)){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<95>";
		dbg_object(bb_framework_game).bb_screenFade.bbm_Start2(50.0,true,false,false);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<96>";
		dbg_object(bb_framework_game).bb_nextScreen=(dbg_object(bb_framework_game).bb_exitScreen);
	}
	pop_err();
}
var bb_globals_gTitleScreen;
function bb_screens_BackgroundScreen(){
	bb_framework_Screen.call(this);
	this.bb_imageName="";
	this.bb_bgImage=null;
}
bb_screens_BackgroundScreen.prototype=extend_class(bb_framework_Screen);
function bb_screens_new2(bbt_imageName){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<107>";
	bb_framework_new2.call(this);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<108>";
	this.bb_name="CreditsScreen";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<109>";
	dbg_object(this).bb_imageName=bbt_imageName;
	pop_err();
	return this;
}
function bb_screens_new3(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<102>";
	bb_framework_new2.call(this);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<102>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_screens_BackgroundScreen.prototype.bbm_Start=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<113>";
	this.bb_bgImage=bb_graphics_LoadImage(this.bb_imageName,1,bb_graphics_DefaultFlags);
	pop_err();
}
bb_screens_BackgroundScreen.prototype.bbm_Render=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<117>";
	bb_graphics_Cls(0.0,0.0,0.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<118>";
	bb_graphics_DrawImage(this.bb_bgImage,0.0,0.0,0);
	pop_err();
}
bb_screens_BackgroundScreen.prototype.bbm_ExtraRender=function(){
	push_err();
	pop_err();
}
bb_screens_BackgroundScreen.prototype.bbm_Update2=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<125>";
	if((bb_input_KeyHit(27))!=0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<126>";
		dbg_object(bb_framework_game).bb_screenFade.bbm_Start2(50.0,true,false,false);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/screens.monkey<127>";
		dbg_object(bb_framework_game).bb_nextScreen=(bb_globals_gTitleScreen);
	}
	pop_err();
}
var bb_globals_gCreditsScreen;
var bb_globals_gHelpScreen;
function bb_game_screen_GameScreen(){
	bb_framework_Screen.call(this);
	this.bb_menu=null;
	this.bb_won=false;
	this.bb_numberOfPlayers=1.0;
	this.bb_tank=null;
	this.bb_running=false;
	this.bb_start=.0;
	this.bb_comparator=bb_game_screen_new2.call(new bb_game_screen_TankComparator);
	this.bb_delay=2000.0;
	this.bb_mousePosition=bb_vector_new.call(new bb_vector_Vector,0.0,0.0);
}
bb_game_screen_GameScreen.prototype=extend_class(bb_framework_Screen);
function bb_game_screen_new(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<14>";
	bb_framework_new2.call(this);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<14>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_game_screen_GameScreen.prototype.bbm_LoadParticleSystem=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<170>";
	var bbt_parser=bb_xml_new.call(new bb_xml_XMLParser);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<171>";
	var bbt_doc=bbt_parser.bbm_ParseFile("psystem.xml");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<172>";
	bb_globals_gPS=bb_psystem_new2.call(new bb_psystem_ParticleSystem,bbt_doc);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<174>";
	bb_globals_gGroupSmoke=bb_globals_gPS.bbm_GetGroup("group1");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<175>";
	bb_globals_gEmitterSmoke=bb_globals_gPS.bbm_GetEmitter("emit1");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<177>";
	bb_globals_gGroupExplosion=bb_globals_gPS.bbm_GetGroup("group2");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<178>";
	bb_globals_gEmitterExplosion=bb_globals_gPS.bbm_GetEmitter("emit2");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<180>";
	var bbt_speck=bb_graphics_LoadImage("speck.png",1,1);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<181>";
	bb_globals_gEmitterSmoke.bbm_ParticleImage2(bbt_speck);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<182>";
	bb_globals_gEmitterExplosion.bbm_ParticleImage2(bbt_speck);
	pop_err();
}
bb_game_screen_GameScreen.prototype.bbm_Start=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<32>";
	dbg_object(bb_framework_game).bb_screenFade.bbm_Start2(50.0,false,false,false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<33>";
	this.bb_menu=bb_simplegui_new3.call(new bb_simplegui_SimpleMenu,"ButtonOver","ButtonClick",756,0,10,true);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<34>";
	var bbt_b=this.bb_menu.bbm_AddButton("quitInGameButton.png","quitInGameButtonHover.png","");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<36>";
	bb_globals_gGameOver=false;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<37>";
	this.bb_won=true;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<39>";
	bb_globals_gWorld=bb_world_new.call(new bb_world_World,"World1");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<41>";
	bb_globals_gProjectileManager=bb_managers_new.call(new bb_managers_ProjectileManager);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<42>";
	bb_globals_gTanks=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<44>";
	var bbt_playersToPlace=((this.bb_numberOfPlayers)|0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<46>";
	while(dbg_object(bb_globals_gWorld).bb_spawnPoints.bbm_Size()>0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<47>";
		var bbt_spawn=((bb_random_Rnd2(0.0,(dbg_object(bb_globals_gWorld).bb_spawnPoints.bbm_Size())))|0);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<49>";
		if(bbt_playersToPlace>0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<50>";
			this.bb_tank=bb_tank_new.call(new bb_tank_Tank,dbg_object(dbg_object(bb_globals_gWorld).bb_spawnPoints.bbm_Get2(bbt_spawn)).bb_vector);
			err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<51>";
			dbg_object(this.bb_tank).bb_rotation=dbg_object(dbg_object(bb_globals_gWorld).bb_spawnPoints.bbm_Get2(bbt_spawn)).bb_rotation;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<52>";
			bb_globals_gTanks.bbm_Add(this.bb_tank);
			err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<53>";
			bbt_playersToPlace=bbt_playersToPlace-1;
		}else{
			err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<55>";
			var bbt_aitank=bb_aitank_new.call(new bb_aitank_AITank,dbg_object(dbg_object(bb_globals_gWorld).bb_spawnPoints.bbm_Get2(bbt_spawn)).bb_vector);
			err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<56>";
			dbg_object(bbt_aitank).bb_rotation=dbg_object(dbg_object(bb_globals_gWorld).bb_spawnPoints.bbm_Get2(bbt_spawn)).bb_rotation;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<57>";
			bb_globals_gTanks.bbm_Add(bbt_aitank);
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<60>";
		dbg_object(bb_globals_gWorld).bb_spawnPoints.bbm_RemoveAt(bbt_spawn);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<63>";
	this.bbm_LoadParticleSystem();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<65>";
	this.bb_running=false;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<66>";
	this.bb_start=(bb_app_Millisecs());
	pop_err();
}
bb_game_screen_GameScreen.prototype.bbm_Render=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<71>";
	bb_graphics_Cls(0.0,0.0,0.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<73>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<74>";
	bb_graphics_DrawRect(0.0,0.0,bb_framework_SCREEN_WIDTH,bb_framework_SCREEN_HEIGHT);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<76>";
	bb_globals_gWorld.bbm_RenderBackground();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<77>";
	bb_globals_gProjectileManager.bbm_OnRender();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<80>";
	bb_globals_gTanks.bbm_Sort(false,(this.bb_comparator));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<81>";
	var bbt_t=null;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<82>";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<82>";
	var bbt_=bb_globals_gTanks.bbm_ObjectEnumerator();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<82>";
	while(bbt_.bbm_HasNext()){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<82>";
		bbt_t=bbt_.bbm_NextObject();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<83>";
		bbt_t.bbm_OnRender();
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<86>";
	bb_globals_gWorld.bbm_RenderForeground();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<87>";
	bb_globals_gPS.bbm_Render();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<88>";
	this.bb_menu.bbm_Draw3();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<90>";
	if(bb_globals_gGameOver && this.bb_won){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<91>";
		bb_graphics_DrawImage2(dbg_object(dbg_object(bb_framework_game).bb_images.bbm_Find("Win")).bb_image,480.0,320.0,0.0,1.0,1.0,0);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<94>";
	if(bb_globals_gGameOver && !this.bb_won){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<95>";
		bb_graphics_DrawImage2(dbg_object(dbg_object(bb_framework_game).bb_images.bbm_Find("Fail")).bb_image,480.0,320.0,0.0,1.0,1.0,0);
	}
	pop_err();
}
bb_game_screen_GameScreen.prototype.bbm_ProcessInput=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<143>";
	if((this.bb_menu.bbm_Clicked("quitInGameButton"))!=0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<144>";
		dbg_object(bb_framework_game).bb_screenFade.bbm_Start2(50.0,true,false,false);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<145>";
		dbg_object(bb_framework_game).bb_nextScreen=(bb_globals_gTitleScreen);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<148>";
	if(bb_globals_gGameOver){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<152>";
	dbg_object(this.bb_tank).bb_forward=bb_input_KeyDown(87)==1;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<153>";
	dbg_object(this.bb_tank).bb_backward=bb_input_KeyDown(83)==1;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<154>";
	dbg_object(this.bb_tank).bb_left=bb_input_KeyDown(65)==1;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<155>";
	dbg_object(this.bb_tank).bb_right=bb_input_KeyDown(68)==1;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<157>";
	dbg_object(this.bb_mousePosition).bb_X=(dbg_object(bb_framework_game).bb_mouseX);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<158>";
	dbg_object(this.bb_mousePosition).bb_Y=(dbg_object(bb_framework_game).bb_mouseY);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<159>";
	dbg_object(this.bb_tank).bb_weapon.bbm_AimAt(this.bb_mousePosition);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<163>";
	if(bb_input_MouseHit(0)==1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<164>";
		dbg_object(this.bb_tank).bb_weapon.bbm_Fire();
	}
	pop_err();
}
bb_game_screen_GameScreen.prototype.bbm_Update2=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<100>";
	this.bb_menu.bbm_Update2();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<102>";
	if(!this.bb_running){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<103>";
		var bbt_currentTime=(bb_app_Millisecs());
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<104>";
		if(bbt_currentTime-this.bb_start>this.bb_delay){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<105>";
			this.bb_running=true;
		}else{
			pop_err();
			return;
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<111>";
	if(!bb_globals_gGameOver && dbg_object(this.bb_tank).bb_health<=0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<113>";
		bb_globals_gGameOver=true;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<114>";
		this.bb_won=false;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<118>";
	bb_globals_gAlive=0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<119>";
	var bbt_t=null;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<120>";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<120>";
	var bbt_=bb_globals_gTanks.bbm_ObjectEnumerator();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<120>";
	while(bbt_.bbm_HasNext()){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<120>";
		bbt_t=bbt_.bbm_NextObject();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<121>";
		if(dbg_object(bbt_t).bb_health>0.0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<122>";
			bb_globals_gAlive+=1;
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<126>";
	if(bb_globals_gAlive==1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<127>";
		bb_globals_gGameOver=true;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<130>";
	this.bbm_ProcessInput();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<132>";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<132>";
	var bbt_2=bb_globals_gTanks.bbm_ObjectEnumerator();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<132>";
	while(bbt_2.bbm_HasNext()){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<132>";
		bbt_t=bbt_2.bbm_NextObject();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<133>";
		bbt_t.bbm_OnUpdate();
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<136>";
	bb_globals_gPS.bbm_Update(dbg_object(bb_framework_dt).bb_frametime);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<137>";
	bb_globals_gProjectileManager.bbm_OnUpdate();
	pop_err();
}
var bb_globals_gGameScreen;
function bb_functions_StripExt(bbt_path){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<220>";
	var bbt_i=bbt_path.lastIndexOf(".");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<221>";
	if(bbt_i!=-1 && bbt_path.indexOf("/",bbt_i+1)==-1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<221>";
		var bbt_=bbt_path.slice(0,bbt_i);
		pop_err();
		return bbt_;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<222>";
	pop_err();
	return bbt_path;
}
function bb_functions_StripDir(bbt_path){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<214>";
	var bbt_i=bbt_path.lastIndexOf("/");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<215>";
	if(bbt_i!=-1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<215>";
		var bbt_=bbt_path.slice(bbt_i+1);
		pop_err();
		return bbt_;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<216>";
	pop_err();
	return bbt_path;
}
function bb_functions_StripAll(bbt_path){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<226>";
	var bbt_=bb_functions_StripDir(bb_functions_StripExt(bbt_path));
	pop_err();
	return bbt_;
}
function bb_map_Node(){
	Object.call(this);
	this.bb_key=null;
	this.bb_right=null;
	this.bb_left=null;
	this.bb_value=null;
	this.bb_color=0;
	this.bb_parent=null;
}
function bb_map_new3(bbt_key,bbt_value,bbt_color,bbt_parent){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<331>";
	dbg_object(this).bb_key=bbt_key;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<332>";
	dbg_object(this).bb_value=bbt_value;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<333>";
	dbg_object(this).bb_color=bbt_color;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<334>";
	dbg_object(this).bb_parent=bbt_parent;
	pop_err();
	return this;
}
function bb_map_new4(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/map.monkey<328>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_assert_AssertNotNull(bbt_val,bbt_msg){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/assert.monkey<20>";
	if(bbt_val==null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/assert.monkey<20>";
		bb_assert_AssertError(bbt_msg);
	}
	pop_err();
}
function bb_functions_LoadBitmap(bbt_path,bbt_flags){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<132>";
	var bbt_pointer=bb_graphics_LoadImage(bbt_path,1,bbt_flags);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<134>";
	bb_assert_AssertNotNull((bbt_pointer),"Error loading bitmap "+bbt_path);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<136>";
	pop_err();
	return bbt_pointer;
}
function bb_functions_LoadAnimBitmap(bbt_path,bbt_w,bbt_h,bbt_count,bbt_tmpImage){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<141>";
	bbt_tmpImage=bb_graphics_LoadImage(bbt_path,1,bb_graphics_DefaultFlags);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<143>";
	bb_assert_AssertNotNull((bbt_tmpImage),"Error loading bitmap "+bbt_path);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<145>";
	var bbt_pointer=bbt_tmpImage.bbm_GrabImage(0,0,bbt_w,bbt_h,bbt_count,1);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<147>";
	pop_err();
	return bbt_pointer;
}
function bb_audio_Sound(){
	Object.call(this);
	this.bb_sample=null;
}
bb_audio_Sound.prototype.bbm_Discard=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<45>";
	if((this.bb_sample)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<46>";
		this.bb_sample.Discard();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<47>";
		this.bb_sample=null;
	}
	pop_err();
	return 0;
}
function bb_audio_new(bbt_sample){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<41>";
	dbg_object(this).bb_sample=bbt_sample;
	pop_err();
	return this;
}
function bb_audio_new2(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<38>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_audio_LoadSound(bbt_path){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<60>";
	var bbt_sample=bb_audio_device.LoadSample(bbt_path);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<61>";
	if((bbt_sample)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<61>";
		var bbt_=bb_audio_new.call(new bb_audio_Sound,bbt_sample);
		pop_err();
		return bbt_;
	}
	pop_err();
	return null;
}
function bb_functions_LoadSoundSample(bbt_path){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<151>";
	var bbt_pointer=bb_audio_LoadSound(bbt_path);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<152>";
	bb_assert_AssertNotNull((bbt_pointer),"Error loading sound "+bbt_path);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<153>";
	pop_err();
	return bbt_pointer;
}
function bb_functions_ExitApp(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<113>";
	error("");
	pop_err();
}
function bb_simplegui_SimpleButton(){
	bb_framework_Sprite.call(this);
	this.bb_imageMouseOver=null;
	this.bb_soundMouseOver=null;
	this.bb_soundClick=null;
	this.bb_useVirtualRes=false;
	this.bb_active=1;
	this.bb_mouseOver=0;
	this.bb_disabled=false;
	this.bb_clicked=0;
}
bb_simplegui_SimpleButton.prototype=extend_class(bb_framework_Sprite);
function bb_simplegui_new(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<213>";
	bb_framework_new12.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<213>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_simplegui_SimpleButton.prototype.bbm_Load6=function(bbt_buttonImage,bbt_mouseOverImage,bbt_soundMouseOverFile,bbt_soundClickFile){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<269>";
	dbg_object(this).bb_image=bb_framework_new5.call(new bb_framework_GameImage);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<270>";
	this.bb_image.bbm_Load(dbg_object(dbg_object(bb_framework_game).bb_images).bb_path+bbt_buttonImage,false);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<272>";
	if(bbt_mouseOverImage!=""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<273>";
		this.bb_imageMouseOver=bb_framework_new5.call(new bb_framework_GameImage);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<274>";
		this.bb_imageMouseOver.bbm_Load(dbg_object(dbg_object(bb_framework_game).bb_images).bb_path+bbt_mouseOverImage,false);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<277>";
	this.bb_name=bb_functions_StripAll(bbt_buttonImage.toUpperCase());
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<279>";
	if(bbt_soundMouseOverFile!=""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<280>";
		this.bb_soundMouseOver=bb_framework_new7.call(new bb_framework_GameSound);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<281>";
		this.bb_soundMouseOver.bbm_Load3(bbt_soundMouseOverFile);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<283>";
	if(bbt_soundClickFile!=""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<284>";
		this.bb_soundClick=bb_framework_new7.call(new bb_framework_GameSound);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<285>";
		this.bb_soundClick.bbm_Load3(bbt_soundClickFile);
	}
	pop_err();
}
bb_simplegui_SimpleButton.prototype.bbm_MoveTo=function(bbt_dx,bbt_dy){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<264>";
	this.bb_x=bbt_dx;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<265>";
	this.bb_y=bbt_dy;
	pop_err();
}
bb_simplegui_SimpleButton.prototype.bbm_Draw3=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<230>";
	if(this.bb_active==0){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<231>";
	bb_graphics_SetAlpha(dbg_object(this).bb_alpha);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<232>";
	if((this.bb_mouseOver)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<233>";
		bb_graphics_DrawImage(dbg_object(dbg_object(this).bb_imageMouseOver).bb_image,this.bb_x,this.bb_y,0);
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<235>";
		bb_graphics_DrawImage(dbg_object(dbg_object(this).bb_image).bb_image,this.bb_x,this.bb_y,0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<237>";
	bb_graphics_SetAlpha(1.0);
	pop_err();
}
bb_simplegui_SimpleButton.prototype.bbm_Click=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<241>";
	if(this.bb_clicked==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<242>";
		this.bb_clicked=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<243>";
		if(this.bb_soundClick!=null){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<244>";
			this.bb_soundClick.bbm_Play(-1);
		}
	}
	pop_err();
}
bb_simplegui_SimpleButton.prototype.bbm_Update2=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<290>";
	if(this.bb_active==0 || this.bb_disabled){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<291>";
	var bbt_mx=dbg_object(bb_framework_game).bb_mouseX;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<292>";
	var bbt_my=dbg_object(bb_framework_game).bb_mouseY;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<293>";
	if(!this.bb_useVirtualRes){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<294>";
		bbt_mx=((bb_input_MouseX())|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<295>";
		bbt_my=((bb_input_MouseY())|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<297>";
	if((bbt_mx)>=this.bb_x && (bbt_mx)<this.bb_x+(dbg_object(this.bb_image).bb_w) && (bbt_my)>=this.bb_y && (bbt_my)<this.bb_y+(dbg_object(this.bb_image).bb_h)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<298>";
		if(this.bb_mouseOver==0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<299>";
			if(this.bb_soundMouseOver!=null){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<300>";
				this.bb_soundMouseOver.bbm_Play(-1);
			}
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<303>";
		this.bb_mouseOver=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<304>";
		if((bb_input_MouseHit(0))!=0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<305>";
			this.bbm_Click();
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<307>";
			this.bb_clicked=0;
		}
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<310>";
		this.bb_mouseOver=0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<311>";
		this.bb_clicked=0;
	}
	pop_err();
}
function bb_list_List(){
	Object.call(this);
	this.bb__head=bb_list_new2.call(new bb_list_Node);
}
function bb_list_new(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<20>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_list_List.prototype.bbm_Clear=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<31>";
	this.bb__head=bb_list_new2.call(new bb_list_Node);
	pop_err();
	return 0;
}
bb_list_List.prototype.bbm_AddLast=function(bbt_data){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<114>";
	var bbt_=bb_list_new3.call(new bb_list_Node,this.bb__head,dbg_object(this.bb__head).bb__pred,bbt_data);
	pop_err();
	return bbt_;
}
bb_list_List.prototype.bbm_ObjectEnumerator=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<118>";
	var bbt_=bb_list_new4.call(new bb_list_Enumerator,this);
	pop_err();
	return bbt_;
}
function bb_simplegui_SimpleMenu(){
	bb_list_List.call(this);
	this.bb_useVirtualRes=false;
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_nextY=0;
	this.bb_buttonGap=0;
	this.bb_h=0;
	this.bb_mouseOverName="";
	this.bb_clickedName="";
	this.bb_addGap=0;
	this.bb_soundMouseOver=null;
	this.bb_soundClick=null;
	this.bb_clearClickedName=1;
}
bb_simplegui_SimpleMenu.prototype=extend_class(bb_list_List);
function bb_simplegui_new2(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<16>";
	bb_list_new.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<17>";
	error("Please use a different constructor");
	pop_err();
	return this;
}
bb_simplegui_SimpleMenu.prototype.bbm_Init=function(bbt_soundMouseOverFile,bbt_soundClickFile,bbt_x,bbt_y,bbt_gap,bbt_useVirtualRes){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<25>";
	this.bbm_Clear();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<26>";
	dbg_object(this).bb_useVirtualRes=bbt_useVirtualRes;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<27>";
	dbg_object(this).bb_x=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<28>";
	dbg_object(this).bb_y=bbt_y;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<29>";
	this.bb_nextY=((bbt_y)|0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<30>";
	dbg_object(this).bb_buttonGap=bbt_gap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<31>";
	this.bb_h=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<32>";
	this.bb_mouseOverName="";
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<33>";
	this.bb_clickedName="";
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<34>";
	this.bb_addGap=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<35>";
	if(bbt_soundMouseOverFile!=""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<36>";
		this.bb_soundMouseOver=bb_framework_new7.call(new bb_framework_GameSound);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<37>";
		this.bb_soundMouseOver.bbm_Load3(bbt_soundMouseOverFile);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<39>";
	if(bbt_soundClickFile!=""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<40>";
		this.bb_soundClick=bb_framework_new7.call(new bb_framework_GameSound);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<41>";
		this.bb_soundClick.bbm_Load3(bbt_soundClickFile);
	}
	pop_err();
}
function bb_simplegui_new3(bbt_soundMouseOverFile,bbt_soundClickFile,bbt_x,bbt_y,bbt_gap,bbt_useVirtualRes){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<20>";
	bb_list_new.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<21>";
	this.bbm_Init(bbt_soundMouseOverFile,bbt_soundClickFile,(bbt_x),(bbt_y),bbt_gap,bbt_useVirtualRes);
	pop_err();
	return this;
}
bb_simplegui_SimpleMenu.prototype.bbm_ProcessAddButton=function(bbt_buttonImageFile,bbt_mouseOverFile,bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<155>";
	var bbt_b=bb_simplegui_new.call(new bb_simplegui_SimpleButton);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<156>";
	bbt_b.bbm_Load6(bbt_buttonImageFile,bbt_mouseOverFile,"","");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<157>";
	dbg_object(bbt_b).bb_useVirtualRes=dbg_object(this).bb_useVirtualRes;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<158>";
	if(bbt_name!=""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<158>";
		dbg_object(bbt_b).bb_name=bbt_name.toUpperCase();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<159>";
	bbt_b.bbm_MoveTo(this.bb_x,(this.bb_nextY));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<161>";
	dbg_object(bbt_b).bb_soundMouseOver=this.bb_soundMouseOver;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<162>";
	dbg_object(bbt_b).bb_soundClick=this.bb_soundClick;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<163>";
	this.bbm_AddLast(bbt_b);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<164>";
	pop_err();
	return bbt_b;
}
bb_simplegui_SimpleMenu.prototype.bbm_IncreaseHeight=function(bbt_b){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<144>";
	this.bb_nextY=this.bb_nextY+dbg_object(dbg_object(bbt_b).bb_image).bb_h+this.bb_buttonGap;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<146>";
	this.bb_h=this.bb_h+dbg_object(dbg_object(bbt_b).bb_image).bb_h;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<147>";
	if((this.bb_addGap)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<148>";
		this.bb_h=this.bb_h+this.bb_buttonGap;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<150>";
		this.bb_addGap=1;
	}
	pop_err();
}
bb_simplegui_SimpleMenu.prototype.bbm_AddButton=function(bbt_buttonImageFile,bbt_mouseOverFile,bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<138>";
	var bbt_b=this.bbm_ProcessAddButton(bbt_buttonImageFile,bbt_mouseOverFile,bbt_name);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<139>";
	this.bbm_IncreaseHeight(bbt_b);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<140>";
	pop_err();
	return bbt_b;
}
bb_simplegui_SimpleMenu.prototype.bbm_Draw3=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<207>";
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<207>";
	var bbt_=this.bbm_ObjectEnumerator();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<207>";
	while(bbt_.bbm_HasNext()){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<207>";
		var bbt_b=bbt_.bbm_NextObject();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<208>";
		bbt_b.bbm_Draw3();
	}
	pop_err();
}
bb_simplegui_SimpleMenu.prototype.bbm_Update2=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<187>";
	if(dbg_object(dbg_object(bb_framework_game).bb_screenFade).bb_active){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<188>";
		pop_err();
		return 0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<190>";
	this.bb_clickedName="";
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<191>";
	var bbt_b=null;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<192>";
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<192>";
	var bbt_=this.bbm_ObjectEnumerator();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<192>";
	while(bbt_.bbm_HasNext()){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<192>";
		bbt_b=bbt_.bbm_NextObject();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<193>";
		bbt_b.bbm_Update2();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<194>";
		if((dbg_object(bbt_b).bb_mouseOver)!=0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<194>";
			this.bb_mouseOverName=dbg_object(bbt_b).bb_name;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<195>";
		if((dbg_object(bbt_b).bb_clicked)!=0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<195>";
			this.bb_clickedName=dbg_object(bbt_b).bb_name;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<197>";
	pop_err();
	return 1;
}
bb_simplegui_SimpleMenu.prototype.bbm_Clicked=function(bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<177>";
	bbt_name=bbt_name.toUpperCase();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<178>";
	if(bbt_name==this.bb_clickedName){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<179>";
		if((this.bb_clearClickedName)!=0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<179>";
			this.bb_clickedName="";
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<180>";
		pop_err();
		return 1;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/simplegui.monkey<182>";
		pop_err();
		return 0;
	}
}
function bb_list_Node(){
	Object.call(this);
	this.bb__succ=null;
	this.bb__pred=null;
	this.bb__data=null;
}
var bb_list__sentinal;
function bb_list_new2(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<194>";
	this.bb__succ=this;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<195>";
	this.bb__pred=this;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<196>";
	this.bb__data=(bb_list__sentinal);
	pop_err();
	return this;
}
function bb_list_new3(bbt_succ,bbt_pred,bbt_data){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<201>";
	this.bb__succ=bbt_succ;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<202>";
	this.bb__pred=bbt_pred;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<203>";
	dbg_object(this.bb__succ).bb__pred=this;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<204>";
	dbg_object(this.bb__pred).bb__succ=this;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<205>";
	this.bb__data=bbt_data;
	pop_err();
	return this;
}
function bb_graphics_Cls(bbt_r,bbt_g,bbt_b){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<381>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<383>";
	bb_graphics_renderDevice.Cls(bbt_r,bbt_g,bbt_b);
	pop_err();
	return 0;
}
function bb_list_Enumerator(){
	Object.call(this);
	this.bb__list=null;
	this.bb__curr=null;
}
function bb_list_new4(bbt_list){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<249>";
	this.bb__list=bbt_list;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<250>";
	this.bb__curr=dbg_object(dbg_object(bbt_list).bb__head).bb__succ;
	pop_err();
	return this;
}
function bb_list_new5(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<246>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_list_Enumerator.prototype.bbm_HasNext=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<254>";
	var bbt_=this.bb__curr!=dbg_object(this.bb__list).bb__head;
	pop_err();
	return bbt_;
}
bb_list_Enumerator.prototype.bbm_NextObject=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<258>";
	var bbt_data=dbg_object(this.bb__curr).bb__data;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<259>";
	this.bb__curr=dbg_object(this.bb__curr).bb__succ;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/list.monkey<260>";
	pop_err();
	return bbt_data;
}
function bb_audio_StopChannel(bbt_channel){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<69>";
	bb_audio_device.StopChannel(bbt_channel);
	pop_err();
	return 0;
}
function bb_audio_PlaySound(bbt_sound,bbt_channel,bbt_flags){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<65>";
	if((dbg_object(bbt_sound).bb_sample)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<65>";
		bb_audio_device.PlaySample(dbg_object(bbt_sound).bb_sample,bbt_channel,bbt_flags);
	}
	pop_err();
	return 0;
}
function bb_audio_SetChannelPan(bbt_channel,bbt_pan){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<81>";
	bb_audio_device.SetPan(bbt_channel,bbt_pan);
	pop_err();
	return 0;
}
function bb_audio_SetChannelRate(bbt_channel,bbt_rate){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/audio.monkey<85>";
	bb_audio_device.SetRate(bbt_channel,bbt_rate);
	pop_err();
	return 0;
}
function bb_boxes_IntObject(){
	Object.call(this);
	this.bb_value=0;
}
function bb_boxes_new5(bbt_value){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/boxes.monkey<11>";
	dbg_object(this).bb_value=bbt_value;
	pop_err();
	return this;
}
function bb_boxes_new6(bbt_value){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/boxes.monkey<15>";
	dbg_object(this).bb_value=((bbt_value)|0);
	pop_err();
	return this;
}
function bb_boxes_new7(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/boxes.monkey<7>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_collections_AbstractCollection(){
	Object.call(this);
	this.bb_comparator=null;
}
function bb_collections_new(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<16>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_collections_AbstractCollection.prototype.bbm_ToArray=function(){
}
bb_collections_AbstractCollection.prototype.bbm_Add=function(bbt_o){
}
bb_collections_AbstractCollection.prototype.bbm_Size=function(){
}
bb_collections_AbstractCollection.prototype.bbm_Contains2=function(bbt_o){
}
bb_collections_AbstractCollection.prototype.bbm_IsEmpty=function(){
}
bb_collections_AbstractCollection.prototype.bbm_Sort=function(bbt_reverse,bbt_comp){
}
bb_collections_AbstractCollection.prototype.bbm_Comparator=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<46>";
	pop_err();
	return this.bb_comparator;
}
bb_collections_AbstractCollection.prototype.bbm_Comparator2=function(bbt_comparator){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<51>";
	dbg_object(this).bb_comparator=bbt_comparator;
	pop_err();
}
bb_collections_AbstractCollection.prototype.bbm_Enumerator=function(){
}
bb_collections_AbstractCollection.prototype.bbm_ObjectEnumerator=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<40>";
	var bbt_=this.bbm_Enumerator();
	pop_err();
	return bbt_;
}
bb_collections_AbstractCollection.prototype.bbm_FillArray=function(bbt_arr){
}
bb_collections_AbstractCollection.prototype.bbm_Remove2=function(bbt_o){
}
bb_collections_AbstractCollection.prototype.bbm_Clear=function(){
}
function bb_collections_AbstractList(){
	bb_collections_AbstractCollection.call(this);
	this.bb_modCount=0;
	this.bb_rangeChecking=true;
}
bb_collections_AbstractList.prototype=extend_class(bb_collections_AbstractCollection);
function bb_collections_new2(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<157>";
	bb_collections_new.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<157>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_collections_AbstractList.prototype.bbm_Get2=function(bbt_index){
}
bb_collections_AbstractList.prototype.bbm_RangeCheck=function(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<171>";
	var bbt_size=this.bbm_Size();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<173>";
	if(bbt_index<0 || bbt_index>=bbt_size){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<173>";
		bb_assert_AssertError("AbstractList.RangeCheck: Index out of bounds: "+String(bbt_index)+" is not 0<=index<"+String(bbt_size));
	}
	pop_err();
}
bb_collections_AbstractList.prototype.bbm_RemoveAt=function(bbt_index){
}
bb_collections_AbstractList.prototype.bbm_RemoveLast=function(){
}
bb_collections_AbstractList.prototype.bbm_AddLast2=function(bbt_o){
}
bb_collections_AbstractList.prototype.bbm_Enumerator=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<196>";
	var bbt_=(bb_collections_new11.call(new bb_collections_ListEnumerator,this));
	pop_err();
	return bbt_;
}
bb_collections_AbstractList.prototype.bbm_AddFirst=function(bbt_o){
}
bb_collections_AbstractList.prototype.bbm_Insert=function(bbt_index,bbt_o){
}
function bb_collections_ArrayList(){
	bb_collections_AbstractList.call(this);
	this.bb_elements=[];
	this.bb_size=0;
}
bb_collections_ArrayList.prototype=extend_class(bb_collections_AbstractList);
function bb_collections_new3(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<430>";
	bb_collections_new2.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<431>";
	dbg_object(this).bb_elements=new_object_array(10);
	pop_err();
	return this;
}
function bb_collections_new4(bbt_initialCapacity){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<434>";
	bb_collections_new2.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<435>";
	bb_assert_AssertGreaterThanOrEqualInt(bbt_initialCapacity,0,"ArrayList.New: Illegal Capacity:");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<436>";
	dbg_object(this).bb_elements=new_object_array(bbt_initialCapacity);
	pop_err();
	return this;
}
function bb_collections_new5(bbt_c){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<439>";
	bb_collections_new2.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<440>";
	this.bb_elements=bbt_c.bbm_ToArray();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<441>";
	this.bb_size=this.bb_elements.length;
	pop_err();
	return this;
}
bb_collections_ArrayList.prototype.bbm_EnsureCapacity=function(bbt_minCapacity){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<412>";
	var bbt_oldCapacity=this.bb_elements.length;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<413>";
	if(bbt_minCapacity>bbt_oldCapacity){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<414>";
		var bbt_newCapacity=((bbt_oldCapacity*3/2)|0)+1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<415>";
		if(bbt_newCapacity<bbt_minCapacity){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<415>";
			bbt_newCapacity=bbt_minCapacity;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<416>";
		this.bb_elements=resize_object_array(this.bb_elements,bbt_newCapacity);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<417>";
		this.bb_modCount+=1;
	}
	pop_err();
}
bb_collections_ArrayList.prototype.bbm_Add=function(bbt_o){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<447>";
	if(this.bb_size+1>this.bb_elements.length){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<447>";
		this.bbm_EnsureCapacity(this.bb_size+1);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<448>";
	dbg_array(this.bb_elements,this.bb_size)[this.bb_size]=(bbt_o)
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<449>";
	this.bb_size+=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<450>";
	this.bb_modCount+=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<451>";
	pop_err();
	return true;
}
bb_collections_ArrayList.prototype.bbm_Size=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<560>";
	pop_err();
	return this.bb_size;
}
bb_collections_ArrayList.prototype.bbm_RangeCheck=function(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<423>";
	if(bbt_index<0 || bbt_index>=this.bb_size){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<423>";
		bb_assert_AssertError("ArrayList.RangeCheck: Index out of bounds: "+String(bbt_index)+" is not 0<=index<"+String(this.bb_size));
	}
	pop_err();
}
bb_collections_ArrayList.prototype.bbm_Get2=function(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<614>";
	if(this.bb_rangeChecking){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<614>";
		this.bbm_RangeCheck(bbt_index);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<615>";
	var bbt_=(dbg_array(this.bb_elements,bbt_index)[bbt_index]);
	pop_err();
	return bbt_;
}
bb_collections_ArrayList.prototype.bbm_RemoveAt=function(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<666>";
	if(this.bb_rangeChecking){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<666>";
		this.bbm_RangeCheck(bbt_index);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<667>";
	var bbt_oldValue=(dbg_array(this.bb_elements,bbt_index)[bbt_index]);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<668>";
	for(var bbt_i=bbt_index;bbt_i<this.bb_size-1;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<669>";
		var bbt_=bbt_i+1;
		dbg_array(this.bb_elements,bbt_i)[bbt_i]=dbg_array(this.bb_elements,bbt_)[bbt_]
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<671>";
	var bbt_2=this.bb_size-1;
	dbg_array(this.bb_elements,bbt_2)[bbt_2]=null
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<672>";
	this.bb_size-=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<673>";
	this.bb_modCount+=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<674>";
	pop_err();
	return bbt_oldValue;
}
bb_collections_ArrayList.prototype.bbm_Contains2=function(bbt_o){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<480>";
	for(var bbt_i=0;bbt_i<this.bb_size;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<481>";
		if((dbg_array(this.bb_elements,bbt_i)[bbt_i])==bbt_o){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<481>";
			pop_err();
			return true;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<483>";
	pop_err();
	return false;
}
bb_collections_ArrayList.prototype.bbm_IsEmpty=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<513>";
	var bbt_=this.bb_size==0;
	pop_err();
	return bbt_;
}
bb_collections_ArrayList.prototype.bbm_RemoveLast=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<588>";
	var bbt_=this.bbm_RemoveAt(this.bb_size-1);
	pop_err();
	return bbt_;
}
bb_collections_ArrayList.prototype.bbm_AddLast2=function(bbt_o){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<583>";
	var bbt_=this.bbm_Add(bbt_o);
	pop_err();
	return bbt_;
}
bb_collections_ArrayList.prototype.bbm_Sort=function(bbt_reverse,bbt_comp){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<565>";
	if(this.bb_size<=1){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<566>";
	if(bbt_comp==null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<566>";
		bbt_comp=this.bbm_Comparator();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<567>";
	if(bbt_comp==null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<567>";
		bbt_comp=(bb_collections_DEFAULT_COMPARATOR);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<568>";
	bb_collections_QuickSort(this.bb_elements,0,this.bb_size-1,bbt_comp,bbt_reverse);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<569>";
	this.bb_modCount+=1;
	pop_err();
}
bb_collections_ArrayList.prototype.bbm_ToArray=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<574>";
	var bbt_arr=new_object_array(this.bb_size);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<575>";
	for(var bbt_i=0;bbt_i<this.bb_size;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<576>";
		dbg_array(bbt_arr,bbt_i)[bbt_i]=dbg_array(this.bb_elements,bbt_i)[bbt_i]
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<578>";
	pop_err();
	return bbt_arr;
}
bb_collections_ArrayList.prototype.bbm_FillArray=function(bbt_arr){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<504>";
	bb_assert_AssertGreaterThanOrEqualInt(bbt_arr.length,this.bb_size,"ArrayList.FillArray: Array too small:");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<505>";
	for(var bbt_i=0;bbt_i<this.bb_size;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<506>";
		dbg_array(bbt_arr,bbt_i)[bbt_i]=dbg_array(this.bb_elements,bbt_i)[bbt_i]
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<508>";
	pop_err();
	return this.bb_size;
}
bb_collections_ArrayList.prototype.bbm_Remove2=function(bbt_o){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<518>";
	for(var bbt_i=0;bbt_i<this.bb_size;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<519>";
		if((dbg_array(this.bb_elements,bbt_i)[bbt_i])==bbt_o){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<520>";
			this.bbm_RemoveAt(bbt_i);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<521>";
			this.bb_modCount+=1;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<522>";
			pop_err();
			return true;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<525>";
	pop_err();
	return false;
}
bb_collections_ArrayList.prototype.bbm_Enumerator=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<499>";
	var bbt_=(bb_collections_new13.call(new bb_collections_ArrayListEnumerator,this));
	pop_err();
	return bbt_;
}
bb_collections_ArrayList.prototype.bbm_Insert=function(bbt_index,bbt_o){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<620>";
	if(this.bb_rangeChecking){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<620>";
		this.bbm_RangeCheck(bbt_index);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<621>";
	if(this.bb_size+1>this.bb_elements.length){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<621>";
		this.bbm_EnsureCapacity(this.bb_size+1);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<622>";
	for(var bbt_i=this.bb_size;bbt_i>bbt_index;bbt_i=bbt_i+-1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<623>";
		var bbt_=bbt_i-1;
		dbg_array(this.bb_elements,bbt_i)[bbt_i]=dbg_array(this.bb_elements,bbt_)[bbt_]
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<625>";
	dbg_array(this.bb_elements,bbt_index)[bbt_index]=(bbt_o)
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<626>";
	this.bb_size+=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<627>";
	this.bb_modCount+=1;
	pop_err();
}
bb_collections_ArrayList.prototype.bbm_AddFirst=function(bbt_o){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<598>";
	this.bbm_Insert(0,bbt_o);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<599>";
	pop_err();
	return true;
}
bb_collections_ArrayList.prototype.bbm_Clear=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<471>";
	for(var bbt_i=0;bbt_i<this.bb_size;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<472>";
		dbg_array(this.bb_elements,bbt_i)[bbt_i]=null
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<474>";
	this.bb_modCount+=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<475>";
	this.bb_size=0;
	pop_err();
}
function bb_collections_IntArrayList(){
	bb_collections_ArrayList.call(this);
}
bb_collections_IntArrayList.prototype=extend_class(bb_collections_ArrayList);
function bb_collections_new6(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<704>";
	bb_collections_new3.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<704>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_collections_IntArrayList.prototype.bbm_Enumerator=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<723>";
	var bbt_=(bb_collections_new15.call(new bb_collections_IntListEnumerator,(this)));
	pop_err();
	return bbt_;
}
function bb_assert_AssertGreaterThanOrEqualInt(bbt_val,bbt_expected,bbt_msg){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/assert.monkey<81>";
	if(bbt_val<bbt_expected){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/assert.monkey<81>";
		bb_assert_AssertError(bbt_msg+" "+String(bbt_val)+"<"+String(bbt_expected));
	}
	pop_err();
}
var bb_globals_gGameOver;
function bb_world_World(){
	Object.call(this);
	this.bb_tileWidth=32;
	this.bb_tileHeight=32;
	this.bb_tileSheet=null;
	this.bb_backgroundImageStart=0;
	this.bb_spawnPointsStart=0;
	this.bb_backgroundTilesStart=0;
	this.bb_foregroundTilesStart=0;
	this.bb_background=null;
	this.bb_spawnPoints=bb_collections_new3.call(new bb_collections_ArrayList);
	this.bb_world1=[];
	this.bb_foreground1=[];
	this.bb_numTilesX=30;
	this.bb_numTilesY=20;
}
function bb_world_new(bbt_file){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<40>";
	this.bb_tileSheet=bb_graphics_LoadImage2("graphics/TileSheet.png",this.bb_tileWidth,this.bb_tileHeight,256,1);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<42>";
	var bbt_index=0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<43>";
	var bbt_str=bb_app_LoadString("worlds/"+bbt_file+".txt");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<45>";
	var bbt_lines=bbt_str.split("\n");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<46>";
	var bbt_line="";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<48>";
	for(bbt_index=0;bbt_index<bbt_lines.length;bbt_index=bbt_index+1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<49>";
		var bbt_=string_trim(dbg_array(bbt_lines,bbt_index)[bbt_index]);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<50>";
		if(bbt_=="[Background Image]"){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<51>";
			this.bb_backgroundImageStart=bbt_index+1;
		}else{
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<52>";
			if(bbt_=="[Spawn Points]"){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<53>";
				this.bb_spawnPointsStart=bbt_index+1;
			}else{
				err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<54>";
				if(bbt_=="[Background Tiles]"){
					err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<55>";
					this.bb_backgroundTilesStart=bbt_index+1;
				}else{
					err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<56>";
					if(bbt_=="[Foreground Tiles]"){
						err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<57>";
						this.bb_foregroundTilesStart=bbt_index+1;
					}
				}
			}
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<61>";
	this.bb_background=bb_graphics_LoadImage(string_trim(dbg_array(bbt_lines,this.bb_backgroundImageStart)[this.bb_backgroundImageStart]),1,1);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<63>";
	bbt_index=0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<64>";
	var bbt_2=this.bb_spawnPointsStart+bbt_index;
	bbt_line=string_trim(dbg_array(bbt_lines,bbt_2)[bbt_2]);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<65>";
	while(bbt_line!=""){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<66>";
		var bbt_coords=bbt_line.split(",");
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<67>";
		var bbt_vec=bb_vector_new.call(new bb_vector_Vector,parseFloat(string_trim(dbg_array(bbt_coords,0)[0])),parseFloat(string_trim(dbg_array(bbt_coords,1)[1])));
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<68>";
		var bbt_sp=bb_world_new3.call(new bb_world_SpawnPoint,bbt_vec,parseFloat(string_trim(dbg_array(bbt_coords,2)[2])));
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<69>";
		this.bb_spawnPoints.bbm_Add(bbt_sp);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<71>";
		bbt_index=bbt_index+1;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<72>";
		var bbt_3=this.bb_spawnPointsStart+bbt_index;
		bbt_line=string_trim(dbg_array(bbt_lines,bbt_3)[bbt_3]);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<75>";
	var bbt_x=0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<76>";
	var bbt_y=0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<97>";
	this.bb_world1=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,55,56,57,55,56,57,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,71,72,73,71,72,73,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18]];
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<118>";
	this.bb_foreground1=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,40,41,39,40,41,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,55,56,57,55,56,57,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,71,72,73,71,72,73,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],[18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18]];
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<120>";
	for(bbt_y=0;bbt_y<20;bbt_y=bbt_y+1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<121>";
		var bbt_tiles=[];
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<122>";
		for(bbt_x=0;bbt_x<30;bbt_x=bbt_x+1){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<123>";
			var bbt_4=this.bb_backgroundTilesStart+bbt_y;
			bbt_line=string_trim(dbg_array(bbt_lines,bbt_4)[bbt_4]);
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<124>";
			bbt_tiles=bbt_line.split(",");
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<125>";
			dbg_array(dbg_array(this.bb_world1,bbt_y)[bbt_y],bbt_x)[bbt_x]=parseInt((string_trim(dbg_array(bbt_tiles,bbt_x)[bbt_x])),10)
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<127>";
		for(bbt_x=0;bbt_x<30;bbt_x=bbt_x+1){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<128>";
			var bbt_5=this.bb_foregroundTilesStart+bbt_y;
			bbt_line=string_trim(dbg_array(bbt_lines,bbt_5)[bbt_5]);
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<129>";
			bbt_tiles=bbt_line.split(",");
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<130>";
			dbg_array(dbg_array(this.bb_foreground1,bbt_y)[bbt_y],bbt_x)[bbt_x]=parseInt((string_trim(dbg_array(bbt_tiles,bbt_x)[bbt_x])),10)
		}
	}
	pop_err();
	return this;
}
function bb_world_new2(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<10>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_world_World.prototype.bbm_RenderBackground=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<138>";
	bb_graphics_DrawImage(this.bb_background,480.0,320.0,0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<139>";
	for(var bbt_y=0;bbt_y<=19;bbt_y=bbt_y+1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<140>";
		for(var bbt_x=0;bbt_x<=29;bbt_x=bbt_x+1){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<141>";
			if(dbg_array(dbg_array(this.bb_world1,bbt_y)[bbt_y],bbt_x)[bbt_x]!=0){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<142>";
				bb_graphics_DrawImage(this.bb_tileSheet,(bbt_x*this.bb_tileWidth+16),(bbt_y*this.bb_tileHeight+16),dbg_array(dbg_array(this.bb_world1,bbt_y)[bbt_y],bbt_x)[bbt_x]-1);
			}
		}
	}
	pop_err();
}
bb_world_World.prototype.bbm_RenderForeground=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<150>";
	for(var bbt_y=0;bbt_y<=19;bbt_y=bbt_y+1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<151>";
		for(var bbt_x=0;bbt_x<=29;bbt_x=bbt_x+1){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<152>";
			if(dbg_array(dbg_array(this.bb_foreground1,bbt_y)[bbt_y],bbt_x)[bbt_x]!=0){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<153>";
				bb_graphics_DrawImage(this.bb_tileSheet,(bbt_x*this.bb_tileWidth+16),(bbt_y*this.bb_tileHeight+16),dbg_array(dbg_array(this.bb_foreground1,bbt_y)[bbt_y],bbt_x)[bbt_x]-1);
			}
		}
	}
	pop_err();
}
bb_world_World.prototype.bbm_IsCollision=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<166>";
	var bbt_xIndex=((Math.floor(bbt_x/(this.bb_tileWidth)))|0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<167>";
	var bbt_yIndex=((Math.floor(bbt_y/(this.bb_tileHeight)))|0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<169>";
	if(dbg_array(dbg_array(this.bb_world1,bbt_yIndex)[bbt_yIndex],bbt_xIndex)[bbt_xIndex]<17){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<170>";
		pop_err();
		return false;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<173>";
	pop_err();
	return true;
}
bb_world_World.prototype.bbm_IsCollision2=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<203>";
	if(dbg_array(dbg_array(this.bb_world1,bbt_y)[bbt_y],bbt_x)[bbt_x]<17){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<204>";
		pop_err();
		return false;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<206>";
	pop_err();
	return true;
}
bb_world_World.prototype.bbm_IsCollision3=function(bbt_v){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<192>";
	var bbt_=this.bbm_IsCollision(dbg_object(bbt_v).bb_X,dbg_object(bbt_v).bb_Y);
	pop_err();
	return bbt_;
}
bb_world_World.prototype.bbm_GetCollisionModifier=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<178>";
	var bbt_xIndex=((Math.floor(bbt_x/(this.bb_tileWidth)))|0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<179>";
	var bbt_yIndex=((Math.floor(bbt_y/(this.bb_tileHeight)))|0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<181>";
	if(dbg_array(dbg_array(this.bb_world1,bbt_yIndex)[bbt_yIndex],bbt_xIndex)[bbt_xIndex]==0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<182>";
		pop_err();
		return 1.0;
	}else{
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<183>";
		if(dbg_array(dbg_array(this.bb_world1,bbt_yIndex)[bbt_yIndex],bbt_xIndex)[bbt_xIndex]<17){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<184>";
			pop_err();
			return 0.6;
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<187>";
	pop_err();
	return 0.0;
}
bb_world_World.prototype.bbm_GetCollisionModifier2=function(bbt_v){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<197>";
	var bbt_=this.bbm_GetCollisionModifier(dbg_object(bbt_v).bb_X,dbg_object(bbt_v).bb_Y);
	pop_err();
	return bbt_;
}
bb_world_World.prototype.bbm_Reflect=function(bbt_p,bbt_v){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<211>";
	var bbt_xIndex=((Math.floor(dbg_object(bbt_p).bb_X/(this.bb_tileWidth)))|0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<212>";
	var bbt_yIndex=((Math.floor(dbg_object(bbt_p).bb_Y/(this.bb_tileHeight)))|0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<215>";
	var bbt_yDir=1;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<216>";
	if(dbg_object(bbt_v).bb_Y>0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<217>";
		bbt_yDir=-1;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<220>";
	var bbt_xDir=1;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<221>";
	if(dbg_object(bbt_v).bb_X>0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<222>";
		bbt_xDir=-1;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<225>";
	var bbt_result=bb_vector_new.call(new bb_vector_Vector,-1.0,-1.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<226>";
	var bbt_=bbt_yIndex+bbt_yDir;
	if(dbg_array(dbg_array(this.bb_world1,bbt_)[bbt_],bbt_xIndex)[bbt_xIndex]<17){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<227>";
		dbg_object(bbt_result).bb_X=1.0;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<230>";
	var bbt_2=bbt_xIndex+bbt_xDir;
	if(dbg_array(dbg_array(this.bb_world1,bbt_yIndex)[bbt_yIndex],bbt_2)[bbt_2]<17){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<231>";
		dbg_object(bbt_result).bb_Y=1.0;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<234>";
	pop_err();
	return bbt_result;
}
bb_world_World.prototype.bbm_LineOfSight=function(bbt_x0,bbt_y0,bbt_x1,bbt_y1){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<261>";
	var bbt_dx=bb_math_Abs(bbt_x1-bbt_x0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<262>";
	var bbt_dy=bb_math_Abs(bbt_y1-bbt_y0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<264>";
	var bbt_sx=-1;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<265>";
	var bbt_sy=-1;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<267>";
	if(bbt_x0<bbt_x1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<268>";
		bbt_sx=1;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<271>";
	if(bbt_y0<bbt_y1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<272>";
		bbt_sy=1;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<275>";
	var bbt_error=bbt_dx-bbt_dy;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<276>";
	var bbt_error2=0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<278>";
	var bbt_finish=false;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<279>";
	while(!bbt_finish){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<282>";
		if(dbg_array(dbg_array(this.bb_world1,bbt_y0)[bbt_y0],bbt_x0)[bbt_x0]>=17){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<283>";
			pop_err();
			return false;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<286>";
		if(bbt_x0==bbt_x1 && bbt_y0==bbt_y1){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<287>";
			bbt_finish=true;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<288>";
			continue;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<291>";
		bbt_error2=2*bbt_error;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<292>";
		if(bbt_error2>-bbt_dy){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<293>";
			bbt_error=bbt_error-bbt_dy;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<294>";
			bbt_x0=bbt_x0+bbt_sx;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<297>";
		if(bbt_error2<bbt_dx){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<298>";
			bbt_error=bbt_error+bbt_dx;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<299>";
			bbt_y0=bbt_y0+bbt_sy;
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<302>";
	pop_err();
	return true;
}
bb_world_World.prototype.bbm_LineOfSight2=function(bbt_v1,bbt_v2){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<248>";
	var bbt_x0=bb_math_Min(this.bb_numTilesX,bb_math_Max(0,((Math.floor(dbg_object(bbt_v1).bb_X/(this.bb_tileWidth)))|0)));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<249>";
	var bbt_y0=bb_math_Min(this.bb_numTilesY,bb_math_Max(0,((Math.floor(dbg_object(bbt_v1).bb_Y/(this.bb_tileHeight)))|0)));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<251>";
	var bbt_x1=bb_math_Min(this.bb_numTilesX,bb_math_Max(0,((Math.floor(dbg_object(bbt_v2).bb_X/(this.bb_tileWidth)))|0)));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<252>";
	var bbt_y1=bb_math_Min(this.bb_numTilesY,bb_math_Max(0,((Math.floor(dbg_object(bbt_v2).bb_Y/(this.bb_tileWidth)))|0)));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<254>";
	var bbt_=this.bbm_LineOfSight(bbt_x0,bbt_y0,bbt_x1,bbt_y1);
	pop_err();
	return bbt_;
}
function bb_app_LoadString(bbt_path){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/app.monkey<145>";
	var bbt_=bb_app_device.LoadString(bbt_path);
	pop_err();
	return bbt_;
}
function bb_vector_Vector(){
	Object.call(this);
	this.bb_X=.0;
	this.bb_Y=.0;
}
function bb_vector_new(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<9>";
	this.bb_X=bbt_x;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<10>";
	this.bb_Y=bbt_y;
	pop_err();
	return this;
}
function bb_vector_new2(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<3>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_vector_Vector.prototype.bbm_Subtract=function(bbt_v){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<49>";
	var bbt_=bb_vector_new.call(new bb_vector_Vector,this.bb_X-dbg_object(bbt_v).bb_X,this.bb_Y-dbg_object(bbt_v).bb_Y);
	pop_err();
	return bbt_;
}
bb_vector_Vector.prototype.bbm_LengthSquared=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<53>";
	var bbt_=this.bb_X*this.bb_X+this.bb_Y*this.bb_Y;
	pop_err();
	return bbt_;
}
bb_vector_Vector.prototype.bbm_Length=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<57>";
	var bbt_=Math.sqrt(this.bbm_LengthSquared());
	pop_err();
	return bbt_;
}
bb_vector_Vector.prototype.bbm_Normalize=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<19>";
	var bbt_length=this.bbm_Length();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<21>";
	this.bb_X/=bbt_length;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<22>";
	this.bb_Y/=bbt_length;
	pop_err();
}
bb_vector_Vector.prototype.bbm_Scale=function(bbt_Scalar){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<61>";
	var bbt_=bb_vector_new.call(new bb_vector_Vector,this.bb_X*bbt_Scalar,this.bb_Y*bbt_Scalar);
	pop_err();
	return bbt_;
}
bb_vector_Vector.prototype.bbm_AddLocal=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<26>";
	this.bb_X+=bbt_x;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<27>";
	this.bb_Y+=bbt_y;
	pop_err();
}
bb_vector_Vector.prototype.bbm_AddLocal2=function(bbt_v){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<31>";
	this.bb_X+=dbg_object(bbt_v).bb_X;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<32>";
	this.bb_Y+=dbg_object(bbt_v).bb_Y;
	pop_err();
}
bb_vector_Vector.prototype.bbm_ScaleLocal=function(bbt_Scalar){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<65>";
	this.bb_X*=bbt_Scalar;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<66>";
	this.bb_Y*=bbt_Scalar;
	pop_err();
}
bb_vector_Vector.prototype.bbm_Set2=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<14>";
	this.bb_X=bbt_x;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<15>";
	this.bb_Y=bbt_y;
	pop_err();
}
bb_vector_Vector.prototype.bbm_Add2=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<36>";
	var bbt_=bb_vector_new.call(new bb_vector_Vector,dbg_object(this).bb_X+bbt_x,dbg_object(this).bb_Y+bbt_y);
	pop_err();
	return bbt_;
}
bb_vector_Vector.prototype.bbm_Add3=function(bbt_v){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<40>";
	var bbt_=bb_vector_new.call(new bb_vector_Vector,this.bb_X+dbg_object(bbt_v).bb_X,this.bb_Y+dbg_object(bbt_v).bb_Y);
	pop_err();
	return bbt_;
}
bb_vector_Vector.prototype.bbm_SubtractLocal=function(bbt_v){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<44>";
	this.bb_X-=dbg_object(bbt_v).bb_X;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/vector.monkey<45>";
	this.bb_Y-=dbg_object(bbt_v).bb_Y;
	pop_err();
}
function bb_world_SpawnPoint(){
	Object.call(this);
	this.bb_vector=null;
	this.bb_rotation=.0;
}
function bb_world_new3(bbt_v,bbt_rot){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<329>";
	this.bb_vector=bbt_v;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<330>";
	this.bb_rotation=bbt_rot;
	pop_err();
	return this;
}
function bb_world_new4(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<324>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
var bb_globals_gWorld;
function bb_managers_ProjectileManager(){
	Object.call(this);
	this.bb_projectiles=null;
}
function bb_managers_new(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/managers.monkey<10>";
	this.bb_projectiles=bb_collections_new3.call(new bb_collections_ArrayList);
	pop_err();
	return this;
}
bb_managers_ProjectileManager.prototype.bbm_OnRender=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/managers.monkey<20>";
	for(var bbt_i=0;bbt_i<=this.bb_projectiles.bbm_Size()-1;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/managers.monkey<21>";
		this.bb_projectiles.bbm_Get2(bbt_i).bbm_OnRender();
	}
	pop_err();
}
bb_managers_ProjectileManager.prototype.bbm_AddProjectile=function(bbt_p){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/managers.monkey<26>";
	this.bb_projectiles.bbm_Add(bbt_p);
	pop_err();
}
bb_managers_ProjectileManager.prototype.bbm_RemoveProjectile=function(bbt_p){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/managers.monkey<30>";
	this.bb_projectiles.bbm_Remove2(bbt_p);
	pop_err();
}
bb_managers_ProjectileManager.prototype.bbm_OnUpdate=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/managers.monkey<14>";
	for(var bbt_i=0;bbt_i<=this.bb_projectiles.bbm_Size()-1;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/managers.monkey<15>";
		this.bb_projectiles.bbm_Get2(bbt_i).bbm_OnUpdate();
	}
	pop_err();
}
function bb_projectile_Projectile(){
	Object.call(this);
	this.bb_image=null;
	this.bb_explosionSound=null;
	this.bb_bounceSound=null;
	this.bb_tankExplosionSound=null;
	this.bb_speed=.0;
	this.bb_damage=1.0;
	this.bb_position=null;
	this.bb_rotation=0.0;
	this.bb_velocity=null;
	this.bb_hasBounced=false;
}
function bb_projectile_new(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<24>";
	this.bb_image=dbg_object(bb_framework_game).bb_images.bbm_Find("Projectile");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<25>";
	this.bb_explosionSound=dbg_object(bb_framework_game).bb_sounds.bbm_Find("explosion");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<26>";
	this.bb_bounceSound=dbg_object(bb_framework_game).bb_sounds.bbm_Find("bounce");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<27>";
	this.bb_tankExplosionSound=dbg_object(bb_framework_game).bb_sounds.bbm_Find("tankExplosion");
	pop_err();
	return this;
}
bb_projectile_Projectile.prototype.bbm_OnRender=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<61>";
	if((this.bb_image)!=null){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<62>";
		bb_graphics_DrawImage2(dbg_object(this.bb_image).bb_image,dbg_object(this.bb_position).bb_X,dbg_object(this.bb_position).bb_Y,this.bb_rotation,1.0,1.0,0);
	}
	pop_err();
}
bb_projectile_Projectile.prototype.bbm_Clone=function(bbt_position,bbt_norm,bbt_rot){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<67>";
	var bbt_clone=bb_projectile_new.call(new bb_projectile_Projectile);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<69>";
	dbg_object(bbt_clone).bb_position=bbt_position;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<70>";
	dbg_object(bbt_clone).bb_rotation=bbt_rot;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<71>";
	dbg_object(bbt_clone).bb_velocity=bbt_norm;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<72>";
	dbg_object(bbt_clone).bb_velocity.bbm_ScaleLocal(dbg_object(this).bb_speed);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<73>";
	dbg_object(bbt_clone).bb_damage=dbg_object(this).bb_damage;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<74>";
	dbg_object(bbt_clone).bb_image=dbg_object(this).bb_image;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<76>";
	pop_err();
	return bbt_clone;
}
bb_projectile_Projectile.prototype.bbm_CheckTankCollisions=function(bbt_p){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<83>";
	var bbt_tank=null;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<84>";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<84>";
	var bbt_=bb_globals_gTanks.bbm_ObjectEnumerator();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<84>";
	while(bbt_.bbm_HasNext()){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<84>";
		bbt_tank=bbt_.bbm_NextObject();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<85>";
		if(dbg_object(bbt_tank).bb_position.bbm_Subtract(bbt_p).bbm_Length()<20.0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<86>";
			pop_err();
			return bbt_tank;
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<89>";
	pop_err();
	return null;
}
bb_projectile_Projectile.prototype.bbm_CheckCollisions=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<93>";
	if(bb_globals_gWorld.bbm_IsCollision3(this.bb_position)){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<94>";
		pop_err();
		return true;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<96>";
	pop_err();
	return false;
}
bb_projectile_Projectile.prototype.bbm_OnUpdate=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<33>";
	var bbt_tank=this.bbm_CheckTankCollisions(this.bb_position);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<34>";
	if(bbt_tank!=null){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<36>";
		bb_globals_gProjectileManager.bbm_RemoveProjectile(this);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<37>";
		this.bb_tankExplosionSound.bbm_Play(-1);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<38>";
		bbt_tank.bbm_Hit(this.bb_damage);
	}else{
		err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<39>";
		if(this.bbm_CheckCollisions()){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<40>";
			if(this.bb_hasBounced){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<42>";
				bb_globals_gProjectileManager.bbm_RemoveProjectile(this);
				err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<43>";
				this.bb_explosionSound.bbm_Play(-1);
			}else{
				err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<45>";
				this.bb_bounceSound.bbm_Play(-1);
				err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<46>";
				this.bb_hasBounced=true;
				err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<52>";
				var bbt_reflect=bb_globals_gWorld.bbm_Reflect(this.bb_position,this.bb_velocity);
				err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<53>";
				this.bb_velocity.bbm_Set2(dbg_object(this.bb_velocity).bb_X*dbg_object(bbt_reflect).bb_X,dbg_object(this.bb_velocity).bb_Y*dbg_object(bbt_reflect).bb_Y);
			}
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/projectile.monkey<57>";
	this.bb_position.bbm_AddLocal2(this.bb_velocity);
	pop_err();
}
var bb_globals_gProjectileManager;
function bb_tank_Tank(){
	Object.call(this);
	this.bb_rotation=.0;
	this.bb_position=null;
	this.bb_previousPosition=null;
	this.bb_image=null;
	this.bb_explodeImage=null;
	this.bb_weapon=null;
	this.bb_obb=[];
	this.bb_defaultAABB=[];
	this.bb_aabbMin=null;
	this.bb_aabbMax=null;
	this.bb_movementVector=null;
	this.bb_deathAnimation=null;
	this.bb_healthBar=bb_health_bar_new.call(new bb_health_bar_HealthBar);
	this.bb_health=10.0;
	this.bb_frame=0;
	this.bb_forward=false;
	this.bb_backward=false;
	this.bb_left=false;
	this.bb_right=false;
	this.bb_rotationDelta=.0;
	this.bb_speed=.0;
	this.bb_radius=32;
	this.bb_rollback=false;
	this.bb_baseSpeed=1.0;
	this.bb_healthMax=10.0;
}
bb_tank_Tank.prototype.bbm_MakeDefaultArray=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<386>";
	var bbt_=[bb_vector_new.call(new bb_vector_Vector,-32.0,-32.0),bb_vector_new.call(new bb_vector_Vector,32.0,-32.0),bb_vector_new.call(new bb_vector_Vector,-32.0,32.0),bb_vector_new.call(new bb_vector_Vector,32.0,32.0)];
	pop_err();
	return bbt_;
}
function bb_tank_new(bbt_startingPosition){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<60>";
	this.bb_rotation=0.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<61>";
	this.bb_position=bbt_startingPosition;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<62>";
	this.bb_previousPosition=bb_vector_new.call(new bb_vector_Vector,0.0,0.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<64>";
	this.bb_image=dbg_object(bb_framework_game).bb_images.bbm_Find("TankBaseBlue");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<65>";
	this.bb_explodeImage=dbg_object(bb_framework_game).bb_images.bbm_Find("TankExplodeBlue");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<66>";
	this.bb_weapon=bb_weapon_new.call(new bb_weapon_Weapon,this.bb_position);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<68>";
	this.bb_obb=this.bbm_MakeDefaultArray();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<69>";
	this.bb_defaultAABB=this.bbm_MakeDefaultArray();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<71>";
	this.bb_aabbMin=bb_vector_new.call(new bb_vector_Vector,0.0,0.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<72>";
	this.bb_aabbMax=bb_vector_new.call(new bb_vector_Vector,0.0,0.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<74>";
	this.bb_movementVector=bb_vector_new.call(new bb_vector_Vector,0.0,0.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<75>";
	this.bb_deathAnimation=bb_death_new.call(new bb_death_DeathAnimation);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<77>";
	this.bb_healthBar.bbm_Update4(1.0,1.0);
	pop_err();
	return this;
}
function bb_tank_new2(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<19>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_tank_Tank.prototype.bbm_OnRender=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<170>";
	if((this.bb_image)!=null){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<171>";
		if(this.bb_health==0.0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<172>";
			this.bb_frame=0;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<175>";
		bb_graphics_DrawImage2(dbg_object(this.bb_image).bb_image,dbg_object(this.bb_position).bb_X,dbg_object(this.bb_position).bb_Y,0.0,1.0,1.0,this.bb_frame);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<178>";
	if(((this.bb_weapon)!=null) && this.bb_health>0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<179>";
		this.bb_weapon.bbm_OnRender();
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<182>";
	if(((this.bb_healthBar)!=null) && this.bb_health>0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<183>";
		this.bb_healthBar.bbm_Render2(this.bb_position);
	}
	pop_err();
}
bb_tank_Tank.prototype.bbm_Move=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<230>";
	if(this.bb_forward && this.bb_backward){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<234>";
	if(!this.bb_forward && !this.bb_backward){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<238>";
	var bbt_sign=1.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<239>";
	if(this.bb_backward){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<240>";
		bbt_sign=-1.0;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<243>";
	this.bb_movementVector.bbm_Set2(bbt_sign*Math.cos((this.bb_rotation)*D2R)*this.bb_speed,bbt_sign*Math.sin((this.bb_rotation)*D2R)*this.bb_speed);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<244>";
	this.bb_previousPosition.bbm_Set2(dbg_object(this.bb_position).bb_X,dbg_object(this.bb_position).bb_Y);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<245>";
	this.bb_position.bbm_AddLocal2(this.bb_movementVector);
	pop_err();
}
bb_tank_Tank.prototype.bbm_Turn=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<249>";
	if(this.bb_left && this.bb_right){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<253>";
	if(!this.bb_left && !this.bb_right){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<257>";
	var bbt_sign=1.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<258>";
	if(this.bb_left){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<259>";
		bbt_sign=-1.0;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<262>";
	this.bb_rotationDelta=2.0*bbt_sign;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<263>";
	this.bb_rotation+=this.bb_rotationDelta;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<264>";
	if(this.bb_rotation>360.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<265>";
		this.bb_rotation-=360.0;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<268>";
	if(this.bb_rotation<0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<269>";
		this.bb_rotation+=360.0;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<272>";
	var bbt_val=((((this.bb_rotation)|0) % 45/45)|0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<273>";
	this.bb_radius=((bbt_val*32.0+(1.0-bbt_val)*22.0)|0);
	pop_err();
}
bb_tank_Tank.prototype.bbm_CheckEnvironmentCollisions=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<303>";
	for(var bbt_i=0;bbt_i<this.bb_defaultAABB.length;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<304>";
		if(bb_globals_gWorld.bbm_IsCollision3(this.bb_position.bbm_Add3(dbg_array(this.bb_defaultAABB,bbt_i)[bbt_i]))){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<305>";
			pop_err();
			return bbt_i;
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<308>";
	pop_err();
	return -1;
}
bb_tank_Tank.prototype.bbm_MovementVectorTest=function(bbt_h1,bbt_h2,bbt_v1,bbt_v2){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<312>";
	if((bbt_h1 || bbt_h2) && (bbt_v1 || bbt_v2)){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<313>";
		this.bb_rollback=true;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<316>";
	if(!bbt_v1 && !bbt_v2 && !bbt_h1 && !bbt_h2){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<317>";
		if(bb_math_Abs2(dbg_object(this.bb_movementVector).bb_X)>bb_math_Abs2(dbg_object(this.bb_movementVector).bb_Y)){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<318>";
			dbg_object(this.bb_movementVector).bb_X=0.0;
		}else{
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<320>";
			dbg_object(this.bb_movementVector).bb_Y=0.0;
		}
	}else{
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<322>";
		if(bbt_h1 || bbt_h2){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<323>";
			dbg_object(this.bb_movementVector).bb_X=0.0;
		}else{
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<324>";
			if(bbt_v1 || bbt_v2){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<325>";
				dbg_object(this.bb_movementVector).bb_Y=0.0;
			}
		}
	}
	pop_err();
}
bb_tank_Tank.prototype.bbm_FixMovementVector=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<330>";
	this.bb_rollback=false;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<340>";
	var bbt_grid=[bb_globals_gWorld.bbm_IsCollision3(this.bb_position.bbm_Add2(-32.0,-32.0)),bb_globals_gWorld.bbm_IsCollision3(this.bb_position.bbm_Add2(0.0,-32.0)),bb_globals_gWorld.bbm_IsCollision3(this.bb_position.bbm_Add2(32.0,-32.0)),bb_globals_gWorld.bbm_IsCollision3(this.bb_position.bbm_Add2(-32.0,0.0)),bb_globals_gWorld.bbm_IsCollision3(this.bb_position.bbm_Add2(32.0,0.0)),bb_globals_gWorld.bbm_IsCollision3(this.bb_position.bbm_Add2(-32.0,32.0)),bb_globals_gWorld.bbm_IsCollision3(this.bb_position.bbm_Add2(0.0,32.0)),bb_globals_gWorld.bbm_IsCollision3(this.bb_position.bbm_Add2(32.0,32.0))];
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<342>";
	if(dbg_array(bbt_grid,0)[0] && dbg_array(bbt_grid,2)[2] && dbg_array(bbt_grid,5)[5] && dbg_array(bbt_grid,7)[7]){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<343>";
		this.bb_position.bbm_Set2(dbg_object(this.bb_previousPosition).bb_X,dbg_object(this.bb_previousPosition).bb_Y);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<344>";
		this.bb_movementVector.bbm_Set2(0.0,0.0);
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<348>";
	if(dbg_array(bbt_grid,0)[0]){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<349>";
		this.bbm_MovementVectorTest(dbg_array(bbt_grid,1)[1],dbg_array(bbt_grid,2)[2],dbg_array(bbt_grid,3)[3],dbg_array(bbt_grid,5)[5]);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<352>";
	if(dbg_array(bbt_grid,2)[2]){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<353>";
		this.bbm_MovementVectorTest(dbg_array(bbt_grid,0)[0],dbg_array(bbt_grid,1)[1],dbg_array(bbt_grid,4)[4],dbg_array(bbt_grid,7)[7]);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<356>";
	if(dbg_array(bbt_grid,5)[5]){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<357>";
		this.bbm_MovementVectorTest(dbg_array(bbt_grid,6)[6],dbg_array(bbt_grid,7)[7],dbg_array(bbt_grid,0)[0],dbg_array(bbt_grid,3)[3]);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<360>";
	if(dbg_array(bbt_grid,7)[7]){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<361>";
		this.bbm_MovementVectorTest(dbg_array(bbt_grid,5)[5],dbg_array(bbt_grid,6)[6],dbg_array(bbt_grid,2)[2],dbg_array(bbt_grid,4)[4]);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<364>";
	if(this.bb_rollback){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<365>";
		this.bb_position.bbm_Set2(dbg_object(this.bb_previousPosition).bb_X,dbg_object(this.bb_previousPosition).bb_Y);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<366>";
		this.bb_movementVector.bbm_Set2(0.0,0.0);
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<370>";
	this.bb_position.bbm_SubtractLocal(this.bb_movementVector);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<372>";
	var bbt_dx=this.bb_position.bbm_Subtract(this.bb_previousPosition);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<373>";
	var bbt_length=bbt_dx.bbm_Length();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<374>";
	if(bb_math_Abs2(bbt_length)>0.01){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<375>";
		bbt_dx.bbm_Normalize();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<376>";
		bbt_dx.bbm_Scale(this.bb_speed-bbt_length);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<377>";
		this.bb_position.bbm_AddLocal2(bbt_dx);
	}
	pop_err();
}
bb_tank_Tank.prototype.bbm_CheckTankCollisions2=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<277>";
	var bbt_result=bb_vector_new.call(new bb_vector_Vector,0.0,0.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<278>";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<278>";
	var bbt_=bb_globals_gTanks.bbm_ObjectEnumerator();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<278>";
	while(bbt_.bbm_HasNext()){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<278>";
		var bbt_tank=bbt_.bbm_NextObject();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<279>";
		if(this==bbt_tank){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<280>";
			continue;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<283>";
		var bbt_combinedRadius=this.bb_radius+dbg_object(bbt_tank).bb_radius;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<284>";
		var bbt_combinedSquared=bbt_combinedRadius*bbt_combinedRadius;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<286>";
		var bbt_difference=this.bb_position.bbm_Subtract(dbg_object(bbt_tank).bb_position);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<288>";
		if(bbt_difference.bbm_LengthSquared()<(bbt_combinedSquared)){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<289>";
			var bbt_length=bbt_difference.bbm_Length();
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<290>";
			bbt_difference.bbm_Normalize();
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<291>";
			bbt_difference.bbm_ScaleLocal((bbt_combinedRadius)-bbt_length);
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<292>";
			bbt_result.bbm_AddLocal2(bbt_difference);
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<295>";
	pop_err();
	return bbt_result;
}
bb_tank_Tank.prototype.bbm_OnUpdate=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<81>";
	this.bb_movementVector.bbm_Set2(0.0,0.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<82>";
	this.bb_rotationDelta=0.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<84>";
	if(this.bb_health<=0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<85>";
		if(!dbg_object(this.bb_deathAnimation).bb_started){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<86>";
			this.bb_deathAnimation.bbm_Begin(this.bb_position);
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<89>";
		if(!this.bb_deathAnimation.bbm_Finished()){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<90>";
			this.bb_deathAnimation.bbm_Update2();
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<94>";
	if(this.bb_health<=0.0 || bb_globals_gGameOver){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<95>";
		this.bb_forward=false;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<96>";
		this.bb_backward=false;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<97>";
		this.bb_left=false;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<98>";
		this.bb_right=false;
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<102>";
	this.bbm_Move();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<103>";
	this.bbm_Turn();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<106>";
	if(this.bb_rotation<11.25){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<107>";
		this.bb_frame=0;
	}else{
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<108>";
		if(this.bb_rotation<33.75){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<109>";
			this.bb_frame=1;
		}else{
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<110>";
			if(this.bb_rotation<56.25){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<111>";
				this.bb_frame=2;
			}else{
				err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<112>";
				if(this.bb_rotation<78.75){
					err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<113>";
					this.bb_frame=3;
				}else{
					err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<114>";
					if(this.bb_rotation<101.25){
						err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<115>";
						this.bb_frame=4;
					}else{
						err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<116>";
						if(this.bb_rotation<123.75){
							err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<117>";
							this.bb_frame=5;
						}else{
							err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<118>";
							if(this.bb_rotation<146.25){
								err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<119>";
								this.bb_frame=6;
							}else{
								err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<120>";
								if(this.bb_rotation<168.75){
									err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<121>";
									this.bb_frame=7;
								}else{
									err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<122>";
									if(this.bb_rotation<191.25){
										err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<123>";
										this.bb_frame=8;
									}else{
										err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<124>";
										if(this.bb_rotation<213.75){
											err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<125>";
											this.bb_frame=9;
										}else{
											err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<126>";
											if(this.bb_rotation<236.25){
												err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<127>";
												this.bb_frame=10;
											}else{
												err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<128>";
												if(this.bb_rotation<256.75){
													err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<129>";
													this.bb_frame=11;
												}else{
													err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<130>";
													if(this.bb_rotation<281.25){
														err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<131>";
														this.bb_frame=12;
													}else{
														err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<132>";
														if(this.bb_rotation<303.75){
															err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<133>";
															this.bb_frame=13;
														}else{
															err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<134>";
															if(this.bb_rotation<326.25){
																err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<135>";
																this.bb_frame=14;
															}else{
																err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<136>";
																if(this.bb_rotation<348.75){
																	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<137>";
																	this.bb_frame=15;
																}else{
																	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<139>";
																	this.bb_frame=0;
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<145>";
	var bbt_index=this.bbm_CheckEnvironmentCollisions();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<146>";
	if(bbt_index>=0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<147>";
		this.bbm_FixMovementVector();
	}else{
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<151>";
		this.bb_movementVector.bbm_AddLocal2(this.bbm_CheckTankCollisions2());
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<153>";
		if((this.bb_weapon)!=null){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<154>";
			dbg_object(this.bb_weapon).bb_position.bbm_AddLocal2(this.bb_movementVector);
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<158>";
	var bbt_SpeedMod=bb_globals_gWorld.bbm_GetCollisionModifier2(this.bb_position);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<159>";
	if(bbt_SpeedMod>0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<160>";
		this.bb_speed=this.bb_baseSpeed*bbt_SpeedMod;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<163>";
	bbt_index=this.bbm_CheckEnvironmentCollisions();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<164>";
	if(bbt_index>=0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<165>";
		this.bb_position.bbm_Set2(dbg_object(this.bb_previousPosition).bb_X,dbg_object(this.bb_previousPosition).bb_Y);
	}
	pop_err();
}
bb_tank_Tank.prototype.bbm_Hit=function(bbt_damage){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<219>";
	this.bb_health-=bbt_damage;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<220>";
	if(this.bb_health<=0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<221>";
		this.bb_health=0.0;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<223>";
		this.bb_image=this.bb_explodeImage;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/tank.monkey<225>";
	this.bb_healthBar.bbm_Update4(this.bb_health,this.bb_healthMax);
	pop_err();
}
var bb_globals_gTanks;
function bb_random_Rnd(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/random.monkey<21>";
	bb_random_Seed=bb_random_Seed*1664525+1013904223|0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/random.monkey<22>";
	var bbt_=(bb_random_Seed>>8&16777215)/16777216.0;
	pop_err();
	return bbt_;
}
function bb_random_Rnd2(bbt_low,bbt_high){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/random.monkey<30>";
	var bbt_=bb_random_Rnd3(bbt_high-bbt_low)+bbt_low;
	pop_err();
	return bbt_;
}
function bb_random_Rnd3(bbt_range){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/random.monkey<26>";
	var bbt_=bb_random_Rnd()*bbt_range;
	pop_err();
	return bbt_;
}
function bb_weapon_Weapon(){
	Object.call(this);
	this.bb_position=null;
	this.bb_image=null;
	this.bb_fireSound=null;
	this.bb_projectile=null;
	this.bb_cooldown=.0;
	this.bb_lastFired=.0;
	this.bb_frame=0;
	this.bb_direction=null;
	this.bb_rotation=.0;
}
function bb_weapon_new(bbt_startingPosition){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<26>";
	this.bb_position=bbt_startingPosition;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<28>";
	this.bb_image=dbg_object(bb_framework_game).bb_images.bbm_Find("WeaponBlue");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<30>";
	this.bb_fireSound=dbg_object(bb_framework_game).bb_sounds.bbm_Find("shoot");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<32>";
	this.bb_projectile=bb_projectile_new.call(new bb_projectile_Projectile);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<33>";
	dbg_object(this.bb_projectile).bb_speed=6.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<34>";
	dbg_object(this.bb_projectile).bb_damage=2.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<36>";
	this.bb_cooldown=750.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<37>";
	this.bb_lastFired=0.0;
	pop_err();
	return this;
}
function bb_weapon_new2(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<8>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_weapon_Weapon.prototype.bbm_OnRender=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<41>";
	if((this.bb_image)!=null){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<42>";
		bb_graphics_DrawImage2(dbg_object(this.bb_image).bb_image,dbg_object(this.bb_position).bb_X,dbg_object(this.bb_position).bb_Y-10.0,0.0,1.0,1.0,this.bb_frame);
	}
	pop_err();
}
bb_weapon_Weapon.prototype.bbm_AimAt=function(bbt_v){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<63>";
	this.bb_direction=bbt_v.bbm_Subtract(this.bb_position);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<64>";
	this.bb_direction.bbm_Normalize();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<65>";
	this.bb_rotation=(Math.atan2(dbg_object(this.bb_direction).bb_Y,dbg_object(this.bb_direction).bb_X)*R2D);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<67>";
	if(this.bb_rotation>360.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<68>";
		this.bb_rotation-=360.0;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<71>";
	if(this.bb_rotation<0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<72>";
		this.bb_rotation+=360.0;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<76>";
	if(this.bb_rotation<11.25){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<77>";
		this.bb_frame=0;
	}else{
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<78>";
		if(this.bb_rotation<33.75){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<79>";
			this.bb_frame=1;
		}else{
			err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<80>";
			if(this.bb_rotation<56.25){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<81>";
				this.bb_frame=2;
			}else{
				err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<82>";
				if(this.bb_rotation<78.75){
					err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<83>";
					this.bb_frame=3;
				}else{
					err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<84>";
					if(this.bb_rotation<101.25){
						err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<85>";
						this.bb_frame=4;
					}else{
						err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<86>";
						if(this.bb_rotation<123.75){
							err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<87>";
							this.bb_frame=5;
						}else{
							err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<88>";
							if(this.bb_rotation<146.25){
								err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<89>";
								this.bb_frame=6;
							}else{
								err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<90>";
								if(this.bb_rotation<168.75){
									err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<91>";
									this.bb_frame=7;
								}else{
									err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<92>";
									if(this.bb_rotation<191.25){
										err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<93>";
										this.bb_frame=8;
									}else{
										err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<94>";
										if(this.bb_rotation<213.75){
											err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<95>";
											this.bb_frame=9;
										}else{
											err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<96>";
											if(this.bb_rotation<236.25){
												err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<97>";
												this.bb_frame=10;
											}else{
												err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<98>";
												if(this.bb_rotation<256.75){
													err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<99>";
													this.bb_frame=11;
												}else{
													err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<100>";
													if(this.bb_rotation<281.25){
														err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<101>";
														this.bb_frame=12;
													}else{
														err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<102>";
														if(this.bb_rotation<303.75){
															err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<103>";
															this.bb_frame=13;
														}else{
															err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<104>";
															if(this.bb_rotation<326.25){
																err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<105>";
																this.bb_frame=14;
															}else{
																err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<106>";
																if(this.bb_rotation<348.75){
																	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<107>";
																	this.bb_frame=15;
																}else{
																	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<109>";
																	this.bb_frame=0;
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	pop_err();
}
bb_weapon_Weapon.prototype.bbm_Fire=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<49>";
	var bbt_time=(bb_app_Millisecs());
	err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<50>";
	if(this.bb_lastFired==0.0 || bbt_time-this.bb_lastFired>this.bb_cooldown){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<51>";
		this.bb_lastFired=bbt_time;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<53>";
		var bbt_delta=this.bb_direction.bbm_Scale(40.0);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<54>";
		bbt_delta.bbm_AddLocal2(this.bb_position);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<55>";
		dbg_object(bbt_delta).bb_Y=dbg_object(bbt_delta).bb_Y-10.0;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<56>";
		bb_globals_gProjectileManager.bbm_AddProjectile(this.bb_projectile.bbm_Clone(bbt_delta,this.bb_direction,this.bb_rotation));
		err_info="/Users/kerrw/Dropbox/game-development/itanks/weapon.monkey<57>";
		this.bb_fireSound.bbm_Play(-1);
	}
	pop_err();
}
function bb_death_DeathAnimation(){
	Object.call(this);
	this.bb_position=null;
	this.bb_explosionDelay=.0;
	this.bb_explosionStop=.0;
	this.bb_smokeDelay=.0;
	this.bb_smokeStop=.0;
	this.bb_started=false;
	this.bb_finished=false;
	this.bb_start=.0;
}
function bb_death_new(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<21>";
	this.bb_position=bb_vector_new2.call(new bb_vector_Vector);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<22>";
	this.bb_explosionDelay=0.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<23>";
	this.bb_explosionStop=1200.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<25>";
	this.bb_smokeDelay=1000.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<26>";
	this.bb_smokeStop=2000.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<28>";
	this.bb_started=false;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<29>";
	this.bb_finished=false;
	pop_err();
	return this;
}
bb_death_DeathAnimation.prototype.bbm_Begin=function(bbt_p){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<33>";
	this.bb_position.bbm_Set2(dbg_object(bbt_p).bb_X,dbg_object(bbt_p).bb_Y);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<34>";
	this.bb_start=(bb_app_Millisecs());
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<35>";
	this.bb_explosionDelay+=this.bb_start;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<36>";
	this.bb_explosionStop+=this.bb_start;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<38>";
	this.bb_smokeDelay+=this.bb_start;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<39>";
	this.bb_smokeStop+=this.bb_start;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<41>";
	this.bb_started=true;
	pop_err();
}
bb_death_DeathAnimation.prototype.bbm_Finished=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<45>";
	var bbt_time=(bb_app_Millisecs());
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<46>";
	if(bbt_time-this.bb_start>this.bb_smokeStop){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<47>";
		this.bb_finished=true;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<49>";
	pop_err();
	return this.bb_finished;
}
bb_death_DeathAnimation.prototype.bbm_Update2=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<53>";
	var bbt_time=(bb_app_Millisecs());
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<54>";
	if(bbt_time-this.bb_explosionDelay>0.0 && bbt_time-this.bb_explosionStop<=0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<55>";
		bb_globals_gEmitterExplosion.bbm_EmitAt(1,dbg_object(this.bb_position).bb_X,dbg_object(this.bb_position).bb_Y,null);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<58>";
	if(bbt_time-this.bb_smokeDelay>0.0 && bbt_time-this.bb_smokeStop<=0.0 && ((bbt_time)|0) % 5==0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/death.monkey<59>";
		bb_globals_gEmitterSmoke.bbm_EmitAt(1,dbg_object(this.bb_position).bb_X,dbg_object(this.bb_position).bb_Y,null);
	}
	pop_err();
}
function bb_health_bar_HealthBar(){
	Object.call(this);
	this.bb_image=null;
	this.bb_bgImage=null;
	this.bb_imageWidth=.0;
}
function bb_health_bar_new(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/health_bar.monkey<10>";
	this.bb_image=dbg_object(bb_framework_game).bb_images.bbm_Find("Health");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/health_bar.monkey<11>";
	this.bb_image.bbm_MidHandle(false);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/health_bar.monkey<12>";
	this.bb_bgImage=dbg_object(bb_framework_game).bb_images.bbm_Find("HealthBG");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/health_bar.monkey<13>";
	this.bb_bgImage.bbm_MidHandle(false);
	pop_err();
	return this;
}
bb_health_bar_HealthBar.prototype.bbm_Update4=function(bbt_currentHP,bbt_hpMax){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/health_bar.monkey<26>";
	this.bb_imageWidth=(dbg_object(this.bb_image).bb_w)*(bbt_currentHP/bbt_hpMax);
	pop_err();
	return 0;
}
bb_health_bar_HealthBar.prototype.bbm_Render2=function(bbt_position){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/health_bar.monkey<18>";
	if(((this.bb_image)!=null) && ((this.bb_bgImage)!=null)){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/health_bar.monkey<19>";
		var bbt_offset=((dbg_object(this.bb_bgImage).bb_w2)|0);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/health_bar.monkey<20>";
		bb_graphics_DrawImage2(dbg_object(this.bb_bgImage).bb_image,dbg_object(bbt_position).bb_X-(bbt_offset),dbg_object(bbt_position).bb_Y-40.0,0.0,1.0,1.0,0);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/health_bar.monkey<21>";
		bb_graphics_DrawImageRect(dbg_object(this.bb_image).bb_image,dbg_object(bbt_position).bb_X-(bbt_offset),dbg_object(bbt_position).bb_Y-40.0,0,0,((this.bb_imageWidth)|0),dbg_object(this.bb_image).bb_h,0);
	}
	pop_err();
	return 0;
}
function bb_aitank_AITank(){
	bb_tank_Tank.call(this);
	this.bb_search=null;
	this.bb_state="";
	this.bb_extraDelay=.0;
	this.bb_targetAlive=false;
	this.bb_target=null;
	this.bb_path=null;
	this.bb_pathIndex=0;
	this.bb_movingForward=false;
	this.bb_turning=0;
}
bb_aitank_AITank.prototype=extend_class(bb_tank_Tank);
function bb_aitank_new(bbt_v){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<22>";
	bb_tank_new.call(this,bbt_v);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<24>";
	this.bb_search=bb_search_new.call(new bb_search_AStarSearch);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<25>";
	this.bb_state="NONE";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<26>";
	this.bb_image=dbg_object(bb_framework_game).bb_images.bbm_Find("TankBase");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<27>";
	this.bb_explodeImage=dbg_object(bb_framework_game).bb_images.bbm_Find("TankExplode");
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<30>";
	this.bb_extraDelay=bb_random_Rnd()*3000.0+2000.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<31>";
	dbg_object(this.bb_weapon).bb_lastFired=bb_random_Rnd2(0.0,1000.0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<32>";
	dbg_object(this.bb_weapon).bb_cooldown+=this.bb_extraDelay;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<33>";
	dbg_object(this.bb_weapon).bb_image=dbg_object(bb_framework_game).bb_images.bbm_Find("Weapon");
	pop_err();
	return this;
}
function bb_aitank_new2(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<5>";
	bb_tank_new2.call(this);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<5>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_aitank_AITank.prototype.bbm_FollowPath=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<143>";
	if(this.bb_path.bbm_Size()==0){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<147>";
	var bbt_target=this.bb_path.bbm_Get2(this.bb_pathIndex);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<150>";
	var bbt_direction=bbt_target.bbm_Subtract(this.bb_position);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<151>";
	var bbt_distance=bbt_direction.bbm_Length();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<153>";
	if(bbt_distance<32.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<154>";
		this.bb_pathIndex+=1;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<155>";
		if(this.bb_pathIndex>=this.bb_path.bbm_Size()){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<156>";
			this.bb_state="NONE";
			pop_err();
			return;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<159>";
		bbt_target=this.bb_path.bbm_Get2(this.bb_pathIndex);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<160>";
		bbt_direction=bbt_target.bbm_Subtract(this.bb_position);
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<163>";
	bbt_direction.bbm_Normalize();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<164>";
	var bbt_desiredRotation=(Math.atan2(dbg_object(bbt_direction).bb_Y,dbg_object(bbt_direction).bb_X)*R2D);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<165>";
	var bbt_angleDiff=((bb_aitank_AngleDiff(this.bb_rotation,bbt_desiredRotation))|0);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<166>";
	if(bb_math_Abs(bbt_angleDiff)<2){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<167>";
		this.bb_forward=true;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<168>";
		this.bb_backward=false;
	}else{
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<169>";
		if(bb_math_Abs(bbt_angleDiff)>178){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<170>";
			this.bb_backward=true;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<171>";
			this.bb_forward=false;
		}else{
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<176>";
			if(bbt_angleDiff<0){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<177>";
				this.bb_left=true;
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<178>";
				this.bb_right=false;
			}else{
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<180>";
				this.bb_right=true;
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<181>";
				this.bb_left=false;
			}
		}
	}
	pop_err();
}
bb_aitank_AITank.prototype.bbm_StopPathFollowing=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<189>";
	this.bb_path.bbm_Clear();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<190>";
	this.bb_pathIndex=0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<192>";
	this.bb_forward=false;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<193>";
	this.bb_left=false;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<194>";
	this.bb_right=false;
	pop_err();
}
bb_aitank_AITank.prototype.bbm_OnUpdate=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<41>";
	if(bb_globals_gAlive==1 || this.bb_health<=0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<42>";
		bb_tank_Tank.prototype.bbm_OnUpdate.call(this);
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<46>";
	var bbt_visible=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<47>";
	var bbt_closest=null;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<48>";
	var bbt_distance=100000.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<50>";
	this.bb_targetAlive=false;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<51>";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<51>";
	var bbt_=bb_globals_gTanks.bbm_ObjectEnumerator();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<51>";
	while(bbt_.bbm_HasNext()){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<51>";
		var bbt_tank=bbt_.bbm_NextObject();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<52>";
		if((this)==bbt_tank){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<53>";
			continue;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<56>";
		if(dbg_object(bbt_tank).bb_health<=0.0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<57>";
			continue;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<60>";
		var bbt_test=bb_globals_gWorld.bbm_LineOfSight2(dbg_object(this).bb_position,dbg_object(bbt_tank).bb_position);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<61>";
		if(bbt_test){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<62>";
			bbt_visible.bbm_Add(bbt_tank);
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<63>";
			if(this.bb_target==bbt_tank){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<64>";
				this.bb_targetAlive=true;
			}
		}else{
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<69>";
			var bbt_d=dbg_object(bbt_tank).bb_position.bbm_Subtract(this.bb_position).bbm_Length();
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<70>";
			if(bbt_d<bbt_distance){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<71>";
				bbt_closest=bbt_tank;
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<72>";
				bbt_distance=bbt_d;
			}
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<77>";
	if(bbt_visible.bbm_Size()==0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<78>";
		if(this.bb_state!="PATH"){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<79>";
			this.bb_state="PATH";
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<80>";
			this.bb_path=this.bb_search.bbm_FindPath(this.bb_position,bb_vector_new.call(new bb_vector_Vector,dbg_object(dbg_object(bbt_closest).bb_position).bb_X,dbg_object(dbg_object(bbt_closest).bb_position).bb_Y));
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<81>";
			this.bb_pathIndex=0;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<82>";
			if(this.bb_path.bbm_Size()>0){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<83>";
				this.bb_pathIndex=1;
			}
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<88>";
		this.bbm_FollowPath();
	}else{
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<91>";
		if(this.bb_state=="PATH"){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<92>";
			this.bbm_StopPathFollowing();
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<95>";
		this.bb_state="ATTACK";
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<97>";
		if(!this.bb_targetAlive || bb_random_Rnd2(0.0,1000.0)<10.0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<98>";
			this.bb_target=bbt_visible.bbm_Get2((bb_random_Rnd3(bbt_visible.bbm_Size()))|0);
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<100>";
		dbg_object(this).bb_weapon.bbm_AimAt(dbg_object(this.bb_target).bb_position);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<101>";
		dbg_object(this).bb_weapon.bbm_Fire();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<103>";
		if(bb_random_Rnd2(0.0,1000.0)<10.0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<105>";
			this.bb_movingForward=!this.bb_movingForward;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<108>";
		if(this.bb_movingForward){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<109>";
			this.bb_forward=true;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<110>";
			this.bb_backward=false;
		}else{
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<112>";
			this.bb_backward=true;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<113>";
			this.bb_forward=false;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<116>";
		if(bb_random_Rnd2(0.0,1000.0)<100.0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<118>";
			this.bb_turning=0;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<121>";
		if(this.bb_turning==0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<122>";
			this.bb_left=false;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<123>";
			this.bb_right=false;
		}else{
			err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<124>";
			if(this.bb_turning==1){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<125>";
				this.bb_left=true;
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<126>";
				this.bb_right=false;
			}else{
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<128>";
				this.bb_left=false;
				err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<129>";
				this.bb_right=true;
			}
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<133>";
	bb_tank_Tank.prototype.bbm_OnUpdate.call(this);
	pop_err();
}
bb_aitank_AITank.prototype.bbm_OnRender=function(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<138>";
	bb_tank_Tank.prototype.bbm_OnRender.call(this);
	pop_err();
}
function bb_search_AStarSearch(){
	Object.call(this);
	this.bb_neighbors=null;
	this.bb_offsets=null;
	this.bb_comparator=null;
}
function bb_search_new(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<16>";
	this.bb_neighbors=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<17>";
	this.bb_neighbors.bbm_Add(bb_world_new5.call(new bb_world_TanksPoint,0,1));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<18>";
	this.bb_neighbors.bbm_Add(bb_world_new5.call(new bb_world_TanksPoint,1,0));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<19>";
	this.bb_neighbors.bbm_Add(bb_world_new5.call(new bb_world_TanksPoint,0,-1));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<20>";
	this.bb_neighbors.bbm_Add(bb_world_new5.call(new bb_world_TanksPoint,-1,0));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<22>";
	this.bb_offsets=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<23>";
	this.bb_offsets.bbm_Add(this.bb_neighbors.bbm_Get2(0));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<24>";
	this.bb_offsets.bbm_Add(this.bb_neighbors.bbm_Get2(1));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<25>";
	this.bb_offsets.bbm_Add(this.bb_neighbors.bbm_Get2(2));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<26>";
	this.bb_offsets.bbm_Add(this.bb_neighbors.bbm_Get2(3));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<27>";
	this.bb_offsets.bbm_Add(bb_world_new5.call(new bb_world_TanksPoint,-1,-1));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<28>";
	this.bb_offsets.bbm_Add(bb_world_new5.call(new bb_world_TanksPoint,1,-1));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<29>";
	this.bb_offsets.bbm_Add(bb_world_new5.call(new bb_world_TanksPoint,1,1));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<30>";
	this.bb_offsets.bbm_Add(bb_world_new5.call(new bb_world_TanksPoint,1,1));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<32>";
	this.bb_comparator=bb_search_new2.call(new bb_search_StateComparator);
	pop_err();
	return this;
}
bb_search_AStarSearch.prototype.bbm_ManhattanDistance=function(bbt_current,bbt_start,bbt_goal){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<121>";
	var bbt_dx=bb_math_Abs(dbg_object(bbt_goal).bb_x-dbg_object(bbt_current).bb_x);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<122>";
	var bbt_dy=bb_math_Abs(dbg_object(bbt_goal).bb_y-dbg_object(bbt_current).bb_y);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<123>";
	var bbt_=(bbt_dx+bbt_dy);
	pop_err();
	return bbt_;
}
bb_search_AStarSearch.prototype.bbm_ManhattanDistanceTB=function(bbt_current,bbt_start,bbt_goal){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<128>";
	var bbt_h=this.bbm_ManhattanDistance(bbt_current,bbt_start,bbt_goal);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<130>";
	var bbt_dx1=dbg_object(bbt_current).bb_x-dbg_object(bbt_goal).bb_x;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<131>";
	var bbt_dy1=dbg_object(bbt_current).bb_y-dbg_object(bbt_goal).bb_y;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<133>";
	var bbt_dx2=dbg_object(bbt_start).bb_x-dbg_object(bbt_goal).bb_x;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<134>";
	var bbt_dy2=dbg_object(bbt_start).bb_y-dbg_object(bbt_goal).bb_y;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<136>";
	var bbt_cross=(bb_math_Abs(bbt_dx1*bbt_dy2-bbt_dx2*bbt_dy1));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<137>";
	bbt_h+=bbt_cross*0.001;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<138>";
	pop_err();
	return bbt_h;
}
bb_search_AStarSearch.prototype.bbm_IsPassable=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<144>";
	if(bbt_x>=dbg_object(bb_globals_gWorld).bb_numTilesX || bbt_x<0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<145>";
		pop_err();
		return false;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<148>";
	if(bbt_y>=dbg_object(bb_globals_gWorld).bb_numTilesY || bbt_y<0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<149>";
		pop_err();
		return false;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<152>";
	if(dbg_array(dbg_array(dbg_object(bb_globals_gWorld).bb_world1,bbt_y)[bbt_y],bbt_x)[bbt_x]>=17){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<153>";
		pop_err();
		return false;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<156>";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<156>";
	var bbt_=this.bb_offsets.bbm_ObjectEnumerator();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<156>";
	while(bbt_.bbm_HasNext()){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<156>";
		var bbt_delta=bbt_.bbm_NextObject();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<157>";
		var bbt_newx=bbt_x+dbg_object(bbt_delta).bb_x;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<158>";
		var bbt_newy=bbt_y+dbg_object(bbt_delta).bb_y;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<160>";
		if(bbt_newx>=dbg_object(bb_globals_gWorld).bb_numTilesX || bbt_newx<0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<161>";
			pop_err();
			return false;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<164>";
		if(bbt_newy>=dbg_object(bb_globals_gWorld).bb_numTilesY || bbt_newy<0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<165>";
			pop_err();
			return false;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<168>";
		if(dbg_array(dbg_array(dbg_object(bb_globals_gWorld).bb_world1,bbt_newy)[bbt_newy],bbt_newx)[bbt_newx]>=17){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<169>";
			pop_err();
			return false;
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<172>";
	pop_err();
	return true;
}
bb_search_AStarSearch.prototype.bbm_Neighbors=function(bbt_s){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<178>";
	var bbt_results=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<180>";
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<180>";
	var bbt_=this.bb_neighbors.bbm_ObjectEnumerator();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<180>";
	while(bbt_.bbm_HasNext()){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<180>";
		var bbt_delta=bbt_.bbm_NextObject();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<181>";
		var bbt_newx=dbg_object(bbt_s).bb_x+dbg_object(bbt_delta).bb_x;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<182>";
		var bbt_newy=dbg_object(bbt_s).bb_y+dbg_object(bbt_delta).bb_y;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<184>";
		if(!this.bbm_IsPassable(bbt_newx,bbt_newy)){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<185>";
			continue;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<188>";
		var bbt_cost=1.0;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<189>";
		if(dbg_object(bbt_delta).bb_x!=0 || dbg_object(bbt_delta).bb_y!=0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<190>";
			bbt_cost=1.44;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<193>";
		if(dbg_array(dbg_array(dbg_object(bb_globals_gWorld).bb_world1,bbt_newy)[bbt_newy],bbt_newx)[bbt_newx]>0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<194>";
			bbt_cost+=0.25;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<197>";
		bbt_results.bbm_Add(bb_search_new4.call(new bb_search_State,bbt_s,bbt_newx,bbt_newy,bbt_cost));
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<200>";
	pop_err();
	return bbt_results;
}
bb_search_AStarSearch.prototype.bbm_FindPath=function(bbt_s,bbt_g){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<39>";
	var bbt_start=bb_search_new3.call(new bb_search_State,((Math.floor(dbg_object(bbt_s).bb_X/(dbg_object(bb_globals_gWorld).bb_tileWidth)))|0),((Math.floor(dbg_object(bbt_s).bb_Y/(dbg_object(bb_globals_gWorld).bb_tileHeight)))|0));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<40>";
	var bbt_goal=bb_search_new3.call(new bb_search_State,((Math.floor(dbg_object(bbt_g).bb_X/(dbg_object(bb_globals_gWorld).bb_tileWidth)))|0),((Math.floor(dbg_object(bbt_g).bb_Y/(dbg_object(bb_globals_gWorld).bb_tileHeight)))|0));
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<42>";
	var bbt_explored=bb_map_new2.call(new bb_map_StringMap);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<43>";
	dbg_object(bbt_start).bb_cost=0.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<44>";
	dbg_object(bbt_start).bb_estimate=this.bbm_ManhattanDistanceTB(bbt_start,bbt_start,bbt_goal);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<46>";
	var bbt_openMap=bb_map_new2.call(new bb_map_StringMap);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<47>";
	var bbt_open=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<49>";
	bbt_open.bbm_Add(bbt_start);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<50>";
	bbt_openMap.bbm_Set((bb_boxes_new3.call(new bb_boxes_StringObject,dbg_object(bbt_start).bb_key)),bbt_start);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<52>";
	var bbt_endState=null;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<53>";
	while(!bbt_open.bbm_IsEmpty()){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<54>";
		var bbt_current=bbt_open.bbm_RemoveAt(0);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<55>";
		bbt_openMap.bbm_Remove(bb_boxes_new3.call(new bb_boxes_StringObject,dbg_object(bbt_current).bb_key));
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<57>";
		if(string_compare(dbg_object(bbt_current).bb_key,dbg_object(bbt_goal).bb_key)==0){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<58>";
			bbt_endState=bbt_current;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<59>";
			break;
		}
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<62>";
		bbt_explored.bbm_Set((bb_boxes_new3.call(new bb_boxes_StringObject,dbg_object(bbt_current).bb_key)),bbt_current);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<63>";
		var bbt_list=this.bbm_Neighbors(bbt_current);
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<64>";
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<64>";
		var bbt_=bbt_list.bbm_ObjectEnumerator();
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<64>";
		while(bbt_.bbm_HasNext()){
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<64>";
			var bbt_n=bbt_.bbm_NextObject();
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<66>";
			if(bbt_explored.bbm_Contains(bb_boxes_new3.call(new bb_boxes_StringObject,dbg_object(bbt_n).bb_key))){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<67>";
				continue;
			}
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<70>";
			var bbt_g2=dbg_object(bbt_current).bb_cost+dbg_object(bbt_n).bb_actionCost;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<71>";
			var bbt_h=this.bbm_ManhattanDistanceTB(bbt_n,bbt_start,bbt_goal);
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<73>";
			var bbt_isBetter=false;
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<74>";
			var bbt_tmp=bbt_openMap.bbm_Get(bb_boxes_new3.call(new bb_boxes_StringObject,dbg_object(bbt_n).bb_key));
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<75>";
			if(bbt_tmp==null){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<76>";
				bbt_isBetter=true;
			}else{
				err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<77>";
				if(bbt_g2<dbg_object(bbt_tmp).bb_cost){
					err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<78>";
					bbt_isBetter=true;
					err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<80>";
					bbt_openMap.bbm_Remove(bb_boxes_new3.call(new bb_boxes_StringObject,dbg_object(bbt_tmp).bb_key));
					err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<81>";
					bbt_open.bbm_Remove2(bbt_tmp);
				}else{
					err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<83>";
					bbt_isBetter=false;
				}
			}
			err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<86>";
			if(bbt_isBetter){
				err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<87>";
				dbg_object(bbt_n).bb_cost=bbt_g2;
				err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<88>";
				dbg_object(bbt_n).bb_estimate=bbt_h;
				err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<89>";
				dbg_object(bbt_n).bb_cameFrom=bbt_current;
				err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<91>";
				bbt_open.bbm_Add(bbt_n);
				err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<92>";
				bbt_openMap.bbm_Set((bb_boxes_new3.call(new bb_boxes_StringObject,dbg_object(bbt_n).bb_key)),bbt_n);
				err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<95>";
				bbt_open.bbm_Sort(false,(this.bb_comparator));
			}
		}
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<100>";
	var bbt_path=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<101>";
	if(bbt_endState==null){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<103>";
		pop_err();
		return bbt_path;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<109>";
	bbt_path.bbm_Add(bbt_g);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<111>";
	var bbt_tmp2=bbt_endState;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<112>";
	while(dbg_object(bbt_tmp2).bb_cameFrom!=null){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<113>";
		bbt_tmp2=dbg_object(bbt_tmp2).bb_cameFrom;
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<114>";
		bbt_path.bbm_AddFirst(bb_vector_new.call(new bb_vector_Vector,(dbg_object(bbt_tmp2).bb_x*dbg_object(bb_globals_gWorld).bb_tileWidth+16),(dbg_object(bbt_tmp2).bb_y*dbg_object(bb_globals_gWorld).bb_tileHeight+16)));
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<116>";
	pop_err();
	return bbt_path;
}
function bb_world_TanksPoint(){
	Object.call(this);
	this.bb_x=0;
	this.bb_y=0;
}
function bb_world_new5(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<316>";
	dbg_object(this).bb_x=bbt_x;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<317>";
	dbg_object(this).bb_y=bbt_y;
	pop_err();
	return this;
}
function bb_world_new6(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/world.monkey<311>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_collections_AbstractComparator(){
	Object.call(this);
}
function bb_collections_new7(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<93>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_collections_AbstractComparator.prototype.bbm_Compare2=function(bbt_o1,bbt_o2){
}
function bb_search_StateComparator(){
	bb_collections_AbstractComparator.call(this);
}
bb_search_StateComparator.prototype=extend_class(bb_collections_AbstractComparator);
function bb_search_new2(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<239>";
	bb_collections_new7.call(this);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<239>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_search_StateComparator.prototype.bbm_Compare2=function(bbt_o1,bbt_o2){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<241>";
	var bbt_s1=object_downcast((bbt_o1),bb_search_State);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<242>";
	var bbt_s2=object_downcast((bbt_o2),bb_search_State);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<244>";
	if(dbg_object(bbt_s1).bb_cost<dbg_object(bbt_s2).bb_cost){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<244>";
		pop_err();
		return -1;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<245>";
	if(dbg_object(bbt_s1).bb_cost>dbg_object(bbt_s2).bb_cost){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<245>";
		pop_err();
		return 1;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<246>";
	pop_err();
	return 0;
}
function bb_xml_XMLParser(){
	Object.call(this);
	this.bb_str="";
}
function bb_xml_new(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<13>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_xml_XMLParser.prototype.bbm_FindUnquoted=function(bbt_findit,bbt_start){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<19>";
	var bbt_a=this.bb_str.indexOf(bbt_findit,bbt_start);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<22>";
	var bbt_singleQuote=this.bb_str.indexOf("'",bbt_start);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<23>";
	var bbt_doubleQuote=this.bb_str.indexOf("\"",bbt_start);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<24>";
	var bbt_quoteToFind="";
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<25>";
	var bbt_b=-1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<26>";
	if(bbt_singleQuote>=0 && bbt_doubleQuote<0 || bbt_singleQuote>=0 && bbt_singleQuote<bbt_doubleQuote){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<27>";
		bbt_quoteToFind="'";
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<28>";
		bbt_b=bbt_singleQuote;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<29>";
		if(bbt_doubleQuote>=0 && bbt_singleQuote<0 || bbt_doubleQuote>=0 && bbt_doubleQuote<bbt_singleQuote){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<30>";
			bbt_quoteToFind="\"";
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<31>";
			bbt_b=bbt_doubleQuote;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<35>";
	while(bbt_b>=0 && bbt_a>=0 && bbt_a>bbt_b){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<37>";
		bbt_b=this.bb_str.indexOf(bbt_quoteToFind,bbt_b+1);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<40>";
		if(bbt_b<0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<40>";
			bb_assert_AssertError("Unclosed quote detected.");
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<43>";
		bbt_a=this.bb_str.indexOf(bbt_findit,bbt_b+1);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<46>";
		bbt_singleQuote=this.bb_str.indexOf("'",bbt_b+1);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<47>";
		bbt_doubleQuote=this.bb_str.indexOf("\"",bbt_b+1);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<48>";
		bbt_b=-1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<49>";
		if(bbt_singleQuote>=0 && bbt_doubleQuote<0 || bbt_singleQuote>=0 && bbt_singleQuote<bbt_doubleQuote){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<50>";
			bbt_quoteToFind="'";
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<51>";
			bbt_b=bbt_singleQuote;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<52>";
			if(bbt_doubleQuote>=0 && bbt_singleQuote<0 || bbt_doubleQuote>=0 && bbt_doubleQuote<bbt_singleQuote){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<53>";
				bbt_quoteToFind="\"";
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<54>";
				bbt_b=bbt_doubleQuote;
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<58>";
	pop_err();
	return bbt_a;
}
bb_xml_XMLParser.prototype.bbm_GetTagContents=function(bbt_startIndex,bbt_endIndex){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<64>";
	while(bbt_endIndex>bbt_startIndex && (this.bb_str.charCodeAt(bbt_endIndex)==32 || this.bb_str.charCodeAt(bbt_endIndex)==9 || this.bb_str.charCodeAt(bbt_endIndex)==10 || this.bb_str.charCodeAt(bbt_endIndex)==13)){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<65>";
		bbt_endIndex+=1;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<68>";
	if(bbt_startIndex==bbt_endIndex){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<68>";
		bb_assert_AssertError("Empty tag detected.");
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<70>";
	var bbt_e=bb_xml_new5.call(new bb_xml_XMLElement);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<71>";
	var bbt_a=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<71>";
	var bbt_singleQuoted=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<71>";
	var bbt_doubleQuoted=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<71>";
	var bbt_key="";
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<71>";
	var bbt_value="";
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<74>";
	while(this.bb_str.charCodeAt(bbt_startIndex)==32 || this.bb_str.charCodeAt(bbt_startIndex)==9 || this.bb_str.charCodeAt(bbt_startIndex)==10 || this.bb_str.charCodeAt(bbt_startIndex)==13){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<75>";
		bbt_startIndex+=1;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<79>";
	bbt_a=bbt_startIndex;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<80>";
	while(bbt_a<bbt_endIndex){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<81>";
		if(this.bb_str.charCodeAt(bbt_a)==32 || this.bb_str.charCodeAt(bbt_a)==9 || this.bb_str.charCodeAt(bbt_a)==10 || this.bb_str.charCodeAt(bbt_a)==13 || bbt_a==bbt_endIndex-1){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<82>";
			if(bbt_a==bbt_endIndex-1){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<83>";
				dbg_object(bbt_e).bb_name=this.bb_str.slice(bbt_startIndex,bbt_endIndex);
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<85>";
				dbg_object(bbt_e).bb_name=this.bb_str.slice(bbt_startIndex,bbt_a);
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<87>";
			bbt_a+=1;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<88>";
			break;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<90>";
		bbt_a+=1;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<92>";
	bbt_startIndex=bbt_a;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<96>";
	if(dbg_object(bbt_e).bb_name==""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<96>";
		bb_assert_AssertError("Error reading tag name.");
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<99>";
	while(bbt_startIndex<bbt_endIndex){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<101>";
		while(bbt_startIndex<bbt_endIndex && (this.bb_str.charCodeAt(bbt_startIndex)==32 || this.bb_str.charCodeAt(bbt_startIndex)==9 || this.bb_str.charCodeAt(bbt_startIndex)==10 || this.bb_str.charCodeAt(bbt_startIndex)==13)){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<102>";
			bbt_startIndex+=1;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<106>";
		bbt_singleQuoted=false;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<107>";
		bbt_doubleQuoted=false;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<108>";
		bbt_key="";
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<109>";
		bbt_value="";
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<112>";
		bbt_a=bbt_startIndex;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<113>";
		while(bbt_a<bbt_endIndex){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<114>";
			if(this.bb_str.charCodeAt(bbt_a)==61 || this.bb_str.charCodeAt(bbt_a)==32 || this.bb_str.charCodeAt(bbt_a)==9 || this.bb_str.charCodeAt(bbt_a)==10 || this.bb_str.charCodeAt(bbt_a)==13 || bbt_a==bbt_endIndex-1){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<115>";
				if(bbt_a==bbt_endIndex-1){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<116>";
					bbt_key=this.bb_str.slice(bbt_startIndex,bbt_endIndex);
				}else{
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<118>";
					bbt_key=this.bb_str.slice(bbt_startIndex,bbt_a);
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<120>";
				bbt_a+=1;
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<121>";
				break;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<123>";
			bbt_a+=1;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<125>";
		bbt_startIndex=bbt_a;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<128>";
		if(bbt_key==""){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<129>";
			if(bbt_a<bbt_endIndex){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<130>";
				bb_assert_AssertError("Error reading attribute key.");
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<132>";
				break;
			}
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<137>";
		if(this.bb_str.charCodeAt(bbt_a-1)==61){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<138>";
			bbt_singleQuoted=false;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<139>";
			bbt_doubleQuoted=false;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<140>";
			while(bbt_a<bbt_endIndex){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<142>";
				if(this.bb_str.charCodeAt(bbt_a)==39 && !bbt_doubleQuoted){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<144>";
					if(bbt_a==bbt_startIndex){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<145>";
						bbt_singleQuoted=true;
					}else{
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<147>";
						if(!bbt_singleQuoted && !bbt_doubleQuoted){
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<148>";
							bb_assert_AssertError("Unexpected single quote detected in attribute value.");
						}else{
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<151>";
							bbt_singleQuoted=false;
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<152>";
							bbt_value=this.bb_str.slice(bbt_startIndex+1,bbt_a);
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<153>";
							bbt_a+=1;
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<154>";
							break;
						}
					}
				}else{
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<158>";
					if(this.bb_str.charCodeAt(bbt_a)==34 && !bbt_singleQuoted){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<160>";
						if(bbt_a==bbt_startIndex){
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<161>";
							bbt_doubleQuoted=true;
						}else{
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<163>";
							if(!bbt_singleQuoted && !bbt_doubleQuoted){
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<164>";
								bb_assert_AssertError("Unexpected double quote detected in attribute value.");
							}else{
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<167>";
								bbt_doubleQuoted=false;
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<168>";
								bbt_value=this.bb_str.slice(bbt_startIndex+1,bbt_a);
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<169>";
								bbt_a+=1;
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<170>";
								break;
							}
						}
					}else{
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<174>";
						if(bbt_a==bbt_endIndex-1 || !bbt_singleQuoted && !bbt_doubleQuoted && (this.bb_str.charCodeAt(bbt_a)==32 || this.bb_str.charCodeAt(bbt_a)==9 || this.bb_str.charCodeAt(bbt_a)==10 || this.bb_str.charCodeAt(bbt_a)==13)){
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<175>";
							if(bbt_a==bbt_endIndex-1){
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<176>";
								bbt_value=this.bb_str.slice(bbt_startIndex,bbt_endIndex);
							}else{
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<178>";
								bbt_value=this.bb_str.slice(bbt_startIndex,bbt_a);
							}
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<180>";
							bbt_a+=1;
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<181>";
							break;
						}
					}
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<183>";
				bbt_a+=1;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<185>";
			bbt_startIndex=bbt_a;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<186>";
			bbt_value=bb_xml_UnescapeXMLString(bbt_value);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<188>";
			if(bbt_singleQuoted || bbt_doubleQuoted){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<188>";
				bb_assert_AssertError("Unclosed quote detected.");
			}
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<192>";
		bbt_e.bbm_SetAttribute(bbt_key,bbt_value);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<194>";
		if(bbt_a>=bbt_endIndex){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<194>";
			break;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<196>";
	pop_err();
	return bbt_e;
}
bb_xml_XMLParser.prototype.bbm_ParseString=function(bbt_str){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<205>";
	dbg_object(this).bb_str=bbt_str;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<207>";
	var bbt_doc=bb_xml_new4.call(new bb_xml_XMLDocument);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<208>";
	var bbt_elements=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<209>";
	var bbt_thisE=null;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<209>";
	var bbt_newE=null;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<210>";
	var bbt_index=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<210>";
	var bbt_a=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<210>";
	var bbt_b=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<210>";
	var bbt_c=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<210>";
	var bbt_nextIndex=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<213>";
	bbt_a=bbt_str.indexOf("<",bbt_index);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<214>";
	while(bbt_a>=bbt_index){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<216>";
		if(bbt_a>bbt_index && string_trim(bbt_str.slice(bbt_index,bbt_a))!=""){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<217>";
			if(bbt_thisE!=null){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<218>";
				dbg_object(bbt_thisE).bb_value+=bb_xml_UnescapeXMLString(string_trim(bbt_str.slice(bbt_index,bbt_a)));
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<220>";
				bb_assert_AssertError("Loose text outside of any tag!");
			}
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<224>";
		if(bbt_str.charCodeAt(bbt_a+1)==63){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<226>";
			if(bbt_thisE!=null){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<226>";
				bb_assert_AssertError("Processing instruction detected inside main document tag.");
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<228>";
			bbt_nextIndex=this.bbm_FindUnquoted("?>",bbt_a+2);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<229>";
			bbt_newE=this.bbm_GetTagContents(bbt_a+2,bbt_nextIndex);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<230>";
			dbg_object(bbt_newE).bb_pi=true;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<231>";
			dbg_object(bbt_doc).bb_pi.bbm_Add(bbt_newE);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<232>";
			bbt_newE=null;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<233>";
			bbt_nextIndex+=2;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<235>";
			if(bbt_str.charCodeAt(bbt_a+1)==33){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<237>";
				if(bbt_str.charCodeAt(bbt_a+2)==45 && bbt_str.charCodeAt(bbt_a+3)==45){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<239>";
					bbt_nextIndex=bbt_str.indexOf("-->",bbt_a+4);
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<241>";
					if(bbt_nextIndex<0){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<241>";
						bb_assert_AssertError("Unclosed comment detected.");
					}
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<243>";
					if(bbt_str.charCodeAt(bbt_nextIndex-1)==45){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<243>";
						bb_assert_AssertError("Invalid comment close detected (too many hyphens).");
					}
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<244>";
					bbt_nextIndex+=3;
				}else{
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<247>";
					if(bbt_str.indexOf("[CDATA[",bbt_a+2)==bbt_a+2){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<249>";
						if(bbt_thisE==null){
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<249>";
							bb_assert_AssertError("CDATA detected outside main document tag.");
						}
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<250>";
						bbt_nextIndex=bbt_str.indexOf("]]>",bbt_a+9);
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<252>";
						if(bbt_nextIndex<0){
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<252>";
							bb_assert_AssertError("Unclosed CDATA tag detected.");
						}
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<253>";
						bbt_newE=bb_xml_new5.call(new bb_xml_XMLElement);
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<254>";
						dbg_object(bbt_newE).bb_value=bbt_str.slice(bbt_a+9,bbt_nextIndex);
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<255>";
						dbg_object(bbt_newE).bb_cdata=true;
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<256>";
						bbt_thisE.bbm_AddChild(bbt_newE);
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<257>";
						bbt_newE=null;
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<258>";
						bbt_nextIndex+=3;
					}else{
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<261>";
						if(bbt_str.indexOf("DOCTYPE",bbt_a+2)==bbt_a+2){
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<263>";
							if(bbt_thisE!=null){
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<263>";
								bb_assert_AssertError("DOCTYPE detected inside main document tag.");
							}
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<264>";
							bbt_nextIndex=this.bbm_FindUnquoted(">",bbt_a+9);
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<265>";
							bbt_newE=this.bbm_GetTagContents(bbt_a+9,bbt_nextIndex);
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<266>";
							dbg_object(bbt_newE).bb_prolog=true;
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<267>";
							dbg_object(bbt_doc).bb_prologs.bbm_Add(bbt_newE);
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<268>";
							bbt_newE=null;
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<269>";
							bbt_nextIndex+=1;
						}else{
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<273>";
							bb_assert_AssertError("Unknown prolog detected.");
						}
					}
				}
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<277>";
				if(bbt_str.charCodeAt(bbt_a+1)==47){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<279>";
					if(bbt_thisE==null){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<279>";
						bb_assert_AssertError("Closing tag found outside main document tag.");
					}
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<281>";
					bbt_nextIndex=bbt_str.indexOf(">",bbt_a+2);
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<283>";
					if(bbt_nextIndex<0){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<283>";
						bb_assert_AssertError("Incomplete closing tag detected.");
					}
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<285>";
					if(string_trim(bbt_str.slice(bbt_a+2,bbt_nextIndex))!=dbg_object(bbt_thisE).bb_name){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<285>";
						bb_assert_AssertError("Closing tag \""+string_trim(bbt_str.slice(bbt_a+2,bbt_nextIndex))+"\" does not match opening tag \""+dbg_object(bbt_thisE).bb_name+"\"");
					}
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<286>";
					if(!bbt_elements.bbm_IsEmpty()){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<287>";
						bbt_thisE=bbt_elements.bbm_RemoveLast();
					}else{
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<289>";
						dbg_object(bbt_doc).bb_root=bbt_thisE;
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<290>";
						break;
					}
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<292>";
					bbt_nextIndex+=1;
				}else{
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<297>";
					bbt_b=this.bbm_FindUnquoted("/>",bbt_a+1);
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<298>";
					bbt_c=this.bbm_FindUnquoted(">",bbt_a+1);
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<300>";
					if(bbt_c<0){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<301>";
						bb_assert_AssertError("Incomplete opening tag detected.");
					}else{
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<304>";
						if(bbt_b<0 || bbt_c<bbt_b){
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<306>";
							bbt_newE=this.bbm_GetTagContents(bbt_a+1,bbt_c);
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<307>";
							if(bbt_thisE!=null){
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<309>";
								bbt_elements.bbm_AddLast2(bbt_thisE);
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<311>";
								bbt_thisE.bbm_AddChild(bbt_newE);
							}
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<313>";
							bbt_thisE=bbt_newE;
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<314>";
							bbt_newE=null;
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<315>";
							bbt_nextIndex=bbt_c+1;
						}else{
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<318>";
							bbt_newE=this.bbm_GetTagContents(bbt_a+1,bbt_b);
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<319>";
							if(bbt_thisE!=null){
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<320>";
								bbt_thisE.bbm_AddChild(bbt_newE);
							}else{
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<322>";
								dbg_object(bbt_doc).bb_root=bbt_newE;
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<323>";
								break;
							}
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<325>";
							bbt_newE=null;
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<326>";
							bbt_nextIndex=bbt_b+2;
						}
					}
				}
			}
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<329>";
		bbt_index=bbt_nextIndex;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<330>";
		bbt_a=bbt_str.indexOf("<",bbt_index);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<332>";
	if(dbg_object(bbt_doc).bb_root==null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<332>";
		bb_assert_AssertError("Error parsing XML: no document tag found.");
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<333>";
	pop_err();
	return bbt_doc;
}
bb_xml_XMLParser.prototype.bbm_ParseFile=function(bbt_filename){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<200>";
	var bbt_=this.bbm_ParseString(bb_app_LoadString(bbt_filename));
	pop_err();
	return bbt_;
}
function bb_xml_XMLDocument(){
	Object.call(this);
	this.bb_root=null;
	this.bb_pi=bb_collections_new3.call(new bb_collections_ArrayList);
	this.bb_prologs=bb_collections_new3.call(new bb_collections_ArrayList);
}
function bb_xml_new2(bbt_rootName){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<349>";
	if(bbt_rootName!=""){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<349>";
		this.bb_root=bb_xml_new6.call(new bb_xml_XMLElement,bbt_rootName,null);
	}
	pop_err();
	return this;
}
function bb_xml_new3(bbt_root){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<353>";
	dbg_object(this).bb_root=bbt_root;
	pop_err();
	return this;
}
function bb_xml_new4(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<337>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_xml_XMLDocument.prototype.bbm_Root=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<373>";
	pop_err();
	return this.bb_root;
}
function bb_xml_XMLElement(){
	Object.call(this);
	this.bb_parent=null;
	this.bb_name="";
	this.bb_children=bb_collections_new3.call(new bb_collections_ArrayList);
	this.bb_value="";
	this.bb_attributes=bb_collections_new3.call(new bb_collections_ArrayList);
	this.bb_pi=false;
	this.bb_cdata=false;
	this.bb_prolog=false;
}
function bb_xml_new5(){
	push_err();
	pop_err();
	return this;
}
function bb_xml_new6(bbt_name,bbt_parent){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<429>";
	dbg_object(this).bb_parent=bbt_parent;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<430>";
	dbg_object(this).bb_name=bbt_name;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<431>";
	if(bbt_parent!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<431>";
		dbg_object(bbt_parent).bb_children.bbm_Add(this);
	}
	pop_err();
	return this;
}
bb_xml_XMLElement.prototype.bbm_SetAttribute=function(bbt_name,bbt_value){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<471>";
	for(var bbt_i=0;bbt_i<this.bb_attributes.bbm_Size();bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<472>";
		var bbt_att=this.bb_attributes.bbm_Get2(bbt_i);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<473>";
		if(dbg_object(bbt_att).bb_name==bbt_name){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<474>";
			var bbt_old=dbg_object(bbt_att).bb_value;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<475>";
			dbg_object(bbt_att).bb_value=bbt_value;
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<476>";
			pop_err();
			return bbt_old;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<479>";
	this.bb_attributes.bbm_Add(bb_xml_new7.call(new bb_xml_XMLAttribute,bbt_name,bbt_value));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<480>";
	pop_err();
	return "";
}
bb_xml_XMLElement.prototype.bbm_AddChild=function(bbt_child){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<449>";
	if(this.bb_children.bbm_Contains2(bbt_child)){
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<450>";
	this.bb_children.bbm_Add(bbt_child);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<451>";
	dbg_object(bbt_child).bb_parent=this;
	pop_err();
}
bb_xml_XMLElement.prototype.bbm_Children=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<568>";
	pop_err();
	return this.bb_children;
}
bb_xml_XMLElement.prototype.bbm_Name=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<576>";
	pop_err();
	return this.bb_name;
}
bb_xml_XMLElement.prototype.bbm_HasAttribute=function(bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<455>";
	for(var bbt_i=0;bbt_i<this.bb_attributes.bbm_Size();bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<456>";
		var bbt_att=this.bb_attributes.bbm_Get2(bbt_i);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<457>";
		if(dbg_object(bbt_att).bb_name==bbt_name){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<457>";
			pop_err();
			return true;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<459>";
	pop_err();
	return false;
}
bb_xml_XMLElement.prototype.bbm_GetAttribute=function(bbt_name,bbt_defaultValue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<463>";
	for(var bbt_i=0;bbt_i<this.bb_attributes.bbm_Size();bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<464>";
		var bbt_att=this.bb_attributes.bbm_Get2(bbt_i);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<465>";
		if(dbg_object(bbt_att).bb_name==bbt_name){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<465>";
			var bbt_=dbg_object(bbt_att).bb_value;
			pop_err();
			return bbt_;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<467>";
	pop_err();
	return bbt_defaultValue;
}
function bb_xml_UnescapeXMLString(bbt_str){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<594>";
	bbt_str=string_replace(bbt_str,"&quot;","\"");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<595>";
	bbt_str=string_replace(bbt_str,"&apos;","'");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<596>";
	bbt_str=string_replace(bbt_str,"&gt;",">");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<597>";
	bbt_str=string_replace(bbt_str,"&lt;","<");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<598>";
	bbt_str=string_replace(bbt_str,"&amp;","&");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<599>";
	pop_err();
	return bbt_str;
}
function bb_xml_XMLAttribute(){
	Object.call(this);
	this.bb_name="";
	this.bb_value="";
}
function bb_xml_new7(bbt_name,bbt_value){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<400>";
	dbg_object(this).bb_name=bbt_name;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<401>";
	dbg_object(this).bb_value=bbt_value;
	pop_err();
	return this;
}
function bb_xml_new8(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/xml.monkey<393>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_psystem_ParticleSystem(){
	Object.call(this);
	this.bb_groups=null;
	this.bb_emitters=null;
	this.implments={bb_psystem_IPSReader:1};
}
function bb_psystem_new(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<23>";
	this.bb_groups=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<24>";
	this.bb_emitters=bb_collections_new3.call(new bb_collections_ArrayList);
	pop_err();
	return this;
}
bb_psystem_ParticleSystem.prototype.bbm_GetGroup=function(bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<41>";
	for(var bbt_i=0;bbt_i<this.bb_groups.bbm_Size();bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<42>";
		if(this.bb_groups.bbm_Get2(bbt_i).bbm_Name()==bbt_name){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<43>";
			var bbt_=this.bb_groups.bbm_Get2(bbt_i);
			pop_err();
			return bbt_;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<46>";
	pop_err();
	return null;
}
bb_psystem_ParticleSystem.prototype.bbm_ReadXML=function(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<76>";
	var bbt_children=bbt_node.bbm_Children();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<77>";
	for(var bbt_i=0;bbt_i<bbt_children.bbm_Size();bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<78>";
		if(bbt_children.bbm_Get2(bbt_i).bbm_Name()=="groups"){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<80>";
			var bbt_groupNodes=bbt_children.bbm_Get2(bbt_i).bbm_Children();
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<81>";
			for(var bbt_j=0;bbt_j<bbt_groupNodes.bbm_Size();bbt_j=bbt_j+1){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<82>";
				var bbt_groupNode=bbt_groupNodes.bbm_Get2(bbt_j);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<83>";
				if(bbt_groupNode.bbm_Name()=="group"){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<84>";
					var bbt_group=bb_psystem_new5.call(new bb_psystem_ParticleGroup,bbt_groupNode);
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<85>";
					this.bb_groups.bbm_Add(bbt_group);
				}
			}
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<88>";
			if(bbt_children.bbm_Get2(bbt_i).bbm_Name()=="emitters"){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<90>";
				var bbt_emitterNodes=bbt_children.bbm_Get2(bbt_i).bbm_Children();
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<91>";
				for(var bbt_j2=0;bbt_j2<bbt_emitterNodes.bbm_Size();bbt_j2=bbt_j2+1){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<92>";
					var bbt_emitterNode=bbt_emitterNodes.bbm_Get2(bbt_j2);
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<93>";
					if(bbt_emitterNode.bbm_Name()=="emitter"){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<94>";
						var bbt_emitter=bb_psystem_new8.call(new bb_psystem_Emitter,bbt_emitterNode);
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<95>";
						this.bb_emitters.bbm_Add(bbt_emitter);
					}
				}
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<101>";
	for(var bbt_i2=0;bbt_i2<this.bb_emitters.bbm_Size();bbt_i2=bbt_i2+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<102>";
		var bbt_group2=this.bbm_GetGroup(dbg_object(this.bb_emitters.bbm_Get2(bbt_i2)).bb_groupName);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<103>";
		if(bbt_group2!=null){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<103>";
			this.bb_emitters.bbm_Get2(bbt_i2).bbm_Group2(bbt_group2);
		}
	}
	pop_err();
}
function bb_psystem_new2(bbt_doc){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<28>";
	this.bb_groups=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<29>";
	this.bb_emitters=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<30>";
	this.bbm_ReadXML(bbt_doc.bbm_Root());
	pop_err();
	return this;
}
function bb_psystem_new3(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<34>";
	this.bb_groups=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<35>";
	this.bb_emitters=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<36>";
	this.bbm_ReadXML(bbt_node);
	pop_err();
	return this;
}
bb_psystem_ParticleSystem.prototype.bbm_GetEmitter=function(bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<50>";
	for(var bbt_i=0;bbt_i<this.bb_emitters.bbm_Size();bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<51>";
		if(this.bb_emitters.bbm_Get2(bbt_i).bbm_Name()==bbt_name){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<52>";
			var bbt_=this.bb_emitters.bbm_Get2(bbt_i);
			pop_err();
			return bbt_;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<55>";
	pop_err();
	return null;
}
bb_psystem_ParticleSystem.prototype.bbm_Render=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<59>";
	var bbt_rgb=bb_graphics_GetColor();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<60>";
	var bbt_alpha=bb_graphics_GetAlpha();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<61>";
	for(var bbt_i=0;bbt_i<this.bb_groups.bbm_Size();bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<62>";
		this.bb_groups.bbm_Get2(bbt_i).bbm_Render();
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<64>";
	bb_graphics_SetAlpha(bbt_alpha);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<65>";
	bb_graphics_SetColor(dbg_array(bbt_rgb,0)[0],dbg_array(bbt_rgb,1)[1],dbg_array(bbt_rgb,2)[2]);
	pop_err();
}
bb_psystem_ParticleSystem.prototype.bbm_Update=function(bbt_delta){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<69>";
	for(var bbt_i=0;bbt_i<this.bb_groups.bbm_Size();bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<70>";
		this.bb_groups.bbm_Get2(bbt_i).bbm_Update(bbt_delta);
	}
	pop_err();
}
function bb_psystem_ParticleGroup(){
	Object.call(this);
	this.bb_name="";
	this.bb_maxParticles=0;
	this.bb_forces=null;
	this.bb_x=[];
	this.bb_y=[];
	this.bb_velocityX=[];
	this.bb_velocityY=[];
	this.bb_polarVelocityAmplitude=[];
	this.bb_polarVelocityAngle=[];
	this.bb_usePolar=[];
	this.bb_useHSB=[];
	this.bb_sourceEmitter=[];
	this.bb_life=[];
	this.bb_alive=[];
	this.bb_mass=[];
	this.bb_particleImage=[];
	this.bb_rotation=[];
	this.bb_rotationSpeed=[];
	this.bb_scale=[];
	this.bb_red=[];
	this.bb_green=[];
	this.bb_blue=[];
	this.bb_alpha=[];
	this.bb_startRed=[];
	this.bb_startGreen=[];
	this.bb_startBlue=[];
	this.bb_startAlpha=[];
	this.bb_endRed=[];
	this.bb_endGreen=[];
	this.bb_endBlue=[];
	this.bb_endAlpha=[];
	this.bb_redInterpolation=[];
	this.bb_redInterpolationTime=[];
	this.bb_redInterpolationTimeInv=[];
	this.bb_greenInterpolation=[];
	this.bb_greenInterpolationTime=[];
	this.bb_greenInterpolationTimeInv=[];
	this.bb_blueInterpolation=[];
	this.bb_blueInterpolationTime=[];
	this.bb_blueInterpolationTimeInv=[];
	this.bb_alphaInterpolation=[];
	this.bb_alphaInterpolationTime=[];
	this.bb_alphaInterpolationTimeInv=[];
	this.bb_hue=[];
	this.bb_saturation=[];
	this.bb_brightness=[];
	this.bb_startHue=[];
	this.bb_startSaturation=[];
	this.bb_startBrightness=[];
	this.bb_endHue=[];
	this.bb_endSaturation=[];
	this.bb_endBrightness=[];
	this.bb_hueInterpolation=[];
	this.bb_hueInterpolationTime=[];
	this.bb_hueInterpolationTimeInv=[];
	this.bb_saturationInterpolation=[];
	this.bb_saturationInterpolationTime=[];
	this.bb_saturationInterpolationTimeInv=[];
	this.bb_brightnessInterpolation=[];
	this.bb_brightnessInterpolationTime=[];
	this.bb_brightnessInterpolationTimeInv=[];
	this.bb_reversePointer=[];
	this.bb_alivePointers=[];
	this.bb_deadParticles=[];
	this.bb_deadEmitters=[];
	this.bb_deadX=[];
	this.bb_deadY=[];
	this.bb_deadVelocityX=[];
	this.bb_deadVelocityY=[];
	this.bb_aliveParticles=0;
	this.bb_forcesArray=[];
	this.bb_deadCount=0;
	this.bb_rgbArray=new_number_array(3);
	this.implments={bb_psystem_IPSReader:1};
}
bb_psystem_ParticleGroup.prototype.bbm_ClearParticle=function(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2071>";
	dbg_array(this.bb_x,bbt_index)[bbt_index]=0.0
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2072>";
	dbg_array(this.bb_y,bbt_index)[bbt_index]=0.0
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2073>";
	dbg_array(this.bb_velocityX,bbt_index)[bbt_index]=0.0
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2074>";
	dbg_array(this.bb_velocityY,bbt_index)[bbt_index]=0.0
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2075>";
	dbg_array(this.bb_polarVelocityAmplitude,bbt_index)[bbt_index]=0.0
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2076>";
	dbg_array(this.bb_polarVelocityAngle,bbt_index)[bbt_index]=0.0
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2077>";
	dbg_array(this.bb_usePolar,bbt_index)[bbt_index]=false
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2078>";
	dbg_array(this.bb_scale,bbt_index)[bbt_index]=1.0
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2079>";
	dbg_array(this.bb_rotation,bbt_index)[bbt_index]=0.0
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2080>";
	dbg_array(this.bb_rotationSpeed,bbt_index)[bbt_index]=0.0
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2081>";
	dbg_array(this.bb_sourceEmitter,bbt_index)[bbt_index]=null
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2082>";
	dbg_array(this.bb_alive,bbt_index)[bbt_index]=false
	pop_err();
}
bb_psystem_ParticleGroup.prototype.bbm_ResetParticles=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2062>";
	this.bb_aliveParticles=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2063>";
	for(var bbt_i=0;bbt_i<this.bb_maxParticles;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2064>";
		dbg_array(this.bb_alivePointers,bbt_i)[bbt_i]=bbt_i
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2065>";
		dbg_array(this.bb_reversePointer,bbt_i)[bbt_i]=bbt_i
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2066>";
		this.bbm_ClearParticle(bbt_i);
	}
	pop_err();
}
bb_psystem_ParticleGroup.prototype.bbm_Init2=function(bbt_maxParticles){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1810>";
	dbg_object(this).bb_maxParticles=bbt_maxParticles;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1811>";
	this.bb_forces=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1813>";
	this.bb_x=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1814>";
	this.bb_y=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1815>";
	this.bb_velocityX=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1816>";
	this.bb_velocityY=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1817>";
	this.bb_polarVelocityAmplitude=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1818>";
	this.bb_polarVelocityAngle=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1819>";
	this.bb_usePolar=new_bool_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1820>";
	this.bb_useHSB=new_bool_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1821>";
	this.bb_sourceEmitter=new_object_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1822>";
	this.bb_life=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1823>";
	this.bb_alive=new_bool_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1824>";
	this.bb_mass=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1825>";
	this.bb_particleImage=new_object_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1826>";
	this.bb_rotation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1827>";
	this.bb_rotationSpeed=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1828>";
	this.bb_scale=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1830>";
	this.bb_red=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1831>";
	this.bb_green=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1832>";
	this.bb_blue=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1833>";
	this.bb_alpha=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1835>";
	this.bb_startRed=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1836>";
	this.bb_startGreen=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1837>";
	this.bb_startBlue=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1838>";
	this.bb_startAlpha=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1840>";
	this.bb_endRed=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1841>";
	this.bb_endGreen=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1842>";
	this.bb_endBlue=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1843>";
	this.bb_endAlpha=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1845>";
	this.bb_redInterpolation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1846>";
	this.bb_redInterpolationTime=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1847>";
	this.bb_redInterpolationTimeInv=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1848>";
	this.bb_greenInterpolation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1849>";
	this.bb_greenInterpolationTime=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1850>";
	this.bb_greenInterpolationTimeInv=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1851>";
	this.bb_blueInterpolation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1852>";
	this.bb_blueInterpolationTime=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1853>";
	this.bb_blueInterpolationTimeInv=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1854>";
	this.bb_alphaInterpolation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1855>";
	this.bb_alphaInterpolationTime=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1856>";
	this.bb_alphaInterpolationTimeInv=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1858>";
	this.bb_hue=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1859>";
	this.bb_saturation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1860>";
	this.bb_brightness=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1862>";
	this.bb_startHue=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1863>";
	this.bb_startSaturation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1864>";
	this.bb_startBrightness=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1866>";
	this.bb_endHue=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1867>";
	this.bb_endSaturation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1868>";
	this.bb_endBrightness=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1870>";
	this.bb_hueInterpolation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1871>";
	this.bb_hueInterpolationTime=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1872>";
	this.bb_hueInterpolationTimeInv=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1873>";
	this.bb_saturationInterpolation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1874>";
	this.bb_saturationInterpolationTime=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1875>";
	this.bb_saturationInterpolationTimeInv=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1876>";
	this.bb_brightnessInterpolation=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1877>";
	this.bb_brightnessInterpolationTime=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1878>";
	this.bb_brightnessInterpolationTimeInv=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1880>";
	this.bb_reversePointer=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1881>";
	this.bb_alivePointers=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1884>";
	this.bb_deadParticles=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1885>";
	this.bb_deadEmitters=new_object_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1886>";
	this.bb_deadX=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1887>";
	this.bb_deadY=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1888>";
	this.bb_deadVelocityX=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1889>";
	this.bb_deadVelocityY=new_number_array(bbt_maxParticles);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1891>";
	this.bbm_ResetParticles();
	pop_err();
	return 0;
}
function bb_psystem_new4(bbt_maxParticles,bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1926>";
	dbg_object(this).bb_name=bbt_name;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1927>";
	this.bbm_Init2(bbt_maxParticles);
	pop_err();
	return this;
}
bb_psystem_ParticleGroup.prototype.bbm_Name=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1909>";
	pop_err();
	return this.bb_name;
}
bb_psystem_ParticleGroup.prototype.bbm_Name2=function(bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1912>";
	dbg_object(this).bb_name=bbt_name;
	pop_err();
}
bb_psystem_ParticleGroup.prototype.bbm_ReadXML=function(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2130>";
	var bbt_maxParts=10000;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2131>";
	if(bbt_node.bbm_HasAttribute("MaxParticles")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2131>";
		bbt_maxParts=parseInt((bbt_node.bbm_GetAttribute("MaxParticles","")),10);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2133>";
	this.bbm_Init2(bbt_maxParts);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2135>";
	if(bbt_node.bbm_HasAttribute("Name")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2135>";
		this.bbm_Name2(bbt_node.bbm_GetAttribute("Name",""));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2137>";
	var bbt_children=bbt_node.bbm_Children();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2138>";
	for(var bbt_i=0;bbt_i<bbt_children.bbm_Size();bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2141>";
		var bbt_forceNode=bbt_children.bbm_Get2(bbt_i);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2142>";
		if(bbt_forceNode.bbm_Name()=="constantforce"){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2144>";
			var bbt_cf=bb_psystem_new11.call(new bb_psystem_ConstantForce,bbt_forceNode);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2145>";
			this.bb_forces.bbm_Add(bbt_cf);
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2146>";
			if(bbt_forceNode.bbm_Name()=="pointforce"){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2148>";
				var bbt_pf=bb_psystem_new14.call(new bb_psystem_PointForce,bbt_forceNode);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2149>";
				this.bb_forces.bbm_Add(bbt_pf);
			}
		}
	}
	pop_err();
}
function bb_psystem_new5(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1931>";
	this.bbm_ReadXML(bbt_node);
	pop_err();
	return this;
}
function bb_psystem_new6(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1712>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_psystem_ParticleGroup.prototype.bbm_Render=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2099>";
	for(var bbt_i=0;bbt_i<this.bb_aliveParticles;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2100>";
		var bbt_index=dbg_array(this.bb_alivePointers,bbt_i)[bbt_i];
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2101>";
		bb_graphics_SetColor((dbg_array(this.bb_red,bbt_index)[bbt_index]),(dbg_array(this.bb_green,bbt_index)[bbt_index]),(dbg_array(this.bb_blue,bbt_index)[bbt_index]));
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2102>";
		bb_graphics_SetAlpha(dbg_array(this.bb_alpha,bbt_index)[bbt_index]);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2105>";
		if(dbg_array(this.bb_scale,bbt_index)[bbt_index]<=0.0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2105>";
			dbg_array(this.bb_scale,bbt_index)[bbt_index]=1.0
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2107>";
		if(dbg_array(this.bb_particleImage,bbt_index)[bbt_index]!=null){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2108>";
			if(dbg_array(this.bb_scale,bbt_index)[bbt_index]!=1.0 || dbg_array(this.bb_rotation,bbt_index)[bbt_index]!=0.0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2109>";
				bb_graphics_DrawImage2(dbg_array(this.bb_particleImage,bbt_index)[bbt_index],dbg_array(this.bb_x,bbt_index)[bbt_index],dbg_array(this.bb_y,bbt_index)[bbt_index],dbg_array(this.bb_rotation,bbt_index)[bbt_index]*57.295779578552292,dbg_array(this.bb_scale,bbt_index)[bbt_index],dbg_array(this.bb_scale,bbt_index)[bbt_index],0);
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2111>";
				bb_graphics_DrawImage(dbg_array(this.bb_particleImage,bbt_index)[bbt_index],dbg_array(this.bb_x,bbt_index)[bbt_index],dbg_array(this.bb_y,bbt_index)[bbt_index],0);
			}
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2114>";
			if(dbg_array(this.bb_scale,bbt_index)[bbt_index]!=1.0 || dbg_array(this.bb_rotation,bbt_index)[bbt_index]!=0.0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2115>";
				bb_graphics_PushMatrix();
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2116>";
				bb_graphics_Translate(dbg_array(this.bb_x,bbt_index)[bbt_index]-1.0,dbg_array(this.bb_y,bbt_index)[bbt_index]-1.0);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2117>";
				if(dbg_array(this.bb_scale,bbt_index)[bbt_index]!=1.0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2117>";
					bb_graphics_Scale(dbg_array(this.bb_scale,bbt_index)[bbt_index],dbg_array(this.bb_scale,bbt_index)[bbt_index]);
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2118>";
				if(dbg_array(this.bb_rotation,bbt_index)[bbt_index]!=0.0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2118>";
					bb_graphics_Rotate(dbg_array(this.bb_rotation,bbt_index)[bbt_index]*57.295779578552292);
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2119>";
				bb_graphics_DrawRect(0.0,0.0,3.0,3.0);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2120>";
				bb_graphics_PopMatrix();
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2122>";
				bb_graphics_DrawRect(dbg_array(this.bb_x,bbt_index)[bbt_index]-1.0,dbg_array(this.bb_y,bbt_index)[bbt_index]-1.0,3.0,3.0);
			}
		}
	}
	pop_err();
}
bb_psystem_ParticleGroup.prototype.bbm_CreateParticle=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2055>";
	if(this.bb_aliveParticles>=this.bb_maxParticles){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2055>";
		pop_err();
		return -1;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2056>";
	this.bb_aliveParticles+=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2057>";
	var bbt_=this.bb_aliveParticles-1;
	this.bbm_ClearParticle(dbg_array(this.bb_alivePointers,bbt_)[bbt_]);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2058>";
	var bbt_3=this.bb_aliveParticles-1;
	var bbt_2=dbg_array(this.bb_alivePointers,bbt_3)[bbt_3];
	pop_err();
	return bbt_2;
}
bb_psystem_ParticleGroup.prototype.bbm_UpdateCartesian=function(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2043>";
	dbg_array(this.bb_velocityX,bbt_index)[bbt_index]=Math.cos(dbg_array(this.bb_polarVelocityAngle,bbt_index)[bbt_index])*dbg_array(this.bb_polarVelocityAmplitude,bbt_index)[bbt_index]
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2044>";
	dbg_array(this.bb_velocityY,bbt_index)[bbt_index]=Math.sin(dbg_array(this.bb_polarVelocityAngle,bbt_index)[bbt_index])*dbg_array(this.bb_polarVelocityAmplitude,bbt_index)[bbt_index]
	pop_err();
}
bb_psystem_ParticleGroup.prototype.bbm_UpdateRGB=function(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2048>";
	bb_functions_HSBtoRGB(dbg_array(this.bb_hue,bbt_index)[bbt_index],dbg_array(this.bb_saturation,bbt_index)[bbt_index],dbg_array(this.bb_brightness,bbt_index)[bbt_index],this.bb_rgbArray);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2049>";
	dbg_array(this.bb_red,bbt_index)[bbt_index]=dbg_array(this.bb_rgbArray,0)[0]
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2050>";
	dbg_array(this.bb_green,bbt_index)[bbt_index]=dbg_array(this.bb_rgbArray,1)[1]
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2051>";
	dbg_array(this.bb_blue,bbt_index)[bbt_index]=dbg_array(this.bb_rgbArray,2)[2]
	pop_err();
}
bb_psystem_ParticleGroup.prototype.bbm_RemoveParticle=function(bbt_index){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2087>";
	var bbt_=this.bb_aliveParticles-1;
	var bbt_indexOfLastParticle=dbg_array(this.bb_alivePointers,bbt_)[bbt_];
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2089>";
	var bbt_2=dbg_array(this.bb_reversePointer,bbt_index)[bbt_index];
	dbg_array(this.bb_alivePointers,bbt_2)[bbt_2]=bbt_indexOfLastParticle
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2090>";
	var bbt_3=this.bb_aliveParticles-1;
	dbg_array(this.bb_alivePointers,bbt_3)[bbt_3]=bbt_index
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2092>";
	dbg_array(this.bb_reversePointer,bbt_indexOfLastParticle)[bbt_indexOfLastParticle]=dbg_array(this.bb_reversePointer,bbt_index)[bbt_index]
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2093>";
	dbg_array(this.bb_reversePointer,bbt_index)[bbt_index]=this.bb_aliveParticles-1
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2095>";
	this.bb_aliveParticles-=1;
	pop_err();
}
bb_psystem_ParticleGroup.prototype.bbm_Update=function(bbt_delta){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1936>";
	var bbt_forceCount=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1937>";
	if(this.bb_forcesArray.length<this.bb_forces.bbm_Size()){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1938>";
		this.bb_forcesArray=this.bb_forces.bbm_ToArray();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1939>";
		bbt_forceCount=this.bb_forcesArray.length;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1941>";
		bbt_forceCount=this.bb_forces.bbm_FillArray(this.bb_forcesArray);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1944>";
	bbt_delta=bbt_delta*0.001;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1945>";
	this.bb_deadCount=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1947>";
	for(var bbt_i=0;bbt_i<this.bb_aliveParticles;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1948>";
		var bbt_index=dbg_array(this.bb_alivePointers,bbt_i)[bbt_i];
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1949>";
		dbg_array(this.bb_life,bbt_index)[bbt_index]-=bbt_delta
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1950>";
		if(dbg_array(this.bb_life,bbt_index)[bbt_index]>0.0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1952>";
			if(bbt_forceCount>0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1954>";
				for(var bbt_fi=0;bbt_fi<bbt_forceCount;bbt_fi=bbt_fi+1){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1955>";
					if(dbg_object(object_downcast((dbg_array(this.bb_forcesArray,bbt_fi)[bbt_fi]),bb_psystem_Force)).bb_enabled){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1956>";
						var bbt_f=object_downcast((dbg_array(this.bb_forcesArray,bbt_fi)[bbt_fi]),bb_psystem_Force);
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1957>";
						bbt_f.bbm_Calculate(dbg_array(this.bb_x,bbt_index)[bbt_index],dbg_array(this.bb_y,bbt_index)[bbt_index]);
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1958>";
						dbg_array(this.bb_velocityX,bbt_index)[bbt_index]+=dbg_object(bbt_f).bb_outDX*bbt_delta
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1959>";
						dbg_array(this.bb_velocityY,bbt_index)[bbt_index]+=dbg_object(bbt_f).bb_outDY*bbt_delta
					}
				}
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1965>";
			dbg_array(this.bb_x,bbt_index)[bbt_index]+=dbg_array(this.bb_velocityX,bbt_index)[bbt_index]*bbt_delta
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1966>";
			dbg_array(this.bb_y,bbt_index)[bbt_index]+=dbg_array(this.bb_velocityY,bbt_index)[bbt_index]*bbt_delta
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1968>";
			dbg_array(this.bb_rotation,bbt_index)[bbt_index]+=dbg_array(this.bb_rotationSpeed,bbt_index)[bbt_index]*bbt_delta
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1970>";
			while(dbg_array(this.bb_rotation,bbt_index)[bbt_index]>6.2831853000000004){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1971>";
				dbg_array(this.bb_rotation,bbt_index)[bbt_index]-=6.2831853000000004
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1973>";
			while(dbg_array(this.bb_rotation,bbt_index)[bbt_index]<0.0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1974>";
				dbg_array(this.bb_rotation,bbt_index)[bbt_index]+=6.2831853000000004
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1977>";
			if(!dbg_array(this.bb_useHSB,bbt_index)[bbt_index]){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1978>";
				if(dbg_array(this.bb_startRed,bbt_index)[bbt_index]!=dbg_array(this.bb_endRed,bbt_index)[bbt_index] && dbg_array(this.bb_life,bbt_index)[bbt_index]<dbg_array(this.bb_redInterpolationTime,bbt_index)[bbt_index]){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1979>";
					dbg_array(this.bb_red,bbt_index)[bbt_index]=((bb_functions_Interpolate(dbg_array(this.bb_redInterpolation,bbt_index)[bbt_index],(dbg_array(this.bb_startRed,bbt_index)[bbt_index]),(dbg_array(this.bb_endRed,bbt_index)[bbt_index]),1.0-dbg_array(this.bb_life,bbt_index)[bbt_index]*dbg_array(this.bb_redInterpolationTimeInv,bbt_index)[bbt_index]))|0)
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1981>";
				if(dbg_array(this.bb_startGreen,bbt_index)[bbt_index]!=dbg_array(this.bb_endGreen,bbt_index)[bbt_index] && dbg_array(this.bb_life,bbt_index)[bbt_index]<dbg_array(this.bb_greenInterpolationTime,bbt_index)[bbt_index]){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1982>";
					dbg_array(this.bb_green,bbt_index)[bbt_index]=((bb_functions_Interpolate(dbg_array(this.bb_greenInterpolation,bbt_index)[bbt_index],(dbg_array(this.bb_startGreen,bbt_index)[bbt_index]),(dbg_array(this.bb_endGreen,bbt_index)[bbt_index]),1.0-dbg_array(this.bb_life,bbt_index)[bbt_index]*dbg_array(this.bb_greenInterpolationTimeInv,bbt_index)[bbt_index]))|0)
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1984>";
				if(dbg_array(this.bb_startBlue,bbt_index)[bbt_index]!=dbg_array(this.bb_endBlue,bbt_index)[bbt_index] && dbg_array(this.bb_life,bbt_index)[bbt_index]<dbg_array(this.bb_blueInterpolationTime,bbt_index)[bbt_index]){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1985>";
					dbg_array(this.bb_blue,bbt_index)[bbt_index]=((bb_functions_Interpolate(dbg_array(this.bb_blueInterpolation,bbt_index)[bbt_index],(dbg_array(this.bb_startBlue,bbt_index)[bbt_index]),(dbg_array(this.bb_endBlue,bbt_index)[bbt_index]),1.0-dbg_array(this.bb_life,bbt_index)[bbt_index]*dbg_array(this.bb_blueInterpolationTimeInv,bbt_index)[bbt_index]))|0)
				}
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1988>";
				if(dbg_array(this.bb_startHue,bbt_index)[bbt_index]!=dbg_array(this.bb_endHue,bbt_index)[bbt_index] && dbg_array(this.bb_life,bbt_index)[bbt_index]<dbg_array(this.bb_hueInterpolationTime,bbt_index)[bbt_index]){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1989>";
					dbg_array(this.bb_hue,bbt_index)[bbt_index]=bb_functions_Interpolate(dbg_array(this.bb_hueInterpolation,bbt_index)[bbt_index],dbg_array(this.bb_startHue,bbt_index)[bbt_index],dbg_array(this.bb_endHue,bbt_index)[bbt_index],1.0-dbg_array(this.bb_life,bbt_index)[bbt_index]*dbg_array(this.bb_hueInterpolationTimeInv,bbt_index)[bbt_index])
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1991>";
				if(dbg_array(this.bb_startSaturation,bbt_index)[bbt_index]!=dbg_array(this.bb_endSaturation,bbt_index)[bbt_index] && dbg_array(this.bb_life,bbt_index)[bbt_index]<dbg_array(this.bb_saturationInterpolationTime,bbt_index)[bbt_index]){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1992>";
					dbg_array(this.bb_saturation,bbt_index)[bbt_index]=bb_functions_Interpolate(dbg_array(this.bb_saturationInterpolation,bbt_index)[bbt_index],dbg_array(this.bb_startSaturation,bbt_index)[bbt_index],dbg_array(this.bb_endSaturation,bbt_index)[bbt_index],1.0-dbg_array(this.bb_life,bbt_index)[bbt_index]*dbg_array(this.bb_saturationInterpolationTimeInv,bbt_index)[bbt_index])
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1994>";
				if(dbg_array(this.bb_startBrightness,bbt_index)[bbt_index]!=dbg_array(this.bb_endBrightness,bbt_index)[bbt_index] && dbg_array(this.bb_life,bbt_index)[bbt_index]<dbg_array(this.bb_brightnessInterpolationTime,bbt_index)[bbt_index]){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1995>";
					dbg_array(this.bb_brightness,bbt_index)[bbt_index]=bb_functions_Interpolate(dbg_array(this.bb_brightnessInterpolation,bbt_index)[bbt_index],dbg_array(this.bb_startBrightness,bbt_index)[bbt_index],dbg_array(this.bb_endBrightness,bbt_index)[bbt_index],1.0-dbg_array(this.bb_life,bbt_index)[bbt_index]*dbg_array(this.bb_brightnessInterpolationTimeInv,bbt_index)[bbt_index])
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1997>";
				this.bbm_UpdateRGB(bbt_index);
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1999>";
			if(dbg_array(this.bb_startAlpha,bbt_index)[bbt_index]!=dbg_array(this.bb_endAlpha,bbt_index)[bbt_index] && dbg_array(this.bb_life,bbt_index)[bbt_index]<dbg_array(this.bb_alphaInterpolationTime,bbt_index)[bbt_index]){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2000>";
				dbg_array(this.bb_alpha,bbt_index)[bbt_index]=bb_functions_Interpolate(dbg_array(this.bb_alphaInterpolation,bbt_index)[bbt_index],dbg_array(this.bb_startAlpha,bbt_index)[bbt_index],dbg_array(this.bb_endAlpha,bbt_index)[bbt_index],1.0-dbg_array(this.bb_life,bbt_index)[bbt_index]*dbg_array(this.bb_alphaInterpolationTimeInv,bbt_index)[bbt_index])
			}
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2003>";
			dbg_array(this.bb_alive,bbt_index)[bbt_index]=false
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2005>";
			dbg_array(this.bb_deadParticles,this.bb_deadCount)[this.bb_deadCount]=bbt_index
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2006>";
			dbg_array(this.bb_deadEmitters,this.bb_deadCount)[this.bb_deadCount]=dbg_array(this.bb_sourceEmitter,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2007>";
			dbg_array(this.bb_deadX,this.bb_deadCount)[this.bb_deadCount]=dbg_array(this.bb_x,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2008>";
			dbg_array(this.bb_deadY,this.bb_deadCount)[this.bb_deadCount]=dbg_array(this.bb_y,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2009>";
			dbg_array(this.bb_deadVelocityX,this.bb_deadCount)[this.bb_deadCount]=dbg_array(this.bb_velocityX,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2010>";
			dbg_array(this.bb_deadVelocityY,this.bb_deadCount)[this.bb_deadCount]=dbg_array(this.bb_velocityY,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2011>";
			this.bb_deadCount+=1;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2015>";
	for(var bbt_i2=0;bbt_i2<this.bb_deadCount;bbt_i2=bbt_i2+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2016>";
		this.bbm_RemoveParticle(dbg_array(this.bb_deadParticles,bbt_i2)[bbt_i2]);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2019>";
	for(var bbt_i3=0;bbt_i3<this.bb_deadCount;bbt_i3=bbt_i3+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2020>";
		for(var bbt_j=0;bbt_j<dbg_object(dbg_array(this.bb_deadEmitters,bbt_i3)[bbt_i3]).bb_deathEmitterChances.bbm_Size();bbt_j=bbt_j+1){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2021>";
			var bbt_c=(dbg_object(dbg_array(this.bb_deadEmitters,bbt_i3)[bbt_i3]).bb_deathEmitterChances.bbm_Get2(bbt_j).bbm_ToFloat());
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2022>";
			if(bbt_c==1.0 || bbt_c>0.0 && bb_random_Rnd()<=bbt_c){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2023>";
				var bbt_e=dbg_object(dbg_array(this.bb_deadEmitters,bbt_i3)[bbt_i3]).bb_deathEmitters.bbm_Get2(bbt_j);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2025>";
				if(dbg_object(bbt_e).bb_group==null){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2026>";
					bbt_e.bbm_EmitAtAngle(30,dbg_array(this.bb_deadX,bbt_i3)[bbt_i3],dbg_array(this.bb_deadY,bbt_i3)[bbt_i3],bb_psystem_SafeATanr(dbg_array(this.bb_deadVelocityX,bbt_i3)[bbt_i3],dbg_array(this.bb_deadVelocityY,bbt_i3)[bbt_i3],0.0),this);
				}else{
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2028>";
					bbt_e.bbm_EmitAtAngle(30,dbg_array(this.bb_deadX,bbt_i3)[bbt_i3],dbg_array(this.bb_deadY,bbt_i3)[bbt_i3],bb_psystem_SafeATanr(dbg_array(this.bb_deadVelocityX,bbt_i3)[bbt_i3],dbg_array(this.bb_deadVelocityY,bbt_i3)[bbt_i3],0.0),null);
				}
			}
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2032>";
		dbg_array(this.bb_deadEmitters,bbt_i3)[bbt_i3]=null
	}
	pop_err();
}
function bb_psystem_Emitter(){
	Object.call(this);
	this.bb_deathEmitters=null;
	this.bb_deathEmitterChances=null;
	this.bb_minStartRed=255;
	this.bb_maxStartRed=255;
	this.bb_minEndRed=255;
	this.bb_maxEndRed=255;
	this.bb_redInterpolation=0;
	this.bb_redInterpolationTime=-1.0;
	this.bb_useHSB=false;
	this.bb_minStartGreen=255;
	this.bb_maxStartGreen=255;
	this.bb_minEndGreen=255;
	this.bb_maxEndGreen=255;
	this.bb_greenInterpolation=0;
	this.bb_greenInterpolationTime=-1.0;
	this.bb_minStartBlue=255;
	this.bb_maxStartBlue=255;
	this.bb_minEndBlue=255;
	this.bb_maxEndBlue=255;
	this.bb_blueInterpolation=0;
	this.bb_blueInterpolationTime=-1.0;
	this.bb_minStartAlpha=1.0;
	this.bb_maxStartAlpha=1.0;
	this.bb_minEndAlpha=0.0;
	this.bb_maxEndAlpha=0.0;
	this.bb_alphaInterpolation=1;
	this.bb_alphaInterpolationTime=-1.0;
	this.bb_minStartHue=1.0;
	this.bb_maxStartHue=1.0;
	this.bb_minEndHue=1.0;
	this.bb_maxEndHue=1.0;
	this.bb_hueInterpolation=0;
	this.bb_hueInterpolationTime=-1.0;
	this.bb_minStartSaturation=1.0;
	this.bb_maxStartSaturation=1.0;
	this.bb_minEndSaturation=1.0;
	this.bb_maxEndSaturation=1.0;
	this.bb_saturationInterpolation=0;
	this.bb_saturationInterpolationTime=-1.0;
	this.bb_minStartBrightness=1.0;
	this.bb_maxStartBrightness=1.0;
	this.bb_minEndBrightness=1.0;
	this.bb_maxEndBrightness=1.0;
	this.bb_brightnessInterpolation=0;
	this.bb_brightnessInterpolationTime=-1.0;
	this.bb_polarVelocityAngle=.0;
	this.bb_usePolar=false;
	this.bb_polarVelocityAngleSpread=.0;
	this.bb_polarVelocityAmplitude=.0;
	this.bb_polarVelocityAmplitudeSpread=.0;
	this.bb_velocityX=.0;
	this.bb_velocityXSpread=.0;
	this.bb_velocityY=.0;
	this.bb_velocityYSpread=.0;
	this.bb_name="";
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_angle=.0;
	this.bb_groupName="";
	this.bb_spawnMinRange=.0;
	this.bb_spawnMaxRange=.0;
	this.bb_life=.0;
	this.bb_lifeSpread=.0;
	this.bb_scale=1.0;
	this.bb_scaleSpread=.0;
	this.bb_rotation=.0;
	this.bb_rotationSpread=.0;
	this.bb_rotationSpeed=.0;
	this.bb_rotationSpeedSpread=.0;
	this.bb_group=null;
	this.bb_particleImage=null;
	this.implments={bb_psystem_IPSReader:1};
}
function bb_psystem_new7(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1163>";
	this.bb_deathEmitters=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1164>";
	this.bb_deathEmitterChances=bb_collections_new8.call(new bb_collections_FloatArrayList);
	pop_err();
	return this;
}
bb_psystem_Emitter.prototype.bbm_Red=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<870>";
	pop_err();
	return this.bb_minStartRed;
}
bb_psystem_Emitter.prototype.bbm_Red2=function(bbt_red){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<873>";
	bbt_red=bb_math_Min(bb_math_Max(bbt_red,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<874>";
	dbg_object(this).bb_minStartRed=bbt_red;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<875>";
	dbg_object(this).bb_maxStartRed=bbt_red;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<876>";
	dbg_object(this).bb_minEndRed=bbt_red;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<877>";
	dbg_object(this).bb_maxEndRed=bbt_red;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<878>";
	dbg_object(this).bb_redInterpolation=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<879>";
	dbg_object(this).bb_redInterpolationTime=-1.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<880>";
	dbg_object(this).bb_useHSB=false;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Green=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<884>";
	pop_err();
	return this.bb_minStartGreen;
}
bb_psystem_Emitter.prototype.bbm_Green2=function(bbt_green){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<887>";
	bbt_green=bb_math_Min(bb_math_Max(bbt_green,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<888>";
	dbg_object(this).bb_minStartGreen=bbt_green;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<889>";
	dbg_object(this).bb_maxStartGreen=bbt_green;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<890>";
	dbg_object(this).bb_minEndGreen=bbt_green;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<891>";
	dbg_object(this).bb_maxEndGreen=bbt_green;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<892>";
	dbg_object(this).bb_greenInterpolation=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<893>";
	dbg_object(this).bb_greenInterpolationTime=-1.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<894>";
	dbg_object(this).bb_useHSB=false;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Blue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<898>";
	pop_err();
	return this.bb_minStartBlue;
}
bb_psystem_Emitter.prototype.bbm_Blue2=function(bbt_blue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<901>";
	bbt_blue=bb_math_Min(bb_math_Max(bbt_blue,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<902>";
	dbg_object(this).bb_minStartBlue=bbt_blue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<903>";
	dbg_object(this).bb_maxStartBlue=bbt_blue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<904>";
	dbg_object(this).bb_minEndBlue=bbt_blue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<905>";
	dbg_object(this).bb_maxEndBlue=bbt_blue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<906>";
	dbg_object(this).bb_blueInterpolation=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<907>";
	dbg_object(this).bb_blueInterpolationTime=-1.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<908>";
	dbg_object(this).bb_useHSB=false;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Alpha=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<912>";
	pop_err();
	return this.bb_minStartAlpha;
}
bb_psystem_Emitter.prototype.bbm_Alpha2=function(bbt_alpha){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<915>";
	bbt_alpha=bb_math_Min2(bb_math_Max2(bbt_alpha,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<916>";
	dbg_object(this).bb_minStartAlpha=bbt_alpha;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<917>";
	dbg_object(this).bb_maxStartAlpha=bbt_alpha;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<918>";
	dbg_object(this).bb_minEndAlpha=0.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<919>";
	dbg_object(this).bb_maxEndAlpha=0.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<920>";
	dbg_object(this).bb_alphaInterpolation=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<921>";
	dbg_object(this).bb_alphaInterpolationTime=-1.0;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_StartRed=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<968>";
	pop_err();
	return this.bb_minStartRed;
}
bb_psystem_Emitter.prototype.bbm_StartRed2=function(bbt_startRed){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<971>";
	bbt_startRed=bb_math_Min(bb_math_Max(bbt_startRed,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<972>";
	dbg_object(this).bb_minStartRed=bbt_startRed;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<973>";
	dbg_object(this).bb_maxStartRed=bbt_startRed;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<974>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<975>";
	if(this.bb_redInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<976>";
		this.bb_redInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<977>";
		this.bb_redInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_StartGreen=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<982>";
	pop_err();
	return this.bb_minStartGreen;
}
bb_psystem_Emitter.prototype.bbm_StartGreen2=function(bbt_startGreen){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<985>";
	bbt_startGreen=bb_math_Min(bb_math_Max(bbt_startGreen,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<986>";
	dbg_object(this).bb_minStartGreen=bbt_startGreen;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<987>";
	dbg_object(this).bb_maxStartGreen=bbt_startGreen;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<988>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<989>";
	if(this.bb_greenInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<990>";
		this.bb_greenInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<991>";
		this.bb_greenInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_StartBlue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<996>";
	pop_err();
	return this.bb_minStartBlue;
}
bb_psystem_Emitter.prototype.bbm_StartBlue2=function(bbt_startBlue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<999>";
	bbt_startBlue=bb_math_Min(bb_math_Max(bbt_startBlue,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1000>";
	dbg_object(this).bb_minStartBlue=bbt_startBlue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1001>";
	dbg_object(this).bb_maxStartBlue=bbt_startBlue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1002>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1003>";
	if(this.bb_blueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1004>";
		this.bb_blueInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1005>";
		this.bb_blueInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_StartAlpha=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1010>";
	pop_err();
	return this.bb_minStartAlpha;
}
bb_psystem_Emitter.prototype.bbm_StartAlpha2=function(bbt_startAlpha){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1013>";
	bbt_startAlpha=bb_math_Min2(bb_math_Max2(bbt_startAlpha,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1014>";
	dbg_object(this).bb_minStartAlpha=bbt_startAlpha;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1015>";
	dbg_object(this).bb_maxStartAlpha=bbt_startAlpha;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1016>";
	if(this.bb_alphaInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1017>";
		this.bb_alphaInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1018>";
		this.bb_alphaInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_EndRed=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1023>";
	pop_err();
	return this.bb_minEndRed;
}
bb_psystem_Emitter.prototype.bbm_EndRed2=function(bbt_endRed){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1026>";
	bbt_endRed=bb_math_Min(bb_math_Max(bbt_endRed,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1027>";
	dbg_object(this).bb_minEndRed=bbt_endRed;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1028>";
	dbg_object(this).bb_maxEndRed=bbt_endRed;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1029>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1030>";
	if(this.bb_redInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1031>";
		this.bb_redInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1032>";
		this.bb_redInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_EndGreen=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1037>";
	pop_err();
	return this.bb_minEndGreen;
}
bb_psystem_Emitter.prototype.bbm_EndGreen2=function(bbt_endGreen){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1040>";
	bbt_endGreen=bb_math_Min(bb_math_Max(bbt_endGreen,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1041>";
	dbg_object(this).bb_minEndGreen=bbt_endGreen;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1042>";
	dbg_object(this).bb_maxEndGreen=bbt_endGreen;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1043>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1044>";
	if(this.bb_greenInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1045>";
		this.bb_greenInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1046>";
		this.bb_greenInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_EndBlue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1051>";
	pop_err();
	return this.bb_minEndBlue;
}
bb_psystem_Emitter.prototype.bbm_EndBlue2=function(bbt_endBlue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1054>";
	bbt_endBlue=bb_math_Min(bb_math_Max(bbt_endBlue,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1055>";
	dbg_object(this).bb_minEndBlue=bbt_endBlue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1056>";
	dbg_object(this).bb_maxEndBlue=bbt_endBlue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1057>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1058>";
	if(this.bb_blueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1059>";
		this.bb_blueInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1060>";
		this.bb_blueInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_EndAlpha=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1065>";
	pop_err();
	return this.bb_minEndAlpha;
}
bb_psystem_Emitter.prototype.bbm_EndAlpha2=function(bbt_endAlpha){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1068>";
	bbt_endAlpha=bb_math_Min2(bb_math_Max2(bbt_endAlpha,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1069>";
	dbg_object(this).bb_minEndAlpha=bbt_endAlpha;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1070>";
	dbg_object(this).bb_maxEndAlpha=bbt_endAlpha;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1071>";
	if(this.bb_alphaInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1072>";
		this.bb_alphaInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1073>";
		this.bb_alphaInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinStartRed=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<392>";
	pop_err();
	return this.bb_minStartRed;
}
bb_psystem_Emitter.prototype.bbm_MinStartRed2=function(bbt_minStartRed){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<395>";
	dbg_object(this).bb_minStartRed=bb_math_Min(bb_math_Max(bbt_minStartRed,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<396>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<397>";
	if(this.bb_redInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<397>";
		this.bb_redInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxStartRed=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<402>";
	pop_err();
	return this.bb_maxStartRed;
}
bb_psystem_Emitter.prototype.bbm_MaxStartRed2=function(bbt_maxStartRed){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<405>";
	dbg_object(this).bb_maxStartRed=bb_math_Min(bb_math_Max(bbt_maxStartRed,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<406>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<407>";
	if(this.bb_redInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<407>";
		this.bb_redInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinEndRed=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<470>";
	pop_err();
	return this.bb_minEndRed;
}
bb_psystem_Emitter.prototype.bbm_MinEndRed2=function(bbt_minEndRed){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<473>";
	dbg_object(this).bb_minEndRed=bb_math_Min(bb_math_Max(bbt_minEndRed,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<474>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<475>";
	if(this.bb_redInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<475>";
		this.bb_redInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxEndRed=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<480>";
	pop_err();
	return this.bb_maxEndRed;
}
bb_psystem_Emitter.prototype.bbm_MaxEndRed2=function(bbt_maxEndRed){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<483>";
	dbg_object(this).bb_maxEndRed=bb_math_Min(bb_math_Max(bbt_maxEndRed,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<484>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<485>";
	if(this.bb_redInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<485>";
		this.bb_redInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinStartGreen=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<412>";
	pop_err();
	return this.bb_minStartGreen;
}
bb_psystem_Emitter.prototype.bbm_MinStartGreen2=function(bbt_minStartGreen){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<415>";
	dbg_object(this).bb_minStartGreen=bb_math_Min(bb_math_Max(bbt_minStartGreen,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<416>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<417>";
	if(this.bb_greenInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<417>";
		this.bb_greenInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxStartGreen=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<422>";
	pop_err();
	return this.bb_maxStartGreen;
}
bb_psystem_Emitter.prototype.bbm_MaxStartGreen2=function(bbt_maxStartGreen){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<425>";
	dbg_object(this).bb_maxStartGreen=bb_math_Min(bb_math_Max(bbt_maxStartGreen,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<426>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<427>";
	if(this.bb_greenInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<427>";
		this.bb_greenInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinEndGreen=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<490>";
	pop_err();
	return this.bb_minEndGreen;
}
bb_psystem_Emitter.prototype.bbm_MinEndGreen2=function(bbt_minEndGreen){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<493>";
	dbg_object(this).bb_minEndGreen=bb_math_Min(bb_math_Max(bbt_minEndGreen,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<494>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<495>";
	if(this.bb_greenInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<495>";
		this.bb_greenInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxEndGreen=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<500>";
	pop_err();
	return this.bb_maxEndGreen;
}
bb_psystem_Emitter.prototype.bbm_MaxEndGreen2=function(bbt_maxEndGreen){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<503>";
	dbg_object(this).bb_maxEndGreen=bb_math_Min(bb_math_Max(bbt_maxEndGreen,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<504>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<505>";
	if(this.bb_greenInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<505>";
		this.bb_greenInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinStartBlue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<432>";
	pop_err();
	return this.bb_minStartBlue;
}
bb_psystem_Emitter.prototype.bbm_MinStartBlue2=function(bbt_minStartBlue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<435>";
	dbg_object(this).bb_minStartBlue=bb_math_Min(bb_math_Max(bbt_minStartBlue,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<436>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<437>";
	if(this.bb_blueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<437>";
		this.bb_blueInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxStartBlue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<442>";
	pop_err();
	return this.bb_maxStartBlue;
}
bb_psystem_Emitter.prototype.bbm_MaxStartBlue2=function(bbt_maxStartBlue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<445>";
	dbg_object(this).bb_maxStartBlue=bb_math_Min(bb_math_Max(bbt_maxStartBlue,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<446>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<447>";
	if(this.bb_blueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<447>";
		this.bb_blueInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinEndBlue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<510>";
	pop_err();
	return this.bb_minEndBlue;
}
bb_psystem_Emitter.prototype.bbm_MinEndBlue2=function(bbt_minEndBlue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<513>";
	dbg_object(this).bb_minEndBlue=bb_math_Min(bb_math_Max(bbt_minEndBlue,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<514>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<515>";
	if(this.bb_blueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<515>";
		this.bb_blueInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxEndBlue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<520>";
	pop_err();
	return this.bb_maxEndBlue;
}
bb_psystem_Emitter.prototype.bbm_MaxEndBlue2=function(bbt_maxEndBlue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<523>";
	dbg_object(this).bb_maxEndBlue=bb_math_Min(bb_math_Max(bbt_maxEndBlue,0),255);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<524>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<525>";
	if(this.bb_blueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<525>";
		this.bb_blueInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinStartAlpha=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<452>";
	pop_err();
	return this.bb_minStartAlpha;
}
bb_psystem_Emitter.prototype.bbm_MinStartAlpha2=function(bbt_minStartAlpha){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<455>";
	dbg_object(this).bb_minStartAlpha=bb_math_Min2(bb_math_Max2(bbt_minStartAlpha,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<456>";
	if(this.bb_alphaInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<456>";
		this.bb_alphaInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxStartAlpha=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<461>";
	pop_err();
	return this.bb_maxStartAlpha;
}
bb_psystem_Emitter.prototype.bbm_MaxStartAlpha2=function(bbt_maxStartAlpha){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<464>";
	dbg_object(this).bb_maxStartAlpha=bb_math_Min2(bb_math_Max2(bbt_maxStartAlpha,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<465>";
	if(this.bb_alphaInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<465>";
		this.bb_alphaInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinEndAlpha=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<530>";
	pop_err();
	return this.bb_minEndAlpha;
}
bb_psystem_Emitter.prototype.bbm_MinEndAlpha2=function(bbt_minEndAlpha){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<533>";
	dbg_object(this).bb_minEndAlpha=bb_math_Min2(bb_math_Max2(bbt_minEndAlpha,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<534>";
	if(this.bb_alphaInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<534>";
		this.bb_alphaInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxEndAlpha=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<539>";
	pop_err();
	return this.bb_maxEndAlpha;
}
bb_psystem_Emitter.prototype.bbm_MaxEndAlpha2=function(bbt_maxEndAlpha){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<542>";
	dbg_object(this).bb_maxEndAlpha=bb_math_Min2(bb_math_Max2(bbt_maxEndAlpha,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<543>";
	if(this.bb_alphaInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<543>";
		this.bb_alphaInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_RedInterpolation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<314>";
	pop_err();
	return this.bb_redInterpolation;
}
bb_psystem_Emitter.prototype.bbm_RedInterpolation2=function(bbt_redInterpolation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<317>";
	bb_assert_AssertRangeInt(bbt_redInterpolation,0,5,"Invalid RedInterpolation");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<318>";
	dbg_object(this).bb_redInterpolation=bbt_redInterpolation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<319>";
	dbg_object(this).bb_useHSB=false;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_GreenInterpolation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<334>";
	pop_err();
	return this.bb_greenInterpolation;
}
bb_psystem_Emitter.prototype.bbm_GreenInterpolation2=function(bbt_greenInterpolation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<337>";
	bb_assert_AssertRangeInt(bbt_greenInterpolation,0,5,"Invalid GreenInterpolation");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<338>";
	dbg_object(this).bb_greenInterpolation=bbt_greenInterpolation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<339>";
	dbg_object(this).bb_useHSB=false;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_BlueInterpolation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<354>";
	pop_err();
	return this.bb_blueInterpolation;
}
bb_psystem_Emitter.prototype.bbm_BlueInterpolation2=function(bbt_blueInterpolation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<357>";
	bb_assert_AssertRangeInt(bbt_blueInterpolation,0,5,"Invalid BlueInterpolation");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<358>";
	dbg_object(this).bb_blueInterpolation=bbt_blueInterpolation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<359>";
	dbg_object(this).bb_useHSB=false;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_AlphaInterpolation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<374>";
	pop_err();
	return this.bb_alphaInterpolation;
}
bb_psystem_Emitter.prototype.bbm_AlphaInterpolation2=function(bbt_alphaInterpolation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<377>";
	bb_assert_AssertRangeInt(bbt_alphaInterpolation,0,5,"Invalid AlphaInterpolation");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<378>";
	dbg_object(this).bb_alphaInterpolation=bbt_alphaInterpolation;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_RedInterpolationTime=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<324>";
	pop_err();
	return this.bb_redInterpolationTime;
}
bb_psystem_Emitter.prototype.bbm_RedInterpolationTime2=function(bbt_redInterpolationTime){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<327>";
	dbg_object(this).bb_redInterpolationTime=bbt_redInterpolationTime;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<328>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<329>";
	if(this.bb_redInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<329>";
		this.bb_redInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_GreenInterpolationTime=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<344>";
	pop_err();
	return this.bb_greenInterpolationTime;
}
bb_psystem_Emitter.prototype.bbm_GreenInterpolationTime2=function(bbt_greenInterpolationTime){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<347>";
	dbg_object(this).bb_greenInterpolationTime=bbt_greenInterpolationTime;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<348>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<349>";
	if(this.bb_greenInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<349>";
		this.bb_greenInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_BlueInterpolationTime=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<364>";
	pop_err();
	return this.bb_blueInterpolationTime;
}
bb_psystem_Emitter.prototype.bbm_BlueInterpolationTime2=function(bbt_blueInterpolationTime){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<367>";
	dbg_object(this).bb_blueInterpolationTime=bbt_blueInterpolationTime;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<368>";
	dbg_object(this).bb_useHSB=false;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<369>";
	if(this.bb_blueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<369>";
		this.bb_blueInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_AlphaInterpolationTime=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<383>";
	pop_err();
	return this.bb_alphaInterpolationTime;
}
bb_psystem_Emitter.prototype.bbm_AlphaInterpolationTime2=function(bbt_alphaInterpolationTime){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<386>";
	dbg_object(this).bb_alphaInterpolationTime=bbt_alphaInterpolationTime;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<387>";
	if(this.bb_alphaInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<387>";
		this.bb_alphaInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Hue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<925>";
	pop_err();
	return this.bb_minStartHue;
}
bb_psystem_Emitter.prototype.bbm_Hue2=function(bbt_hue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<928>";
	bbt_hue=bb_math_Min2(bb_math_Max2(bbt_hue,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<929>";
	dbg_object(this).bb_minStartHue=bbt_hue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<930>";
	dbg_object(this).bb_maxStartHue=bbt_hue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<931>";
	dbg_object(this).bb_minEndHue=bbt_hue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<932>";
	dbg_object(this).bb_maxEndHue=bbt_hue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<933>";
	dbg_object(this).bb_hueInterpolation=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<934>";
	dbg_object(this).bb_hueInterpolationTime=-1.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<935>";
	dbg_object(this).bb_useHSB=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Saturation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<939>";
	pop_err();
	return this.bb_minStartSaturation;
}
bb_psystem_Emitter.prototype.bbm_Saturation2=function(bbt_saturation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<942>";
	bbt_saturation=bb_math_Min2(bb_math_Max2(bbt_saturation,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<943>";
	dbg_object(this).bb_minStartSaturation=bbt_saturation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<944>";
	dbg_object(this).bb_maxStartSaturation=bbt_saturation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<945>";
	dbg_object(this).bb_minEndSaturation=bbt_saturation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<946>";
	dbg_object(this).bb_maxEndSaturation=bbt_saturation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<947>";
	dbg_object(this).bb_saturationInterpolation=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<948>";
	dbg_object(this).bb_saturationInterpolationTime=-1.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<949>";
	dbg_object(this).bb_useHSB=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Brightness=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<953>";
	pop_err();
	return this.bb_minStartBrightness;
}
bb_psystem_Emitter.prototype.bbm_Brightness2=function(bbt_brightness){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<956>";
	bbt_brightness=bb_math_Min2(bb_math_Max2(bbt_brightness,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<957>";
	dbg_object(this).bb_minStartBrightness=bbt_brightness;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<958>";
	dbg_object(this).bb_maxStartBrightness=bbt_brightness;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<959>";
	dbg_object(this).bb_minEndBrightness=bbt_brightness;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<960>";
	dbg_object(this).bb_maxEndBrightness=bbt_brightness;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<961>";
	dbg_object(this).bb_brightnessInterpolation=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<962>";
	dbg_object(this).bb_brightnessInterpolationTime=-1.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<963>";
	dbg_object(this).bb_useHSB=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_StartHue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1078>";
	pop_err();
	return this.bb_minStartHue;
}
bb_psystem_Emitter.prototype.bbm_StartHue2=function(bbt_startHue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1081>";
	bbt_startHue=bb_math_Min2(bb_math_Max2(bbt_startHue,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1082>";
	dbg_object(this).bb_minStartHue=bbt_startHue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1083>";
	dbg_object(this).bb_maxStartHue=bbt_startHue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1084>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1085>";
	if(this.bb_hueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1086>";
		this.bb_hueInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1087>";
		this.bb_hueInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_StartSaturation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1092>";
	pop_err();
	return this.bb_minStartSaturation;
}
bb_psystem_Emitter.prototype.bbm_StartSaturation2=function(bbt_startSaturation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1095>";
	bbt_startSaturation=bb_math_Min2(bb_math_Max2(bbt_startSaturation,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1096>";
	dbg_object(this).bb_minStartSaturation=bbt_startSaturation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1097>";
	dbg_object(this).bb_maxStartSaturation=bbt_startSaturation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1098>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1099>";
	if(this.bb_saturationInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1100>";
		this.bb_saturationInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1101>";
		this.bb_saturationInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_StartBrightness=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1106>";
	pop_err();
	return this.bb_minStartBrightness;
}
bb_psystem_Emitter.prototype.bbm_StartBrightness2=function(bbt_startBrightness){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1109>";
	bbt_startBrightness=bb_math_Min2(bb_math_Max2(bbt_startBrightness,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1110>";
	dbg_object(this).bb_minStartBrightness=bbt_startBrightness;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1111>";
	dbg_object(this).bb_maxStartBrightness=bbt_startBrightness;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1112>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1113>";
	if(this.bb_brightnessInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1114>";
		this.bb_brightnessInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1115>";
		this.bb_brightnessInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_EndHue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1120>";
	pop_err();
	return this.bb_minEndHue;
}
bb_psystem_Emitter.prototype.bbm_EndHue2=function(bbt_endHue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1123>";
	bbt_endHue=bb_math_Min2(bb_math_Max2(bbt_endHue,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1124>";
	dbg_object(this).bb_minEndHue=bbt_endHue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1125>";
	dbg_object(this).bb_maxEndHue=bbt_endHue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1126>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1127>";
	if(this.bb_hueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1128>";
		this.bb_hueInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1129>";
		this.bb_hueInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_EndSaturation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1134>";
	pop_err();
	return this.bb_minEndSaturation;
}
bb_psystem_Emitter.prototype.bbm_EndSaturation2=function(bbt_endSaturation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1137>";
	bbt_endSaturation=bb_math_Min2(bb_math_Max2(bbt_endSaturation,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1138>";
	dbg_object(this).bb_minEndSaturation=bbt_endSaturation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1139>";
	dbg_object(this).bb_maxEndSaturation=bbt_endSaturation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1140>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1141>";
	if(this.bb_saturationInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1142>";
		this.bb_saturationInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1143>";
		this.bb_saturationInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_EndBrightness=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1148>";
	pop_err();
	return this.bb_minEndBrightness;
}
bb_psystem_Emitter.prototype.bbm_EndBrightness2=function(bbt_endBrightness){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1151>";
	bbt_endBrightness=bb_math_Min2(bb_math_Max2(bbt_endBrightness,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1152>";
	dbg_object(this).bb_minEndBrightness=bbt_endBrightness;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1153>";
	dbg_object(this).bb_maxEndBrightness=bbt_endBrightness;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1154>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1155>";
	if(this.bb_brightnessInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1156>";
		this.bb_brightnessInterpolation=1;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1157>";
		this.bb_brightnessInterpolationTime=-1.0;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinStartHue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<608>";
	pop_err();
	return this.bb_minStartHue;
}
bb_psystem_Emitter.prototype.bbm_MinStartHue2=function(bbt_minStartHue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<611>";
	dbg_object(this).bb_minStartHue=bb_math_Min2(bb_math_Max2(bbt_minStartHue,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<612>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<613>";
	if(this.bb_hueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<613>";
		this.bb_hueInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxStartHue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<618>";
	pop_err();
	return this.bb_maxStartHue;
}
bb_psystem_Emitter.prototype.bbm_MaxStartHue2=function(bbt_maxStartHue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<621>";
	dbg_object(this).bb_maxStartHue=bb_math_Min2(bb_math_Max2(bbt_maxStartHue,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<622>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<623>";
	if(this.bb_hueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<623>";
		this.bb_hueInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinEndHue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<668>";
	pop_err();
	return this.bb_minEndHue;
}
bb_psystem_Emitter.prototype.bbm_MinEndHue2=function(bbt_minEndHue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<671>";
	dbg_object(this).bb_minEndHue=bb_math_Min2(bb_math_Max2(bbt_minEndHue,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<672>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<673>";
	if(this.bb_hueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<673>";
		this.bb_hueInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxEndHue=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<678>";
	pop_err();
	return this.bb_maxEndHue;
}
bb_psystem_Emitter.prototype.bbm_MaxEndHue2=function(bbt_maxEndHue){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<681>";
	dbg_object(this).bb_maxEndHue=bb_math_Min2(bb_math_Max2(bbt_maxEndHue,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<682>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<683>";
	if(this.bb_hueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<683>";
		this.bb_hueInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinStartSaturation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<628>";
	pop_err();
	return this.bb_minStartSaturation;
}
bb_psystem_Emitter.prototype.bbm_MinStartSaturation2=function(bbt_minStartSaturation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<631>";
	dbg_object(this).bb_minStartSaturation=bb_math_Min2(bb_math_Max2(bbt_minStartSaturation,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<632>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<633>";
	if(this.bb_saturationInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<633>";
		this.bb_saturationInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxStartSaturation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<638>";
	pop_err();
	return this.bb_maxStartSaturation;
}
bb_psystem_Emitter.prototype.bbm_MaxStartSaturation2=function(bbt_maxStartSaturation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<641>";
	dbg_object(this).bb_maxStartSaturation=bb_math_Min2(bb_math_Max2(bbt_maxStartSaturation,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<642>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<643>";
	if(this.bb_saturationInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<643>";
		this.bb_saturationInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinEndSaturation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<688>";
	pop_err();
	return this.bb_minEndSaturation;
}
bb_psystem_Emitter.prototype.bbm_MinEndSaturation2=function(bbt_minEndSaturation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<691>";
	dbg_object(this).bb_minEndSaturation=bb_math_Min2(bb_math_Max2(bbt_minEndSaturation,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<692>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<693>";
	if(this.bb_saturationInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<693>";
		this.bb_saturationInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxEndSaturation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<698>";
	pop_err();
	return this.bb_maxEndSaturation;
}
bb_psystem_Emitter.prototype.bbm_MaxEndSaturation2=function(bbt_maxEndSaturation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<701>";
	dbg_object(this).bb_maxEndSaturation=bb_math_Min2(bb_math_Max2(bbt_maxEndSaturation,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<702>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<703>";
	if(this.bb_saturationInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<703>";
		this.bb_saturationInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinStartBrightness=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<648>";
	pop_err();
	return this.bb_minStartBrightness;
}
bb_psystem_Emitter.prototype.bbm_MinStartBrightness2=function(bbt_minStartBrightness){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<651>";
	dbg_object(this).bb_minStartBrightness=bb_math_Min2(bb_math_Max2(bbt_minStartBrightness,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<652>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<653>";
	if(this.bb_brightnessInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<653>";
		this.bb_brightnessInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxStartBrightness=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<658>";
	pop_err();
	return this.bb_maxStartBrightness;
}
bb_psystem_Emitter.prototype.bbm_MaxStartBrightness2=function(bbt_maxStartBrightness){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<661>";
	dbg_object(this).bb_maxStartBrightness=bb_math_Min2(bb_math_Max2(bbt_maxStartBrightness,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<662>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<663>";
	if(this.bb_brightnessInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<663>";
		this.bb_brightnessInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MinEndBrightness=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<708>";
	pop_err();
	return this.bb_minEndBrightness;
}
bb_psystem_Emitter.prototype.bbm_MinEndBrightness2=function(bbt_minEndBrightness){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<711>";
	dbg_object(this).bb_minEndBrightness=bb_math_Min2(bb_math_Max2(bbt_minEndBrightness,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<712>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<713>";
	if(this.bb_brightnessInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<713>";
		this.bb_brightnessInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_MaxEndBrightness=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<718>";
	pop_err();
	return this.bb_maxEndBrightness;
}
bb_psystem_Emitter.prototype.bbm_MaxEndBrightness2=function(bbt_maxEndBrightness){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<721>";
	dbg_object(this).bb_maxEndBrightness=bb_math_Min2(bb_math_Max2(bbt_maxEndBrightness,0.0),1.0);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<722>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<723>";
	if(this.bb_brightnessInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<723>";
		this.bb_brightnessInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_HueInterpolation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<548>";
	pop_err();
	return this.bb_hueInterpolation;
}
bb_psystem_Emitter.prototype.bbm_HueInterpolation2=function(bbt_hueInterpolation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<551>";
	bb_assert_AssertRangeInt(bbt_hueInterpolation,0,5,"Invalid HueInterpolation");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<552>";
	dbg_object(this).bb_hueInterpolation=bbt_hueInterpolation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<553>";
	dbg_object(this).bb_useHSB=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_SaturationInterpolation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<568>";
	pop_err();
	return this.bb_saturationInterpolation;
}
bb_psystem_Emitter.prototype.bbm_SaturationInterpolation2=function(bbt_saturationInterpolation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<571>";
	bb_assert_AssertRangeInt(bbt_saturationInterpolation,0,5,"Invalid SaturationInterpolation");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<572>";
	dbg_object(this).bb_saturationInterpolation=bbt_saturationInterpolation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<573>";
	dbg_object(this).bb_useHSB=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_BrightnessInterpolation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<588>";
	pop_err();
	return this.bb_brightnessInterpolation;
}
bb_psystem_Emitter.prototype.bbm_BrightnessInterpolation2=function(bbt_brightnessInterpolation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<591>";
	bb_assert_AssertRangeInt(bbt_brightnessInterpolation,0,5,"Invalid BrightnessInterpolation");
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<592>";
	dbg_object(this).bb_brightnessInterpolation=bbt_brightnessInterpolation;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<593>";
	dbg_object(this).bb_useHSB=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_HueInterpolationTime=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<558>";
	pop_err();
	return this.bb_hueInterpolationTime;
}
bb_psystem_Emitter.prototype.bbm_HueInterpolationTime2=function(bbt_hueInterpolationTime){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<561>";
	dbg_object(this).bb_hueInterpolationTime=bbt_hueInterpolationTime;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<562>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<563>";
	if(this.bb_hueInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<563>";
		this.bb_hueInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_SaturationInterpolationTime=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<578>";
	pop_err();
	return this.bb_saturationInterpolationTime;
}
bb_psystem_Emitter.prototype.bbm_SaturationInterpolationTime2=function(bbt_saturationInterpolationTime){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<581>";
	dbg_object(this).bb_saturationInterpolationTime=bbt_saturationInterpolationTime;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<582>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<583>";
	if(this.bb_saturationInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<583>";
		this.bb_saturationInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_BrightnessInterpolationTime=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<598>";
	pop_err();
	return this.bb_brightnessInterpolationTime;
}
bb_psystem_Emitter.prototype.bbm_BrightnessInterpolationTime2=function(bbt_brightnessInterpolationTime){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<601>";
	dbg_object(this).bb_brightnessInterpolationTime=bbt_brightnessInterpolationTime;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<602>";
	dbg_object(this).bb_useHSB=true;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<603>";
	if(this.bb_brightnessInterpolation==0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<603>";
		this.bb_brightnessInterpolation=1;
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAngle=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<242>";
	var bbt_=this.bb_polarVelocityAngle*57.295779578552292;
	pop_err();
	return bbt_;
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAngle2=function(bbt_polarVelocityAngle){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<245>";
	dbg_object(this).bb_polarVelocityAngle=bbt_polarVelocityAngle*0.017453292500000002;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<246>";
	dbg_object(this).bb_usePolar=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAngleRadians=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<249>";
	pop_err();
	return this.bb_polarVelocityAngle;
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAngleRadians2=function(bbt_polarVelocityAngle){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<252>";
	dbg_object(this).bb_polarVelocityAngle=bbt_polarVelocityAngle;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<253>";
	dbg_object(this).bb_usePolar=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAngleSpread=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<258>";
	var bbt_=this.bb_polarVelocityAngleSpread*57.295779578552292;
	pop_err();
	return bbt_;
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAngleSpread2=function(bbt_polarVelocityAngleSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<261>";
	dbg_object(this).bb_polarVelocityAngleSpread=bbt_polarVelocityAngleSpread*0.017453292500000002;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<262>";
	dbg_object(this).bb_usePolar=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAngleSpreadRadians=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<265>";
	pop_err();
	return this.bb_polarVelocityAngleSpread;
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAngleSpreadRadians2=function(bbt_polarVelocityAngleSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<268>";
	dbg_object(this).bb_polarVelocityAngleSpread=bbt_polarVelocityAngleSpread;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<269>";
	dbg_object(this).bb_usePolar=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAmplitude=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<224>";
	pop_err();
	return this.bb_polarVelocityAmplitude;
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAmplitude2=function(bbt_polarVelocityAmplitude){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<227>";
	dbg_object(this).bb_polarVelocityAmplitude=bbt_polarVelocityAmplitude;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<228>";
	dbg_object(this).bb_usePolar=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAmplitudeSpread=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<233>";
	pop_err();
	return this.bb_polarVelocityAmplitudeSpread;
}
bb_psystem_Emitter.prototype.bbm_PolarVelocityAmplitudeSpread2=function(bbt_polarVelocityAmplitudeSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<236>";
	dbg_object(this).bb_polarVelocityAmplitudeSpread=bbt_polarVelocityAmplitudeSpread;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<237>";
	dbg_object(this).bb_usePolar=true;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_VelocityX=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<188>";
	pop_err();
	return this.bb_velocityX;
}
bb_psystem_Emitter.prototype.bbm_VelocityX2=function(bbt_velocityX){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<191>";
	dbg_object(this).bb_velocityX=bbt_velocityX;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<192>";
	dbg_object(this).bb_usePolar=false;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_VelocityXSpread=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<197>";
	pop_err();
	return this.bb_velocityXSpread;
}
bb_psystem_Emitter.prototype.bbm_VelocityXSpread2=function(bbt_velocityXSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<200>";
	dbg_object(this).bb_velocityXSpread=bbt_velocityXSpread;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<201>";
	dbg_object(this).bb_usePolar=false;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_VelocityY=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<206>";
	pop_err();
	return this.bb_velocityY;
}
bb_psystem_Emitter.prototype.bbm_VelocityY2=function(bbt_velocityY){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<209>";
	dbg_object(this).bb_velocityY=bbt_velocityY;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<210>";
	dbg_object(this).bb_usePolar=false;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_VelocityYSpread=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<215>";
	pop_err();
	return this.bb_velocityYSpread;
}
bb_psystem_Emitter.prototype.bbm_VelocityYSpread2=function(bbt_velocityYSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<218>";
	dbg_object(this).bb_velocityYSpread=bbt_velocityYSpread;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<219>";
	dbg_object(this).bb_usePolar=false;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Name=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<816>";
	pop_err();
	return this.bb_name;
}
bb_psystem_Emitter.prototype.bbm_Name2=function(bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<819>";
	dbg_object(this).bb_name=bbt_name;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_X=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<824>";
	pop_err();
	return this.bb_x;
}
bb_psystem_Emitter.prototype.bbm_X2=function(bbt_x){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<827>";
	dbg_object(this).bb_x=bbt_x;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Y=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<832>";
	pop_err();
	return this.bb_y;
}
bb_psystem_Emitter.prototype.bbm_Y2=function(bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<835>";
	dbg_object(this).bb_y=bbt_y;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Angle=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<840>";
	var bbt_=this.bb_angle*57.295779578552292;
	pop_err();
	return bbt_;
}
bb_psystem_Emitter.prototype.bbm_Angle2=function(bbt_angle){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<843>";
	dbg_object(this).bb_angle=bbt_angle*0.017453292500000002;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_AngleRadians=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<846>";
	pop_err();
	return this.bb_angle;
}
bb_psystem_Emitter.prototype.bbm_AngleRadians2=function(bbt_angle){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<849>";
	dbg_object(this).bb_angle=bbt_angle;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_SpawnMinRange=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<282>";
	pop_err();
	return this.bb_spawnMinRange;
}
bb_psystem_Emitter.prototype.bbm_SpawnMinRange2=function(bbt_spawnMinRange){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<285>";
	dbg_object(this).bb_spawnMinRange=bbt_spawnMinRange;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_SpawnMaxRange=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<290>";
	pop_err();
	return this.bb_spawnMaxRange;
}
bb_psystem_Emitter.prototype.bbm_SpawnMaxRange2=function(bbt_spawnMaxRange){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<293>";
	dbg_object(this).bb_spawnMaxRange=bbt_spawnMaxRange;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Life=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<298>";
	pop_err();
	return this.bb_life;
}
bb_psystem_Emitter.prototype.bbm_Life2=function(bbt_life){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<301>";
	dbg_object(this).bb_life=bbt_life;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_LifeSpread=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<306>";
	pop_err();
	return this.bb_lifeSpread;
}
bb_psystem_Emitter.prototype.bbm_LifeSpread2=function(bbt_lifeSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<309>";
	dbg_object(this).bb_lifeSpread=bbt_lifeSpread;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Scale2=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<800>";
	pop_err();
	return this.bb_scale;
}
bb_psystem_Emitter.prototype.bbm_Scale=function(bbt_scale){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<803>";
	dbg_object(this).bb_scale=bbt_scale;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_ScaleSpread=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<808>";
	pop_err();
	return this.bb_scaleSpread;
}
bb_psystem_Emitter.prototype.bbm_ScaleSpread2=function(bbt_scaleSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<811>";
	dbg_object(this).bb_scaleSpread=bbt_scaleSpread;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_Rotation=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<744>";
	var bbt_=this.bb_rotation*57.295779578552292;
	pop_err();
	return bbt_;
}
bb_psystem_Emitter.prototype.bbm_Rotation2=function(bbt_rotation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<747>";
	dbg_object(this).bb_rotation=bbt_rotation*0.017453292500000002;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_RotationRadians=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<750>";
	pop_err();
	return this.bb_rotation;
}
bb_psystem_Emitter.prototype.bbm_RotationRadians2=function(bbt_rotation){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<753>";
	dbg_object(this).bb_rotation=bbt_rotation;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_RotationSpread=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<758>";
	var bbt_=this.bb_rotationSpread*57.295779578552292;
	pop_err();
	return bbt_;
}
bb_psystem_Emitter.prototype.bbm_RotationSpread2=function(bbt_rotationSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<761>";
	dbg_object(this).bb_rotationSpread=bbt_rotationSpread*0.017453292500000002;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_RotationSpreadRadians=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<764>";
	pop_err();
	return this.bb_rotationSpread;
}
bb_psystem_Emitter.prototype.bbm_RotationSpreadRadians2=function(bbt_rotationSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<767>";
	dbg_object(this).bb_rotationSpread=bbt_rotationSpread;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_RotationSpeed=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<772>";
	var bbt_=this.bb_rotationSpeed*57.295779578552292;
	pop_err();
	return bbt_;
}
bb_psystem_Emitter.prototype.bbm_RotationSpeed2=function(bbt_rotationSpeed){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<775>";
	dbg_object(this).bb_rotationSpeed=bbt_rotationSpeed*0.017453292500000002;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_RotationSpeedRadians=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<778>";
	pop_err();
	return this.bb_rotationSpeed;
}
bb_psystem_Emitter.prototype.bbm_RotationSpeedRadians2=function(bbt_rotationSpeed){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<781>";
	dbg_object(this).bb_rotationSpeed=bbt_rotationSpeed;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_RotationSpeedSpread=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<786>";
	var bbt_=this.bb_rotationSpeedSpread*57.295779578552292;
	pop_err();
	return bbt_;
}
bb_psystem_Emitter.prototype.bbm_RotationSpeedSpread2=function(bbt_rotationSpeedSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<789>";
	dbg_object(this).bb_rotationSpeedSpread=bbt_rotationSpeedSpread*0.017453292500000002;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_RotationSpeedSpreadRadians=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<792>";
	pop_err();
	return this.bb_rotationSpeedSpread;
}
bb_psystem_Emitter.prototype.bbm_RotationSpeedSpreadRadians2=function(bbt_rotationSpeedSpread){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<795>";
	dbg_object(this).bb_rotationSpeedSpread=bbt_rotationSpeedSpread;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_ReadXML=function(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1606>";
	if(bbt_node.bbm_HasAttribute("Red")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1606>";
		this.bbm_Red2((parseFloat(bbt_node.bbm_GetAttribute("Red","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1607>";
	if(bbt_node.bbm_HasAttribute("Green")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1607>";
		this.bbm_Green2((parseFloat(bbt_node.bbm_GetAttribute("Green","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1608>";
	if(bbt_node.bbm_HasAttribute("Blue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1608>";
		this.bbm_Blue2((parseFloat(bbt_node.bbm_GetAttribute("Blue","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1609>";
	if(bbt_node.bbm_HasAttribute("Alpha")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1609>";
		this.bbm_Alpha2(parseFloat(bbt_node.bbm_GetAttribute("Alpha","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1610>";
	if(bbt_node.bbm_HasAttribute("StartRed")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1610>";
		this.bbm_StartRed2((parseFloat(bbt_node.bbm_GetAttribute("StartRed","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1611>";
	if(bbt_node.bbm_HasAttribute("StartGreen")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1611>";
		this.bbm_StartGreen2((parseFloat(bbt_node.bbm_GetAttribute("StartGreen","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1612>";
	if(bbt_node.bbm_HasAttribute("StartBlue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1612>";
		this.bbm_StartBlue2((parseFloat(bbt_node.bbm_GetAttribute("StartBlue","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1613>";
	if(bbt_node.bbm_HasAttribute("StartAlpha")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1613>";
		this.bbm_StartAlpha2(parseFloat(bbt_node.bbm_GetAttribute("StartAlpha","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1614>";
	if(bbt_node.bbm_HasAttribute("EndRed")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1614>";
		this.bbm_EndRed2((parseFloat(bbt_node.bbm_GetAttribute("EndRed","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1615>";
	if(bbt_node.bbm_HasAttribute("EndGreen")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1615>";
		this.bbm_EndGreen2((parseFloat(bbt_node.bbm_GetAttribute("EndGreen","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1616>";
	if(bbt_node.bbm_HasAttribute("EndBlue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1616>";
		this.bbm_EndBlue2((parseFloat(bbt_node.bbm_GetAttribute("EndBlue","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1617>";
	if(bbt_node.bbm_HasAttribute("EndAlpha")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1617>";
		this.bbm_EndAlpha2(parseFloat(bbt_node.bbm_GetAttribute("EndAlpha","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1619>";
	if(bbt_node.bbm_HasAttribute("MinStartRed")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1619>";
		this.bbm_MinStartRed2((parseFloat(bbt_node.bbm_GetAttribute("MinStartRed","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1620>";
	if(bbt_node.bbm_HasAttribute("MaxStartRed")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1620>";
		this.bbm_MaxStartRed2((parseFloat(bbt_node.bbm_GetAttribute("MaxStartRed","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1621>";
	if(bbt_node.bbm_HasAttribute("MinEndRed")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1621>";
		this.bbm_MinEndRed2((parseFloat(bbt_node.bbm_GetAttribute("MinEndRed","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1622>";
	if(bbt_node.bbm_HasAttribute("MaxEndRed")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1622>";
		this.bbm_MaxEndRed2((parseFloat(bbt_node.bbm_GetAttribute("MaxEndRed","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1623>";
	if(bbt_node.bbm_HasAttribute("MinStartGreen")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1623>";
		this.bbm_MinStartGreen2((parseFloat(bbt_node.bbm_GetAttribute("MinStartGreen","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1624>";
	if(bbt_node.bbm_HasAttribute("MaxStartGreen")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1624>";
		this.bbm_MaxStartGreen2((parseFloat(bbt_node.bbm_GetAttribute("MaxStartGreen","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1625>";
	if(bbt_node.bbm_HasAttribute("MinEndGreen")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1625>";
		this.bbm_MinEndGreen2((parseFloat(bbt_node.bbm_GetAttribute("MinEndGreen","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1626>";
	if(bbt_node.bbm_HasAttribute("MaxEndGreen")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1626>";
		this.bbm_MaxEndGreen2((parseFloat(bbt_node.bbm_GetAttribute("MaxEndGreen","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1627>";
	if(bbt_node.bbm_HasAttribute("MinStartBlue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1627>";
		this.bbm_MinStartBlue2((parseFloat(bbt_node.bbm_GetAttribute("MinStartBlue","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1628>";
	if(bbt_node.bbm_HasAttribute("MaxStartBlue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1628>";
		this.bbm_MaxStartBlue2((parseFloat(bbt_node.bbm_GetAttribute("MaxStartBlue","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1629>";
	if(bbt_node.bbm_HasAttribute("MinEndBlue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1629>";
		this.bbm_MinEndBlue2((parseFloat(bbt_node.bbm_GetAttribute("MinEndBlue","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1630>";
	if(bbt_node.bbm_HasAttribute("MaxEndBlue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1630>";
		this.bbm_MaxEndBlue2((parseFloat(bbt_node.bbm_GetAttribute("MaxEndBlue","")))|0);
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1631>";
	if(bbt_node.bbm_HasAttribute("MinStartAlpha")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1631>";
		this.bbm_MinStartAlpha2(parseFloat(bbt_node.bbm_GetAttribute("MinStartAlpha","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1632>";
	if(bbt_node.bbm_HasAttribute("MaxStartAlpha")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1632>";
		this.bbm_MaxStartAlpha2(parseFloat(bbt_node.bbm_GetAttribute("MaxStartAlpha","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1633>";
	if(bbt_node.bbm_HasAttribute("MinEndAlpha")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1633>";
		this.bbm_MinEndAlpha2(parseFloat(bbt_node.bbm_GetAttribute("MinEndAlpha","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1634>";
	if(bbt_node.bbm_HasAttribute("MaxEndAlpha")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1634>";
		this.bbm_MaxEndAlpha2(parseFloat(bbt_node.bbm_GetAttribute("MaxEndAlpha","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1636>";
	if(bbt_node.bbm_HasAttribute("RedInterpolation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1636>";
		this.bbm_RedInterpolation2(bb_functions_InterpolationFromString(bbt_node.bbm_GetAttribute("RedInterpolation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1637>";
	if(bbt_node.bbm_HasAttribute("GreenInterpolation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1637>";
		this.bbm_GreenInterpolation2(bb_functions_InterpolationFromString(bbt_node.bbm_GetAttribute("GreenInterpolation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1638>";
	if(bbt_node.bbm_HasAttribute("BlueInterpolation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1638>";
		this.bbm_BlueInterpolation2(bb_functions_InterpolationFromString(bbt_node.bbm_GetAttribute("BlueInterpolation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1639>";
	if(bbt_node.bbm_HasAttribute("AlphaInterpolation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1639>";
		this.bbm_AlphaInterpolation2(bb_functions_InterpolationFromString(bbt_node.bbm_GetAttribute("AlphaInterpolation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1640>";
	if(bbt_node.bbm_HasAttribute("RedInterpolationTime")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1640>";
		this.bbm_RedInterpolationTime2(parseFloat(bbt_node.bbm_GetAttribute("RedInterpolationTime","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1641>";
	if(bbt_node.bbm_HasAttribute("GreenInterpolationTime")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1641>";
		this.bbm_GreenInterpolationTime2(parseFloat(bbt_node.bbm_GetAttribute("GreenInterpolationTime","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1642>";
	if(bbt_node.bbm_HasAttribute("BlueInterpolationTime")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1642>";
		this.bbm_BlueInterpolationTime2(parseFloat(bbt_node.bbm_GetAttribute("BlueInterpolationTime","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1643>";
	if(bbt_node.bbm_HasAttribute("AlphaInterpolationTime")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1643>";
		this.bbm_AlphaInterpolationTime2(parseFloat(bbt_node.bbm_GetAttribute("AlphaInterpolationTime","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1645>";
	if(bbt_node.bbm_HasAttribute("Hue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1645>";
		this.bbm_Hue2(parseFloat(bbt_node.bbm_GetAttribute("Hue","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1646>";
	if(bbt_node.bbm_HasAttribute("Saturation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1646>";
		this.bbm_Saturation2(parseFloat(bbt_node.bbm_GetAttribute("Saturation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1647>";
	if(bbt_node.bbm_HasAttribute("Brightness")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1647>";
		this.bbm_Brightness2(parseFloat(bbt_node.bbm_GetAttribute("Brightness","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1648>";
	if(bbt_node.bbm_HasAttribute("StartHue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1648>";
		this.bbm_StartHue2(parseFloat(bbt_node.bbm_GetAttribute("StartHue","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1649>";
	if(bbt_node.bbm_HasAttribute("StartSaturation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1649>";
		this.bbm_StartSaturation2(parseFloat(bbt_node.bbm_GetAttribute("StartSaturation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1650>";
	if(bbt_node.bbm_HasAttribute("StartBrightness")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1650>";
		this.bbm_StartBrightness2(parseFloat(bbt_node.bbm_GetAttribute("StartBrightness","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1651>";
	if(bbt_node.bbm_HasAttribute("EndHue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1651>";
		this.bbm_EndHue2(parseFloat(bbt_node.bbm_GetAttribute("EndHue","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1652>";
	if(bbt_node.bbm_HasAttribute("EndSaturation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1652>";
		this.bbm_EndSaturation2(parseFloat(bbt_node.bbm_GetAttribute("EndSaturation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1653>";
	if(bbt_node.bbm_HasAttribute("EndBrightness")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1653>";
		this.bbm_EndBrightness2(parseFloat(bbt_node.bbm_GetAttribute("EndBrightness","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1655>";
	if(bbt_node.bbm_HasAttribute("MinStartHue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1655>";
		this.bbm_MinStartHue2(parseFloat(bbt_node.bbm_GetAttribute("MinStartHue","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1656>";
	if(bbt_node.bbm_HasAttribute("MaxStartHue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1656>";
		this.bbm_MaxStartHue2(parseFloat(bbt_node.bbm_GetAttribute("MaxStartHue","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1657>";
	if(bbt_node.bbm_HasAttribute("MinEndHue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1657>";
		this.bbm_MinEndHue2(parseFloat(bbt_node.bbm_GetAttribute("MinEndHue","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1658>";
	if(bbt_node.bbm_HasAttribute("MaxEndHue")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1658>";
		this.bbm_MaxEndHue2(parseFloat(bbt_node.bbm_GetAttribute("MaxEndHue","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1659>";
	if(bbt_node.bbm_HasAttribute("MinStartSaturation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1659>";
		this.bbm_MinStartSaturation2(parseFloat(bbt_node.bbm_GetAttribute("MinStartSaturation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1660>";
	if(bbt_node.bbm_HasAttribute("MaxStartSaturation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1660>";
		this.bbm_MaxStartSaturation2(parseFloat(bbt_node.bbm_GetAttribute("MaxStartSaturation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1661>";
	if(bbt_node.bbm_HasAttribute("MinEndSaturation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1661>";
		this.bbm_MinEndSaturation2(parseFloat(bbt_node.bbm_GetAttribute("MinEndSaturation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1662>";
	if(bbt_node.bbm_HasAttribute("MaxEndSaturation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1662>";
		this.bbm_MaxEndSaturation2(parseFloat(bbt_node.bbm_GetAttribute("MaxEndSaturation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1663>";
	if(bbt_node.bbm_HasAttribute("MinStartBrightness")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1663>";
		this.bbm_MinStartBrightness2(parseFloat(bbt_node.bbm_GetAttribute("MinStartBrightness","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1664>";
	if(bbt_node.bbm_HasAttribute("MaxStartBrightness")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1664>";
		this.bbm_MaxStartBrightness2(parseFloat(bbt_node.bbm_GetAttribute("MaxStartBrightness","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1665>";
	if(bbt_node.bbm_HasAttribute("MinEndBrightness")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1665>";
		this.bbm_MinEndBrightness2(parseFloat(bbt_node.bbm_GetAttribute("MinEndBrightness","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1666>";
	if(bbt_node.bbm_HasAttribute("MaxEndBrightness")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1666>";
		this.bbm_MaxEndBrightness2(parseFloat(bbt_node.bbm_GetAttribute("MaxEndBrightness","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1668>";
	if(bbt_node.bbm_HasAttribute("HueInterpolation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1668>";
		this.bbm_HueInterpolation2(bb_functions_InterpolationFromString(bbt_node.bbm_GetAttribute("HueInterpolation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1669>";
	if(bbt_node.bbm_HasAttribute("SaturationInterpolation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1669>";
		this.bbm_SaturationInterpolation2(bb_functions_InterpolationFromString(bbt_node.bbm_GetAttribute("SaturationInterpolation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1670>";
	if(bbt_node.bbm_HasAttribute("BrightnessInterpolation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1670>";
		this.bbm_BrightnessInterpolation2(bb_functions_InterpolationFromString(bbt_node.bbm_GetAttribute("BrightnessInterpolation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1671>";
	if(bbt_node.bbm_HasAttribute("HueInterpolationTime")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1671>";
		this.bbm_HueInterpolationTime2(parseFloat(bbt_node.bbm_GetAttribute("HueInterpolationTime","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1672>";
	if(bbt_node.bbm_HasAttribute("SaturationInterpolationTime")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1672>";
		this.bbm_SaturationInterpolationTime2(parseFloat(bbt_node.bbm_GetAttribute("SaturationInterpolationTime","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1673>";
	if(bbt_node.bbm_HasAttribute("BrightnessInterpolationTime")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1673>";
		this.bbm_BrightnessInterpolationTime2(parseFloat(bbt_node.bbm_GetAttribute("BrightnessInterpolationTime","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1675>";
	if(bbt_node.bbm_HasAttribute("PolarVelocityAngle")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1675>";
		this.bbm_PolarVelocityAngle2(parseFloat(bbt_node.bbm_GetAttribute("PolarVelocityAngle","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1676>";
	if(bbt_node.bbm_HasAttribute("PolarVelocityAngleRadians")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1676>";
		this.bbm_PolarVelocityAngleRadians2(parseFloat(bbt_node.bbm_GetAttribute("PolarVelocityAngleRadians","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1677>";
	if(bbt_node.bbm_HasAttribute("PolarVelocityAngleSpread")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1677>";
		this.bbm_PolarVelocityAngleSpread2(parseFloat(bbt_node.bbm_GetAttribute("PolarVelocityAngleSpread","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1678>";
	if(bbt_node.bbm_HasAttribute("PolarVelocityAngleSpreadRadians")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1678>";
		this.bbm_PolarVelocityAngleSpreadRadians2(parseFloat(bbt_node.bbm_GetAttribute("PolarVelocityAngleSpreadRadians","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1679>";
	if(bbt_node.bbm_HasAttribute("PolarVelocityAmplitude")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1679>";
		this.bbm_PolarVelocityAmplitude2(parseFloat(bbt_node.bbm_GetAttribute("PolarVelocityAmplitude","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1680>";
	if(bbt_node.bbm_HasAttribute("PolarVelocityAmplitudeSpread")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1680>";
		this.bbm_PolarVelocityAmplitudeSpread2(parseFloat(bbt_node.bbm_GetAttribute("PolarVelocityAmplitudeSpread","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1682>";
	if(bbt_node.bbm_HasAttribute("VelocityX")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1682>";
		this.bbm_VelocityX2(parseFloat(bbt_node.bbm_GetAttribute("VelocityX","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1683>";
	if(bbt_node.bbm_HasAttribute("VelocityXSpread")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1683>";
		this.bbm_VelocityXSpread2(parseFloat(bbt_node.bbm_GetAttribute("VelocityXSpread","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1684>";
	if(bbt_node.bbm_HasAttribute("VelocityY")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1684>";
		this.bbm_VelocityY2(parseFloat(bbt_node.bbm_GetAttribute("VelocityY","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1685>";
	if(bbt_node.bbm_HasAttribute("VelocityYSpread")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1685>";
		this.bbm_VelocityYSpread2(parseFloat(bbt_node.bbm_GetAttribute("VelocityYSpread","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1687>";
	if(bbt_node.bbm_HasAttribute("Name")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1687>";
		this.bbm_Name2(bbt_node.bbm_GetAttribute("Name",""));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1688>";
	if(bbt_node.bbm_HasAttribute("X")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1688>";
		this.bbm_X2(parseFloat(bbt_node.bbm_GetAttribute("X","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1689>";
	if(bbt_node.bbm_HasAttribute("Y")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1689>";
		this.bbm_Y2(parseFloat(bbt_node.bbm_GetAttribute("Y","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1690>";
	if(bbt_node.bbm_HasAttribute("Angle")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1690>";
		this.bbm_Angle2(parseFloat(bbt_node.bbm_GetAttribute("Angle","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1691>";
	if(bbt_node.bbm_HasAttribute("AngleRadians")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1691>";
		this.bbm_AngleRadians2(parseFloat(bbt_node.bbm_GetAttribute("AngleRadians","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1692>";
	if(bbt_node.bbm_HasAttribute("Group")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1692>";
		this.bb_groupName=bbt_node.bbm_GetAttribute("Group","");
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1694>";
	if(bbt_node.bbm_HasAttribute("SpawnMinRange")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1694>";
		this.bbm_SpawnMinRange2(parseFloat(bbt_node.bbm_GetAttribute("SpawnMinRange","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1695>";
	if(bbt_node.bbm_HasAttribute("SpawnMaxRange")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1695>";
		this.bbm_SpawnMaxRange2(parseFloat(bbt_node.bbm_GetAttribute("SpawnMaxRange","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1696>";
	if(bbt_node.bbm_HasAttribute("Life")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1696>";
		this.bbm_Life2(parseFloat(bbt_node.bbm_GetAttribute("Life","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1697>";
	if(bbt_node.bbm_HasAttribute("LifeSpread")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1697>";
		this.bbm_LifeSpread2(parseFloat(bbt_node.bbm_GetAttribute("LifeSpread","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1698>";
	if(bbt_node.bbm_HasAttribute("Scale")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1698>";
		this.bbm_Scale(parseFloat(bbt_node.bbm_GetAttribute("Scale","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1699>";
	if(bbt_node.bbm_HasAttribute("ScaleSpread")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1699>";
		this.bbm_ScaleSpread2(parseFloat(bbt_node.bbm_GetAttribute("ScaleSpread","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1701>";
	if(bbt_node.bbm_HasAttribute("Rotation")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1701>";
		this.bbm_Rotation2(parseFloat(bbt_node.bbm_GetAttribute("Rotation","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1702>";
	if(bbt_node.bbm_HasAttribute("RotationRadians")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1702>";
		this.bbm_RotationRadians2(parseFloat(bbt_node.bbm_GetAttribute("RotationRadians","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1703>";
	if(bbt_node.bbm_HasAttribute("RotationSpread")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1703>";
		this.bbm_RotationSpread2(parseFloat(bbt_node.bbm_GetAttribute("RotationSpread","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1704>";
	if(bbt_node.bbm_HasAttribute("RotationSpreadRadians")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1704>";
		this.bbm_RotationSpreadRadians2(parseFloat(bbt_node.bbm_GetAttribute("RotationSpreadRadians","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1705>";
	if(bbt_node.bbm_HasAttribute("RotationSpeed")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1705>";
		this.bbm_RotationSpeed2(parseFloat(bbt_node.bbm_GetAttribute("RotationSpeed","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1706>";
	if(bbt_node.bbm_HasAttribute("RotationSpeedRadians")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1706>";
		this.bbm_RotationSpeedRadians2(parseFloat(bbt_node.bbm_GetAttribute("RotationSpeedRadians","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1707>";
	if(bbt_node.bbm_HasAttribute("RotationSpeedSpread")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1707>";
		this.bbm_RotationSpeedSpread2(parseFloat(bbt_node.bbm_GetAttribute("RotationSpeedSpread","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1708>";
	if(bbt_node.bbm_HasAttribute("RotationSpeedSpreadRadians")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1708>";
		this.bbm_RotationSpeedSpreadRadians2(parseFloat(bbt_node.bbm_GetAttribute("RotationSpeedSpreadRadians","")));
	}
	pop_err();
}
function bb_psystem_new8(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1168>";
	this.bb_deathEmitters=bb_collections_new3.call(new bb_collections_ArrayList);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1169>";
	this.bb_deathEmitterChances=bb_collections_new8.call(new bb_collections_FloatArrayList);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1170>";
	this.bbm_ReadXML(bbt_node);
	pop_err();
	return this;
}
bb_psystem_Emitter.prototype.bbm_Group=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<862>";
	pop_err();
	return this.bb_group;
}
bb_psystem_Emitter.prototype.bbm_Group2=function(bbt_group){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<865>";
	dbg_object(this).bb_group=bbt_group;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_ParticleImage=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<736>";
	pop_err();
	return this.bb_particleImage;
}
bb_psystem_Emitter.prototype.bbm_ParticleImage2=function(bbt_particleImage){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<739>";
	dbg_object(this).bb_particleImage=bbt_particleImage;
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_EmitAtAngleRadians=function(bbt_amount,bbt_emitX,bbt_emitY,bbt_emitAngle,bbt_group){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1414>";
	if(bbt_group==null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1414>";
		bbt_group=dbg_object(this).bb_group;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1416>";
	for(var bbt_i=0;bbt_i<bbt_amount;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1418>";
		var bbt_index=bbt_group.bbm_CreateParticle();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1420>";
		if(bbt_index<0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1420>";
			break;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1422>";
		var bbt_spawnAngle=bb_random_Rnd()*2.0*3.14159265;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1423>";
		var bbt_spawnDistance=this.bb_spawnMinRange+bb_random_Rnd()*(this.bb_spawnMaxRange-this.bb_spawnMinRange);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1424>";
		dbg_array(dbg_object(bbt_group).bb_x,bbt_index)[bbt_index]=bbt_emitX+Math.cos(bbt_spawnAngle)*bbt_spawnDistance
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1425>";
		dbg_array(dbg_object(bbt_group).bb_y,bbt_index)[bbt_index]=bbt_emitY+Math.sin(bbt_spawnAngle)*bbt_spawnDistance
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1426>";
		dbg_array(dbg_object(bbt_group).bb_usePolar,bbt_index)[bbt_index]=this.bb_usePolar
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1427>";
		if(this.bb_usePolar){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1429>";
			dbg_array(dbg_object(bbt_group).bb_polarVelocityAngle,bbt_index)[bbt_index]=bbt_emitAngle+this.bb_polarVelocityAngle-this.bb_polarVelocityAngleSpread*0.5+bb_random_Rnd()*this.bb_polarVelocityAngleSpread
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1430>";
			dbg_array(dbg_object(bbt_group).bb_polarVelocityAmplitude,bbt_index)[bbt_index]=this.bb_polarVelocityAmplitude-this.bb_polarVelocityAmplitudeSpread*0.5+bb_random_Rnd()*this.bb_polarVelocityAmplitudeSpread
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1431>";
			bbt_group.bbm_UpdateCartesian(bbt_index);
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1434>";
			dbg_array(dbg_object(bbt_group).bb_velocityX,bbt_index)[bbt_index]=this.bb_velocityX-this.bb_velocityXSpread*0.5+bb_random_Rnd()*this.bb_velocityXSpread
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1435>";
			dbg_array(dbg_object(bbt_group).bb_velocityY,bbt_index)[bbt_index]=this.bb_velocityY-this.bb_velocityYSpread*0.5+bb_random_Rnd()*this.bb_velocityYSpread
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1437>";
		dbg_array(dbg_object(bbt_group).bb_sourceEmitter,bbt_index)[bbt_index]=this
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1438>";
		dbg_array(dbg_object(bbt_group).bb_alive,bbt_index)[bbt_index]=true
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1439>";
		dbg_array(dbg_object(bbt_group).bb_life,bbt_index)[bbt_index]=this.bb_life-this.bb_lifeSpread*0.5+bb_random_Rnd()*this.bb_lifeSpread
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1440>";
		dbg_array(dbg_object(bbt_group).bb_rotation,bbt_index)[bbt_index]=this.bb_rotation-this.bb_rotationSpread*0.5+bb_random_Rnd()*this.bb_rotationSpread
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1441>";
		dbg_array(dbg_object(bbt_group).bb_rotationSpeed,bbt_index)[bbt_index]=this.bb_rotationSpeed-this.bb_rotationSpeedSpread*0.5+bb_random_Rnd()*this.bb_rotationSpeedSpread
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1442>";
		dbg_array(dbg_object(bbt_group).bb_scale,bbt_index)[bbt_index]=this.bb_scale-this.bb_scaleSpread*0.5+bb_random_Rnd()*this.bb_scaleSpread
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1445>";
		dbg_array(dbg_object(bbt_group).bb_particleImage,bbt_index)[bbt_index]=this.bb_particleImage
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1448>";
		dbg_array(dbg_object(bbt_group).bb_useHSB,bbt_index)[bbt_index]=this.bb_useHSB
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1449>";
		if(!this.bb_useHSB){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1451>";
			if(this.bb_minStartRed!=this.bb_maxStartRed){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1452>";
				dbg_array(dbg_object(bbt_group).bb_startRed,bbt_index)[bbt_index]=bb_math_Max(0,bb_math_Min(255,(((this.bb_minStartRed)+bb_random_Rnd()*(this.bb_maxStartRed-this.bb_minStartRed))|0)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1454>";
				dbg_array(dbg_object(bbt_group).bb_startRed,bbt_index)[bbt_index]=this.bb_minStartRed
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1456>";
			if(this.bb_minStartGreen!=this.bb_maxStartGreen){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1457>";
				dbg_array(dbg_object(bbt_group).bb_startGreen,bbt_index)[bbt_index]=bb_math_Max(0,bb_math_Min(255,(((this.bb_minStartGreen)+bb_random_Rnd()*(this.bb_maxStartRed-this.bb_minStartGreen))|0)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1459>";
				dbg_array(dbg_object(bbt_group).bb_startGreen,bbt_index)[bbt_index]=this.bb_minStartGreen
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1461>";
			if(this.bb_minStartBlue!=this.bb_maxStartBlue){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1462>";
				dbg_array(dbg_object(bbt_group).bb_startBlue,bbt_index)[bbt_index]=bb_math_Max(0,bb_math_Min(255,(((this.bb_minStartBlue)+bb_random_Rnd()*(this.bb_maxStartBlue-this.bb_minStartBlue))|0)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1464>";
				dbg_array(dbg_object(bbt_group).bb_startBlue,bbt_index)[bbt_index]=this.bb_minStartBlue
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1467>";
			dbg_array(dbg_object(bbt_group).bb_red,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_startRed,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1468>";
			dbg_array(dbg_object(bbt_group).bb_green,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_startGreen,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1469>";
			dbg_array(dbg_object(bbt_group).bb_blue,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_startBlue,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1472>";
			if(this.bb_minEndRed!=this.bb_maxEndRed){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1473>";
				dbg_array(dbg_object(bbt_group).bb_endRed,bbt_index)[bbt_index]=bb_math_Max(0,bb_math_Min(255,(((this.bb_minEndRed)+bb_random_Rnd()*(this.bb_maxEndRed-this.bb_minEndRed))|0)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1475>";
				dbg_array(dbg_object(bbt_group).bb_endRed,bbt_index)[bbt_index]=this.bb_minEndRed
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1477>";
			if(this.bb_minEndGreen!=this.bb_maxEndGreen){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1478>";
				dbg_array(dbg_object(bbt_group).bb_endGreen,bbt_index)[bbt_index]=bb_math_Max(0,bb_math_Min(255,(((this.bb_minEndGreen)+bb_random_Rnd()*(this.bb_maxEndRed-this.bb_minEndGreen))|0)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1480>";
				dbg_array(dbg_object(bbt_group).bb_endGreen,bbt_index)[bbt_index]=this.bb_minEndGreen
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1482>";
			if(this.bb_minEndBlue!=this.bb_maxEndBlue){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1483>";
				dbg_array(dbg_object(bbt_group).bb_endBlue,bbt_index)[bbt_index]=bb_math_Max(0,bb_math_Min(255,(((this.bb_minEndBlue)+bb_random_Rnd()*(this.bb_maxEndBlue-this.bb_minEndBlue))|0)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1485>";
				dbg_array(dbg_object(bbt_group).bb_endBlue,bbt_index)[bbt_index]=this.bb_minEndBlue
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1489>";
			if(dbg_array(dbg_object(bbt_group).bb_startRed,bbt_index)[bbt_index]==dbg_array(dbg_object(bbt_group).bb_endRed,bbt_index)[bbt_index]){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1490>";
				dbg_array(dbg_object(bbt_group).bb_redInterpolation,bbt_index)[bbt_index]=0
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1492>";
				dbg_array(dbg_object(bbt_group).bb_redInterpolation,bbt_index)[bbt_index]=this.bb_redInterpolation
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1493>";
				dbg_array(dbg_object(bbt_group).bb_redInterpolationTime,bbt_index)[bbt_index]=this.bb_redInterpolationTime
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1494>";
				if(dbg_array(dbg_object(bbt_group).bb_redInterpolationTime,bbt_index)[bbt_index]<0.0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1494>";
					dbg_array(dbg_object(bbt_group).bb_redInterpolationTime,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_life,bbt_index)[bbt_index]
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1495>";
				dbg_array(dbg_object(bbt_group).bb_redInterpolationTimeInv,bbt_index)[bbt_index]=1.0/dbg_array(dbg_object(bbt_group).bb_redInterpolationTime,bbt_index)[bbt_index]
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1497>";
			if(dbg_array(dbg_object(bbt_group).bb_startGreen,bbt_index)[bbt_index]==dbg_array(dbg_object(bbt_group).bb_endGreen,bbt_index)[bbt_index]){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1498>";
				dbg_array(dbg_object(bbt_group).bb_greenInterpolation,bbt_index)[bbt_index]=0
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1500>";
				dbg_array(dbg_object(bbt_group).bb_greenInterpolation,bbt_index)[bbt_index]=this.bb_greenInterpolation
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1501>";
				dbg_array(dbg_object(bbt_group).bb_greenInterpolationTime,bbt_index)[bbt_index]=this.bb_greenInterpolationTime
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1502>";
				if(dbg_array(dbg_object(bbt_group).bb_greenInterpolationTime,bbt_index)[bbt_index]<0.0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1502>";
					dbg_array(dbg_object(bbt_group).bb_greenInterpolationTime,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_life,bbt_index)[bbt_index]
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1503>";
				dbg_array(dbg_object(bbt_group).bb_greenInterpolationTimeInv,bbt_index)[bbt_index]=1.0/dbg_array(dbg_object(bbt_group).bb_greenInterpolationTime,bbt_index)[bbt_index]
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1505>";
			if(dbg_array(dbg_object(bbt_group).bb_startBlue,bbt_index)[bbt_index]==dbg_array(dbg_object(bbt_group).bb_endBlue,bbt_index)[bbt_index]){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1506>";
				dbg_array(dbg_object(bbt_group).bb_blueInterpolation,bbt_index)[bbt_index]=0
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1508>";
				dbg_array(dbg_object(bbt_group).bb_blueInterpolation,bbt_index)[bbt_index]=this.bb_blueInterpolation
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1509>";
				dbg_array(dbg_object(bbt_group).bb_blueInterpolationTime,bbt_index)[bbt_index]=this.bb_blueInterpolationTime
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1510>";
				if(dbg_array(dbg_object(bbt_group).bb_blueInterpolationTime,bbt_index)[bbt_index]<0.0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1510>";
					dbg_array(dbg_object(bbt_group).bb_blueInterpolationTime,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_life,bbt_index)[bbt_index]
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1511>";
				dbg_array(dbg_object(bbt_group).bb_blueInterpolationTimeInv,bbt_index)[bbt_index]=1.0/dbg_array(dbg_object(bbt_group).bb_blueInterpolationTime,bbt_index)[bbt_index]
			}
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1515>";
			if(this.bb_minStartHue!=this.bb_maxStartHue){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1516>";
				dbg_array(dbg_object(bbt_group).bb_startHue,bbt_index)[bbt_index]=bb_math_Max2(1.0,bb_math_Min2(1.0,this.bb_minStartHue+bb_random_Rnd()*(this.bb_maxStartHue-this.bb_minStartHue)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1518>";
				dbg_array(dbg_object(bbt_group).bb_startHue,bbt_index)[bbt_index]=this.bb_minStartHue
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1520>";
			if(this.bb_minStartSaturation!=this.bb_maxStartSaturation){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1521>";
				dbg_array(dbg_object(bbt_group).bb_startSaturation,bbt_index)[bbt_index]=bb_math_Max2(1.0,bb_math_Min2(1.0,this.bb_minStartSaturation+bb_random_Rnd()*(this.bb_maxStartHue-this.bb_minStartSaturation)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1523>";
				dbg_array(dbg_object(bbt_group).bb_startSaturation,bbt_index)[bbt_index]=this.bb_minStartSaturation
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1525>";
			if(this.bb_minStartBrightness!=this.bb_maxStartBrightness){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1526>";
				dbg_array(dbg_object(bbt_group).bb_startBrightness,bbt_index)[bbt_index]=bb_math_Max2(1.0,bb_math_Min2(1.0,this.bb_minStartBrightness+bb_random_Rnd()*(this.bb_maxStartBrightness-this.bb_minStartBrightness)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1528>";
				dbg_array(dbg_object(bbt_group).bb_startBrightness,bbt_index)[bbt_index]=this.bb_minStartBrightness
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1531>";
			dbg_array(dbg_object(bbt_group).bb_hue,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_startHue,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1532>";
			dbg_array(dbg_object(bbt_group).bb_saturation,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_startSaturation,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1533>";
			dbg_array(dbg_object(bbt_group).bb_brightness,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_startBrightness,bbt_index)[bbt_index]
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1536>";
			if(this.bb_minEndHue!=this.bb_maxEndHue){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1537>";
				dbg_array(dbg_object(bbt_group).bb_endHue,bbt_index)[bbt_index]=bb_math_Max2(1.0,bb_math_Min2(1.0,this.bb_minEndHue+bb_random_Rnd()*(this.bb_maxEndHue-this.bb_minEndHue)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1539>";
				dbg_array(dbg_object(bbt_group).bb_endHue,bbt_index)[bbt_index]=this.bb_minEndHue
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1541>";
			if(this.bb_minEndSaturation!=this.bb_maxEndSaturation){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1542>";
				dbg_array(dbg_object(bbt_group).bb_endSaturation,bbt_index)[bbt_index]=bb_math_Max2(1.0,bb_math_Min2(1.0,this.bb_minEndSaturation+bb_random_Rnd()*(this.bb_maxEndHue-this.bb_minEndSaturation)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1544>";
				dbg_array(dbg_object(bbt_group).bb_endSaturation,bbt_index)[bbt_index]=this.bb_minEndSaturation
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1546>";
			if(this.bb_minEndBrightness!=this.bb_maxEndBrightness){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1547>";
				dbg_array(dbg_object(bbt_group).bb_endBrightness,bbt_index)[bbt_index]=bb_math_Max2(1.0,bb_math_Min2(1.0,this.bb_minEndBrightness+bb_random_Rnd()*(this.bb_maxEndBrightness-this.bb_minEndBrightness)))
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1549>";
				dbg_array(dbg_object(bbt_group).bb_endBrightness,bbt_index)[bbt_index]=this.bb_minEndBrightness
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1553>";
			if(dbg_array(dbg_object(bbt_group).bb_startHue,bbt_index)[bbt_index]==dbg_array(dbg_object(bbt_group).bb_endHue,bbt_index)[bbt_index]){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1554>";
				dbg_array(dbg_object(bbt_group).bb_hueInterpolation,bbt_index)[bbt_index]=0
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1556>";
				dbg_array(dbg_object(bbt_group).bb_hueInterpolation,bbt_index)[bbt_index]=this.bb_hueInterpolation
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1557>";
				dbg_array(dbg_object(bbt_group).bb_hueInterpolationTime,bbt_index)[bbt_index]=this.bb_hueInterpolationTime
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1558>";
				if(dbg_array(dbg_object(bbt_group).bb_hueInterpolationTime,bbt_index)[bbt_index]<1.0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1558>";
					dbg_array(dbg_object(bbt_group).bb_hueInterpolationTime,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_life,bbt_index)[bbt_index]
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1559>";
				dbg_array(dbg_object(bbt_group).bb_hueInterpolationTimeInv,bbt_index)[bbt_index]=1.0/dbg_array(dbg_object(bbt_group).bb_hueInterpolationTime,bbt_index)[bbt_index]
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1561>";
			if(dbg_array(dbg_object(bbt_group).bb_startSaturation,bbt_index)[bbt_index]==dbg_array(dbg_object(bbt_group).bb_endSaturation,bbt_index)[bbt_index]){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1562>";
				dbg_array(dbg_object(bbt_group).bb_saturationInterpolation,bbt_index)[bbt_index]=0
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1564>";
				dbg_array(dbg_object(bbt_group).bb_saturationInterpolation,bbt_index)[bbt_index]=this.bb_saturationInterpolation
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1565>";
				dbg_array(dbg_object(bbt_group).bb_saturationInterpolationTime,bbt_index)[bbt_index]=this.bb_saturationInterpolationTime
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1566>";
				if(dbg_array(dbg_object(bbt_group).bb_saturationInterpolationTime,bbt_index)[bbt_index]<1.0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1566>";
					dbg_array(dbg_object(bbt_group).bb_saturationInterpolationTime,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_life,bbt_index)[bbt_index]
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1567>";
				dbg_array(dbg_object(bbt_group).bb_saturationInterpolationTimeInv,bbt_index)[bbt_index]=1.0/dbg_array(dbg_object(bbt_group).bb_saturationInterpolationTime,bbt_index)[bbt_index]
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1569>";
			if(dbg_array(dbg_object(bbt_group).bb_startBrightness,bbt_index)[bbt_index]==dbg_array(dbg_object(bbt_group).bb_endBrightness,bbt_index)[bbt_index]){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1570>";
				dbg_array(dbg_object(bbt_group).bb_brightnessInterpolation,bbt_index)[bbt_index]=0
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1572>";
				dbg_array(dbg_object(bbt_group).bb_brightnessInterpolation,bbt_index)[bbt_index]=this.bb_brightnessInterpolation
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1573>";
				dbg_array(dbg_object(bbt_group).bb_brightnessInterpolationTime,bbt_index)[bbt_index]=this.bb_brightnessInterpolationTime
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1574>";
				if(dbg_array(dbg_object(bbt_group).bb_brightnessInterpolationTime,bbt_index)[bbt_index]<1.0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1574>";
					dbg_array(dbg_object(bbt_group).bb_brightnessInterpolationTime,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_life,bbt_index)[bbt_index]
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1575>";
				dbg_array(dbg_object(bbt_group).bb_brightnessInterpolationTimeInv,bbt_index)[bbt_index]=1.0/dbg_array(dbg_object(bbt_group).bb_brightnessInterpolationTime,bbt_index)[bbt_index]
			}
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1580>";
		if(this.bb_minStartAlpha!=this.bb_maxStartAlpha){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1581>";
			dbg_array(dbg_object(bbt_group).bb_startAlpha,bbt_index)[bbt_index]=bb_math_Max2(0.0,bb_math_Min2(1.0,this.bb_minStartAlpha+bb_random_Rnd()*(this.bb_maxStartAlpha-this.bb_minStartAlpha)))
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1583>";
			dbg_array(dbg_object(bbt_group).bb_startAlpha,bbt_index)[bbt_index]=this.bb_minStartAlpha
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1585>";
		dbg_array(dbg_object(bbt_group).bb_alpha,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_startAlpha,bbt_index)[bbt_index]
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1586>";
		if(this.bb_minEndAlpha!=this.bb_maxEndAlpha){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1587>";
			dbg_array(dbg_object(bbt_group).bb_endAlpha,bbt_index)[bbt_index]=bb_math_Max2(0.0,bb_math_Min2(1.0,this.bb_minEndAlpha+bb_random_Rnd()*(this.bb_maxEndAlpha-this.bb_minEndAlpha)))
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1589>";
			dbg_array(dbg_object(bbt_group).bb_endAlpha,bbt_index)[bbt_index]=this.bb_minEndAlpha
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1591>";
		if(dbg_array(dbg_object(bbt_group).bb_startAlpha,bbt_index)[bbt_index]==dbg_array(dbg_object(bbt_group).bb_endAlpha,bbt_index)[bbt_index]){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1592>";
			dbg_array(dbg_object(bbt_group).bb_alphaInterpolation,bbt_index)[bbt_index]=0
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1594>";
			dbg_array(dbg_object(bbt_group).bb_alphaInterpolation,bbt_index)[bbt_index]=this.bb_alphaInterpolation
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1595>";
			dbg_array(dbg_object(bbt_group).bb_alphaInterpolationTime,bbt_index)[bbt_index]=this.bb_alphaInterpolationTime
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1596>";
			if(dbg_array(dbg_object(bbt_group).bb_alphaInterpolationTime,bbt_index)[bbt_index]<0.0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1596>";
				dbg_array(dbg_object(bbt_group).bb_alphaInterpolationTime,bbt_index)[bbt_index]=dbg_array(dbg_object(bbt_group).bb_life,bbt_index)[bbt_index]
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1597>";
			dbg_array(dbg_object(bbt_group).bb_alphaInterpolationTimeInv,bbt_index)[bbt_index]=1.0/dbg_array(dbg_object(bbt_group).bb_alphaInterpolationTime,bbt_index)[bbt_index]
		}
	}
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_EmitAt=function(bbt_amount,bbt_emitX,bbt_emitY,bbt_group){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1397>";
	this.bbm_EmitAtAngleRadians(bbt_amount,bbt_emitX,bbt_emitY,this.bb_angle,bbt_group);
	pop_err();
}
bb_psystem_Emitter.prototype.bbm_EmitAtAngle=function(bbt_amount,bbt_emitX,bbt_emitY,bbt_emitAngle,bbt_group){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<1409>";
	this.bbm_EmitAtAngleRadians(bbt_amount,bbt_emitX,bbt_emitY,bbt_emitAngle*0.017453292500000002,bbt_group);
	pop_err();
}
function bb_psystem_Force(){
	Object.call(this);
	this.bb_outDX=.0;
	this.bb_outDY=.0;
	this.bb_name="";
	this.bb_enabled=true;
	this.implments={bb_psystem_IPSReader:1};
}
function bb_psystem_new9(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2157>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_psystem_Force.prototype.bbm_Name=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2176>";
	pop_err();
	return this.bb_name;
}
bb_psystem_Force.prototype.bbm_Name2=function(bbt_name){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2179>";
	dbg_object(this).bb_name=bbt_name;
	pop_err();
}
bb_psystem_Force.prototype.bbm_Enabled=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2169>";
	pop_err();
	return this.bb_enabled;
}
bb_psystem_Force.prototype.bbm_Enabled2=function(bbt_enabled){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2172>";
	dbg_object(this).bb_enabled=bbt_enabled;
	pop_err();
}
bb_psystem_Force.prototype.bbm_ReadXML=function(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2184>";
	if(bbt_node.bbm_HasAttribute("Name")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2184>";
		this.bbm_Name2(bbt_node.bbm_GetAttribute("Name",""));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2185>";
	if(bbt_node.bbm_HasAttribute("Enabled")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2185>";
		this.bbm_Enabled2((bbt_node.bbm_GetAttribute("Enabled","")).length!=0);
	}
	pop_err();
}
bb_psystem_Force.prototype.bbm_Calculate=function(bbt_x,bbt_y){
}
function bb_psystem_ConstantForce(){
	bb_psystem_Force.call(this);
	this.bb_x=.0;
	this.bb_y=.0;
	this.implments={bb_psystem_IPSReader:1};
}
bb_psystem_ConstantForce.prototype=extend_class(bb_psystem_Force);
function bb_psystem_new10(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2213>";
	bb_psystem_new9.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2214>";
	dbg_object(this).bb_x=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2215>";
	dbg_object(this).bb_y=bbt_y;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2216>";
	dbg_object(this).bb_outDX=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2217>";
	dbg_object(this).bb_outDY=bbt_y;
	pop_err();
	return this;
}
bb_psystem_ConstantForce.prototype.bbm_X=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2198>";
	pop_err();
	return this.bb_x;
}
bb_psystem_ConstantForce.prototype.bbm_X2=function(bbt_x){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2201>";
	dbg_object(this).bb_x=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2202>";
	dbg_object(this).bb_outDX=bbt_x;
	pop_err();
}
bb_psystem_ConstantForce.prototype.bbm_Y=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2206>";
	pop_err();
	return this.bb_y;
}
bb_psystem_ConstantForce.prototype.bbm_Y2=function(bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2209>";
	dbg_object(this).bb_y=bbt_y;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2210>";
	dbg_object(this).bb_outDY=bbt_y;
	pop_err();
}
bb_psystem_ConstantForce.prototype.bbm_ReadXML=function(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2229>";
	bb_psystem_Force.prototype.bbm_ReadXML.call(this,bbt_node);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2230>";
	if(bbt_node.bbm_HasAttribute("X")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2230>";
		this.bbm_X2(parseFloat(bbt_node.bbm_GetAttribute("X","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2231>";
	if(bbt_node.bbm_HasAttribute("Y")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2231>";
		this.bbm_Y2(parseFloat(bbt_node.bbm_GetAttribute("Y","")));
	}
	pop_err();
}
function bb_psystem_new11(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2220>";
	bb_psystem_new9.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2221>";
	this.bbm_ReadXML(bbt_node);
	pop_err();
	return this;
}
function bb_psystem_new12(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2191>";
	bb_psystem_new9.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2191>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_psystem_ConstantForce.prototype.bbm_Calculate=function(bbt_x,bbt_y){
	push_err();
	pop_err();
}
function bb_psystem_PointForce(){
	bb_psystem_Force.call(this);
	this.bb_x=.0;
	this.bb_y=.0;
	this.bb_acceleration=.0;
	this.implments={bb_psystem_IPSReader:1};
}
bb_psystem_PointForce.prototype=extend_class(bb_psystem_Force);
function bb_psystem_new13(bbt_x,bbt_y,bbt_acceleration){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2263>";
	bb_psystem_new9.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2264>";
	dbg_object(this).bb_x=bbt_x;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2265>";
	dbg_object(this).bb_y=bbt_y;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2266>";
	dbg_object(this).bb_acceleration=bbt_acceleration;
	pop_err();
	return this;
}
bb_psystem_PointForce.prototype.bbm_X=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2243>";
	pop_err();
	return this.bb_x;
}
bb_psystem_PointForce.prototype.bbm_X2=function(bbt_x){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2246>";
	dbg_object(this).bb_x=bbt_x;
	pop_err();
}
bb_psystem_PointForce.prototype.bbm_Y=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2250>";
	pop_err();
	return this.bb_y;
}
bb_psystem_PointForce.prototype.bbm_Y2=function(bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2253>";
	dbg_object(this).bb_y=bbt_y;
	pop_err();
}
bb_psystem_PointForce.prototype.bbm_Acceleration=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2257>";
	pop_err();
	return this.bb_acceleration;
}
bb_psystem_PointForce.prototype.bbm_Acceleration2=function(bbt_acceleration){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2260>";
	dbg_object(this).bb_acceleration=bbt_acceleration;
	pop_err();
}
bb_psystem_PointForce.prototype.bbm_ReadXML=function(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2287>";
	bb_psystem_Force.prototype.bbm_ReadXML.call(this,bbt_node);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2288>";
	if(bbt_node.bbm_HasAttribute("X")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2288>";
		this.bbm_X2(parseFloat(bbt_node.bbm_GetAttribute("X","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2289>";
	if(bbt_node.bbm_HasAttribute("Y")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2289>";
		this.bbm_Y2(parseFloat(bbt_node.bbm_GetAttribute("Y","")));
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2290>";
	if(bbt_node.bbm_HasAttribute("Acceleration")){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2290>";
		this.bbm_Acceleration2(parseFloat(bbt_node.bbm_GetAttribute("Acceleration","")));
	}
	pop_err();
}
function bb_psystem_new14(bbt_node){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2269>";
	bb_psystem_new9.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2270>";
	this.bbm_ReadXML(bbt_node);
	pop_err();
	return this;
}
function bb_psystem_new15(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2235>";
	bb_psystem_new9.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2235>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_psystem_PointForce.prototype.bbm_Calculate=function(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2275>";
	if(bbt_x==dbg_object(this).bb_x && bbt_y==dbg_object(this).bb_y){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2276>";
		this.bb_outDX=0.0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2277>";
		this.bb_outDY=0.0;
		pop_err();
		return;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2280>";
	var bbt_length=Math.sqrt((bbt_x-dbg_object(this).bb_x)*(bbt_x-dbg_object(this).bb_x)+(bbt_y-dbg_object(this).bb_y)*(bbt_y-dbg_object(this).bb_y));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2281>";
	var bbt_scale=this.bb_acceleration/bbt_length;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2282>";
	this.bb_outDX=(dbg_object(this).bb_x-bbt_x)*bbt_scale;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2283>";
	this.bb_outDY=(dbg_object(this).bb_y-bbt_y)*bbt_scale;
	pop_err();
}
function bb_boxes_FloatObject(){
	Object.call(this);
	this.bb_value=.0;
}
bb_boxes_FloatObject.prototype.bbm_ToFloat=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/boxes.monkey<47>";
	pop_err();
	return this.bb_value;
}
function bb_collections_FloatArrayList(){
	bb_collections_ArrayList.call(this);
}
bb_collections_FloatArrayList.prototype=extend_class(bb_collections_ArrayList);
function bb_collections_new8(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<794>";
	bb_collections_new3.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<794>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_collections_FloatArrayList.prototype.bbm_Enumerator=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<813>";
	var bbt_=(bb_collections_new17.call(new bb_collections_FloatListEnumerator,(this)));
	pop_err();
	return bbt_;
}
function bb_math_Max(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<56>";
	if(bbt_x>bbt_y){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<56>";
		pop_err();
		return bbt_x;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<57>";
	pop_err();
	return bbt_y;
}
function bb_math_Max2(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<83>";
	if(bbt_x>bbt_y){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<83>";
		pop_err();
		return bbt_x;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<84>";
	pop_err();
	return bbt_y;
}
function bb_math_Min(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<51>";
	if(bbt_x<bbt_y){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<51>";
		pop_err();
		return bbt_x;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<52>";
	pop_err();
	return bbt_y;
}
function bb_math_Min2(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<78>";
	if(bbt_x<bbt_y){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<78>";
		pop_err();
		return bbt_x;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<79>";
	pop_err();
	return bbt_y;
}
function bb_functions_InterpolationFromString(bbt_interp){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<417>";
	if(bbt_interp=="" || bbt_interp=="none"){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<417>";
		pop_err();
		return 0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<418>";
	if(bbt_interp=="linear"){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<418>";
		pop_err();
		return 1;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<419>";
	if(bbt_interp=="inverselinear"){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<419>";
		pop_err();
		return 2;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<420>";
	if(bbt_interp=="halfsine"){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<420>";
		pop_err();
		return 3;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<421>";
	if(bbt_interp=="halfcosine"){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<421>";
		pop_err();
		return 4;
	}
	pop_err();
	return 0;
}
function bb_assert_AssertRangeInt(bbt_val,bbt_minbound,bbt_maxbound,bbt_msg){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/assert.monkey<89>";
	if(bbt_val<bbt_minbound || bbt_val>=bbt_maxbound){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/assert.monkey<89>";
		bb_assert_AssertError(bbt_msg+" "+String(bbt_val)+" is not "+String(bbt_minbound)+"<=val<"+String(bbt_maxbound));
	}
	pop_err();
}
var bb_globals_gPS;
var bb_globals_gGroupSmoke;
var bb_globals_gEmitterSmoke;
var bb_globals_gGroupExplosion;
var bb_globals_gEmitterExplosion;
function bb_game_screen_TankComparator(){
	bb_collections_AbstractComparator.call(this);
}
bb_game_screen_TankComparator.prototype=extend_class(bb_collections_AbstractComparator);
function bb_game_screen_new2(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<187>";
	bb_collections_new7.call(this);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<187>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_game_screen_TankComparator.prototype.bbm_Compare2=function(bbt_o1,bbt_o2){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<189>";
	var bbt_t1=object_downcast((bbt_o1),bb_tank_Tank);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<190>";
	var bbt_t2=object_downcast((bbt_o2),bb_tank_Tank);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<192>";
	if(dbg_object(dbg_object(bbt_t1).bb_position).bb_Y<dbg_object(dbg_object(bbt_t2).bb_position).bb_Y){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<192>";
		pop_err();
		return -1;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<193>";
	if(dbg_object(dbg_object(bbt_t1).bb_position).bb_Y>dbg_object(dbg_object(bbt_t2).bb_position).bb_Y){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<193>";
		pop_err();
		return 1;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/game_screen.monkey<194>";
	pop_err();
	return 0;
}
function bb_collections_DefaultComparator(){
	bb_collections_AbstractComparator.call(this);
}
bb_collections_DefaultComparator.prototype=extend_class(bb_collections_AbstractComparator);
function bb_collections_new9(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<112>";
	bb_collections_new7.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<112>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_collections_DefaultComparator.prototype.bbm_Compare2=function(bbt_o1,bbt_o2){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<116>";
	if(object_downcast((bbt_o1),bb_boxes_IntObject)!=null && object_downcast((bbt_o2),bb_boxes_IntObject)!=null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<117>";
		if(dbg_object(object_downcast((bbt_o1),bb_boxes_IntObject)).bb_value<dbg_object(object_downcast((bbt_o2),bb_boxes_IntObject)).bb_value){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<117>";
			pop_err();
			return -1;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<118>";
		if(dbg_object(object_downcast((bbt_o1),bb_boxes_IntObject)).bb_value>dbg_object(object_downcast((bbt_o2),bb_boxes_IntObject)).bb_value){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<118>";
			pop_err();
			return 1;
		}
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<119>";
		pop_err();
		return 0;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<120>";
		if(object_downcast((bbt_o1),bb_boxes_FloatObject)!=null && object_downcast((bbt_o2),bb_boxes_FloatObject)!=null){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<121>";
			if(dbg_object(object_downcast((bbt_o1),bb_boxes_FloatObject)).bb_value<dbg_object(object_downcast((bbt_o2),bb_boxes_FloatObject)).bb_value){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<121>";
				pop_err();
				return -1;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<122>";
			if(dbg_object(object_downcast((bbt_o1),bb_boxes_FloatObject)).bb_value>dbg_object(object_downcast((bbt_o2),bb_boxes_FloatObject)).bb_value){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<122>";
				pop_err();
				return 1;
			}
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<123>";
			pop_err();
			return 0;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<124>";
			if(object_downcast((bbt_o1),bb_boxes_StringObject)!=null && object_downcast((bbt_o2),bb_boxes_StringObject)!=null){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<125>";
				if(dbg_object(object_downcast((bbt_o1),bb_boxes_StringObject)).bb_value<dbg_object(object_downcast((bbt_o2),bb_boxes_StringObject)).bb_value){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<125>";
					pop_err();
					return -1;
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<126>";
				if(dbg_object(object_downcast((bbt_o1),bb_boxes_StringObject)).bb_value>dbg_object(object_downcast((bbt_o2),bb_boxes_StringObject)).bb_value){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<126>";
					pop_err();
					return 1;
				}
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<127>";
				pop_err();
				return 0;
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<129>";
	if(bbt_o1==bbt_o2){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<129>";
		pop_err();
		return 0;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<130>";
	if(bbt_o1==null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<130>";
		pop_err();
		return -1;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<131>";
	if(bbt_o2==null){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<131>";
		pop_err();
		return 1;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<132>";
	pop_err();
	return 0;
}
var bb_collections_DEFAULT_COMPARATOR;
function bb_collections_QuickSortPartition(bbt_arr,bbt_left,bbt_right,bbt_pivotIndex,bbt_comp,bbt_reverse){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1346>";
	var bbt_pivotValue=dbg_array(bbt_arr,bbt_pivotIndex)[bbt_pivotIndex];
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1347>";
	dbg_array(bbt_arr,bbt_pivotIndex)[bbt_pivotIndex]=dbg_array(bbt_arr,bbt_right)[bbt_right]
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1348>";
	dbg_array(bbt_arr,bbt_right)[bbt_right]=bbt_pivotValue
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1349>";
	var bbt_storeIndex=bbt_left;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1349>";
	var bbt_val=null;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1350>";
	for(var bbt_i=bbt_left;bbt_i<bbt_right;bbt_i=bbt_i+1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1351>";
		if(object_implements((dbg_array(bbt_arr,bbt_i)[bbt_i]),"bb_collections_IComparable")!=null){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1352>";
			if(!bbt_reverse && object_implements((dbg_array(bbt_arr,bbt_i)[bbt_i]),"bb_collections_IComparable").bbm_Compare3(bbt_pivotValue)<=0 || bbt_reverse && object_implements((dbg_array(bbt_arr,bbt_i)[bbt_i]),"bb_collections_IComparable").bbm_Compare3(bbt_pivotValue)>=0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1353>";
				bbt_val=dbg_array(bbt_arr,bbt_i)[bbt_i];
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1354>";
				dbg_array(bbt_arr,bbt_i)[bbt_i]=dbg_array(bbt_arr,bbt_storeIndex)[bbt_storeIndex]
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1355>";
				dbg_array(bbt_arr,bbt_storeIndex)[bbt_storeIndex]=bbt_val
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1356>";
				bbt_storeIndex+=1;
			}
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1359>";
			if(!bbt_reverse && bbt_comp.bbm_Compare2(dbg_array(bbt_arr,bbt_i)[bbt_i],bbt_pivotValue)<=0 || bbt_reverse && bbt_comp.bbm_Compare2(dbg_array(bbt_arr,bbt_i)[bbt_i],bbt_pivotValue)>=0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1360>";
				bbt_val=dbg_array(bbt_arr,bbt_i)[bbt_i];
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1361>";
				dbg_array(bbt_arr,bbt_i)[bbt_i]=dbg_array(bbt_arr,bbt_storeIndex)[bbt_storeIndex]
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1362>";
				dbg_array(bbt_arr,bbt_storeIndex)[bbt_storeIndex]=bbt_val
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1363>";
				bbt_storeIndex+=1;
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1367>";
	bbt_val=dbg_array(bbt_arr,bbt_storeIndex)[bbt_storeIndex];
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1368>";
	dbg_array(bbt_arr,bbt_storeIndex)[bbt_storeIndex]=dbg_array(bbt_arr,bbt_right)[bbt_right]
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1369>";
	dbg_array(bbt_arr,bbt_right)[bbt_right]=bbt_val
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1370>";
	pop_err();
	return bbt_storeIndex;
}
function bb_collections_QuickSort(bbt_arr,bbt_left,bbt_right,bbt_comp,bbt_reverse){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1337>";
	if(bbt_right>bbt_left){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1338>";
		var bbt_pivotIndex=bbt_left+(((bbt_right-bbt_left)/2)|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1339>";
		var bbt_pivotNewIndex=bb_collections_QuickSortPartition(bbt_arr,bbt_left,bbt_right,bbt_pivotIndex,bbt_comp,bbt_reverse);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1340>";
		bb_collections_QuickSort(bbt_arr,bbt_left,bbt_pivotNewIndex-1,bbt_comp,bbt_reverse);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<1341>";
		bb_collections_QuickSort(bbt_arr,bbt_pivotNewIndex+1,bbt_right,bbt_comp,bbt_reverse);
	}
	pop_err();
}
function bb_collections_AbstractEnumerator(){
	Object.call(this);
}
bb_collections_AbstractEnumerator.prototype.bbm_HasNext=function(){
}
bb_collections_AbstractEnumerator.prototype.bbm_NextObject=function(){
}
function bb_collections_new10(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<62>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_graphics_DrawImageRect(bbt_image,bbt_x,bbt_y,bbt_srcX,bbt_srcY,bbt_srcWidth,bbt_srcHeight,bbt_frame){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<492>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<494>";
	var bbt_f=dbg_array(dbg_object(bbt_image).bb_frames,bbt_frame)[bbt_frame];
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<496>";
	if((dbg_object(bb_graphics_context).bb_tformed)!=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<497>";
		bb_graphics_PushMatrix();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<500>";
		bb_graphics_Translate(-dbg_object(bbt_image).bb_tx+bbt_x,-dbg_object(bbt_image).bb_ty+bbt_y);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<502>";
		bb_graphics_ValidateMatrix();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<504>";
		dbg_object(bb_graphics_context).bb_device.DrawSurface2(dbg_object(bbt_image).bb_surface,0.0,0.0,bbt_srcX+dbg_object(bbt_f).bb_x,bbt_srcY+dbg_object(bbt_f).bb_y,bbt_srcWidth,bbt_srcHeight);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<506>";
		bb_graphics_PopMatrix();
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<508>";
		bb_graphics_ValidateMatrix();
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<511>";
		dbg_object(bb_graphics_context).bb_device.DrawSurface2(dbg_object(bbt_image).bb_surface,-dbg_object(bbt_image).bb_tx+bbt_x,-dbg_object(bbt_image).bb_ty+bbt_y,bbt_srcX+dbg_object(bbt_f).bb_x,bbt_srcY+dbg_object(bbt_f).bb_y,bbt_srcWidth,bbt_srcHeight);
	}
	pop_err();
	return 0;
}
function bb_graphics_DrawImageRect2(bbt_image,bbt_x,bbt_y,bbt_srcX,bbt_srcY,bbt_srcWidth,bbt_srcHeight,bbt_rotation,bbt_scaleX,bbt_scaleY,bbt_frame){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<517>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<519>";
	var bbt_f=dbg_array(dbg_object(bbt_image).bb_frames,bbt_frame)[bbt_frame];
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<521>";
	bb_graphics_PushMatrix();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<523>";
	bb_graphics_Translate(bbt_x,bbt_y);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<524>";
	bb_graphics_Rotate(bbt_rotation);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<525>";
	bb_graphics_Scale(bbt_scaleX,bbt_scaleY);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<527>";
	bb_graphics_Translate(-dbg_object(bbt_image).bb_tx,-dbg_object(bbt_image).bb_ty);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<529>";
	bb_graphics_ValidateMatrix();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<531>";
	dbg_object(bb_graphics_context).bb_device.DrawSurface2(dbg_object(bbt_image).bb_surface,0.0,0.0,bbt_srcX+dbg_object(bbt_f).bb_x,bbt_srcY+dbg_object(bbt_f).bb_y,bbt_srcWidth,bbt_srcHeight);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<533>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
function bb_graphics_GetColor(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<288>";
	var bbt_=[dbg_object(bb_graphics_context).bb_color_r,dbg_object(bb_graphics_context).bb_color_g,dbg_object(bb_graphics_context).bb_color_b];
	pop_err();
	return bbt_;
}
function bb_graphics_GetAlpha(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/mojo/graphics.monkey<297>";
	var bbt_=dbg_object(bb_graphics_context).bb_alpha;
	pop_err();
	return bbt_;
}
var bb_globals_gAlive;
function bb_math_Abs(bbt_x){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<46>";
	if(bbt_x>=0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<46>";
		pop_err();
		return bbt_x;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<47>";
	var bbt_=-bbt_x;
	pop_err();
	return bbt_;
}
function bb_math_Abs2(bbt_x){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<73>";
	if(bbt_x>=0.0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<73>";
		pop_err();
		return bbt_x;
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/monkey/math.monkey<74>";
	var bbt_=-bbt_x;
	pop_err();
	return bbt_;
}
function bb_functions_Interpolate(bbt_type,bbt_startValue,bbt_endValue,bbt_alpha){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<391>";
	var bbt_range=bbt_endValue-bbt_startValue;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<392>";
	var bbt_rv=0.0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<393>";
	var bbt_=bbt_type;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<394>";
	if(bbt_==1){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<395>";
		bbt_rv=bbt_startValue+bbt_range*bbt_alpha;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<397>";
		if(bbt_==2){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<398>";
			bbt_rv=bbt_startValue+bbt_range-bbt_range*bbt_alpha;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<400>";
			if(bbt_==3){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<401>";
				bbt_rv=bbt_startValue+bbt_range*Math.sin(bbt_alpha*3.14159265);
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<403>";
				if(bbt_==4){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<404>";
					bbt_rv=bbt_startValue+bbt_range*Math.cos(bbt_alpha*3.14159265);
				}
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<407>";
	if(bbt_startValue<bbt_endValue && bbt_rv<bbt_startValue || bbt_startValue>bbt_endValue && bbt_rv>bbt_startValue){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<408>";
		bbt_rv=bbt_startValue;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<409>";
		if(bbt_startValue<bbt_endValue && bbt_rv>bbt_endValue || bbt_startValue>bbt_endValue && bbt_rv<bbt_endValue){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<410>";
			bbt_rv=bbt_endValue;
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<412>";
	pop_err();
	return bbt_rv;
}
function bb_functions_HSBtoRGB(bbt_hue,bbt_saturation,bbt_brightness,bbt_rgbArray){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<427>";
	var bbt_r=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<427>";
	var bbt_g=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<427>";
	var bbt_b=0;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<428>";
	if(bbt_saturation==0.0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<429>";
		bbt_r=((bbt_brightness*255.0+0.5)|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<430>";
		bbt_g=bbt_r;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<431>";
		bbt_b=bbt_r;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<433>";
		var bbt_h=(bbt_hue-Math.floor(bbt_hue))*6.0;
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<434>";
		var bbt_f=bbt_h-Math.floor(bbt_h);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<435>";
		var bbt_p=bbt_brightness*(1.0-bbt_saturation);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<436>";
		var bbt_q=bbt_brightness*(1.0-bbt_saturation*bbt_f);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<437>";
		var bbt_t=bbt_brightness*(1.0-bbt_saturation*(1.0-bbt_f));
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<438>";
		var bbt_=((bbt_h)|0);
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<439>";
		if(bbt_==0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<440>";
			bbt_r=((bbt_brightness*255.0+0.5)|0);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<441>";
			bbt_g=((bbt_t*255.0+0.5)|0);
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<442>";
			bbt_b=((bbt_p*255.0+0.5)|0);
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<444>";
			if(bbt_==1){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<445>";
				bbt_r=((bbt_q*255.0+0.5)|0);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<446>";
				bbt_g=((bbt_brightness*255.0+0.5)|0);
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<447>";
				bbt_b=((bbt_p*255.0+0.5)|0);
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<449>";
				if(bbt_==2){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<450>";
					bbt_r=((bbt_p*255.0+0.5)|0);
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<451>";
					bbt_g=((bbt_brightness*255.0+0.5)|0);
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<452>";
					bbt_b=((bbt_t*255.0+0.5)|0);
				}else{
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<454>";
					if(bbt_==3){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<455>";
						bbt_r=((bbt_p*255.0+0.5)|0);
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<456>";
						bbt_g=((bbt_q*255.0+0.5)|0);
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<457>";
						bbt_b=((bbt_brightness*255.0+0.5)|0);
					}else{
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<459>";
						if(bbt_==4){
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<460>";
							bbt_r=((bbt_t*255.0+0.5)|0);
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<461>";
							bbt_g=((bbt_p*255.0+0.5)|0);
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<462>";
							bbt_b=((bbt_brightness*255.0+0.5)|0);
						}else{
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<464>";
							if(bbt_==5){
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<465>";
								bbt_r=((bbt_brightness*255.0+0.5)|0);
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<466>";
								bbt_g=((bbt_p*255.0+0.5)|0);
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<467>";
								bbt_b=((bbt_q*255.0+0.5)|0);
							}
						}
					}
				}
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<470>";
	if(bbt_rgbArray.length==3){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<471>";
		dbg_array(bbt_rgbArray,0)[0]=bbt_r
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<472>";
		dbg_array(bbt_rgbArray,1)[1]=bbt_g
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<473>";
		dbg_array(bbt_rgbArray,2)[2]=bbt_b
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/functions.monkey<475>";
	var bbt_2=-16777216|bbt_r<<16|bbt_g<<8|bbt_b<<0;
	pop_err();
	return bbt_2;
}
function bb_psystem_SafeATanr(bbt_dx,bbt_dy,bbt_def){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2305>";
	var bbt_angle=bbt_def;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2306>";
	if(bbt_dy==0.0 && bbt_dx>=0.0){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2307>";
		bbt_angle=0.0;
	}else{
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2308>";
		if(bbt_dy==0.0 && bbt_dx<0.0){
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2309>";
			bbt_angle=3.14159265;
		}else{
			err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2310>";
			if(bbt_dy>0.0 && bbt_dx==0.0){
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2311>";
				bbt_angle=1.5707963250000001;
			}else{
				err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2312>";
				if(bbt_dy<0.0 && bbt_dx==0.0){
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2313>";
					bbt_angle=4.7123889750000005;
				}else{
					err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2314>";
					if(bbt_dy>0.0 && bbt_dx>0.0){
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2315>";
						bbt_angle=Math.atan(bbt_dy/bbt_dx);
					}else{
						err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2316>";
						if(bbt_dy>0.0 && bbt_dx<0.0){
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2317>";
							bbt_angle=3.14159265-Math.atan(bbt_dy/-bbt_dx);
						}else{
							err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2318>";
							if(bbt_dy<0.0 && bbt_dx<0.0){
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2319>";
								bbt_angle=3.14159265+Math.atan(bbt_dy/bbt_dx);
							}else{
								err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2320>";
								if(bbt_dy<0.0 && bbt_dx>0.0){
									err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2321>";
									bbt_angle=6.2831853000000004-Math.atan(-bbt_dy/bbt_dx);
								}
							}
						}
					}
				}
			}
		}
	}
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/psystem.monkey<2323>";
	pop_err();
	return bbt_angle;
}
function bb_collections_ListEnumerator(){
	bb_collections_AbstractEnumerator.call(this);
	this.bb_lst=null;
	this.bb_expectedModCount=0;
	this.bb_index=0;
	this.bb_lastIndex=0;
}
bb_collections_ListEnumerator.prototype=extend_class(bb_collections_AbstractEnumerator);
function bb_collections_new11(bbt_lst){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<231>";
	bb_collections_new10.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<232>";
	dbg_object(this).bb_lst=bbt_lst;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<233>";
	this.bb_expectedModCount=dbg_object(bbt_lst).bb_modCount;
	pop_err();
	return this;
}
function bb_collections_new12(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<217>";
	bb_collections_new10.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<217>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_collections_ListEnumerator.prototype.bbm_CheckConcurrency=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<226>";
	if(dbg_object(this.bb_lst).bb_modCount!=this.bb_expectedModCount){
		err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<226>";
		bb_assert_AssertError("ListEnumerator.CheckConcurrency: Concurrent list modification");
	}
	pop_err();
}
bb_collections_ListEnumerator.prototype.bbm_HasNext=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<239>";
	this.bbm_CheckConcurrency();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<240>";
	var bbt_=this.bb_index<this.bb_lst.bbm_Size();
	pop_err();
	return bbt_;
}
bb_collections_ListEnumerator.prototype.bbm_NextObject=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<251>";
	this.bbm_CheckConcurrency();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<252>";
	this.bb_lastIndex=this.bb_index;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<253>";
	this.bb_index+=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<254>";
	var bbt_=this.bb_lst.bbm_Get2(this.bb_lastIndex);
	pop_err();
	return bbt_;
}
function bb_collections_ArrayListEnumerator(){
	bb_collections_ListEnumerator.call(this);
	this.bb_alst=null;
}
bb_collections_ArrayListEnumerator.prototype=extend_class(bb_collections_ListEnumerator);
function bb_collections_new13(bbt_lst){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<304>";
	bb_collections_new11.call(this,(bbt_lst));
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<305>";
	dbg_object(this).bb_alst=bbt_lst;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<306>";
	this.bb_expectedModCount=dbg_object(this.bb_alst).bb_modCount;
	pop_err();
	return this;
}
function bb_collections_new14(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<297>";
	bb_collections_new12.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<297>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
bb_collections_ArrayListEnumerator.prototype.bbm_HasNext=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<312>";
	this.bbm_CheckConcurrency();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<313>";
	var bbt_=this.bb_index<dbg_object(this.bb_alst).bb_size;
	pop_err();
	return bbt_;
}
bb_collections_ArrayListEnumerator.prototype.bbm_NextObject=function(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<318>";
	this.bbm_CheckConcurrency();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<319>";
	this.bb_lastIndex=this.bb_index;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<320>";
	this.bb_index+=1;
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<321>";
	var bbt_=(dbg_array(dbg_object(this.bb_alst).bb_elements,this.bb_lastIndex)[this.bb_lastIndex]);
	pop_err();
	return bbt_;
}
function bb_collections_IntListEnumerator(){
	bb_collections_ListEnumerator.call(this);
}
bb_collections_IntListEnumerator.prototype=extend_class(bb_collections_ListEnumerator);
function bb_collections_new15(bbt_lst){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<336>";
	bb_collections_new11.call(this,bbt_lst);
	pop_err();
	return this;
}
function bb_collections_new16(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<333>";
	bb_collections_new12.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<333>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_search_State(){
	Object.call(this);
	this.bb_x=0;
	this.bb_y=0;
	this.bb_key="";
	this.bb_cameFrom=null;
	this.bb_actionCost=.0;
	this.bb_cost=.0;
	this.bb_estimate=.0;
}
function bb_search_new3(bbt_x,bbt_y){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<221>";
	dbg_object(this).bb_x=bbt_x;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<222>";
	dbg_object(this).bb_y=bbt_y;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<224>";
	dbg_object(this).bb_key=String(bbt_x)+","+String(bbt_y);
	pop_err();
	return this;
}
function bb_search_new4(bbt_cameFrom,bbt_x,bbt_y,bbt_actionCost){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<228>";
	dbg_object(this).bb_x=bbt_x;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<229>";
	dbg_object(this).bb_y=bbt_y;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<231>";
	dbg_object(this).bb_key=String(bbt_x)+","+String(bbt_y);
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<233>";
	dbg_object(this).bb_cameFrom=bbt_cameFrom;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<234>";
	dbg_object(this).bb_actionCost=bbt_actionCost;
	pop_err();
	return this;
}
function bb_search_new5(){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/search.monkey<207>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bb_aitank_WrapValue(bbt_value){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<200>";
	var bbt_max=360.0;
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<201>";
	while(bbt_value>bbt_max){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<202>";
		bbt_value-=bbt_max;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<205>";
	while(bbt_value<0.0){
		err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<206>";
		bbt_value+=bbt_max;
	}
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<208>";
	pop_err();
	return bbt_value;
}
function bb_aitank_AngleDiff(bbt_actual,bbt_target){
	push_err();
	err_info="/Users/kerrw/Dropbox/game-development/itanks/aitank.monkey<213>";
	var bbt_=-1.0*(bb_aitank_WrapValue(bbt_actual+180.0-bbt_target)-180.0);
	pop_err();
	return bbt_;
}
function bb_collections_FloatListEnumerator(){
	bb_collections_ListEnumerator.call(this);
}
bb_collections_FloatListEnumerator.prototype=extend_class(bb_collections_ListEnumerator);
function bb_collections_new17(bbt_lst){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<358>";
	bb_collections_new11.call(this,bbt_lst);
	pop_err();
	return this;
}
function bb_collections_new18(){
	push_err();
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<355>";
	bb_collections_new12.call(this);
	err_info="/Users/kerrw/Downloads/MonkeyDemo45c/modules/diddy/collections.monkey<355>";
	var bbt_=this;
	pop_err();
	return bbt_;
}
function bbInit(){
	bb_graphics_context=null;
	bb_input_device=null;
	bb_audio_device=null;
	bb_app_device=null;
	bb_framework_game=null;
	bb_graphics_DefaultFlags=0;
	bb_graphics_renderDevice=null;
	bb_framework_DEVICE_WIDTH=0;
	bb_framework_DEVICE_HEIGHT=0;
	bb_framework_SCREEN_WIDTH=.0;
	bb_framework_SCREEN_HEIGHT=.0;
	bb_framework_SCREEN_WIDTH2=.0;
	bb_framework_SCREEN_HEIGHT2=.0;
	bb_framework_SCREENX_RATIO=1.0;
	bb_framework_SCREENY_RATIO=1.0;
	bb_random_Seed=1234;
	bb_framework_dt=null;
	bb_framework_MAX_PARTICLES=800;
	bb_framework_particles=new_object_array(bb_framework_MAX_PARTICLES);
	bb_framework_startTime=0;
	bb_framework_fpsCount=0;
	bb_framework_totalFPS=0;
	bb_framework_channel=0;
	bb_globals_gTitleScreen=null;
	bb_globals_gCreditsScreen=null;
	bb_globals_gHelpScreen=null;
	bb_globals_gGameScreen=null;
	bb_framework_path="sounds/";
	bb_list__sentinal=(new Object);
	bb_framework_playerChannelState=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	bb_globals_gGameOver=false;
	bb_globals_gWorld=null;
	bb_globals_gProjectileManager=null;
	bb_globals_gTanks=null;
	bb_globals_gPS=null;
	bb_globals_gGroupSmoke=null;
	bb_globals_gEmitterSmoke=null;
	bb_globals_gGroupExplosion=null;
	bb_globals_gEmitterExplosion=null;
	bb_collections_DEFAULT_COMPARATOR=bb_collections_new9.call(new bb_collections_DefaultComparator);
	bb_globals_gAlive=0;
}
//${TRANSCODE_END}
