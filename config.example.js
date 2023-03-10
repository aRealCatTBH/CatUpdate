export default {
    /*
      GooseUpdate config
  
      All these have defaults in the code so if you don't want to see / mess around you can just remove everything you don't change
    */
  
    webserver: {
      /* Key and cert to use for HTTPS (Uncomment and modify if you want HTTPS)
      https: {
        key: '../server.key',
        cert: '../server.crt'
      }
      */
    },
  
    proxy: {
      cache: {
        lastUsedRemoveHours: 1, // Wait how many hours after cache entry was last used before removing it
        maxMinutesToUseCached: 30, // Use a cache entry for how many minutes after it was made
      },
  
      useragent:
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9010 Chrome/91.0.4472.164 Electron/13.6.6 Safari/537.36", // User agent to send with proxy requests
    },
  
    apiBases: {
      v1: "https://discord.com/api", // API v1 base (for redirects + proxy)
      v2: "https://discord.com/api/updates", // API v2 base (for proxy)
    },
  
    guApi: {
      enabled: true
    },
  
    /* Discord webhook for statistics updates (Uncomment and modify if you want a webhook)
    webhook: {
      url: "https://discord.com/api/webhooks/X", // Discord webhook URL
      username: "CatUpdate", // Webhook username
      avatarUrl: "https://catets.pages.dev/pfp.webp" // URL to webhook avatar
    },
    */
  
    deprecated: {
      guV2Migration: false, // Whether to use the GooseUpdate v1.x -> v2.x migration fix (you probably don't need this unless it's updates.goosemod.com)
    },
  
    experimental: {
      // Experimental - could crash / break server (but mostly are fine)
      webserver: {
        // https is required for http2 and subsequently http2's options to work
        http2: {
          enabled: true, // Whether to use HTTP/2
          allowFallback: true, // Allow HTTP/1 fallback as well
        },
      },
      apiV2Enabled: true, // Whether to actually enable / load API v2 code on startup
    },
  };
  