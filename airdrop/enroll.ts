import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
const readline = require("readline");
const bs58 = require("bs58");
import { IDL, WbaPrereq } from "./programs/wba_prereq";
// import wallet from "./wba-wallet.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your base58 string: ", async (base58: string) => {
  try {
    const wallet = bs58.decode(base58);
    console.log(wallet);

    // We're going to import our keypair from the wallet file
    const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
    // Create a devnet connection
    const connection = new Connection("https://api.devnet.solana.com");

    // Github account
    const github = Buffer.from("renovj", "utf8");

    // Create our anchor provider
    const provider = new AnchorProvider(connection, new Wallet(keypair), {
      commitment: "confirmed",
    });

    // Create our program
    const program: Program = new Program(IDL, provider);

    // Create the PDA for our enrollment account
    const enrollment_seeds = [
      Buffer.from("prereq"),
      keypair.publicKey.toBuffer(),
    ];
    const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
      enrollment_seeds,
      program.programId
    );

    try {
      const txhash = await program.methods
        .complete(github)
        .accounts({
          signer: keypair.publicKey,
        })
        .signers([keypair])
        .rpc();
      console.log(`Success! Check out your TX here:
      https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
      console.error(`Oops, something went wrong: ${e}`);
    }
  } catch (error) {
    console.error("Error decoding base58:", error);
  } finally {
    rl.close();
  }
});
