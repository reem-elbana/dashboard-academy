import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['swiper']
  },
  server: {
    watch: {
      // لو بتشتغل على ويندوز أو نظام ملفات بيعمل مشاكل، جرب تفعيل usePolling
      // usePolling: true, // فعّلها لو التغييرات ما بتظهرش تلقائي
      // ممكن تضيف ignored عشان تأكد ملف tailwind.config.js ما بيتجاهرش
      ignored: ['!**/tailwind.config.js'],
    }
  }
});
