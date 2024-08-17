/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/hangman_game.json`.
 */
export type HangmanGame = {
  "address": "4u6yGzkFDTA62nicP8EGe8B8hn1SGuAwQ3o32iEcE9D6",
  "metadata": {
    "name": "hangmanGame",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "makeGuess",
      "discriminator": [
        59,
        189,
        219,
        87,
        240,
        211,
        125,
        101
      ],
      "accounts": [
        {
          "name": "hangman",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "letter",
          "type": "u8"
        }
      ]
    },
    {
      "name": "startGame",
      "discriminator": [
        249,
        47,
        252,
        172,
        184,
        162,
        245,
        14
      ],
      "accounts": [
        {
          "name": "hangman",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "word",
          "type": "string"
        },
        {
          "name": "maxWrongGuesses",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "hangman",
      "discriminator": [
        116,
        122,
        37,
        159,
        15,
        0,
        22,
        169
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "gameOver",
      "msg": "The game is over."
    }
  ],
  "types": [
    {
      "name": "hangman",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "word",
            "type": "string"
          },
          {
            "name": "wordLength",
            "type": "u8"
          },
          {
            "name": "maxWrongGuesses",
            "type": "u8"
          },
          {
            "name": "wrongGuesses",
            "type": "u8"
          },
          {
            "name": "guessedLetters",
            "type": "bytes"
          },
          {
            "name": "wrongGuessedLetters",
            "type": "bytes"
          },
          {
            "name": "isGameOver",
            "type": "bool"
          },
          {
            "name": "isGameWon",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
