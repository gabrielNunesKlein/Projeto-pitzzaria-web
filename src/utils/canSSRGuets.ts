import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export function canSSRGuest<P>(fn: GetServerSideProps<P>){

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookeis = parseCookies(ctx);

        if(cookeis['@nextauth.token']){

            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false
                }
            }

        }

        return await fn(ctx);
    }

}