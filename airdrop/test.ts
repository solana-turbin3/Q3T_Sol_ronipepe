import { PublicKey, Connection } from "@solana/web3.js";
import { LeafSchema } from "@metaplex-foundation/mpl-bubblegum";
import { Metaplex } from "@metaplex-foundation/js";
import * as borsh from "@project-serum/borsh";
import bs58 from "bs58";

async function getAssetInfo(assetId: string) {
  try {
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );

    // getAsset RPC 메소드 사용
    // const assetData = await connection.getAsset(new PublicKey(assetId));

    const assetDataResponse: Response = await fetch(
      "https://api.devnet.solana.com",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "my-id",
          method: "getAsset",
          params: {
            id: assetId,
          },
        }),
      }
    );
    const assetDataJson: any = await assetDataResponse.json();
    const assetData = assetDataJson.result;

    const assetProofResponse = await fetch("https://api.devnet.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAssetProof",
        params: {
          id: assetId,
        },
      }),
    });
    const assetProofJson: any = await assetProofResponse.json();
    const assetProof = assetProofJson.result;

    console.log("assetData", assetData);
    console.log("assetProof", assetProof);

    if (!assetData) {
      throw new Error("Asset not found");
    }

    // Compressed NFT 확인
    if (!assetData.compression || !assetData.compression.compressed) {
      throw new Error("Asset is not compressed");
    }

    const root = assetProof.root;
    const dataHash = assetData.compression.data_hash;
    const creatorHash = assetData.compression.creator_hash;
    const nonce = assetData.compression.leaf_id;
    const index = assetData.compression.leaf_id;

    return {
      root,
      data_hash: dataHash,
      creator_hash: creatorHash,
      nonce,
      index,
    };
  } catch (error) {
    console.error("Error fetching asset info:", error);
    throw error;
  }
}

// 사용 예시
async function main() {
  // Anchor 프로바이더 설정

  const assetId = "2FXz7Reatf6WD18iVKuqhKzx9rYHXbBEfJ8Sj2Hb8foF";
  try {
    const assetInfo = await getAssetInfo(assetId);
    console.log("Asset Info:", assetInfo);

    const root = Buffer.from(assetInfo.root, "hex");
    const dataHash = Buffer.from(assetInfo.data_hash, "hex");
    const creatorHash = Buffer.from(assetInfo.creator_hash, "hex");
    const index = assetInfo.index;

    console.log("root1", assetInfo.root);

    console.log("root2", [...root]);

    console.log("root3", bs58.decode(assetInfo.root));

    console.log("root4", base58Decode(assetInfo.root));

    console.log("root5", [...new PublicKey(assetInfo.root.trim()).toBytes()]);
  } catch (error) {
    console.error("Error:", error);
  }
}

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58Decode(string: string): Uint8Array {
  const base = BigInt(58);
  let num = BigInt(0);
  for (let i = 0; i < string.length; i++) {
    num = num * base + BigInt(BASE58_ALPHABET.indexOf(string[i]));
  }

  const bytes = [];
  while (num > BigInt(0)) {
    bytes.unshift(Number(num & BigInt(255)));
    num = num >> BigInt(8);
  }

  // Add leading zeros
  for (let i = 0; i < string.length && string[i] === "1"; i++) {
    bytes.unshift(0);
  }

  return new Uint8Array(bytes);
}

main();
