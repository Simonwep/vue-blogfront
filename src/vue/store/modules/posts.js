import {fetchGraphQL} from '../../../js/utils';
import config         from '../../../../config/config';

export const posts = {

    namespaced: true,

    state: [],

    actions: {

        async update({state}) {
            return this.dispatch('graphql', {
                query: `
                       query {
                           getAllPosts {
                               id,
                               title,
                               body,
                               timestamp,
                               user {
                                   id,
                                   username,
                                   fullname                                 
                               }
                           }
                       }
                `
            }).then(({errors, data: {getAllPosts}}) => {

                if (errors && errors.length) {
                    // TODO: Log?
                } else if (Array.isArray(getAllPosts)) {
                    state.splice(0, state.length, ...getAllPosts);
                }

            });
        },

        async newPost({state, rootState}, {title, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                variables: {title, body, apikey},
                query: `
                       query Post($apikey: String!, $title: String!, $body: String!) {
                           post(apikey: $apikey, title: $title, body: $body) {
                               id,
                               timestamp
                           }
                       }
                `
            }).then(({errors, data}) => {

                if (errors && errors.length) {
                    return Promise.reject(errors[0].message);
                } else {
                    const {id, timestamp} = data.post;
                    state.splice(0, 0, {
                        id,
                        timestamp,
                        title,
                        body,
                        user: {
                            ...rootState.auth.user
                        }
                    });
                }

            });
        }
    }
};
