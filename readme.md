# Reshare

Reshare is a TIY homework assignment.

## Description

Reshare is a project that allows users to share, vote, tag, and comment on
resources. It's like news.ycombinator.com, except with a focus on sharing
developer tools.

## Authentication

Authentication is done via GitHub credentials. To prompt the user to login,
send them to:

    /auth/github

## API

The reshare API is a minimal Node API. There is little in the way of server
validation or rules... Because I was lazy!

Unless otherwise noted, each API call requires authentication.

Here is what the API looks like:

### Users

Get users:

    GET /api/users

    returns a list of users, e.g.

    [{
      _id: 'mongoid'
      userId: 'githubid',
      role: 'admin'
    }]

Get currently logged in user:

    GET /api/users/me

    returns a single user, e.g.

    {
      _id: 'mongoid',
      userId: 'githubid',
      role: 'user'
    }

Get a single user by id:

    GET /api/users/:id

    here, :id is the value of the user's github id
    returns a single user

Add a user:

    POST /api/users

    only admins can add users

    the post value should be a user object, e.g.

    {
      userId: 'githubidofuser',
      role: 'admin'
    }

    note, role is required, and must be either 'admin', or 'user'

Disable a user:

    DELETE /api/users/:id

    marks the specified user as disabled, but doesn't actually delete his/her
    record from the database

### Resources

List resources:

    GET /api/res

    Authentication not required

    Gets an array of resources, e.g.

    [{
      url: 'http://google.com',
      description: 'A good search engine',
      tags: ['search-engines', 'google'],
      upvotes: 1,
      downvotes: 3,
      userId: 'githubid of user that created this',
      _id: 'id of this resource'
    }]

Get a single resource by id:

    GET /api/res/:id

    Authentication not required

Upsert a resource:

    POST /api/res

    the post body should be JSON that looks something like:

    {
      url: 'http://google.com',
      description: 'A good search engine',
      tags: ['search-engines', 'google']
    }

Delete a resource:

    DELETE /api/res/:id

    :id is the _id of the resource

    Only an admin or the person who created the resource should be
    allowed to call this

Vote on a resource:

    POST /api/res/:id/votes

    to upvote, post:

    { vote: 1 }

    to downvote, post:

    { vote: -1 }

    to clear the user's vote, post:

    { vote: 0 }

### Comments

List all comments for a resource:

    GET /api/res/:res_id/comments

    Authentication not required

    Gets a list of all comments, looking something like:

    [{
      userId: 'the github id of the commenter',
      text: 'The comment text',
      created: 'the ISO date when the comment was created',
      subjectId: 'the id of the object being commented on (usually a resource)'
    }]

Add a comment to a resource:

    POST /api/res/:res_id/comments

    {
      text: 'The comment text'
    }

Delete a comment:

    DELETE /api/res/:res_id/comments/:id

    here, :res_id is the id of the resource
    :id is the _id of the comment

    Only admins or the commenter should be allowed to delete a comment
