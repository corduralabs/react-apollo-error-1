/*** SCHEMA ***/
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString, resolve: (source) => people.find((p) => p.id ===source.id)?.name },
  },
});

const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: { type: GraphQLID },
    author: { 
      type: PersonType, 
      resolve: (obj) => {
        const msg = messages.find((m) => m.id === obj.id);
        return msg ? { id: msg.authorId } : null;
      } 
    },
    body: {type: GraphQLString },
    conversation: { 
      type: ConversationType,  
      resolve: (obj) => {
        const msg = messages.find((m) => m.id === obj.id);
        return msg ? { id: msg.conversationId } : null;
      }
    },
  })
})

const ConversationType = new GraphQLObjectType({
  name: 'Conversation',
  fields: {
    id: { type: GraphQLID },
    messages: { 
      type: new GraphQLList(MessageType ),
      args: {
        startIndex: { type: GraphQLInt },
        endIndex: { type: GraphQLInt },
      },
      resolve: (obj, { startIndex, endIndex }) => {
        return messages.filter((m) => m.conversationId === obj.id).slice(startIndex, endIndex);
      }
    },
  }
})


const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    conversation: {
      type: ConversationType,
      args: { id: { type: GraphQLID } },
      resolve: (_, { id }) => ({ id })
    }
  },
});


export const schema = new GraphQLSchema({ query: QueryType });

/******************
 *      Data      *
 ******************/

const people = [
  { id: 1, name: 'Neville' },
  { id: 2, name: 'Phil Z' },
  { id: 3, name: 'Nick' },
];

const messages = [
  { id: 'msg-1', body: 'hi', authorId: 1, conversationId: 'c-1' },
  { id: 'msg-2', body: 'hello', authorId: 2, conversationId: 'c-1' },
  { id: 'msg-3', body: 'yoyo', authorId: 3, conversationId: 'c-1' },
  { id: 'msg-4', body: 'bye', authorId: 1, conversationId: 'c-1' },
  { id: 'msg-5', body: 'ciao', authorId: 2, conversationId: 'c-1' },
  { id: 'msg-6', body: 'adios', authorId: 3, conversationId: 'c-1' },
]