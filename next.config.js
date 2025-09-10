/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Configurações para melhor estabilidade do CSS
  // experimental: {
  //   optimizeCss: true,
  // },
  // Configurações de cache para CSS
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Otimizações para produção
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true,
      };
    }
    return config;
  },
}

module.exports = nextConfig