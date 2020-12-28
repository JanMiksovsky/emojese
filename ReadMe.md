**Emojese** is a modest but earnest effort to explore the construction of a written language using emoji.

When this project began in late 2020, there was no widely-accepted grammar for communicating complex thoughts in emoji. Emoji statements have been generally limited to expressing emotions, rebuses, or simple ideas directly expressible with the large but fixed vocabulary of existing emoji. Communicating ideas purely in standard emoji is made difficult by the fact that there are few or no emoji for many common verbs, pronouns, adjectives, prepositions, or abstract ideas.

Emojese is one attempt at an emoji language rich enough for interesting communication. Emojese defines a small but flexible set of grammatical constructions and standardized meanings for specific emoji. To make it easy for you to write and read messages, the Emojese app at [emojese.org](https://emojese.org) lets you convert text (currently, English) to Emojese and back.

# Goals

1. **Let people have fun.** It's fun for friends to express more complex thoughts entirely in emoji in texts/chats.
2. **Serve as a potentially practical means of transmitting complex ideas** between two parties who do not share a common natural language. Examples: a traveler writes a foreign apartment rental owner a question about room accommodations; an airport posts signage in emoji so a wider range of visitors can understand them.

# Principles

## Be natural

- Strive for easy recognition and recall. Try to minimize the amount of what must be learned.
- Be a natural extension of current emoji use.
- Start with basic words friends use in text messages.
- Be usable on existing devices. Pick emoji already in use (or arriving imminently). Use emoji as is; they cannot be rotated, resized, etc.

## Be inclusive

- The intended audience is global.
- The initial audience is English speakers in the United States, because one has to start somewhere. When possible, avoid choices that would only make sense to U.S. speakers.
- Avoid using text to convey meaning. Avoid emoji with words, with the exception of the word “OK” (which is nearly universally understood). Text for proper nouns is fine.
- In cases where gender is irrelevant, use the default “person” emojis rather than gendered alternatives. Messages about specific people can use more specific genders.
- Likewise, generally use the default yellow skin tone. Messages about specific people can use more specific depictions.
- Be family-friendly. It's unclear whether adding entries like 🍆 would actually make this more fun. For now, you can always just type "eggplant" to pick that emoji if you want to include it.

## Evolve naturally

- Prioritize clarity and precision over current ease of typing. Software can catch up to make writing in this language easy.
- Keep in mind that, if the existence of a new emoji would make something substantially easier to express, such an emoji could actually be added someday.
- Grow the set of definitions slowly, ideally based on observed usage.

# Contributing

If there's general interest in this project, we can work out some processes for reviewing and accepting suggestions. For now, submit a pull request. Please recognize that an emoji definition that seems obvious or perfect to you may not be so clear to other people.

## Definitions

Emojese fixes some standard meanings to a list of ~700 common English words. These were drawn from various sources, including the [Swadesh list](https://en.wikipedia.org/wiki/Swadesh_list), the Fluent Forever [625 Base Vocabulary Word List](https://fluent-forever.com/wp-content/uploads/2014/05/625-List-Alphabetical.pdf), and the [National University of Singapore SMS Corpus](https://scholarbank.nus.edu.sg/handle/10635/137343).

The Emojese definitions can be found in the tab-delimited [emojese.txt](./data/emojese.txt) file.

That file also contains common words for which definitions are desired but do not have definitions yet. If you're interested in contributing words, those are a good place to start. As of this writing, words without definitions include:

- already
- body
- brother
- cheap
- easy
- happen
- hope
- interesting
- lake
- main
- poor
- roof
- sister
- sky
- street
- toe
- valley
- wall
- waiter
- whole

You're also welcome to submit alternatives for words that already have definitions if you feel you've found an emoji sequence that might be clearer.

## Choosing emoji

- Consider the full range of Unicode, not just emoji characters.
- Make judicious use of mathematical symbols, including numbers. Recognize that few people will know the precise meaning of obscure mathematical symbols; it's best if the symbols are suggestive of their meanings.
- Reserve arrows for the most common words or constructions. It is tempting to use the hundreds of Unicode arrows to suggest a wide range of actions, but relying too heavily on subtly-different arrows produces visually confusing results.
- Big, obvious distinctions are better than small, subtle ones. When sent in a messaging application, emojis can appear very small, making fine details hard to discern.
- Choose emoji which, if not obvious, are at least recognizable, memorable, and sensible in retrospect. Few people would type 🐛🦋 for “become” on their own, but hopefully in retrospect the choice of those emoji makes sense.
- The more common an idea is, ideally the shorter its emoji expression should be.
- There's no need to reproduce standard emoji definitions. There is no Emojese definition for "cat", for example, because the 🐈 emoji already has the standard English description "cat", and typing "cat" in the app already produces that emoji.
- Be aware that emoji representations vary from platform to platform, which can occasionally present challenges. For example, the contrast in 🏕️⛺ ("near") works well in iOS and other platforms, but poorly in Microsoft Windows.
- [Emojipedia](https://emojipedia.org/) is a reasonably definitive emoji reference.
