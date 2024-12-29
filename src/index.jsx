/*** APP ***/
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  gql,
  useQuery,
} from "@apollo/client";

import cache from './cache.js';
import { link } from "./link.js";
import { Subscriptions } from "./subscriptions.jsx";
import { Layout } from "./layout.jsx";
import "./index.css";

const CONVERSATION = gql`
  query GetConversation($id: ID!, $start: Int!, $end: Int!) {
    conversation(id: $id) {
      id
      messages(startIndex: $start, endIndex: $end) {
        id
        author {
          id
          name
        }
        body
        conversation {
          # !!! including this recursive id causes readField('id', message) to return null in merge callback !!!
          id 
        }
      }
    }
  }
`

function App() {
  const conversationQuery = useQuery(CONVERSATION, { variables: { id: 'c-1', start: 0 , end: 2 }})
 
  return (
    <main>
      <h3>Home</h3>
      <h2>Conversation</h2>
      {
        conversationQuery.loading ? (<p>Loading...</p>) :
        (
          <ul>
            {
              conversationQuery.data?.conversation?.messages.map(
              (m) => (<li key={m.id}>{`[${m.id}] ${m.author.name}: ${m.body}`}</li>))
            }
          </ul>
        )
      }
    </main>
  );
}


const client = new ApolloClient({ cache, link });

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="subscriptions-wslink" element={<Subscriptions />} />
        </Route>
      </Routes>
    </Router>
  </ApolloProvider>
);

