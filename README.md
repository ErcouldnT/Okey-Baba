# Okey Baba
The nightly coded Online Java Script Okey Game, Rummikub your grandparents warned you about.

*Okey baba is a game playing with 4 players. There is a deck includes total amount of 106 tiles which has 1 to 13 numbers, 4 diff colors and 2 jokers in it. Every player has 13 random cards. Players get and give one piece each round and the game continues counterclockwise. The goal is finishing the game once sort your tiles appropriately.*

![The game board](/public/table.png "The game board")

## Setup
> `npm i`

## Development
> `npm run dev`

## Todo
* *Basic game logic*
  * ~First player have 1 more extra tile to start game.~
  * Taking rummy tile to your board.
    * [ ] From left-side player.
    * [ ] From middle deck.
  * Show all players (and points) on the screen.
  * Show counter for middle tiles left.
* *Advanced*
  * Handle game on player disconnect (MongoDB).
  * Point management.
  * Playing indicator tile at the 1st round logic.
  * Logic for game ending.
    * [ ] Ending w/o Joker.
    * [ ] Ending w/ 1 Joker.
    * [ ] Ending w/ 2 Jokers.
  * Multiple game rooms.
    * [ ] Create a room with point options.
    * [ ] Easy room join like url/:room_id.
    * [ ] Players can choose where sit.
    * [ ] Ready and Start buttons.
* *Update the app*
  * Animations.
  * Responsive layout.
    * [ ] Mobile friendly.
  * Sound effects.
* *Make it clean code (and also English spells)*

## Link to recent app
> https://okeybaba.herokuapp.com \
> *Note that it's a free dyno so wait a bit.*

&copy; 2021 Erkut