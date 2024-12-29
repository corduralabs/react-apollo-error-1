# Broken `readField` with circular reference

This is a repro for the issue reported [here](https://github.com/apollographql/apollo-client/issues/9315).  The issue is that `readField` provided to merge callbacks does not resolve correctly when there is a circular reference in the object being merged.

In this example we have a type `Conversation` which includes a field `messages` pointing to a list of type `Message`.  Each message includes a reference to the conversation it is a part of.  The query includes this reference:
```
    conversation(id: $id) {
      id
      messages {
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
```

For pagination purposes, we need to define a merge function for the `messages` field on `Conversation` and use `readField` to try to read fields of the message.  In this repro we simply try to read the `id` field.

### Expected Outcome
`readField('id', msg)` should return the message id.

### Actual Outcome
It returns `undefined` when the recursive conversation reference is included in the message.  If the reference is removed then it correctly returns the id.

