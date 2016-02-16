#!/usr/bin/env node
'use strict';

const fetch = require('node-fetch');
const wallpaper = require('wallpaper');

const sub = process.argv[2] || 'spaceporn';
const source = sub => `http://reddit.com/r/${sub}.json`;

const saveWallpaper = image => {
  const fileName = `wallpaper-${Date.now()}.png`;
  image.body.pipe(require('fs').createWriteStream(fileName)).on('close', () => {
    console.log('image downloaded');
    wallpaper.set(fileName).then(() => console.log(" wallpaper has been set"))
  })
};

fetch(source(sub)).then(r => r.json()).then(body => {
  const postIndex = 1 + parseInt((Math.random()*100) % body.data.children.length);

  const url = body.data.children[postIndex].data.url;

  console.log(`connected to r/${sub}\n requesting for ${url}`);

  fetch(url).then(saveWallpaper);
})
.catch(e => console.log(`Couldn't connect to ${source(sub)}`, e));
