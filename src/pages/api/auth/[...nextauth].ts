import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';

export default NextAuth({

    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: { params: { scope: 'read:user' } },
        }),

    ],
    callbacks: {
        async signIn({ user }) {

            const { email } = user;

            try {
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match( // parecido com o where do sql
                                    q.Index('user_by_email'),
                                        q.Casefold(user.email)
                                ) 
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }
                        ),
                        q.Get( //select
                            q.Match( // parecido com o where do sql
                                q.Index('user_by_email'),
                                    q.Casefold(user.email)
                                )
                        )
                    )
                )
                return true;

            } catch {
                return false;
            }
        },

    }
})
