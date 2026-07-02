const CACHE_NAME = 'slot-game-cache-v1';
// キャッシュするファイルのリスト（使用している画像や音声を全て記載します）
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './image/7.png',
  './image/auto.png',
  './image/autoon.png',
  './image/bar.png',
  './image/bell.png',
  './image/cherry.png',
  './image/data.png',
  './image/grape.png',
  './image/icon.png',
  './image/machine.png',
  './image/miniclown.png',
  './image/onlychance.png',
  './image/onlygogo.png',
  './image/q.png',
  './image/return.png',
  './image/rhinoceros.png',
  './image/setting.png',
  './image/star.png',
  './image/statistics.png',
  './image/statisticsmenu.png',
  './image/icon.png',
  './bgm/9.mp3',
  './bgm/9finish.mp3',
  './bgm/9start.mp3',
  './bgm/barstart.mp3',
  './bgm/bigbonus.mp3',
  './bgm/button.mp3',
  './bgm/d.mp3',
  './bgm/dfinish.mp3',
  './bgm/dstart.mp3',
  './bgm/flash.mp3',
  './bgm/maxbet.mp3',
  './bgm/payout.mp3',
  './bgm/regbonus.mp3',
  './bgm/replay.mp3',
  './bgm/sp1finish.mp3',
  './bgm/sp1start.mp3',
  './bgm/sp2finish.mp3',
  './bgm/sp2start.mp3',
  './bgm/special1.mp3',
  './bgm/special2.mp3',
  './bgm/start.mp3',
  './bgm/startbonus.mp3',
  './bgm/tenpai.mp3'
 ];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // urlsToCache の配列を一括処理せず、1つずつ個別にキャッシュを試みます
      return Promise.all(
        urlsToCache.map(function(url) {
          return cache.add(url).catch(function(error) {
            // もしファイルが無くてもエラーをここでキャッチし、全体のインストールを中断させない
            console.error('PWAキャッシュ失敗（ファイルが存在しない可能性があります）:', url, error);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});