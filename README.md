# windchimes

🎧 🎐

UI for a multi-source music player, allows streaming and managing music from platforms like youtube and soundcloud in one place

[try the web-version](https://windchimes.hopto.org)

## features

-   playlists creation, tracks import from other platforms. only youtube and soundcloud are supported for now
-   playback control: rewind, pause, next/prev track, supports native mobile media notification
-   tracks queue editing with drag and drop reordering

## tech info

frontend was built using **vue**, **vueuse**, **anime.js** for animations, **zod** & **veevalidate** for form validation
and **pinia** for the global state. there's also **vuetify** to not bother with UI too much.

server communication implemented with **grahpql** using cool typescript codegen

can be used as a mobile app with **capacitor.js**
