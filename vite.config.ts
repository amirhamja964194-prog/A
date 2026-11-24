import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({command}) => {
  const buildId = command === 'build' ? `build-${Date.now()}` : 'dev';

  return {
    define: {
      __APP_BUILD_ID__: JSON.stringify(buildId),
    },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'wbsec-build-meta',
        apply: 'build',
        closeBundle() {
          const outDir = path.resolve(import.meta.dirname, 'dist');
          fs.mkdirSync(outDir, {recursive: true});
          fs.writeFileSync(
            path.join(outDir, 'build-meta.json'),
            JSON.stringify({buildId, builtAt: Date.now()}, null, 2),
            'utf-8',
          );
        },
      },
      {
        name: 'wbsec-dev-manifest-link',
        apply: 'serve',
        transformIndexHtml() {
          return [
            {
              tag: 'link',
              attrs: {
                rel: 'manifest',
                href: '/manifest.webmanifest',
              },
              injectTo: 'head',
            },
          ];
        },
      },
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png'],
        manifest: {
          id: '/',
          name: 'Wbsec — AI Teacher',
          short_name: 'Wbsec',
          description:
            'West Bengal Board AI Teacher with live voice tutor, interactive quizzes, camera problem solving, and Bengali dictionary.',
          theme_color: '#05060d',
          background_color: '#05060d',
          display: 'standalone',
          display_override: ['standalone', 'minimal-ui'],
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          prefer_related_applications: false,
          categories: ['education', 'books', 'productivity'],
          launch_handler: {
            client_mode: 'navigate-existing',
          },
          shortcuts: [
            {
              name: 'AI Live (সরাসরি কথা)',
              short_name: 'AI Live',
              description: 'সরাসরি AI শিক্ষকের সাথে বাংলায় কথা বলুন',
              url: '/?action=live',
              icons: [{src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png'}],
            },
            {
              name: 'কুইজ তৈরি করুন (Quiz)',
              short_name: 'Quiz',
              description: 'যেকোনো টপিকে ৪ অপশনের কুইজ দিন',
              url: '/?action=quiz',
              icons: [{src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png'}],
            },
            {
              name: 'বাংলা অভিধান',
              short_name: 'Dictionary',
              description: 'শব্দের অর্থ, সন্ধি বিচ্ছেদ ও ব্যাকরণ জানুন',
              url: '/?action=dictionary',
              icons: [{src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png'}],
            },
          ],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          navigateFallback: null,
          globPatterns: ['**/*.{js,css,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: ({request}) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'wbsec-html-nav-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/(?:api\/config|build-meta\.json)/i,
              handler: 'NetworkOnly',
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/(cdn\.jsdelivr\.net|unpkg\.com)\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'jsdelivr-wasm-cache',
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/tessdata\.projectnaptha\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'tessdata-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            return undefined;
          },
        },
      },
    },
    worker: {
      format: 'es',
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'lucide-react',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
