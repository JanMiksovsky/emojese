# The Emojese emoji language

The Emojese project explores the construction of a written language using emoji, standardizing how to write a list of 2000+ common English words in emoji and other Unicode glyphs.

When this project began in late 2020, there was no widely-accepted grammar for communicating complex thoughts in emoji. Emoji statements have been generally limited to expressing emotions, rebuses, or simple ideas directly expressible with the large but fixed vocabulary of existing emoji. Communicating ideas purely in standard emoji is made difficult by the fact that there are few or no emoji for many common verbs, pronouns, adjectives, prepositions, or abstract ideas.

Emojese is one attempt at an emoji language rich enough for interesting communication. Emojese defines a small but flexible set of grammatical constructions and standardized meanings for specific emoji. To make it easy for you to write and read messages, the Emojese app at [emojese.org](https://emojese.org) lets you convert text (currently, English) to Emojese and back.

# Goals

The primary goal is **let people have fun.** It's fun for friends to express more complex thoughts entirely in emoji in texts/chats.

In support of that primary goal:

1. A tool for writing and reading Emojese needs to be fun to use: easy enough to start without studying anything, quick, and should keep the focus on the message.
2. The tool should support the easy sending and receiving of messages using the communication tools people are already using.
3. The language should be close enough to natural language that someone can often type a conversational message in natural language and get a corresponding sentence in Emojese.
4. The emoji definitions for English words don't always have to be predictable, but once seen should be understandable and memorable.

Other goals:

1. Consider hypothetical additions to the Unicode emoji set to better express [very common words without obvious emoji](docs/Challenges.md).
2. Explore emoji as a written visual language for transmitting complex ideas between parties who do not share a common natural language — a written [international auxiliary language](https://en.m.wikipedia.org/wiki/International_auxiliary_language) that leverages exposure to emoji. Example: store posts signage in emoji so a wider range of visitors can understand it.

# Principles

## Be natural

- Strive for easy recognition and recall. Try to minimize the amount of what must be learned.
- Be a natural extension of current emoji use.
- Focus on common words.
- Be usable on existing devices. Pick emoji already in use (or arriving imminently). Use emoji as is; they cannot be rotated, resized, etc.

## Be inclusive

- The intended audience is global.
- The initial audience is English speakers in the United States, because one has to start somewhere. When possible, avoid choices that would only make sense to U.S. speakers.

## Evolve naturally

- Prioritize clarity and precision over current ease of typing. Software can catch up to make writing in this language easy.
- Keep in mind that, if the existence of a new emoji would make something substantially easier to express, such an emoji could actually be added someday.
- Grow the set of definitions slowly, ideally based on observed usage.

# Lexicon

The list of words in Emojese was drawn from various sources, including the Fluent Forever [625 Base Vocabulary Word List](https://fluent-forever.com/wp-content/uploads/2014/05/625-List-Alphabetical.pdf) and the [National University of Singapore SMS Corpus](https://scholarbank.nus.edu.sg/handle/10635/137343). The definitions include all of Randall Monroe's [The Ten Hundred Words People Use Most](https://gist.github.com/JanMiksovsky/77ffbb4d0805f1a09ac5bfe80b057cc3) from his book [Thing Explainer](https://xkcd.com/thing-explainer/), with the exception of the same swear words he omitted; it also omits number words like "one" and "two" since you can write those with numbers.

If you can write something using Monroe's [Simple Writer](https://xkcd.com/simplewriter/), you can generally write it in Emojese.

The Emojese definitions can be found in the tab-delimited [emojese.txt](./data/emojese.txt) file. You can also view a [spreadsheet snapshot](https://docs.google.com/spreadsheets/d/1lB-XmWmzeb6bkNbfVQobhuh0aK4BVmlLOxQ78JZQJKk/edit#gid=425780240) of the definitions.

## Experimental emoji

There are [many common words without obvious emoji](docs/Challenges.md). Emoji sentences would be much clearer if there were more emoji for common words for abstract things such as pronouns, prepositions, and actions. The Emojese application includes experimental emoji that could fill that role.

# Contributing

You can [propose or request a definition](https://docs.google.com/forms/d/1-TFomAkbYQyJSD6b-8vi-jDbahqxcg53DqtLmdo940A/). For other contributions, please submit a pull request. Please recognize that an emoji definition that seems obvious or perfect to you may not be so clear to other people.

See the [guidelines for representing words with emojis](docs/Guidelines.md).

You're welcome to submit alternatives for words that already have definitions if you feel you've found an emoji sequence that might be clearer.

## Languages

If you're a native/fluent speaker of a language other than English, and would be interested in coming up with translations for that language, please get in touch with [Jan Miksovsky](https://fosstodon.org/@JanMiksovsky). It would be very interesting to try using Emojese to exchange messages between people who don't share a common natural language.
