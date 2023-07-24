import nextMdx from '@next/mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const withMDX = nextMdx({
    extension: /\.mdx?$/,
    options: {
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex],
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