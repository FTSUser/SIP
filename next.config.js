
const withSass = require('@zeit/next-sass')
const path = require('path')
const imageDomain = process.env.NEXT_PUBLIC_STRAPI_API_URL && process.env.NEXT_PUBLIC_STRAPI_API_URL.replace(/.*\:\/\/?([^\/|:]+).*/g, '$1') || "";
module.exports = withSass({
    /* bydefault config  option Read For More Optios
    here https://github.com/vercel/next-plugins/tree/master/packages/next-sass*/
    cssModules: true
})

module.exports = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ?  'https://api.sip.rejoicehub.com/api' // development api
            :  'https://api.sip.rejoicehub.com/api' // production api
    },
    
    /* Add Your Scss File Folder Path Here */
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{
                loader: "@svgr/webpack",
                options: {
                    svgoConfig: {
                        plugins: {
                            removeViewBox: false
                        }
                    }
                }
            }]
        });
        return config;
    },
    images: {
        domains: ["res.cloudinary.com", imageDomain],
    },
}
