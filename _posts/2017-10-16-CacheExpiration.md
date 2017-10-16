---
title: Easy Cloudfront cache-busting with Travis-CI
author: Patrick McDavid
---

This site is hosted on AWS' S3 via Cloudfront which is an easy way to keep it online with minimal concern at runtime. We're trying to get more contributors to this project in support of our [OpenAPI docs](/api), this blog, and other odds and ends.

<!--more-->

Cloudfront is good both for speed, but more importantly for us, for it's custom SSL offering, which ensures that the content you see on the site came from us.

A side-effect of this from our perspective is the default 24-hour cache that Cloudfront uses in their CDN. This meant that changes to this site could take up to a day before they'd go live without some manual intervention.

The optimal solution would be to invalidate the caches on just what's changed on a publish event. Another option would be to [invalidate the whole cache](https://renzo.lucioni.xyz/s3-deployment-with-travis/).

We chose a one-liner: configure our S3 objects to have a TTL of a few minutes. [Adding just one line](https://github.com/bombbomb/developer.bombbomb.com/commit/0f6806032273b825e8f1beff57dc04a7f27317b9) to our `.travis.yml` achieves our desired affect, the site shows the latest information within a couple minutes.

```
  cache_control: "max-age=120"
```

You can [read the pertinent travis-ci docs here](https://docs.travis-ci.com/user/deployment/s3/#HTTP-cache-control).

A downside here is that your cache is going to miss more often. Depending on the traffic to your site this will affect latency somewhat. For our use case, this wasn't a major concern, at least for now.

![Too Easy]({{ "/img/blog_imgs/easy.gif" | absolute_url }})
