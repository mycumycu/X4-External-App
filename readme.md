# X4 External App

External app for X4 Foundations game.

![X4 External App main screen](https://i.imgur.com/d2tnx9s.png)

Shows real time logbook entries, mission offers, currently active mission details and player information.  
Application is served on a local port, so it can be run locally or on multiple network devices at once.  
Created to be displayed on external device (monitor, tablet or smartphone).

Note: lua module supports only Windows, so currently it will run exclusevly on this platform.

## One time setup

1. Install *Http client library for X4 Foundation* mod by *djfhe*  
   https://github.com/djfhe/x4_http  
  _Since this mod is still in beta, you need to navigate to the main page of the repository. Above the list of files, click Code and Download ZIP.  
   Then extract contents of the zip file to `\extensions` directory - and rename `x4_http-main` folder to `djfhe_http`_.

   The folder structure should be:

   ```
   \extensions
       \djfhe_http
           \content.xml
           \...
   ```
  

3. Install *X4 External App* mod  
   https://www.nexusmods.com/x4foundations/mods/818

4. Download *X4 External App server*   
   https://github.com/mycumycu/X4-External-App/releases

That's it, you should be good to go.

## Running the X4 External App

1. Start the *X4 External App* server (`x4_external_app.exe`). Don't close it during playing.
2. Start the game and load your save file.

*X4 External App* will serve application on a local port. If default port (8080) is busy - a new, free one will be found.
> In case of used port different from 8080 - also update the port setting the mod config file located in `\extensions\mycu_external_app\ui\config.lua`

App will automatically open in default browser.

If you want to access it from a local network - change `localhost` to local IP address of a machine running X4, e.g. `http://192.168.1.120:8080`.  
Application will detect and output the exact network address in console window.

## Useful X4 launch params
There are two **optional** but quite useful X4 parameters working when game looses focus:

   - **-nosoundthrottle** makes game keep playing music
   - **-nocputhrottle** game usess full CPU

   Thanks to it interacting with external monitor feels like a part of the game.  
   You can apply one or all of them: https://help.steampowered.com/en/faqs/view/7D01-D2DD-D75E-2955   

## Layout

### Application layout

User can freely define app layout. To open configuration screen press layout icon ![layout icon](https://i.imgur.com/DsukxhO.png)   

![layout screen](https://i.imgur.com/uUMZgEz.png)

It's possible to define number of columns and its width.  
Also, by dragging widgets into approtiate columns one can set their order.   

If the "limit widget heights" option is checked - each widget can have "max height" property defined - application will then automatically adjust the height of the widget within the viewport height.  

All changes made are stored automatically.

  
### App font size

Clicking ![Font size icon](https://i.imgur.com/neFE6wC.png) icon switches between different font sizes. 

## Widgets

### Logbook

![X4 External App UI elements](https://i.imgur.com/gopHNqi.png)

App UI supports unrestricted filtering the latest logbook entries.  

You can also define phrases that should be excluded or feartured in logbook panel.
To define such phrases, click on clog icon: ![X4 External App clog icon](https://i.imgur.com/KQGSIIO.png) - setting window will open.  

![X4 External App UI elements](https://i.imgur.com/Z9nw0Xa.png)

Possible settings for each rule include:

* on/off toggle - defines if certain rule is enabled
* phrase - phrase to look for. All phrases are case-insensitive.
* type - excluded means that an entry containing such a phrase will not be displayed, while highlighted means that it will be marked with a color.
* blink - makes entry's title blinking
* title only - when disabled, search will consider also message text and a faction name

Important logbook messages (e.g. property under attack or being destroyed) will automatically blink catching attention.  
All changes are stored automatically.  
  
### Mission offers
Mission offers can be filtered similarly to logbook entries.  
Also, you can define which mission difficulties should be displayed.
To do so - just click on clog icon: ![X4 External App clog icon](https://i.imgur.com/KQGSIIO.png)   
Setting window will open.  

### Player goals
![Player goals](https://i.imgur.com/xhaJ0LC.png)  

You can define and add your own goals. Just type it and press enter key (or dedicated button).
Each goal can be moved higher or lower in priority or even moved to another list by dragging.

You can also highlight selected goals with one of few preselected icons. 
To do that, select "make featured" option from goal (three dot) menu. The exclamation icon will appear. To switch it, just click on the icon until desired one appears.

After completing a goal and making it "checked" - it will fade out and will be removed in a few seconds. Unchecking the goal within that time cancels the removal operation.

### Factions
![Factions](https://i.imgur.com/GcuOrQj.png)  

Shows all factions and their relations with the player.

If player has a military or capital ship licence with a faction - it will be displayed as a green bar above faction name.  
When faction relation changes, its name will blink and recent relation change value will be displayed in a top right of a faction name.

Widget settings alow to:
* exlude factions from the grid
* exclude certain relation levels
* hide recent relation changes
* hide licence indicators
 
## How it works

External App mod *(MD + LUA)* collects and sends data to *(Node.js)* server that serves it to a (Vue.js) SPA application.  
A **big thanks to djfhe** for creating _Http client library_ mod that allows communication between game and REST server.

SPA application was created with *Vue.js (v3)* using *Bootstrap (v5)* and all data is provided dynamically.

## Making sever executable from source

In order to build executable of X4 External App server yourself:

1. Clone this repo with the command:  
   `git clone https://github.com/mycumycu/X4-External-App.git`
2. Change dir:  
   `cd x4_external_app`
3. Install packages:  
   `npm install`
4. Create *.env.* file from existing *.env.example* file  
   `copy .env.example .env`
5. Build exe with:  
   `npm run package`

Output executable will be created in `\dist` folder

