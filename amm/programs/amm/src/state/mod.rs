

#[account]

#[derived(INIT_SPACE)]
pub struct Config {
  pub seed: u64,
  pub fees: u16,
  pub mint_x: Pubkey,
  pub mint_y: Pubkey,
  pub lp_bump: u8,
  pub bump: u8
}