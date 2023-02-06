const cacheStore = {};

const cacheCleaner = () => {
  for (let k in cacheStore) {
    const v = cacheStore[k];

    if ((Date.now() - v.lastUsed) / 1000 / 60 / 60 > (global.config.proxy?.cache?.lastUsedRemoveHours || 1)) { // If anything cached was last used longer than an hour ago, remove it
      delete cacheStore[k];
    }
  }
};

export const get = (key) => cacheStore[key];
export const set = (key, value) => { cacheStore[key] = value; };

setInterval(cacheCleaner, 1000 * 60 * 60);