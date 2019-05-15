# Simple Chat

A simple chat app with a [Django](https://github.com/django/django) API and [React](https://github.com/facebook/react) front-end made for the purposes of learning.

# Dependencies
 + Django: `~2.2.0`
 + React: `^16.8.6`
   * `react-dom: ^16.8.6`                                                                                                                                                                                    
   * `react-scripts: 3.01`

# API

### Base Url: 
`https://oxson.pythonanywhere.com/api/`
 *Note: not yet active (the above link leads nowhere)*

## Objects:
 + `Channel`: a collection of grouped messages that can be posted to or read from
 
    | field | type   | description                 |
    | ----- | ------ | --------------------------- |
    | name  | string | the name of the new Channel |
 + `Message`: a message posted to a channel by a user
 
    | field | type   | description                 |
    | ----- | ------ | --------------------------- |
    | author  | ForeignKey | user that posted the message |
    | text  | string | content of the message |
    | timestamp  | DateTime | time message was posted |
    | channel  | ForeignKey | Channel to which the message belongs |

## Endpoints:
 + `Channels`
    * `GET:` Returns a list of all registered Channels
    * `POST:` Creates a new Channel
    
    | field | type   | description                 |
    | ----- | ------ | --------------------------- |
    | name  | string | the name of the new Channel |
 + `Channels/<int:ChannelId>`
    * Returns Channel object corresponding to ChannelId
 + `Channels/<int:ChannelId>/messages`
    * `GET:` Returns a list of Messages
    * `POST:` Posts a Message
    
    | field | type | description |
    | ----- | ----| -------|
    | text | string | the content of the message to be posted |
