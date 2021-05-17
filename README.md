# Okey Baba
The nightly coded Online Java Script Okey Game, Rummikub your grandparents warned you about.

*Okey baba is a game playing with 4 players. There is a deck includes total amount of 106 tiles which has 1 to 13 numbers, 4 diff colors and 2 jokers in it. Every player has 13 random cards. Players get and give one piece each round and the game continues counterclockwise. The goal is finishing the game once sort your tiles appropriately.*

![The game board](/public/newdash.png "The game board")

## Setup
> `npm i`

## Development
> `npm run dev`

## Todo
* *Basic game logic*
  * ~First player have 1 more extra tile to start game.~
  * ~Sending a tile for next player.~
  * ~Taking rummy tile to your board.~
    * [x] From left-side player.
    * [x] From middle deck.
  * ~Show all players (and points) on the screen.~
  * ~Show counter for middle tiles left.~
  * ~Logic for simple game ending.~
  * Game loop (Every round next player starting).
* *Advanced*
  * Live chat.
  * Handle game on player disconnect (MongoDB).
  * Point management.
  * ~Playing indicator tile at the 1st round logic.~
  * Client-side and Server-side validations.
    * [ ] Player board.
    * [ ] Middle deck.
    * [ ] Discarded tiles.
    * [ ] Game endings.
      * [ ] Ending w/o Joker.
      * [ ] Ending w/ 1 Joker.
      * [ ] Ending w/ 2 Jokers.
      * [ ] Okey!
  * Multiple game rooms.
    * [ ] Create a room with point options.
    * [ ] Easy room join like url/:room_id.
    * [ ] Players can choose where sit.
    * [ ] Ready and Start buttons.
* *Update the app*
  * Sound effects.
  * Responsive layout.
    * [ ] Animations.
    * [ ] Mobile friendly.
  * Make it clean code (and also English spells).
  * Game-bot for disconnected players at different difficulty levels.
  * Display logger.

## Link to recent app
> https://okey.erkuttekoglu.com \
> *Note that it's a free dyno so wait a bit.*

&copy; 2021 Erkut