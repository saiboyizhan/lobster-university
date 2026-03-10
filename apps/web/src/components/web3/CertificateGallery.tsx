"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS, CERTIFICATE_NFT_ABI } from "@/lib/web3";

export default function CertificateGallery() {
  const { address, isConnected } = useAccount();

  const { data: balance } = useReadContract({
    address: CONTRACTS.certificateNFT as `0x${string}`,
    abi: CERTIFICATE_NFT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!CONTRACTS.certificateNFT },
  });

  if (!isConnected || !CONTRACTS.certificateNFT) {
    return null;
  }

  const count = balance ? Number(balance) : 0;

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
        NFT Certificates
      </h3>
      {count === 0 ? (
        <p className="text-sm text-zinc-500">No certificates yet. Complete the 7-step guide to earn your first.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-lg dark:bg-purple-900">
                🎓
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-white">
                  Certificate #{i + 1}
                </div>
                <div className="text-xs text-zinc-400">Soulbound NFT</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
