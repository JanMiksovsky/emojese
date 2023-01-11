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

You can [contribute or update a definition](https://docs.google.com/forms/d/1-TFomAkbYQyJSD6b-8vi-jDbahqxcg53DqtLmdo940A/). For other contributions, please submit a pull request. Please recognize that an emoji definition that seems obvious or perfect to you may not be so clear to other people.

## Definitions

Emojese fixes some standard meanings to a list of 1000+ common English words. These were drawn from various sources, including the [Swadesh list](https://en.wikipedia.org/wiki/Swadesh_list), the Fluent Forever [625 Base Vocabulary Word List](https://fluent-forever.com/wp-content/uploads/2014/05/625-List-Alphabetical.pdf), and the [National University of Singapore SMS Corpus](https://scholarbank.nus.edu.sg/handle/10635/137343).

Identifying meaningful [emoji for some of the most common words is challenging](docs/Challenges.md).

The Emojese definitions can be found in the tab-delimited [emojese.txt](./data/emojese.txt) file. That file also contains common words for which definitions are desired but do not have definitions yet. If you're interested in contributing words, those are a good place to start. As of this writing, words without definitions include:

- dust
- neck
- pocket
- soil
- stain

You're also welcome to submit alternatives for words that already have definitions if you feel you've found an emoji sequence that might be clearer.

See [Strategies for representing words with emojis](docs/Strategies.md).

## Experimental emoji

Emoji sentences would be much clearer if there were more emoji for common words for abstract things such as pronouns, prepositions, and actions. The Emojese application includes experimental emoji that could fill that role, particularly
for <a href="https://docs.google.com/document/d/1Lkfpwm_BLYZiUEgtFUQ6OXYiLGlM9Jo8j44sR58Xn_I/edit">common words without obvious emoji</a>.

## Languages

If you're a native/fluent speaker of a language other than English, and would be interested in coming up with translations for that language, please file an issue. It would be very interesting to try using Emojese to exchange simple messages between people who don't share a common natural language.
