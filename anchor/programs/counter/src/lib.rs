use anchor_lang::prelude::*;
use std::str;

declare_id!("EGYo4TaUmnsxosJaKxVGSUzXNmw6XSsZxMzpG4bdpDYR");

#[program]
pub mod hangman_game {
    use super::*;

    pub fn start_game(ctx: Context<StartGame>, word: String, max_wrong_guesses: u8) -> Result<()> {
        let hangman = &mut ctx.accounts.hangman;
        hangman.is_initialized = true;
        hangman.word = word.to_lowercase();
        hangman.word_length = hangman.word.len() as u8;
        hangman.max_wrong_guesses = max_wrong_guesses;
        hangman.wrong_guesses = 0;
        hangman.guessed_letters = vec![0; hangman.word_length as usize];
        hangman.is_game_over = false;
        Ok(())
    }

    pub fn make_guess(ctx: Context<MakeGuess>, letter: u8) -> Result<()> {
        let hangman = &mut ctx.accounts.hangman;

        if hangman.is_game_over {
          return Err(ErrorCode::GameOver.into());
        }

        // Ensure the guess is a lowercase alphabet character
        if !((b'a'..=b'z').contains(&letter)) {
            return Err(ProgramError::InvalidArgument.into());
        }

        let mut correct_guess = false;
        let word_bytes = hangman.word.as_bytes().to_vec();

        // First pass: Check if the letter is in the word
        for &c in word_bytes.iter() {
            if c == letter {
                correct_guess = true;
                break;
            }
        }

        // Second pass: Update the guessed letters
        if correct_guess {
            for (i, &c) in word_bytes.iter().enumerate() {
                if c == letter {
                    hangman.guessed_letters[i] = letter;
                }
            }
        } else {
            hangman.wrong_guesses += 1;
        }

        if hangman.wrong_guesses >= hangman.max_wrong_guesses {
          hangman.is_game_over = true;
          msg!("Game Over! Too many wrong guesses.");
        }

        if hangman.guessed_letters.iter().all(|&c| c != 0) {
            msg!("Congratulations! You guessed the word.");
        }

        Ok(())
    }

}

#[derive(Accounts)]
pub struct StartGame<'info> {
    #[account(init, payer = user, space = 1024)]
    pub hangman: Account<'info, Hangman>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MakeGuess<'info> {
    #[account(mut)]
    pub hangman: Account<'info, Hangman>,
}


#[account]
pub struct Hangman {
    pub is_initialized: bool,
    pub word: String,
    pub word_length: u8,
    pub max_wrong_guesses: u8,
    pub wrong_guesses: u8,
    pub guessed_letters: Vec<u8>,
    pub is_game_over: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The game is over.")]
    GameOver,
}