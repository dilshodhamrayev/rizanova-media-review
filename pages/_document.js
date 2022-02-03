import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="RizaNova" />
                    <meta property="og:url" content="https://rizanova.uz" />

                    <link rel="preload" as="style" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha512-SfTiTlX6kk+qitfevl/7LibUOeJWlt9rbyDn92a1DqWOw9vWG2MFoays0sgObmWazO5BQPiFucnnEAjpAB+/Sw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    <link rel="preload" as="style" href="/css/bootstrap-grid.min.css" />
                    <link rel="preload" as="style" href="/css/bootstrap-utilities.min.css" />
                    <link rel="preload" as="style" href="/font/proximanova/stylesheet.css" />
                    <link rel="preload" as="style" href="/css/components.css?12" />

                    <link rel="preload" as="style" href="/css/style.css?12" />
                    <link rel="preload" as="style" href="/css/media.css?12" />
                    <link rel="preload" as="style" href="/css/theme.css?12" />

                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha512-SfTiTlX6kk+qitfevl/7LibUOeJWlt9rbyDn92a1DqWOw9vWG2MFoays0sgObmWazO5BQPiFucnnEAjpAB+/Sw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    <link rel="stylesheet" href="/css/bootstrap-grid.min.css" />
                    <link rel="stylesheet" href="/css/bootstrap-utilities.min.css" />
                    <link rel="stylesheet" href="/font/proximanova/stylesheet.css" />
                    <link rel="stylesheet" href="/css/components.css?12" />

                    <link rel="stylesheet" href="/css/style.css?12" />
                    <link rel="stylesheet" href="/css/media.css?12" />
                    <link rel="stylesheet" href="/css/theme.css?12" />

                </Head>
                <body>
                    <Main />

                    <script type="text/javascript" src="/js/jquery-3.6.0.min.js"></script>
                    <script type="text/javascript" src="/js/main.js"></script>

                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument