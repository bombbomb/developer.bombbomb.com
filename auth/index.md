---
layout: blogPost
title: OAuth2 Authentication Guide
author: Thomas Pendergrass
---

## Overview
Authenticating with BombBomb allows you to securely utilize our API on behalf of BombBomb users.
To complete the authentication process, you must create an OAuth Client, get a BombBomb user's approval, and acquire 
tokens. This guide will walk you through that process and also inform you on how to use the tokens once you have them.

<pre>Note: In this guide, text highlighted in <span style='color:red'>red</span> will represent variables specific to 
you.</pre>

## Create an OAuth Client

An OAuth Client represents your application. You must have a BombBomb account in order to create a client.


To create a client, use the "Create an OAuth Client" interface.

<center><a href="/api/#!/Utilities/CreateOAuthClient" class="btn btn-primary" target="_blank">Create an OAuth Client</a></center>

Click the OAUTH button at the bottom right to set your scope. select the all:manage button so the interface can generate
your OAuth Client. Click the Authorize button.

You will be redirected to an authorization page. you will need to log in to your account and  click 'Allow'. 

Once authorized, fill in the parameters. The 'name' parameter allows you to easily identify your OAuth Client, in the
case that you have more than one. The 'redirectUri' parameter is the web page the user is sent to after approving your
request for an access token.

Click on the 'Try' button to view information about your new OAuth Client. You will need 
<span style="color:red;">client_secret</span>, <span style="color:red;">redirect_uri</span>, and 
<span style="color:red;">identifier</span> to make authenticated API requests.

## Get User Approval
For users to grant access to your client, send them to the following hyperlink:

<pre>https://app.bombbomb.com/auth/authorize?client_id=<span style="color:red;">identifier</span>&scope=all:manage&redirect_uri=<span style="color:red;">redirect_uri</span>&response_type=code</pre>

Users will be directed to a screen stating that your client would like permission to access their account. Once the user 
accepts the request, they will be sent to the redirect URI you specified. The URI will contain a parameter named 'code' 
which contains the URL encoded <span style='color:red'>authorization_code</span>. You will need to decode the 
<span style="color:red;">authorization_code</span> for use in acquiring an access token.

## Acquire Tokens
You will need to send a POST request to the following url:

<pre>https://app.bombbomb.com/auth/access_token</pre>
    
- The content Type must be set to application/json.
- The following JSON body must be included:
    
<pre>
{
    grant_type : authorization_code,
    client_id : <span style="color:red;">identifier</span>,
    client_secret : <span style="color:red;">client_secret</span>,
    redirect_uri : <span style="color:red;">redirect_uri</span>,
    code : <span style="color:red;">authorization_code</span>
}
</pre>

You will receive a response containing an access_token and refresh_token, along with the remaining time the access token 
is valid (in hours).
    
<pre>
{    
    token_type : Bearer,
    expires_in : 3600,
    access_token : <span style="color:red;">access_token</span>
    refresh_token : <span style="color:red;">refresh_token</span>
}
</pre>

Keep the <span style="color:red;">access_token</span> and <span style="color:red;">refresh_token</span> in a secure 
location.

## Use Tokens

Use the access token for any API requests you make pertaining to the user. Do so by adding an Authorization header to 
your request.

<pre>Bearer <span style="color:red;">access_token</span></pre>

The access token will expire after a set amount of hours. When this occurs, you can use the refresh token to gain a new 
access token. To use the refresh token, POST to the following url:

<pre>https://app.bombbomb.com/auth/access_token</pre>
    
- The content type must be set to application/json
- The following JSON body must be included:

<pre>
{
    grant_type : refresh_token,
    client_id : <span style="color:red;">identifier</span>
    client_secret : <span style="color:red;">client_secret</span>
    refresh_token : <span style="color:red;">refresh_token</span>
}
</pre>

You will receive a new <span style="color:red;">access_token</span> and <span style="color:red;">refresh_token</span>.