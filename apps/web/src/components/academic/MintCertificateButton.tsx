"use client";

import { useAccount } from "wagmi";
import { useEffect, useCallback } from "react";
import { useMintCertificate } from "@/hooks/useContractWrite";
import { CONTRACTS } from "@/lib/web3";

interface Props {
  certificateId: string;
  title: string;
  level?: number;
  score?: number;
  txHash?: string | null;
}

export default function MintCertificateButton({
  certificateId,
  title,
  level = 1,
  score = 8000,
  txHash,
}: Props) {
  const { address, isConnected } = useAccount();
  const { mint, hash, isPending, isConfirming, isSuccess, error } = useMintCertificate();

  // Save txHash back to DB after successful mint
  const saveTxHash = useCallback(async (newHash: string) => {
    await fetch("/api/certificates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ certificateId, txHash: newHash }),
    });
  }, [certificateId]);

  useEffect(() => {
    if (isSuccess && hash) {
      saveTxHash(hash);
    }
  }, [isSuccess, hash, saveTxHash]);

  // Already minted
  if (txHash) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 dark:bg-green-950">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-green-700 dark:text-green-300">
          On-Chain Verified
        </span>
      </div>
    );
  }

  // Wallet not connected or contract not configured
  if (!isConnected || !CONTRACTS.certificateNFT) {
    return (
      <button
        disabled
        className="cursor-not-allowed rounded-lg bg-zinc-200 px-4 py-2 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
      >
        Connect wallet to mint on-chain
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => address && mint(address, title, level, score)}
        disabled={isPending || isConfirming}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
          isPending || isConfirming
            ? "cursor-wait bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {isPending
          ? "Confirm in wallet..."
          : isConfirming
            ? "Confirming..."
            : "Mint to Blockchain"}
      </button>
      {isSuccess && hash && (
        <p className="mt-2 text-xs text-green-600">
          Minted! TX: {hash.slice(0, 10)}...
        </p>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-500">
          {error.message.slice(0, 100)}
        </p>
      )}
    </div>
  );
}
