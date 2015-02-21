# Reshare

Reshare is a TIY homework assignment.

## Description

Reshare is a project that allows users to share, vote, tag, and comment on
resources. It's like news.ycombinator.com, except with a focus on sharing
developer tools.

## Getting up and running

You may want to fork this repo instead of just copying it. That way, if I make
bug fixes to the API (highly likely), you can pull them down pretty easily.

After you've gotten the repo, you'll need to npm install as per usual.

This can't be deployed to GitHub pages, either, since it is a server-app. We'll
worry about deploying it later, and we'll probably do it together in class.

### Your .env file

You'll aslo need a `.env` file which I have not checked in, since it contains
private keys and things of that nature. The `.env` file goes in your project's
root directory (along side the .gitignore, gulpfile.js, etc).

Here's what it should look like, except you'll want your own GITHUB_CLIENT_ID,
and GITHUB_CLIENT_SECRET:

    GITHUB_CLIENT_ID=234h5k2jh35kj23h45
    GITHUB_CLIENT_SECRET=k2hk2jh35kj2h35kj23h5kj2h435k2
    APP_SUPER_ADMIN=chrisdavies
    SESSION_SECRET=topsecretsessionkey

To get a client ID and client secret, you'll need to register your
application by going here:

https://github.com/settings/applications/new

And use these settings:

    Homepage URL: http://localhost:3000

    Authorization callback URL: http://localhost:3000/auth

For the other values (app name and description), you can use whatever you like.

When your registration is complete, you'll be given some keys:

    Client ID
    2g4342hg33jh42j3h423
    Client Secret
    23h4j23hkh23kj5h2kh5k2jh345kj2h42kj345

Put those into your `.env` file.

### Admins

If you wish to make yourself the admin, of your reshare site, edit the .env
file in your project.

Find this line:

    APP_SUPER_ADMIN=chrisdavies

And change chrisdavies to be your GitHub username.

Admins add other admins via the API. They can also do some tasks that other
users can't, such as disabling user accounts.

### Persistence

Reshare is written with an in-memory database called NEDB. What this means
for you is that any time you restart the server (e.g. stop and start gulp),
all of your data is lost.

Obviously, this isn't a production-ready API! But it is easy to download and
run locally (no database installation required).

## Authentication

Authentication is done via GitHub credentials. To prompt the user to login,
send them to:

    /auth/github

To log the user out, send them to:

    /logout

You'll probably want to add logic to handle 401 (unauthorized) responses
from the API and indicate to the user that they need to log in.

## API

The reshare API is a minimal Node API. There is little in the way of server
validation or rules...

Unless otherwise noted, each API call requires authentication.

Here is what the API looks like:

### Users

#### Get users:

    GET /api/users

Authentication not required

Returns a list of users, e.g.

    [{
      _id: 'rwewer0923402370'
      userId: 'githubid',
      role: 'admin'
    }]

#### Get currently logged in user:

    GET /api/users/me

Returns a single user, e.g.

    {
      _id: 'mongoid',
      userId: 'githubid',
      role: 'user'
    }

#### Get a single user by id:

    GET /api/users/:id

Here, :id is the value of the user's github id. Returns a single user.

Example:

    /api/users/chrisdavies

Authentication not required

Returns a single user:

    {
      _id: '32043248208203',
      userId: 'chrisdavies',
      role: 'user'
    }

#### Add a user:

    POST /api/users

Only admins can make this call.

However, users are also created automatically if someone logs in with
GitHub credentials.

The post value should be a user object, e.g.

    {
      userId: 'githubidofuser',
      role: 'admin'
    }

Note, role is required, and must be either 'admin', or 'user'.

#### Disable a user:

    DELETE /api/users/:id

Only admins can make this call.

Marks the specified user as disabled, but doesn't actually delete his/her
record from the database

### Resources

#### List resources:

    GET /api/res

Authentication not required

Gets an array of resources which have been shared, e.g.

    [{
      url: 'http://google.com',
      description: 'A good search engine',
      tags: ['search-engines', 'google'],
      upvotes: 1,
      downvotes: 3,
      userId: 'githubid of user that created this',
      _id: 'id of this resource'
    }]

#### Get a single resource by id:

    GET /api/res/:id

Authentication not required

Gets a single resource, e.g.

    {
      url: 'http://google.com',
      description: 'A good search engine',
      tags: ['search-engines', 'google'],
      upvotes: 1,
      downvotes: 3,
      userId: 'githubid of user that created this',
      _id: 'id of this resource'
    }

#### Upsert a resource

    POST /api/res

Creates a resource, or overwrites one, if there is already a resource for the
specified url.

The post body should be JSON that looks something like:

    {
      url: 'http://google.com',
      description: 'A good search engine',
      tags: ['search-engines', 'google']
    }

#### Delete a resource:

    DELETE /api/res/:id

Only an admin or the person who created the resource should be
allowed to call this

:id is the _id of the resource

### Voting

Vote on a resource:

    POST /api/res/:id/votes

To upvote, post:

    { vote: 1 }

To downvote, post:

    { vote: -1 }

To clear the user's vote, post:

    { vote: 0 }

### Comments

#### List all comments for a resource:

    GET /api/res/:res_id/comments

Authentication not required

Gets a list of all comments, looking something like:

    [{
      userId: 'the github id of the commenter',
      text: 'The comment text',
      created: 'the ISO date when the comment was created',
      subjectId: 'the id of the object being commented on (usually a resource)'
    }]

#### Add a comment to a resource:

    POST /api/res/:res_id/comments

Adds a comment to the specified resource.

    {
      text: 'The comment text'
    }

#### Delete a comment:

    DELETE /api/res/:res_id/comments/:id

Only admins or the commenter should be allowed to delete a comment

:res_id is the id of the resource

:id is the _id of the comment
