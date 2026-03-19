import { build } from 'vite';

(async () => {
  try {
    await build();
    console.log('Build successful');
  } catch (err) {
    console.error('BUILD FAILED:');
    console.error(err.message);
    if (err.frame) console.error(err.frame);
    if (err.id) console.error('In file:', err.id);
    if (err.loc) console.error('At:', err.loc);
  }
})();
