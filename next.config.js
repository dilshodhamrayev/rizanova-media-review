const { i18n } = require('./next-i18next.config');

module.exports = {
    reactStrictMode: false,
    images: {
        domains: ['api.rizanova.uz', 'files.rizanova.uz'],
    },
    // distDir: 'build',

    // i18n: {
    //     // These are all the locales you want to support in
    //     // your application
    //     locales: ['uz', 'ru'],
    //     // This is the default locale you want to be used when visiting
    //     // a non-locale prefixed path e.g. `/hello`
    //     defaultLocale: 'uz',
    //     localeDetection: false
    // },

    i18n,

    async rewrites() {
        return [
            {
                source: '/clip/singer',
                destination: '/music/singer'
            }
        ];
    },

    presets: ["next/babel"]
}
