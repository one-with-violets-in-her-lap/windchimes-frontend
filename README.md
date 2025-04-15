# windchimes

🎧 🎐

UI for a multi-platform music player that lets you listen to the music from different platforms like Youtube and Soundcloud in one place

it fixes the problem of constant platform switching just to listen to some youtube exclusive podcast, for example

[try the web app](https://windchimes.sorry.run) | [install the Android app](https://github.com/one-with-violets-in-her-lap/windchimes-frontend/releases/download/v0.2.0/windchimes-v0.2.0.apk)

https://github.com/user-attachments/assets/2e7b06ad-f6fa-4508-b300-c0539c76344c

## features

-   playlists creation, tracks import from other platforms. only youtube and soundcloud are supported for now
-   playback control: rewind, pause, next/prev track, supports native mobile media notification
-   tracks queue editing with drag and drop reordering

## tech info

frontend was built using **vue**, **vueuse**, **anime.js** for animations, **zod** & **veevalidate** for form validation
and **pinia** for the global state. there's also **vuetify** to not bother with UI too much.

server communication implemented with **grahpql** using cool typescript codegen

can be used as a mobile app with **capacitor.js**
