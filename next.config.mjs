import nextMdx from '@next/mdx';
import remarkGfm from 'remark-gfm';

const withMDX = nextMdx({
    extension: /\.mdx?$/,
    options: {
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
    }
});

/** @type {import('next').nextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.experiments.topLevelAwait = true;
        return config;
    },
    eslint: {ignoreDuringBuilds: true,},
    typescript: {ignoreBuildErrors: true,},
    reactStrictMode: true,
    images: { unoptimized: true, },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
};

export default withMDX(nextConfig);