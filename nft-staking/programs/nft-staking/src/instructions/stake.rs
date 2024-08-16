use anchor_lang::prelude::*;

use crate::state::{StakeAccount, StakeConfig, UserAccount};

#[derive(Accounts)]
pub struct Stake<'info> {
  #[account(mut)]
  pub user: Signer<'info>,
  pub mint: Account<'info, Mint>,
  pub collection: Account<'info, Mint>,
  #[account(
    mut,
  )]
  pub mint_ata: Account<'info, TokenAccount>
  #[account(
    seeds = [
      b"metadata",
      metadata_program.key().as_ref(),
      mint.key().as_ref(),
    ],
    seeds::program = metadata_program.key(),
    constraint = metadata.collection.as_ref().unwrap().key().as_ref() == collection.key().as_ref(),
    constraint = metadata.collection.as_ref().unwrap().verified == true,
    bump,
  )]
  pub metadata: Account<'info, MetadataAccount>,
  #[account(
    seeds = [
      b"metadata",
      metadata_program.key().as_ref(),
      mint.key().as_ref(),
      b"edition"
    ],
    seeds::program = metadata_program.key(),
    bump,
  )]
  pub edition: Account<'info, MasterEditionAccount>,
  pub config: Account<'info, StakeConfig>,
  #[account(
    mut,
    seeds = [b"user".as_ref(), user.key().as_ref()]
    bump = user_account.bump,
  )]
  pub user_account: Account<'info, UserAccount>,
  #[account(
    init,
    payer = user,
    space = StakeAccount::INIT_SPACE,
    seeds = [b"stake".as_ref(), mint.key().as_ref(), config.key().as_ref()]
    // bump = stake_account.bump,
  )]
  pub stake_account: Account<'info, UserAccount>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub metadata_program: Program<'info, Metadata>,
}

impl<'info> Stake<'info> {
  pub fn stake(&mut self, bumps: &StateBumps) -> Result<()> {
    let cpi_program = self.token_program.to_account_info();
    let cpi_accounts = Approve {
      to: self.mint_ata.to_account_info(),
      delegate: self.stake_account.to_account_info(),
      authority: self.user.to_account_info(),
    }

    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    approve(cpi_ctx, 1)?;

    let delegate = &self.stake_account.to_account_info();
    let token_account = &self.mint_ata.to_account_info();
    let edition = &self.edition.to_account_info();
    let token_program = &self.token_program.to_account_info();
    let metadata_program = &self.metadata_program.to_account_info();

    FreezeDelegateAccountCpi::new(
      metadata_program,
      FreezeDelegateAccountCpiAccounts {
        delegate,
        token_account,
        edition,
        mint,
        token_program
      }
    ).invoke()?;

    self.stake_account.set_inner(StakeAccount {
      owner: self.user.key(),
      mint: self.mint.key(),
      last_update: Clock::get()?.unix_timestamp,
      bumps: bumps.stake_account,
    });

    self.user_account.amount_staked += 1;

    Ok(())
      
  }
}