# windchimes

🎧 🎐

UI for a multi-platform music player that lets you listen to the music from different platforms like Youtube and Soundcloud in one place

it fixes the problem of constant platform switching just to listen to some youtube exclusive podcast, for example

[try the web-version](https://windchimes.hopto.org)

https://github.com/user-attachments/assets/d0db5652-e2c0-42e8-939d-8923c7864509

## features

-   playlists creation, tracks import from other platforms. only youtube and soundcloud are supported for now
-   playback control: rewind, pause, next/prev track, supports native mobile media notification
-   tracks queue editing with drag and drop reordering

## tech info

frontend was built using **vue**, **vueuse**, **anime.js** for animations, **zod** & **veevalidate** for form validation
and **pinia** for the global state. there's also **vuetify** to not bother with UI too much.

server communication implemented with **grahpql** using cool typescript codegen

can be used as a mobile app with **capacitor.js**
