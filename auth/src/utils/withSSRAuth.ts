import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from 'nookies'
import decode from 'jwt-decode'
import {  destroyCookie } from 'nookies'
import { AuthTokenError } from "../../services/errors/AuthTokenError";

type withSSRAuthOptions = {
    permissions: string[],
    roles: string[],
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?:withSSRAuthOptions ) {

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);
        const token = cookies['nextauth.token']
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }

        const user  = decode(token)

        console.log(user);
        
        
        try {
            return await fn(ctx)
        } catch (err) {
    
            if(err) {
                if (err instanceof AuthTokenError) {
                    destroyCookie(ctx, 'nextauth.token' )
                    destroyCookie(ctx, 'nextauth.refreshToken' )
            
                    return {
                        redirect: {
                            destination: '/',
                            permanent: false,
                        }
                }
            }
          
            }
        }
    }
}

