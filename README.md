# electreact

> My "baseline" Electron + React repo

The idea here is that all my UI apps should start with this repo. Maybe they
should all have a remote called `electreact` that I can pull from and merge
things onto? That sounds kinda weird, but it might work. I'll do my best to
follow the "no breaking changes in a 0.0.X release" model, so that one could
just get a particular tag and if there are security concerns, you can just merge
a tag instead of needing to update everything. We'll have to see if I can be
that disciplined...

The primary reason for this is that getting a functioning basic setup for a UI
app is annoying as hell. This just collects a bunch of common stuff together
into a single place so that I don't have to re-cobble it all together every time
I want to do some that's more complicated that a command line utility.

## Architecture

Electron has the whole `main` and `render` process: cool. React lives in the
render process and has all the nifty react-ish functional programming style UI
goodness. All the `main` processing work (as well as the renderer.ts and the
preload.ts files: basically all the NodeJS aware code) live under the `static`
folder. For the UI code, look in `src`.

I strictly use React function components (no classes!) because I also use Recoil
for full state management (above and beyond what you get with simple state &
effects with React).

**_TODO: Add moar details about the architecture. (as in DOCUMENTATION!)_**

## Development environment

I've been on a Mac primarily since mid-2014. I use Windows on a regular basis,
as well, but I do most of my development on a Mac these days, so it's VSCode and
Electron Shell for development for me. Honestly, I actually really like
TypeScript + React + Electron Shell for building UI's that are fully cross
platform. Java is such a nasty, heavy-weight language that I'd just rather not.
Who knows? Maybe someday I'll do something to make it such that I can run some
of this malarkey remotely, instead of as a local app. The core architecture
wouldn't be too hard to adapt to something like that...

### Debugging

There are some configurations I've got set up in the .vscode directory just for
funsies. If you need to debug something in the main process, you select the
Electron: Main configuration. I should figure out what all the rest of those
things are good for, too.

**_TODO: Add info about the other debugging configurations_**

## Motivation

I basically started this as a way to get a duplicate file detection app up &
going. I have a very old one I wrote in XAML/C# on .NET 4, but it crashed when I
threw it at 1TB of music files (I think it's a 32-bit app), so I'm rewriting the
thing in Electron + React, which is the motivation behind this thing. All the
goodies in this are already in use in my music player app (EMP) so I just stole
that stuff, and then stripped out all the music player-specific stuff.
