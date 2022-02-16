import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from 'nookies'
import decode from 'jwt-decode'
import {  destroyCookie } from 'nookies'
import { AuthTokenError } from "../../services/errors/AuthTokenError";
import { validateUsePermissions } from "./validateUsePermissions";

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

      if (options) {
        const user  = decode<{ permissions: string[], roles: string[],}>(token);
        const {permissions, roles} = options

        const userHasValidPermissions = validateUsePermissions({
            user,
            permissions,
            roles
        })

        if (!userHasValidPermissions) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

      }

        
        
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

