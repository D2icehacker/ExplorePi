import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse,userAgent } from "next/server";
import { translate } from "./translate-config";


function getLocale (req){
    const negoHeader = {} 
    req.headers.forEach((val,key) => {
        negoHeader[key] = val
    });

    let langs = new Negotiator({headers:negoHeader}).languages()
    const locals = translate.locales
    return match(langs,locals,translate.default)
}

export function middleware(req){
    const {ua,device} = userAgent(req)


    if(ua.toLowerCase().includes("pibrowser") && device.type === 'mobile'){
        let locale = getLocale(req)
        return NextResponse.redirect(new URL(`/${locale}/pibrowser/explorer`, req.url))        
    }

    if(req.nextUrl.pathname.startsWith('/_next')) return

    const path = req.nextUrl.pathname
    const checkismissing = translate.locales.every(
        locale => !path.startsWith(`/${locale}/`) && path !== `/${locale}`
    )
    console.log(checkismissing)
    if (checkismissing) {
        let locale = getLocale(req)
        return NextResponse.redirect(new URL(`/${locale}/${path}`, req.url))
      }
}
export const config = {
    matcher: ['/'],
  }