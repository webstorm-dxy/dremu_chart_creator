const nextMdx = require('@next/mdx');
const withLess = require('next-with-less');

const withMDX = nextMdx({
    extension: /\.mdx?$/,
    options: {providerImportSource: '@mdx-js/react'}
});

// const tsLoaderConfig = 

/** @type {import('next').nextConfig} */
nextConfig = {
    webpack: (config) => {
        config.experiments.topLevelAwait = true;
        return config;
    },
    reactStrictMode: true,
    images: { unoptimized: true, },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
};

module.exports = withLess(withMDX(nextConfig));