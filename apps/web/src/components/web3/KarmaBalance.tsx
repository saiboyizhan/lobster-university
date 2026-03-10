"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS, KARMA_TOKEN_ABI } from "@/lib/web3";
import { formatUnits } from "viem";

export default function KarmaBalance() {
  const { address, isConnected } = useAccount();

  const { data: balance } = useReadContract({
    address: CONTRACTS.karmaToken as `0x${string}`,
    abi: KARMA_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!CONTRACTS.karmaToken },
  });

  if (!isConnected || !CONTRACTS.karmaToken) {
    return null;
  }

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="text-sm text-zinc-500">On-Chain KARMA</div>
      <div className="text-2xl font-bold text-zinc-900 dark:text-white">
        {balance ? formatUnits(balance, 18) : "0"}
      </div>
    </div>
  );
}
