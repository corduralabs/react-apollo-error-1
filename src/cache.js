import { InMemoryCache } from "@apollo/client";

export default new InMemoryCache(
    {
        typePolicies: {
            Conversation: {
                fields: {
                    messages: {
                        keyArgs: false,
                        merge: (existing, incoming, { readField }) => {
                            console.log('Incoming message ids:', incoming.map((m) => readField('id', m)))
                            return incoming;
                        }
                    }
                }
            }
        }
    }
)