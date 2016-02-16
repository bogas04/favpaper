#!/usr/bin/env node
'use strict';

const fetch = require('node-fetch');
const wallpaper = require('wallpaper');
const fs = require('fs');
const path = `${require('home-dir')()}/.favpaper/`;

const sub = process.argv[2] || 'spaceporn';
const source = sub => `http://reddit.com/r/${sub}.json`;

const saveWallpaper = image => {
  const filename = `wallpaper-${Date.now()}.png`;

  fs.stat(path, (err, status) => {
    if (err && err.code === 'ENOENT') { fs.mkdirSync(path); }
    image.body.pipe(fs.createWriteStream(path + filename)).on('close', () => {
      console.log('image downloaded');
      wallpaper.set(path + filename).then(() => console.log(" wallpaper has been set"))
    })
  });
};

fetch(source(sub)).then(r => r.json()).then(body => {
  const postIndex = 1 + parseInt((Math.random()*100) % body.data.children.length);

  const url = body.data.children[postIndex].data.url;

  console.log(`connected to r/${sub}\n requesting for ${url}`);

  fetch(url).then(saveWallpaper);
})
.catch(e => console.log(`Couldn't connect to ${source(sub)}`, e));
