const nextMdx = require('@next/mdx');

const withMDX = nextMdx({
    extension: /\.mdx?$/,
    options: {providerImportSource: '@mdx-js/react'}
});

// const tsLoaderConfig = 

/** @type {import('next').nextConfig} */
nextConfig = {
    // webpack: (config) => {
    //     config.module.rules.push()
    // },
    reactStrictMode: true,
    images: { unoptimized: true, },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
};

module.exports = withMDX(nextConfig);