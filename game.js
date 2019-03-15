const FPS = 30;
const SecondsBetweenFrames = 1 / FPS;
var Can;
var Cancon;

//Canvas Setup
Can = document.getElementById( "mycanvas" );
Cancon = Can.getContext( "2d" );
Can.style.cursor = "none";

const CanvasX = Can.width;
const CanvasY = Can.height;

//Overall Game State
//0 = menu, 1 = Generate Mase, 2 = Playablenessly, 3 = End, 4 = Death End
const StartGameState = 0;//Change to 0
var GameState = StartGameState;
var MenuSelection = 0;
var MenuUp = false;
var MenuDown = false;
var MenuEnter = false;
var MenuDelay = 0.0;
var DoMenuDelay = false;

//Mase Data
const MazeX = 11;
const MazeY = 11;
var Maze;
var MaseGraphics;

const MaxDisplay = 5; //Max / 2

//Levels
var MaxLvls = 5;
var CurrentLvl = 1;
const MaxAI = 5;//Times by MaxLvl later
var AILeft = MaxAI;

//Entities
var Player;

var AI;
var AIGraphics;

window.onload = function(){ ini(); }

function ini()
{
    MazeGraphics = new Object();
    MazeGraphics.Floor = new Image();
    MazeGraphics.Floor.src = "brickfloor.png";
    MazeGraphics.Entrance = new Image();
    MazeGraphics.Entrance.src = "bricksteps.png";
    MazeGraphics.Exit = new Image();
    MazeGraphics.Exit.src = "brickfloortrapdoor.png";
    MazeGraphics.ExitOpen = new Image();
    MazeGraphics.ExitOpen.src = "brickfloortrapdooropen.png";
    MazeGraphics.Wall = new Image();
    MazeGraphics.Wall.src = "brickwall.png";

    MazeGraphics.WallEleOne = new Image();
    MazeGraphics.WallEleOne.src = "brickwallfrontred.png";

    MazeGraphics.WallEleTwo = new Image();
    MazeGraphics.WallEleTwo.src = "brickwallfrontgreen.png";

    MazeGraphics.WallEleThree = new Image();
    MazeGraphics.WallEleThree.src = "brickwallfrontblue.png";

    //Player Data
    Player = new Object();
    Player.Health = 100;

    //Player Start and Entrance
    Player.X = Math.floor( ( Math.random() * ( MazeX - 1 ) ) );
    Player.Y = Math.floor( ( Math.random() * ( MazeY - 1 ) ) );

    //Movement Control States and Data
    Player.Delay = 0.0;
    Player.DoDelay = false;

	Player.Up = false;	
    Player.Left = false;
	Player.Down = false;	
    Player.Right = false;
    
    //Ele Control States and Data
    //0 = Red Element, 1 = Green Element, 2 = Blue Element
    Player.Element = 0;

    Player.SwitchEleOne = false;
	Player.SwitchEleTwo = false;	
    Player.SwitchEleThree = false;

    Player.EleDelay = 0.0;
    Player.DoEleDelay = false;

    Player.FrontImage = new Object();
    Player.OtherSidesImage = new Object();
   
    Player.FrontImage.EleOne = new Image();
    Player.FrontImage.EleOne.src = "playerfrontred.png";

    Player.OtherSidesImage.EleOne = new Image();
    Player.OtherSidesImage.EleOne.src = "playerothersidesred.png";

    Player.FrontImage.EleTwo = new Image();
    Player.FrontImage.EleTwo.src = "playerfrontgreen.png";

    Player.OtherSidesImage.EleTwo = new Image();
    Player.OtherSidesImage.EleTwo.src = "playerothersidesgreen.png";

    Player.FrontImage.EleThree = new Image();
    Player.FrontImage.EleThree.src = "playerfrontblue.png";

    Player.OtherSidesImage.EleThree = new Image();
    Player.OtherSidesImage.EleThree.src = "playerothersidesblue.png";

    //0 = up, 1 = right, 2 = down, 3 = left
    Player.FacingDirection = 0;

    //Damage
    Player.DamageDelay = 0.0;
    Player.DoDamageDelay = false;

    AIGraphics = new Object();
     
    AIGraphics.Body = new Image();
    AIGraphics.Body.src = "enemydummy.png";

    AIGraphics.Bodyfire = new Image();
    AIGraphics.Bodyfire.src = "enemyfire.png";

    AIGraphics.Bullet = new Image();
    AIGraphics.Bullet.src = "beam.png";

    
	//SetGameLoop
	setInterval( Gameloop, ( SecondsBetweenFrames * 1000 ) );
}

function GenerateMazePath( X, Y ) 
{
    //Generate order list
    var DirList = new Array();
    DirList.length = 4;
    DirList[0] = 1;
    DirList[1] = 2;
    DirList[2] = 3;
    DirList[3] = 4;

    //Shuffle order list
    var TmpNum = Math.floor( ( Math.random() * 20 ) + 8 );
    for( var i = 0; i < TmpNum; i++ )
    {
        var TmpNumTwo = Math.floor( ( Math.random() * 4 ) );
        var TmpNumThree = Math.floor( ( Math.random() * 4 ) );
        var TmpNumFour = DirList[TmpNumTwo];
        DirList[TmpNumTwo] = DirList[TmpNumThree];
        DirList[TmpNumThree] = TmpNumFour;
    } 

    //Create path, check cell nabour based on order list
    for( var i = 0; i < 4; i++ )
    {
        //Up
        if( DirList[i] == 1 )
        {
            if( Y > 1 )
            {  
                if( !Maze[X][Y-2].Visited )
                {  
                    Maze[X][Y-1].Data = 1;
                    Maze[X][Y-1].Visited = true;
                    Maze[X][Y-2].Data = 1;
                    Maze[X][Y-2].Visited = true;
                    GenerateMazePath( X, Y - 2 );
                }
            }
        }

        //Right
        if( DirList[i] == 2 )
        {
            if( X < ( ( ( MazeX - 1 ) * CurrentLvl ) - 1 ) )
            {  
                if( !Maze[X+2][Y].Visited )
                {  
                    Maze[X+1][Y].Data = 1;
                    Maze[X+1][Y].Visited = true;
                    Maze[X+2][Y].Data = 1;
                    Maze[X+2][Y].Visited = true;
                    GenerateMazePath( X + 2, Y );
                }
            }
        }

        //Down
        if( DirList[i] == 3 )
        {
            if( Y < ( ( ( MazeY - 1 ) * CurrentLvl ) - 1 ) )
            { 
                if( !Maze[X][Y+2].Visited )
                {  
                    Maze[X][Y+1].Data = 1;
                    Maze[X][Y+1].Visited = true;
                    Maze[X][Y+2].Data = 1;
                    Maze[X][Y+2].Visited = true;
                    GenerateMazePath( X , Y + 2 );
                }
            }
        }
            

        //Left
        if( DirList[i] == 4 )
        {
            if( X > 1 )
            { 
                if( !Maze[X-2][Y].Visited )
                {  
                    Maze[X-1][Y].Data = 1;
                    Maze[X-1][Y].Visited = true;
                    Maze[X-2][Y].Data = 1;
                    Maze[X-2][Y].Visited = true;
                    GenerateMazePath( X - 2, Y );
                }
            }
        }
    }
}

function Gameloop()
{
    //Menu
    if( GameState == 0 )////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        //Background
	    Cancon.fillStyle="#000000";
	    Cancon.fillRect( 0, 0, CanvasX, CanvasY );
	    Cancon.save();

        Cancon.font = "20px Arial";
        
        if( !DoMenuDelay )
        { 
            if( MenuUp )
            { 
                if( !( MenuSelection == 0 ) )
                { 
                    MenuSelection--;
                }
                MenuUp = false;
                DoMenuDelay = true;
                MenuDelay = 0.0;
            }
            if( MenuDown )
            { 
                if( !( MenuSelection == 2 ) )
                { 
                    MenuSelection++;
                } 
                MenuDown = false;
                DoMenuDelay = true;
                MenuDelay = 0.0;
            }
            if( MenuEnter )
            { 
                if( MenuSelection == 0 ){ GameState = 1; MaxLvls = 5; }
                if( MenuSelection == 1 ){ GameState = 1; MaxLvls = 10; }
                if( MenuSelection == 2 ){ GameState = 1; MaxLvls = 20; }
                MenuEnter = false;
                DoMenuDelay = true;
                MenuDelay = 0.0;
            }
        }
        else
        {
            MenuDelay += SecondsBetweenFrames;
            if( MenuDelay > 0.5 ){ DoMenuDelay = false; }
            MenuUp = false;
            MenuDown = false;
            MenuEnter = false;
        }

        Cancon.fillStyle = "#EFC442"; Cancon.fillText( "Controls: WASD: To Move, 123: To Switch Element, Enter: Confirm Menu Item" , 50, 100 );
        Cancon.fillStyle = "#EFC442"; Cancon.fillText( "How To Play: Navagate the level, Advance to the next level by getting rid of the" , 50, 120 );
        Cancon.fillStyle = "#EFC442"; Cancon.fillText( "enemy to open the next level. Get rid of enemys by moving over them, how ever" , 50, 140 );
        Cancon.fillStyle = "#EFC442"; Cancon.fillText( "don't approach them from the front. You can hide in elemental walls however " , 50, 160 );
        Cancon.fillStyle = "#EFC442"; Cancon.fillText( "if you are not the same element you will take damage." , 50, 180 );


        if( MenuSelection == 0 ){ Cancon.fillStyle = "#C90022"; Cancon.fillText(  " 5 Levels" , 350, 400 ); }
        else{ Cancon.fillStyle = "#EFC442"; Cancon.fillText( " 5 Levels" , 350, 400 ); }

        if( MenuSelection == 1 ){ Cancon.fillStyle = "#C90022"; Cancon.fillText( "10 Levels" , 350, 430 ); }
        else{ Cancon.fillStyle = "#EFC442"; Cancon.fillText( "10 Levels" , 350, 430 ); }

        if( MenuSelection == 2 ){ Cancon.fillStyle = "#C90022"; Cancon.fillText( "20 Levels" , 350, 460 ); }
        else{ Cancon.fillStyle = "#EFC442"; Cancon.fillText( "20 Levels" , 350, 460 ); }


    }////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Generate Maze
    else if( GameState == 1 )//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        Player.Health = 100;

        //Player Start and Entrance
        Player.X = Math.floor( ( Math.random() * ( MazeX - 1 ) ) );
        Player.Y = Math.floor( ( Math.random() * ( MazeY - 1 ) ) );

        //Movement Control States and Data
        Player.Delay = 0.0;
        Player.DoDelay = false;

	    Player.Up = false;	
        Player.Left = false;
	    Player.Down = false;	
        Player.Right = false;
    
        //Ele Control States and Data
        //0 = Red Element, 1 = Green Element, 2 = Blue Element
        Player.Element = 0;

        Player.SwitchEleOne = false;
	    Player.SwitchEleTwo = false;	
        Player.SwitchEleThree = false;

        //0 = up, 1 = right, 2 = down, 3 = left
        Player.FacingDirection = 0;

        //Damage
        Player.DamageDelay = 0.0;
        Player.DoDamageDelay = false;


        //Lvl Setup
        AILeft = ( MaxAI * CurrentLvl );

        //Maze Initialisation
        Maze = new Array();
        Maze.length = ( ( ( MazeY - 1 ) * CurrentLvl ) + 1 );
        for( var i = 0; i < ( ( ( MazeX - 1 ) * CurrentLvl ) + 1 ); i++ )
        {
            Maze[i] = new Array();
            Maze[i].length = ( ( ( MazeX - 1 ) * CurrentLvl ) + 1 );
            for( var j = 0; j < ( ( ( MazeY - 1 ) * CurrentLvl ) + 1 ); j++ )
            {
                //0 = Wall, 1 = Empty, 2 = Element 1, 3 = Element 2, 4 = Element 3, 5 = Entrance, 6 = Exit
                Maze[i][j] = new Object();
                Maze[i][j].Data = 0;
                Maze[i][j].Visited = false;
            }
        }

        //Maze Generation

        //Set Entrance
        Maze[Player.X][Player.Y].Visited = true;
        Maze[Player.X][Player.Y].Data = 5;

        //Recersive Mase Generation
        GenerateMazePath( Player.X, Player.Y );

        //Random Exit( Trys until it can find a path )
        var Done = false;
        var TX;
        var TY;
        while( !Done )
        {
           TX = Math.floor( ( Math.random() * ( ( MazeX - 1 ) * CurrentLvl ) ) );
           TY = Math.floor( ( Math.random() * ( ( MazeY - 1 ) * CurrentLvl ) ) );
           if( Maze[TX][TY].Data == 1 )
           {
               Maze[TX][TY].Data = 6;
               Done = true;
           }
        }

        //Elemental Wall( Generates elemental walls on walls based on a chance ) 
        for( var i = 0; i < ( ( MazeX - 1 ) * CurrentLvl ); i++ )
        {
            for( var j = 0; j < ( ( MazeY - 1 ) * CurrentLvl ); j++ )
            {
                //0 = Wall, 1 = Empty, 2 = Element 1, 3 = Element 2, 4 = Element 3, 5 = Entrance, 6 = Exit
                if( Maze[i][j].Data == 0 )
                {
                    //1 to 55 = wall, 56 to 70 = Ele 1, 71 to 85 = Ele 2, 86 to 100 = Ele 3;
                    var RandomPercent = Math.floor( ( ( Math.random() * 100 ) + 1 ) );
                
                    //Stay Wall
                    //if( RandomPercent < 55 )
                    //{
                    //  
                    //}

                    if( RandomPercent > 55 && RandomPercent <= 70 )
                    {
                        Maze[i][j].Data = 2;
                    }

                    if( RandomPercent > 70 && RandomPercent <= 85 )
                    {
                        Maze[i][j].Data = 3;
                    }

                    if( RandomPercent > 85 && RandomPercent <= 100 )
                    {
                        Maze[i][j].Data = 4;
                    }
                }
            }
        }

        //AI Setup
        AI = new Array();
        AI.length = ( MaxAI * CurrentLvl );

        for( var i = 0; i < ( MaxAI * CurrentLvl ); i++ )
        {
            AI[i] = new Object();
            AI[i].Dead = false;
            //0 = up, 1 = right, 2 = down, 3 = left
            AI[i].Direction = 0;
            AI[i].ShootDelay = 0.0;
            AI[i].DoShootDelay = false;
            AI[i].Shooting = false;
            Done = false;
            while( !Done )
            {
               TX = Math.floor( ( Math.random() * ( ( MazeX - 1 ) * CurrentLvl ) ) );
               TY = Math.floor( ( Math.random() * ( ( MazeX - 1 ) * CurrentLvl ) ) );
               if( Maze[TX][TY].Data == 1 )
               {
                   AI[i].X = TX;
                   AI[i].Y = TY;
                   Done = true;
               }
            }
            AI[i].Delay = 0.0;
            AI[i].MyDelay = Math.floor( ( Math.random() * 5  ) + 3 );
            AI[i].DoDelay = false;
        }

        //Start Game
        GameState = 2;
    }/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Main Game
    else if( GameState == 2 )///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        //Background
	    Cancon.fillStyle="#000000";
	    Cancon.fillRect( 0, 0, CanvasX, CanvasY );
	    Cancon.save();

        //Player Movements
        if( Maze[Player.X][Player.Y].Data == 6 )
        {
            if( AILeft < 1 )
            {
                CurrentLvl++;
                if( CurrentLvl > 5 )
                {
                    GameState = 3;
                }
                else
                {
                    GameState = 1;
                }
            }
        }

        if( !Player.DoDelay )
        { 
            if( Player.Up )
	        { 
                if( ( Player.Y < ( ( MazeY - 1 ) * CurrentLvl ) ) )
                {
                    if( Maze[Player.X][Player.Y+1].Data > 0 )
                    {
                        Player.Y++;
                        Player.Delay = 0.0;
                        Player.DoDelay = true;
                        Player.FacingDirection = 0;
                    }
                }   
            }

            if( Player.Down )
	        { 
                if( ( Player.Y > 0 ) )
                {
                    if( Maze[Player.X][Player.Y-1].Data > 0 )
                    { 
                        Player.Y--;
                        Player.Delay = 0.0;
                        Player.DoDelay = true;
                        Player.FacingDirection = 2;
                    }
                } 
            }

            if( Player.Left )
	        { 
                 if( ( Player.X < ( ( MazeX - 1 ) * CurrentLvl ) ) )
                {
                    if( Maze[Player.X+1][Player.Y].Data > 0 )
                    {
                        Player.X++;
                        Player.Delay = 0.0;
                        Player.DoDelay = true;
                        Player.FacingDirection = 3;
                    }
                } 
            }

            if( Player.Right )
	        { 
                if( ( Player.X > 0 ) )
                {
                    if( Maze[Player.X-1][Player.Y].Data > 0 )
                    { 
                        Player.X--;
                        Player.Delay = 0.0;
                        Player.DoDelay = true;
                        Player.FacingDirection = 1;
                    }
                } 
            }
        }
        else if( Player.DoDelay )
        {
            Player.Delay += SecondsBetweenFrames;
            if( Player.Delay > 0.2 )
            {
                Player.Delay = 0.0;
                Player.DoDelay = false;
            }
        }

        //Ele Switching
        if( !Player.DoEleDelay )
        { 
            if( Player.SwitchEleOne )
            {
                Player.Element = 0;
                Player.EleDelay = 0.0;
                Player.DoEleDelay = true;
            }

            if( Player.SwitchEleTwo )
            {
                Player.Element = 1;
                Player.EleDelay = 0.0;
                Player.DoEleDelay = true;
            }

            if( Player.SwitchEleThree )
            {
                Player.Element = 2;
                Player.EleDelay = 0.0;
                Player.DoEleDelay = true;
            }
        }
        else if( Player.DoEleDelay )
        {
            Player.EleDelay += SecondsBetweenFrames;
            if( Player.EleDelay > 1.0 )
            {
                Player.EleDelay = 0.0;
                Player.DoEleDelay = false;
            }
        }

        //Player Wall Detect
        //0 = Red Element, 1 = Green Element, 2 = Blue Element
        //0 = Wall, 1 = Empty, 2 = Element 1, 3 = Element 2, 4 = Element 3, 5 = Entrance, 6 = Exit

        //Red
        if( Player.Element == 0 && ( Maze[Player.X][Player.Y].Data == 3 || Maze[Player.X][Player.Y].Data == 4 )  )
        {
            if( !Player.DoDamageDelay )
            {
                Player.Health -= 5;
                Player.DoDamageDelay = true;
            }
        }

        if( Player.Element == 1 && ( Maze[Player.X][Player.Y].Data == 2 || Maze[Player.X][Player.Y].Data == 4 )  )
        {
            if( !Player.DoDamageDelay )
            {
                Player.Health -= 5;
                Player.DoDamageDelay = true;
            }
        }

        if( Player.Element == 2 && ( Maze[Player.X][Player.Y].Data == 2 || Maze[Player.X][Player.Y].Data == 3 )  )
        {
            if( !Player.DoDamageDelay )
            {
                Player.Health -= 5;
                Player.DoDamageDelay = true;
            }
        }

        if( Player.DoDamageDelay )
        {
            Player.DamageDelay += SecondsBetweenFrames;
            if( Player.DamageDelay > 1.0 )
            {
                Player.DamageDelay = 0.0;
                Player.DoDamageDelay = false;
            }
        }

        if( Player.Health < 1 )
        {
            GameState = 4;
        }


        //AI - Movement and Detection
    
        for( var i = 0; i < ( MaxAI * CurrentLvl ); i++ )
        {
            if
            ( 
                ( AI[i].X == Player.X ) 
                && ( AI[i].Y == Player.Y ) 
                && !AI[i].Dead 
            ) //If Player is ontop of Ai
            {
                AI[i].Dead = true;
                AILeft--;
            }

            if( AI[i].DoShootDelay )
            {
                if( AI[i].ShootDelay > 0.5 ){ AI[i].Shooting = false; }
                if( AI[i].ShootDelay > 1.0 )
                {
                    AI[i].DoShootDelay = false;
                    AI[i].ShootDelay = 0.0;
                }
                AI[i].ShootDelay += SecondsBetweenFrames;
            }

            if( !AI[i].Dead )
            {
                //Detect
                if( AI[i].Direction == 0 )
                {
                    for( var j = 1; j < 3; j++ )
                    { 
                        if( !( ( AI[i].Y + j ) > ( ( MazeY - 1 ) * CurrentLvl ) ) )
                        {
                            if( Maze[AI[i].X][AI[i].Y+j].Data == 1 || Maze[AI[i].X][AI[i].Y+j].Data == 5 || Maze[AI[i].X][AI[i].Y+j].Data == 6 )
                            {
                                if( Player.X == AI[i].X && Player.Y == ( AI[i].Y + j ) )
                                {
                                    if( !AI[i].DoShootDelay )
                                    {
                                        Player.Health -= 75;
                                        AI[i].DoShootDelay = true;
                                        AI[i].Shooting = true;
                                        AI[i].ShootDelay = 0.0;
                                    }
                                }
                            }
                            else 
                            {
                                j = 10;
                            }
                        }
                    }
                }
                if( AI[i].Direction == 1 )
                {
                    for( var j = 1; j < 3; j++ )
                    {
                        if( !( ( AI[i].X - j ) < 0 ) )
                        {
                            if( Maze[AI[i].X-j][AI[i].Y].Data == 1 || Maze[AI[i].X-j][AI[i].Y].Data == 5 || Maze[AI[i].X-j][AI[i].Y].Data == 6 )
                            {
                                if( Player.X == ( AI[i].X - j ) && Player.Y == AI[i].Y )
                                {
                                    if( !AI[i].DoShootDelay )
                                    {
                                        Player.Health -= 75;
                                        AI[i].DoShootDelay = true;
                                        AI[i].Shooting = true;
                                        AI[i].ShootDelay = 0.0;
                                    }
                                }
                            }
                            else 
                            {
                                j = 10;
                            }
                        } 
                    }
                }
                if( AI[i].Direction == 2 )
                {
                    for( var j = 1; j < 3; j++ )
                    {
                        if( !( ( AI[i].Y - j ) < 0 ) )
                        {
                            if( Maze[AI[i].X][AI[i].Y-j].Data == 1 || Maze[AI[i].X][AI[i].Y-j].Data == 5 || Maze[AI[i].X][AI[i].Y-j].Data == 6 )
                            {
                                if( Player.X == AI[i].X && Player.Y == ( AI[i].Y - j ) )
                                {
                                    if( !AI[i].DoShootDelay )
                                    {
                                        Player.Health -= 75;
                                        AI[i].DoShootDelay = true;
                                        AI[i].Shooting = true;
                                        AI[i].ShootDelay = 0.0;
                                    }
                                }
                            }
                            else 
                            {
                                j = 10;
                            }
                        }
                    }
                }
                if( AI[i].Direction == 3 )
                {
                    for( var j = 1; j < 3; j++ )
                    {
                        if( !( ( AI[i].X + j ) > ( ( MazeX - 1 ) * CurrentLvl ) ) )
                        {
                            if( Maze[AI[i].X+j][AI[i].Y].Data == 1 || Maze[AI[i].X+j][AI[i].Y].Data == 5 || Maze[AI[i].X+j][AI[i].Y].Data == 6 )
                            {
                                if( Player.X == ( AI[i].X + j ) && Player.Y == AI[i].Y )
                                {
                                    if( !AI[i].DoShootDelay )
                                    {
                                        Player.Health -= 75;
                                        AI[i].DoShootDelay = true;
                                        AI[i].Shooting = true;
                                        AI[i].ShootDelay = 0.0;
                                    }
                                }
                            }
                            else 
                            {
                                j = 10;
                            }
                        }
                    }
                }
                if( AI[i].DoDelay )
                {
                    AI[i].Delay += SecondsBetweenFrames;
                    if( AI[i].Delay > AI[i].MyDelay )
                    {
                        AI[i].Delay = 0.0;
                        AI[i].DoDelay = false
                    }
                }
                else
                {
                    var Done = false;
                    while( !Done )
                    {
                        var Tmp = Math.floor( ( Math.random() * 4 ) + 1 )
                        //Up
                        if( Tmp == 1 )
                        {
                            if( AI[i].Y > 0 )
                            {
                                if( Maze[AI[i].X][AI[i].Y-1].Data == 1 )
                                {
                                    Done = true;
                                    AI[i].Y--;
                                    AI[i].Delay = 0.0;
                                    AI[i].MyDelay = Math.floor( ( Math.random() * 5  ) + 1 );
                                    AI[i].DoDelay = true;
                                    AI[i].Direction = 2;
                                }
                            }
                        }

                        //Right
                        if( Tmp == 2 )
                        {
                            if( AI[i].X < ( ( MazeX - 1 ) * CurrentLvl ) )
                            {
                                if( Maze[AI[i].X+1][AI[i].Y].Data == 1 )
                                {
                                    Done = true;
                                    AI[i].X++;
                                    AI[i].Delay = 0.0;
                                    AI[i].MyDelay = Math.floor( ( Math.random() * 5  ) + 1 );
                                    AI[i].DoDelay = true;
                                    AI[i].Direction = 3;
                                }
                            }
                        }

                        //Down
                        if( Tmp == 3 )
                        {
                            if( AI[i].Y < ( ( MazeY - 1 ) * CurrentLvl ) )
                            {
                                if( Maze[AI[i].X][AI[i].Y+1].Data == 1 )
                                {
                                    Done = true;
                                    AI[i].Y++;
                                    AI[i].Delay = 0.0;
                                    AI[i].MyDelay = Math.floor( ( Math.random() * 5  ) + 1 );
                                    AI[i].DoDelay = true;
                                    AI[i].Direction = 0;
                                }
                            }
                        }

                        //Left
                        if( Tmp == 4 )
                        {
                            if( AI[i].X > 0 )
                            {
                                if( Maze[AI[i].X-1][AI[i].Y].Data == 1 )
                                {
                                    Done = true;
                                    AI[i].X--;
                                    AI[i].Delay = 0.0;
                                    AI[i].MyDelay = Math.floor( ( Math.random() * 5  ) + 1 );
                                    AI[i].DoDelay = true;
                                    AI[i].Direction = 1;
                                }
                            }
                        }
                    }
                }
            }
        }


        //Render Mase
        var Do = true;

        //Floor
        for( var x = -5; x < 6; x++ )
        {
            for( var y = -5; y < 6; y++ )
            {
                if( ( Player.X + x ) < 0 ){ Do = false; }
                if( ( Player.Y + y ) < 0 ){ Do = false; }
                if( ( Player.X + x ) > ( ( MazeX - 1 ) * CurrentLvl ) ){ Do = false; }
                if( ( Player.Y + y ) > ( ( MazeY - 1 ) * CurrentLvl ) ){ Do = false; }

                if( Do )
                {
                    //Empty
                    if( Maze[Player.X+x][Player.Y+y].Data == 1 )
                    {
                        Cancon.drawImage
                        ( 
                            MazeGraphics.Floor, 
                            ( 400 - ( ( MazeGraphics.Floor.width / 2 ) + ( MazeGraphics.Floor.width * x ) ) ), 
                            ( 400 - ( ( MazeGraphics.Floor.height / 2 ) + ( MazeGraphics.Floor.height * y ) ) ) 
                        );
                    }

                    //Entrance
                    if( Maze[Player.X+x][Player.Y+y].Data == 5 )
                    {
                        Cancon.drawImage
                        ( 
                            MazeGraphics.Entrance, 
                            ( 400 - ( ( MazeGraphics.Entrance.width / 2 ) + ( MazeGraphics.Entrance.width * x ) ) ), 
                            ( 400 - ( ( MazeGraphics.Entrance.height / 2 ) + ( MazeGraphics.Entrance.height * y ) ) ) 
                        );
                    }

                    //Exit
                    if( Maze[Player.X+x][Player.Y+y].Data == 6 )
                    {
                        if( AILeft < 1 )
                        {
                            Cancon.drawImage
                            ( 
                                MazeGraphics.ExitOpen, 
                                ( 400 - ( ( MazeGraphics.ExitOpen.width / 2 ) + ( MazeGraphics.ExitOpen.width * x ) ) ), 
                                ( 400 - ( ( MazeGraphics.ExitOpen.height / 2 ) + ( MazeGraphics.ExitOpen.height * y ) ) ) 
                            );
                        }
                        else
                        {
                            Cancon.drawImage
                            ( 
                                MazeGraphics.Exit, 
                                ( 400 - ( ( MazeGraphics.Exit.width / 2 ) + ( MazeGraphics.Exit.width * x ) ) ), 
                                ( 400 - ( ( MazeGraphics.Exit.height / 2 ) + ( MazeGraphics.Exit.height * y ) ) ) 
                            );
                        }
                    }



                    //Wall
                    if( Maze[Player.X+x][Player.Y+y].Data == 0 )
                    {
                        Cancon.drawImage
                        ( 
                            MazeGraphics.Wall, 
                            ( 400 - ( ( MazeGraphics.Wall.width / 2 ) + ( MazeGraphics.Wall.width * x ) ) ), 
                            ( 400 - ( ( MazeGraphics.Wall.height / 2 ) + ( MazeGraphics.Wall.height * y ) ) ) 
                        );
                    }
                    //Ele 1
                    if( Maze[Player.X+x][Player.Y+y].Data == 2 )
                    {
                        Cancon.drawImage
                        ( 
                            MazeGraphics.WallEleOne, 
                            ( 400 - ( ( MazeGraphics.WallEleOne.width / 2 ) + ( MazeGraphics.WallEleOne.width * x ) ) ), 
                            ( 400 - ( ( MazeGraphics.WallEleOne.height / 2 ) + ( MazeGraphics.WallEleOne.height * y ) ) ) 
                        );
                    }

                    //Ele 2
                    if( Maze[Player.X+x][Player.Y+y].Data == 3 )
                    {
                        Cancon.drawImage
                        ( 
                            MazeGraphics.WallEleTwo, 
                            ( 400 - ( ( MazeGraphics.WallEleTwo.width / 2 ) + ( MazeGraphics.WallEleTwo.width * x ) ) ), 
                            ( 400 - ( ( MazeGraphics.WallEleTwo.height / 2 ) + ( MazeGraphics.WallEleTwo.height * y ) ) ) 
                        );
                    }

                    //Ele 3
                    if( Maze[Player.X+x][Player.Y+y].Data == 4 )
                    {
                        Cancon.drawImage
                        ( 
                            MazeGraphics.WallEleThree, 
                            ( 400 - ( ( MazeGraphics.WallEleThree.width / 2 ) + ( MazeGraphics.WallEleThree.width * x ) ) ), 
                            ( 400 - ( ( MazeGraphics.WallEleThree.height / 2 ) + ( MazeGraphics.WallEleThree.height * y ) ) )  
                        );
                    }
                }
                Do = true;
            }
        }
    
        //Draw Player
        Cancon.save();
        if( Player.FacingDirection == 2 )//If facing down
        {
            if( Player.Element == 0 )
            {
                Cancon.drawImage( Player.FrontImage.EleOne, ( 400 - ( Player.FrontImage.EleOne.width / 2 ) ), ( 400 - ( Player.FrontImage.EleOne.height / 2 ) ) );
            }
            if( Player.Element == 1 )
            {
                Cancon.drawImage( Player.FrontImage.EleTwo, ( 400 - ( Player.FrontImage.EleTwo.width / 2 ) ), ( 400 - ( Player.FrontImage.EleTwo.height / 2 ) ) );
            }
            if( Player.Element == 2 )
            {
                Cancon.drawImage( Player.FrontImage.EleThree, ( 400 - ( Player.FrontImage.EleThree.width / 2 ) ), ( 400 - ( Player.FrontImage.EleThree.height / 2 ) ) );
            }
        }
        else
        {
            if( Player.FacingDirection == 0 )//If facing Up
            {
                if( Player.Element == 0 )
                {
                    Cancon.drawImage( Player.OtherSidesImage.EleOne, ( 400 - ( Player.OtherSidesImage.EleOne.width / 2 ) ), ( 400 - ( Player.OtherSidesImage.EleOne.height / 2 ) ) );
                }
                if( Player.Element == 1 )
                {
                    Cancon.drawImage( Player.OtherSidesImage.EleTwo, ( 400 - ( Player.OtherSidesImage.EleTwo.width / 2 ) ), ( 400 - ( Player.OtherSidesImage.EleTwo.height / 2 ) ) );
                }
                if( Player.Element == 2 )
                {
                    Cancon.drawImage( Player.OtherSidesImage.EleThree, ( 400 - ( Player.OtherSidesImage.EleThree.width / 2 ) ), ( 400 - ( Player.OtherSidesImage.EleThree.height / 2 ) ) );
                }
            }
            else if( Player.FacingDirection == 1 )//If facing right
            {
                Cancon.translate(  400, 400 );
                    Cancon.rotate( Math.PI / 180 * 90 );
                Cancon.translate( -400,- 400 );
                if( Player.Element == 0 )
                {
                    Cancon.drawImage( Player.OtherSidesImage.EleOne, ( 400 - ( Player.OtherSidesImage.EleOne.width / 2 ) ), ( 400 - ( Player.OtherSidesImage.EleOne.height / 2 ) ) );
                }
                if( Player.Element == 1 )
                {
                    Cancon.drawImage( Player.OtherSidesImage.EleTwo, ( 400 - ( Player.OtherSidesImage.EleTwo.width / 2 ) ), ( 400 - ( Player.OtherSidesImage.EleTwo.height / 2 ) ) );
                }
                if( Player.Element == 2 )
                {
                    Cancon.drawImage( Player.OtherSidesImage.EleThree, ( 400 - ( Player.OtherSidesImage.EleThree.width / 2 ) ), ( 400 - ( Player.OtherSidesImage.EleThree.height / 2 ) ) );
                }
            }
            else if( Player.FacingDirection == 3 )//If facing Left
            {
                Cancon.translate(  400, 400 );
                    Cancon.rotate( Math.PI / 180 * 270 );
                Cancon.translate( -400,- 400 );
                if( Player.Element == 0 )
                {
                    Cancon.drawImage( Player.OtherSidesImage.EleOne, ( 400 - ( Player.OtherSidesImage.EleOne.width / 2 ) ), ( 400 - ( Player.OtherSidesImage.EleOne.height / 2 ) ) );
                }
                if( Player.Element == 1 )
                {
                    Cancon.drawImage( Player.OtherSidesImage.EleTwo, ( 400 - ( Player.OtherSidesImage.EleTwo.width / 2 ) ), ( 400 - ( Player.OtherSidesImage.EleTwo.height / 2 ) ) );
                }
                if( Player.Element == 2 )
                {
                    Cancon.drawImage( Player.OtherSidesImage.EleThree, ( 400 - ( Player.OtherSidesImage.EleThree.width / 2 ) ), ( 400 - ( Player.OtherSidesImage.EleThree.height / 2 ) ) );
                }
            }
            Cancon.restore();
	        Cancon.save();
        }


        //Draw AI
        Cancon.save();
        for( var i = 0; i < ( MaxAI * CurrentLvl ); i++ )
        {   
            if( !AI[i].Dead )
            {
                if
                ( 
                    AI[i].X > ( Player.X - 6 ) 
                    && AI[i].Y > ( Player.Y - 6 )
                    && AI[i].X < ( Player.X + 6 )
                    && AI[i].Y < ( Player.Y + 6 )
                )
                {
                        if( AI[i].Direction == 0 )
                        {
                            if( AI[i].Shooting )
                            {
                                Cancon.drawImage
                                ( 
                                    AIGraphics.Bodyfire, 
                                    ( 400 - ( AIGraphics.Bodyfire.width / 2 ) + ( AIGraphics.Bodyfire.width * ( Player.X - AI[i].X  ) ) ), 
                                    ( 400 - ( AIGraphics.Bodyfire.height / 2 ) + ( AIGraphics.Bodyfire.height * ( Player.Y - AI[i].Y ) ) ) 
                                );

                                //Bullet
                                for( var j = 1; j < 3; j++ )
                                { 
                                    if( !( ( AI[i].Y + j ) > ( ( MazeY - 1 ) * CurrentLvl ) ) )
                                    {
                                        if( Maze[AI[i].X][AI[i].Y+j].Data == 1 || Maze[AI[i].X][AI[i].Y+j].Data == 5 || Maze[AI[i].X][AI[i].Y+j].Data == 6 )
                                        {
                                            Cancon.drawImage
                                            ( 
                                                AIGraphics.Bullet, 
                                                ( 400 - ( AIGraphics.Bullet.width / 2 ) + ( AIGraphics.Bullet.width *  ( Player.X - AI[i].X ) ) ), 
                                                ( 400 - ( AIGraphics.Bullet.height / 2 ) + ( AIGraphics.Bullet.height * ( ( Player.Y - AI[i].Y ) - j ) ) ) 
                                            );
                                        }
                                        else 
                                        {
                                            j = 10;
                                        }
                                    }
                                    else
                                    {
                                        j = 10;
                                    }
                                }
                            }
                            else
                            {
                                Cancon.drawImage
                                ( 
                                    AIGraphics.Body, 
                                    ( 400 - ( AIGraphics.Body.width / 2 ) + ( AIGraphics.Body.width * ( Player.X - AI[i].X  ) ) ), 
                                    ( 400 - ( AIGraphics.Body.height / 2 ) + ( AIGraphics.Body.height * ( Player.Y - AI[i].Y ) ) ) 
                                );
                            }
                        }
                        if( AI[i].Direction == 1 )
                        { 
                            Cancon.translate
                            ( 
                                ( 400 - ( AIGraphics.Body.width / 2 ) + ( AIGraphics.Body.width * ( Player.X - AI[i].X  ) ) ), 
                                ( 400 - ( AIGraphics.Body.height / 2 ) + ( AIGraphics.Body.height * ( Player.Y - AI[i].Y ) ) ) 
                            );
                            if( AI[i].Shooting )
                            {
                                Cancon.rotate( Math.PI / 180 * 90 );
                                Cancon.drawImage
                                ( 
                                    AIGraphics.Bodyfire, 
                                    ( 0 ), 
                                    ( -AIGraphics.Bodyfire.height ) 
                                );

                                //Bullet
                                for( var j = 1; j < 3; j++ )
                                { 
                                    if( !( ( AI[i].X - j ) < 0 ) )
                                    {
                                        if( Maze[AI[i].X-j][AI[i].Y].Data == 1 || Maze[AI[i].X-j][AI[i].Y].Data == 5 || Maze[AI[i].X-j][AI[i].Y].Data == 6 )
                                        {
                                            Cancon.rotate( Math.PI / 180 * -90 );
                                                Cancon.translate
                                                ( 
                                                    ( AIGraphics.Bullet.width * j ), 
                                                    ( 0 ) 
                                                );
                                            Cancon.rotate( Math.PI / 180 * 90 );
                                                Cancon.drawImage
                                                ( 
                                                    AIGraphics.Bullet, 
                                                    ( 0 ), 
                                                    ( -( AIGraphics.Bullet.height  ) ) 
                                                );
                                            Cancon.rotate( Math.PI / 180 * -90 );
                                                Cancon.translate
                                                ( 
                                                    ( -( AIGraphics.Bullet.width * j ) ), 
                                                    ( 0 ) 
                                                );
                                            Cancon.rotate( Math.PI / 180 * 90 );
                                        }
                                        else 
                                        {
                                            j = 10;
                                        }
                                    }
                                    else 
                                    {
                                        j = 10;
                                    }
                                }
                            }
                            else
                            {
                                Cancon.rotate( Math.PI / 180 * 90 );
                                Cancon.drawImage
                                ( 
                                    AIGraphics.Body, 
                                    ( 0 ), 
                                    ( -AIGraphics.Body.height ) 
                                );
                            }
                            Cancon.translate
                            ( 
                                -( 400 - ( AIGraphics.Body.width / 2 ) + ( AIGraphics.Body.width * ( Player.X - AI[i].X  ) ) ), 
                                -( 400 - ( AIGraphics.Body.height / 2 ) + ( AIGraphics.Body.height * ( Player.Y - AI[i].Y ) ) ) 
                            ); 
                        }
                        if( AI[i].Direction == 2 )
                        { 
                            Cancon.translate
                            ( 
                                ( 400 - ( AIGraphics.Body.width / 2 ) + ( AIGraphics.Body.width * ( Player.X - AI[i].X  ) ) ), 
                                ( 400 - ( AIGraphics.Body.height / 2 ) + ( AIGraphics.Body.height * ( Player.Y - AI[i].Y ) ) ) 
                            );
                            if( AI[i].Shooting )
                            {
                                Cancon.rotate( Math.PI / 180 * 180 );
                                Cancon.drawImage
                                ( 
                                    AIGraphics.Bodyfire, 
                                    ( -AIGraphics.Bodyfire.width ), 
                                    ( -AIGraphics.Bodyfire.height ) 
                                );

                                //Bullet
                                for( var j = 1; j < 3; j++ )
                                { 
                                    if( !( ( AI[i].Y - j ) < 0 ) )
                                    {
                                        if( Maze[AI[i].X][AI[i].Y-j].Data == 1 || Maze[AI[i].X][AI[i].Y-j].Data == 5 || Maze[AI[i].X][AI[i].Y-j].Data == 6 )
                                        {
                                            Cancon.rotate( Math.PI / 180 * -180 );
                                                Cancon.translate
                                                ( 
                                                    ( 0 ), 
                                                    ( AIGraphics.Bullet.height * j ) 
                                                );
                                            Cancon.rotate( Math.PI / 180 * 180 );
                                                Cancon.drawImage
                                                ( 
                                                    AIGraphics.Bullet, 
                                                    ( -( AIGraphics.Bullet.width ) ), 
                                                    ( -( AIGraphics.Bullet.height ) )  
                                                );
                                            Cancon.rotate( Math.PI / 180 * -180 );
                                                Cancon.translate
                                                ( 
                                                    ( 0 ), 
                                                    ( -( AIGraphics.Bullet.height * j ) ) 
                                                );
                                            Cancon.rotate( Math.PI / 180 * 180 );
                                        }
                                        else 
                                        {
                                            j = 10;
                                        }
                                    }
                                    else
                                    {
                                        j = 10;
                                    }
                                }
                            }
                            else
                            {
                                Cancon.rotate( Math.PI / 180 * 180 );
                                Cancon.drawImage
                                ( 
                                    AIGraphics.Body, 
                                    ( -AIGraphics.Body.width ), 
                                    ( -AIGraphics.Body.height ) 
                                );
                            }
                            Cancon.translate
                            ( 
                                -( 400 - ( AIGraphics.Body.width / 2 ) + ( AIGraphics.Body.width * ( Player.X - AI[i].X  ) ) ), 
                                -( 400 - ( AIGraphics.Body.height / 2 ) + ( AIGraphics.Body.height * ( Player.Y - AI[i].Y ) ) ) 
                            ); 
                        }
                        if( AI[i].Direction == 3 )
                        { 
                            Cancon.translate
                            ( 
                                ( 400 - ( AIGraphics.Body.width / 2 ) + ( AIGraphics.Body.width * ( Player.X - AI[i].X  ) ) ), 
                                ( 400 - ( AIGraphics.Body.height / 2 ) + ( AIGraphics.Body.height * ( Player.Y - AI[i].Y ) ) ) 
                            );
                            if( AI[i].Shooting )
                            {
                                Cancon.rotate( Math.PI / 180 * 270 );
                                Cancon.drawImage
                                ( 
                                    AIGraphics.Bodyfire, 
                                    ( -AIGraphics.Bodyfire.width ), 
                                    ( 0 )  
                                );

                                //Bullet
                                for( var j = 1; j < 3; j++ )
                                { 
                                    if( !( ( AI[i].X + j ) > ( ( MazeX - 1 ) * CurrentLvl ) ) )
                                    {
                                        if( Maze[AI[i].X+j][AI[i].Y].Data == 1 || Maze[AI[i].X+j][AI[i].Y].Data == 5 || Maze[AI[i].X+j][AI[i].Y].Data == 6 )
                                        {
                                            Cancon.rotate( Math.PI / 180 * -270 );
                                                Cancon.translate
                                                ( 
                                                    ( AIGraphics.Bullet.width * -j ), 
                                                    ( 0 ) 
                                                );
                                            Cancon.rotate( Math.PI / 180 * 270 );
                                            Cancon.drawImage
                                            ( 
                                                AIGraphics.Bullet, 
                                                ( -( AIGraphics.Bullet.width ) ), 
                                                ( 0 ) 
                                            );
                                            Cancon.rotate( Math.PI / 180 * -270 );
                                                Cancon.translate
                                                ( 
                                                    ( -( AIGraphics.Bullet.width * -j ) ), 
                                                    ( 0 ) 
                                                );
                                            Cancon.rotate( Math.PI / 180 * 270 );
                                        }
                                        else 
                                        {
                                            j = 10;
                                        }
                                    }
                                    else 
                                    {
                                        j = 10;
                                    }
                                }
                            }
                            else
                            {
                                Cancon.rotate( Math.PI / 180 * 270 );
                                Cancon.drawImage
                                ( 
                                    AIGraphics.Body, 
                                    ( -AIGraphics.Body.width ), 
                                    ( 0 )  
                                );
                            }
                            Cancon.translate
                            ( 
                                -( 400 - ( AIGraphics.Body.width / 2 ) + ( AIGraphics.Body.width * ( Player.X - AI[i].X  ) ) ), 
                                -( 400 - ( AIGraphics.Body.height / 2 ) + ( AIGraphics.Body.height * ( Player.Y - AI[i].Y ) ) ) 
                            ); 
                        }

                    Cancon.restore();
	                Cancon.save();
                }
            }
        }

        //Interface

        //Atunement Indecator

        if( Player.Element == 0 )
        {
            Cancon.fillStyle = "#000000";
            Cancon.fillRect( 18, 698, 24, 32 );
            Cancon.fillStyle = "#9E0000";
            Cancon.fillRect( 20, 700, 20, 30 );
        }
        else
        {
            Cancon.fillStyle = "#000000";
            Cancon.fillRect( 18, 708, 24, 32 );
            Cancon.fillStyle = "#9E0000";
            Cancon.fillRect( 20, 710, 20, 20 );
        }

        if( Player.Element == 1 )
        {
            Cancon.fillStyle = "#000000";
            Cancon.fillRect( 38, 698, 24, 32 );
            Cancon.fillStyle = "#009E0B";
            Cancon.fillRect( 40, 700, 20, 30 );
        }
        else
        {
            Cancon.fillStyle = "#000000";
            Cancon.fillRect( 38, 708, 24, 32 );
            Cancon.fillStyle = "#009E0B";
            Cancon.fillRect( 40, 710, 20, 20 );
        }

        if( Player.Element == 2 )
        {
            Cancon.fillStyle = "#000000";
            Cancon.fillRect( 58, 698, 24, 32 );
            Cancon.fillStyle = "#004C9E";
            Cancon.fillRect( 60, 700, 20, 30 );
        }
        else
        {
            Cancon.fillStyle = "#000000";
            Cancon.fillRect( 58, 708, 24, 32 );
            Cancon.fillStyle = "#004C9E";
            Cancon.fillRect( 60, 710, 20, 20 );
        }


        //Atunement Bar
        Cancon.fillStyle = "#000000";
        Cancon.fillRect( 18, 728, 104, 24 );

        Cancon.fillStyle = "#555555";
        Cancon.fillRect( 20, 730, 100, 20 );

        Cancon.fillStyle = "#111EAB";
        if( !Player.DoEleDelay )
        {
            Cancon.fillRect( 20, 730, 100, 20 );
        }
        else
        {
            Cancon.fillRect( 20, 730, Math.floor( Player.EleDelay * 100 ), 20 );
        }

        //Health Bar
        Cancon.fillStyle = "#000000";
        Cancon.fillRect( 18, 748, 104, 24 );

        Cancon.fillStyle = "#555555";
        Cancon.fillRect( 20, 750, 100, 20 );

        Cancon.fillStyle = "#8A0707";
        var Health = Player.Health;

        if( Health < 0 ){ Health = 0 }
        Cancon.fillRect( 20, 750, Health, 20 );

        Cancon.fillStyle = "#EFC442";
        Cancon.font = "20px Arial";
        Cancon.fillText(  "AI Left: " + AILeft , 20, 20 );

        }////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //End ( Win )
        else if( GameState == 3 )//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        {
            //Background
	        Cancon.fillStyle="#000000";
	        Cancon.fillRect( 0, 0, CanvasX, CanvasY );
	        Cancon.save();

            Cancon.fillStyle = "#C90022";
            Cancon.fillText( "           You Win" , 300, 400 );
            Cancon.fillText( "Press Enter To Continue" , 300, 430 );

            if( MenuEnter )
            {
                MenuEnter = false;
                GameState = 0;
            }
            MenuUp = false;
            MenuDown = false;
        }///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //End ( Loose )
        else if( GameState == 4 )//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        {
            //Background
	        Cancon.fillStyle="#000000";
	        Cancon.fillRect( 0, 0, CanvasX, CanvasY );
	        Cancon.save();

            Cancon.fillStyle = "#C90022";
            Cancon.fillText( "           You Lose" , 300, 400 );
            Cancon.fillText( "Press Enter To Continue" , 300, 430 );

            if( MenuEnter )
            {
                MenuEnter = false;
                GameState = 0;
            }
            MenuUp = false;
            MenuDown = false;
        }/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}


document.onkeydown = function( e ) 
{
	if ( !e ) { e = window.event; }
    
    if( GameState == 0 || GameState == 3 || GameState == 4 )
    {
        //W
	    if( e.keyCode == 87 ){ MenuUp = true; }

        //S
	    if( e.keyCode == 83 ){ MenuDown = true; }
        
        //Enter
        if( e.keyCode == 13 ){ MenuEnter = true; }		
    }
    else
    {
    		   		
	    //W
	    if( e.keyCode == 87 )
        { 
            if( !Player.DoDelay )
            {
                Player.Up = true;
            } 
        }	

	    //A
	    if( e.keyCode == 65 )
        { 
            if( !Player.DoDelay )
            {
                Player.Left = true;
            } 
        }
		
	    //S
	    if( e.keyCode == 83 )
        {   
            if( !Player.DoDelay )
            {
                Player.Down = true;
            }
        }	

	    //D
	    if( e.keyCode == 68 )
        { 
            if( !Player.DoDelay )
            {
                Player.Right = true;
            }
        }	

        //One
        if( e.keyCode == 49 )
        { 
            if( !Player.DoEleDelay )
            {
                Player.SwitchEleOne = true;
            } 
        }
    
        //Two
        if( e.keyCode == 50 )
        { 
            if( !Player.DoEleDelay )
            {
                Player.SwitchEleTwo = true;
            } 
        }	
    
        //Three
        if( e.keyCode == 51 )
        { 
            if( !Player.DoEleDelay )
            {
                Player.SwitchEleThree = true;
            } 
        }		

        //Space
        //if( e.keyCode == 32 ){ Player.Fire = true; }
     }

}


document.onkeyup = function( e ) 
{
	if ( !e ) { e = window.event; }
    		 		
	//W
	if( e.keyCode == 87 ){ Player.Up = false; }	

	//A
	if( e.keyCode == 65 ){ Player.Left = false; }
		
	//S
	if( e.keyCode == 83 ){ Player.Down = false; }	

	//D
	if( e.keyCode == 68 ){ Player.Right = false;  }

    //One
    if( e.keyCode == 49 ){ Player.SwitchEleOne = false; }
    
    //Two
    if( e.keyCode == 50 ){ Player.SwitchEleTwo = false; } 	
    
    //Three
    if( e.keyCode == 51 ){ Player.SwitchEleThree = false; }	
    
    //Space
    //if( e.keyCode == 32 ){ Player.Fire = false; }		
}


