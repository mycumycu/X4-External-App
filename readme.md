# X4 External App

External app for X4 Foundations game.

![X4 External App main screen](https://i.imgur.com/d2tnx9s.png)

Shows real time logbook entries, mission offers, currently active mission details and player information.  
Application is served on a local port, so it can be run locally or on multiple network devices at once.  
Created to be displayed on external device (monitor, tablet or smartphone).

Note: lua module supports only Windows named pipes, so currently it will run exclusevly on this platform.

## One time setup

1. Install SirNukes Mod Support APIs  
   https://www.nexusmods.com/x4foundations/mods/503

2. Download SirNukes Python Pipe Server  
   https://github.com/bvbohnen/x4-projects/releases  
   
3. Install *X4 External App* mod  
   https://www.nexusmods.com/x4foundations/mods/818

4. Download *X4 External App server*   
   https://github.com/mycumycu/X4-External-App/releases

5. Run SirNukes Python Pipe Server, it will create `permissions.json` file.   
   Add X4 External App ID (`ExternalApp`) to the permissions file:

```
{
  "instructions": "Set which extensions are allowed to load modules, based on extension id (in content.xml).",
  "ws_2042901274": true,
  "ExternalApp": true
}
```

That's it, you should be good to go.

## Running the X4 External App

1. Start *SirNukes Python Pipe Server* (via the `X4_Python_Pipe_Server.exe` file) 
2. Start the *X4 External App* server (`x4_external_app.exe`).
3. Start the game and load your save file.

So there should be two console windows open - one from *SirNukes Python Pipe Server* and second from *X4 External App*. 
Don't close it during playing.    
  
*X4 External App* will serve application on a local port. If default port (8080) is busy - a new, free one will be found.  
App will automatically open in default browser.

If you want to access it from a local network - change `localhost` to local IP address of a machine running X4, e.g. `http://192.168.1.120:8080`.  
Application will detect and output the exact network address in console window.

## Usage

### Application layout

User can freely define app layout. To open configuration screen press layout icon ![layout icon](https://i.imgur.com/DsukxhO.png)   

![layout screen](https://i.imgur.com/kGnNhxP.png)

It's possible to define number of columns and its width.  
Also, by dragging widgets into approtiate columns one can set their order.   

If the "limit widget heights" option is checked - each widget can have "max height" property defined - application will then automatically adjust the height of the widget within the viewport height.  

All changes made are stored automatically.

  
### App font size

Clicking ![Font size icon](https://i.imgur.com/neFE6wC.png) icon switches between different font sizes. 

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

![X4 External App UI elements](https://i.imgur.com/SgwMzcN.png)

## How it works

External App mod *(MD + LUA)* collects and sends data to SirNukes Pipe Server *(Python)* custom module.  
Then this module creates another named pipe, allowing the *(Node.js)* server to read data from this pipe and serve it to a (Vue.js) SPA application.  
A **big word of praise for SirNukes** - without his work this data communication wouldn't be possible.

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

