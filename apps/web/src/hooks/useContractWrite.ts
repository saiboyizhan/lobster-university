"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, CERTIFICATE_NFT_ABI, KARMA_TOKEN_ABI } from "@/lib/web3";

export function useMintCertificate() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  function mint(to: `0x${string}`, skillName: string, level: number, score: number) {
    if (!CONTRACTS.certificateNFT) return;
    writeContract({
      address: CONTRACTS.certificateNFT as `0x${string}`,
      abi: CERTIFICATE_NFT_ABI,
      functionName: "issueCertificate",
      args: [to, skillName, level, score],
    });
  }

  return { mint, hash, isPending, isConfirming, isSuccess, error };
}

export function useMintKarma() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  function mint(to: `0x${string}`, amount: bigint, reason: string) {
    if (!CONTRACTS.karmaToken) return;
    writeContract({
      address: CONTRACTS.karmaToken as `0x${string}`,
      abi: KARMA_TOKEN_ABI,
      functionName: "mint",
      args: [to, amount, reason],
    });
  }

  return { mint, hash, isPending, isConfirming, isSuccess, error };
}
