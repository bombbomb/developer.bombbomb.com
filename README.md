# developer.bombbomb.com

[![Build Status](https://travis-ci.org/bombbomb/developer.bombbomb.com.svg?branch=master)](https://travis-ci.org/bombbomb/developer.bombbomb.com)

Generates the site at [developer.bombbomb.com](https://developer.bombbomb.com)

To do:
 - Get Webhooks listed
 
 For more information on Jekyll, see https://jekyllrb.com.

## Install Jekyll

To install a development environment, install ruby on your machine, then:
 
    gem install jekyll bundler

If you're using Mac OS X, Ruby is already installed but you may see an error reading

    ERROR:  Error installing jekyll:
        public_suffix requires Ruby version >= 2.1.

If this happens, you'll need a newer version of Ruby. The easiest way to do this is to install the [Homebrew](https://brew.sh) package manager. Once that's done, install Ruby with 

    brew install ruby

Then repeat the step above with an absolute path, to use the new version of Ruby:

    /usr/local/bin/gem install jekyll bundler

## Install extra gems

When the above is finished, bundle will need to complete its installation:

    bundle install

## Run Jekyll
To host a development environment:
 
    bundle exec jekyll serve
 
Then you can access your local development site at [http://localhost:4000](http://localhost:4000) changes to file contents are automatically reflected here.

RipSecrets<br><br>
We implement pipeline secret scanning on all pull request events to prevent credentials from being merged. If the pipeline scanner detects a secret in your changed files it will gate the pull request and you will need to purge the found credential from your code and re-open the PR. To prevent getting gated by this tool and as best practice you should install the secret scanner locally in a pre-commit hook to prevent the secret from ever being committed to the repo in the first place. You can find documentation on how to set it up locally [here](https://bombbomb.atlassian.net/wiki/spaces/CORE/pages/2039775312/Pipeline+Secret+Scanner+Local+Setup)<br>
Ripsecrets has ways to bypass secret scanning although we should not be ignoring secrets that turn up in the scans. If something is out of your control and blocking the pipeline you can bypass it in one of the following ways<br>
1. Adding "# pragma: allowlist secret" to the end of the line with the secret.<br>
2. Adding the specific secret underneath the "[secrets]" block in .secretsignore<br>
3. Adding the filepath to ignore the whole file aboove the "[secrets]" block in .secretsignore