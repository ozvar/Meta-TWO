# Meta-TWO

This is a web-enabled version of the Cogworks Lab's Meta-T app. It is written in Phaser 2.8.0. Phaser subdivides the "screens" of the game into separate "states" (i.e., levels), with one state active at a time.

`index.html` will load all the scripts, and launch the app by invoking `MetaTWO.run();`

1. `MetaTWO.js` loads all the game states, initializes the random number generator, and transitions to the Boot stage
2. `Boot.js` scales the game window, initializes the gamepad, and transitions to the Preloader stage
3. `Preloader.js` loads all the audio files (bulk of the app's total size) with a progress bar, and transitions to the main menu
4. `MainMenu.js` is the "welcome" screen, which currently takes in the participant's SID and desired starting level. This is to be replaced by settings in the participant's account. This state then transitions to the game
5. `Game.js` is the core logic of the task. The participant spends most of their time playing the game here. This state transitions to either GameOver or TimesUp depending on whether they ended a game with time remaining, or they have reached the end of their prealotted session time.
6. `GameOver.js` waits for the user to hit Enter or the A button, then returns to Game
7. `TimesUp.js` is the final screen, which does not transition away