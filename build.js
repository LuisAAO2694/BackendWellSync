const esbuild = require('esbuild');

esbuild
    .build({
        entryPoints: ['src/index.ts'],
        bundle: true,
        platform: 'node',
        target: 'node2022',
        outfile: 'dist/index.js',
        external: ['bcrypt'],
        sourcemap: false,
        minify: true,
    })
    .catch(() => process.exit(1));
