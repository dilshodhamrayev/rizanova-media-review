import { withIronSession } from 'next-iron-session'

export default function withSession(handler) {
    return withIronSession(handler, {
        password: "*&@F*(&WTFGW(*Q&FWTYQ*&$WFY*HS*GASDC12312@",
        cookieName: '_rn_cookie',
        cookieOptions: {
            // the next line allows to use the session in non-https environments like
            // Next.js dev mode (http://localhost:3000)
            secure: false //process.env.NODE_ENV === 'production' ? true : false,
        },
    })
}