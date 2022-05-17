# aMaze
A basic maze solving game with a maze builder. Find objectives scattered throughout 2 pre-built mazes or create and save your own custom maze for your personal enjoyment. 

### Getting Started
Visit https://a-maze.vercel.app/ or download the files and run on localhost:3000 of your browser using `npm run dev` from the CLI of the project directory.


# Introduction
This game was created as my first project for General Assembly's Software Engineering Immersive Bootcamp. We were tasked to create a simple playable game that utilised Javscript, HTML, and CSS. I also elected to use Jquery for DOM manipulation for the ease of use this framework provides. 

My initial concept was to create a simple maze game where players could navigate through several prebuilt mazes using their arrrow keys. I wanted to attempt something that could be interacted with in real-time as I felt it would help me understand how to tackle other popular 2d games like dungeon crawlers or snake.

### Project Objectives
* Players should be able to move around using arrow keys
* Players should be able to end the game once they collect all the objectives
* Players should not be able to move through the walls of the maze
* Players should not be able to see the entire maze at the start of the game

### Optional Objectives
* Players should be able to create their own map
* Players should be able to save their map and play/edit it at a later time

# Design & Implementation

### Gameboard
I conceived of my gameboard as html divs within a container div that was a css grid with 30rows x 30 columns. To specify the coordinates of the players and different objects, I assigned an x and y attribute to each div upon generation. The height and width of the container grid was set to 80% of the view height to fit different screen sizes.

### Movement
To move the player, I used the combination of the following:
* A global object `state` the stores the current direction `state.direction`
* Eventlistener callback function that change `state.direction` according to keyboard events of arrowkeys
* An interval that calls a function to update the position of the player every .2 seconds

Once the game starts, `updatePosition` is called at intervals to update the position of the player div depending on the direction in `state.direction`.

### Updating Position
For this game, I decided that rather than simply escaping the maze, I wanted players to find several objectives scattered around the map to encourage exploration. To make this more challenging, players are also only allowed to see a small area around their location rather than the entire map. As expected, players were also prevented from moving to a div that was designated as a wall.

To achieve these ends, `updatePosition` calls a few other functions: 
#### validPath
* Used to check if the next square is a valid square for the player to occupy (i.e. not a wall, not out of bounds)

#### movePlayer
* Changes the location of the player if validPath says it can be occupied.

#### endCheck
* Checks if the next square contains an objective and adds it to the count. Ends the game if all the objectives are collected. 

#### unMask
* At the start of the game, the map is concealed. unMask reveals the squares around the player and hides all others. 

As such, `updatePosition` looks like this:
![Screenshot 2022-05-16 at 3 00 23 PM](https://user-images.githubusercontent.com/32446451/168536762-2b937719-b86c-4658-8ef3-98d8d09ef613.png)

### Drawing & Saving Maps
When I started this project, I knew I needed a visual interface for map creation as creating a maze programatically or manually through html was pretty difficult. As such, I combined click and hover eventlisteners to allow myself to draw a map on my gameboard to generate the html of a maze. To allow anyone to utilise this feature, I then programmed a save function that allowed a player to save a map to the local storage of their browser. When the app is loaded, it retrieves any existing maps in the localstorage and makes them accessible via buttons.

# Reflection
As this was my first programming project, my focus was on getting things to work and implementing all my features. While I was successful in these aspects, th mindset of just charging foward with implementation caused me to write very poorly conceived code. Here are some of my key mistakes

### 1. Impure functions
* Many of my functions relied on side effects which makes it hard to predict what their effect will be and for reviewers to understand what they do. However, by the time this was pointed out to me, it extremely hard to refactor this as I would have to rewrite the entire app. 

### 2. Poor organisation
* Code defining the logic for the game was interspered with code that was used to run the game. The latter should have been separated out into a main function that ran the program. 

### 3. Not using constants for repeated values
* Throughout my program, I queried elements using their classes which I entered as string. Besides making the code harder to understand, it made typos more likely and the code hard to modify if there were changes in the class names.

In summary, I definitely should have put in more thought into making my code more organised, readable, and maintainable. I also should have paused to refactor my code more often, rather than leaving it to the end when it was too complicated for me to make changes easily. However, this experience has definitely opened my eyes to the art of writing good code and it's something I definitely want to explore and practice in greater depth in future projects.
