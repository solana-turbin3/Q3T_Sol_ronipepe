use anchor_lang::prelude::*;

pub mod state;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod amm {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, seed: u64, fee: u16, amount_x: u64, amount_y: u64) -> Result<()> {
        ctx.accounts.save_config(seed, fee, ctx.bumps.config, ctx.bumps.mint_lp)?;
        ctx.accounts.deposit(amount_x, true)?;
        ctx.accounts.deposit(amount_y, false)?;
        ctx.accounts.mint_lp_tokens(amount_x, amount_y);
        Ok(())
    }

    // Add liquidity to receive LP tokens
    pub fn deposit(ctx: Context<Deposit>, amount: u64, max_x: u64, max_y: u64) -> Result<()> {
        // deposit_token_x
        // deposit_token_y
        // mint_lp_token(amount)
        Ok(())
    }

    // Add liquidity to receive LP tokens
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64, min_x: u64, min_y: u64) -> Result<()> {
        // deposit_token_x
        // deposit_token_y
        // mint_lp_token(amount)
        Ok(())
    }

    pub fn swap(ctx: Context<Swap>, amount: u64, min_receive: u64, is_x: bool, expiration: i64) -> Result<()> {

        Ok(())
    }
}

