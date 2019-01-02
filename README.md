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
