"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS, CERTIFICATE_NFT_ABI } from "@/lib/web3";

function CertificateItem({ tokenId }: { tokenId: bigint }) {
  const { data: certData } = useReadContract({
    address: CONTRACTS.certificateNFT as `0x${string}`,
    abi: CERTIFICATE_NFT_ABI,
    functionName: "getCertificate",
    args: [tokenId],
    query: { enabled: !!CONTRACTS.certificateNFT },
  });

  const cert = certData as { skillName: string; level: number; score: number; timestamp: bigint } | undefined;

  const levelLabels = ["", "Novice", "Beginner", "Intermediate", "Advanced", "Expert", "Master"];

  return (
    <div className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-lg dark:bg-purple-900">
        🎓
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-zinc-900 dark:text-white">
          {cert?.skillName ?? `Certificate #${Number(tokenId)}`}
        </div>
        <div className="text-xs text-zinc-400">
          {cert ? (
            <>
              {levelLabels[cert.level] ?? `Level ${cert.level}`} · Score: {(cert.score / 100).toFixed(0)}%
            </>
          ) : (
            "Soulbound NFT"
          )}
        </div>
      </div>
    </div>
  );
}

export default function CertificateGallery() {
  const { address, isConnected } = useAccount();

  const { data: balance } = useReadContract({
    address: CONTRACTS.certificateNFT as `0x${string}`,
    abi: CERTIFICATE_NFT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!CONTRACTS.certificateNFT },
  });

  const { data: tokenIds } = useReadContract({
    address: CONTRACTS.certificateNFT as `0x${string}`,
    abi: CERTIFICATE_NFT_ABI,
    functionName: "tokensOfOwner",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!CONTRACTS.certificateNFT },
  });

  if (!isConnected || !CONTRACTS.certificateNFT) {
    return null;
  }

  const count = balance ? Number(balance) : 0;
  const ids = (tokenIds as bigint[]) ?? [];

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
        NFT Certificates ({count})
      </h3>
      {count === 0 ? (
        <p className="text-sm text-zinc-500">
          No on-chain certificates yet. Complete courses and mint your certificates to the blockchain.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {ids.map((tokenId) => (
            <CertificateItem key={String(tokenId)} tokenId={tokenId} />
          ))}
        </div>
      )}
    </div>
  );
}
