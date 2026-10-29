import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://casaguapo.com',
  build: { format: 'directory' },
  // Lets pages style the Photo component through the class prop.
  scopedStyleStrategy: 'class',
});
