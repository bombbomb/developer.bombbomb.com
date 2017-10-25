---
title: Data Detection in Swift
author: Tom Harrington
---

I have a love/hate relationship with regular expressions. I **love** them because they're great for examining text to find useful information and, often, to change the text in some way. I **hate** them because once you get beyond basic matching, they descend into bizarre [write-only code](https://en.wikipedia.org/wiki/Write-only_language) that gives me flashbacks to my days writing Perl. In extreme cases they may well [endanger the universe](https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags/1732454#1732454). And so we come to one of my recent coding issues: How can I find out if a string contains a valid email address?

<!--more--> 

Of course you can't be completely sure an email address is valid without sending an email and then checking to see if anyone received it. That second half can't be done reliably in code either-- you may just need to ask someone. But addresses follow [specific rules outlined in RFC 5322](https://tools.ietf.org/html/rfc5322#section-3.4), so it should be possible to check the syntax to see if it **could** be valid.

Enter regular expressions. Maybe. They certainly seem like the right tool for this job.

## So About that Regex...

If you hesitate before writing out the regex, you're not alone. The rules are a little more subtle than they seem. Did yours allow, for example, for a `+` in the middle of the `local-part` (the stuff before the `@`)? It's legal. So are a variety of other things that might not be immediately obvious.

There's [no shortage of people with ideas](https://stackoverflow.com/search?q=email+address+regular+expression) on how to write this regex. None of them agree with each other. The [highest-rated Stack Overflow answer](https://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address) presents this, along with a state diagram describing it:

    (?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])

Maybe you can read that, and maybe I could if I had a week to spare, but I'd wager almost nobody even tries.

In an iOS app I could just drop that into `NSRegularExpression`, and it would probably work. Maybe I'd need to add some backslashes to escape some characters. But you know what? I'm writing iOS apps, and Apple has a better solution.

## Data Detectors

There's a lot in Apple's Foundation framework. It's had literally decades to accumulate useful stuff. Several years ago, iOS 4 added a new class called `NSDataDetector`. Its purpose is to scan arbitrary text and find useful details. Sound like something we could use here?

When `NSDataDetector` scans a string, you can tell it which types of information you want. The docs for [NSTextCheckingResult.CheckingType](https://developer.apple.com/documentation/foundation/nstextcheckingresult.checkingtype) list all kinds of useful options. Links, telephone numbers, dates, and addresses, to name a few. If you want to really get into it you can ask it to look for transit information (like flight details) or check grammar. Email addresses get wrapped up with the "link" type, which is what I'm interested in here.

You create a data detector to match one or more data types:

```swift
let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)
```

That gives us a data detector that looks only for links. The `types` argument is a little odd here. The `CheckingType` conforms to `OptionSet`, but I wasn't able to get a more Swift-y version of the argument value to work.

Now that we have a detector we can ask for every link match in a string:

```swift
let myString = // some string we want to parse
let matches = detector.matches(in: myString, options: [], range: NSMakeRange(0, myString.count))
```

This produces an array of `NSTextCheckingResult`, one per discovered data item. Matches have a variety of optional properties that may be set depending on what kind of match an instance represents. Here we only asked for `.link` matches, so every result will include a value for the `url` property, which will be an instance of `URL`. Other match types use other properties-- `phoneNumber`, or `addressComponents` for example.

We're not done though, because `.link` will also match plain URLs found in text. We'll need to run through the matches to find what we need. Email addresses are represented as `mailto:` URLs here (because they're treated as links), so we'll look for that.

```swift
var addresses = [String]()

for match in matches {
    if let matchURL = match.url,
        let matchURLComponents = URLComponents(url: matchURL, resolvingAgainstBaseURL: false),
        matchURLComponents.scheme == "mailto"
    {
        let address = matchURLComponents.path
        addresses.append(String(address))
    }
}
```

This code loops over the matches. For each one, it checks to see if the URL uses `mailto:`. If so, it extracts the email address and adds it to an array.

There's one detail that might seem a little odd. I'm creating an instance of `URLComponents` to get the address, when it looks like the original `URL` would work on its own. Both classes have a `path` property, after all. Why the extra step? Well, remember what I said about Foundation having literally decades of history? That also means there's some old cruft in places. `URL` parses URLs according to [RFC 1808](https://tools.ietf.org/html/rfc1808). That RFC was obsoleted by [RFC 3986](https://tools.ietf.org/html/rfc3986) back in 2005. `URL` still uses the older RFC, probably because changing it would break existing code. The upshot is that `URL` can't extract the email address, but `URLComponents` can. But since `NSTextCheckingResult` still produces a `URL`, the code above needs to convert.

## Extending String

This all comes together nicely in an extension to `String`.

```swift
extension String {
    /** Get email addresses in a string, discard any other content. */
    func emailAddresses() -> [String] {
        var addresses = [String]()
        if let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue) {
            let matches = detector.matches(in: self, options: [], range: NSMakeRange(0, self.count))
            for match in matches {
                if let matchURL = match.url,
                    let matchURLComponents = URLComponents(url: matchURL, resolvingAgainstBaseURL: false),
                    matchURLComponents.scheme == "mailto"
                {
                    let address = matchURLComponents.path
                    addresses.append(String(address))
                }
            }
        }
        return addresses
    }
}
```

Using this, you can take any string, call `emailAddresses()` on it, and get an array of all addresses in the string. Any extra content is ignored. For example,

```
"foo@bar.com".emailAddresses() // produces ["foo@bar.com"]
"my address is foo@bar.com".emailAddresses() // also produces ["foo@bar.com"]
"foo@bar.com bar@foo.com".emailAddresses() // produces ["foo@bar.com", "bar@foo.com"]
"Zip a dee doo dah".emailAddresses() // produces an empty array
```

This extension lends itself to a variety of UI rules. If only one email address is allowed, check that the address array has exactly one entry. If you also require that there must be no extraneous characters, add a check that the address length is the same as the original string length.

The end result is probably more or less what we'd get using a regular expression. `NSDataDetector` is a subclass of `NSRegularExpression`, after all, so it very likely uses one or more regular expressions under the hood. Using this approach means that I get to write code that I can read, though, which is always a plus. It also means that I get to have Apple engineers writing my regular expressions instead of dropping in a long string of line noise-like characters that I can only pretend to understand. I'll call it a win.
