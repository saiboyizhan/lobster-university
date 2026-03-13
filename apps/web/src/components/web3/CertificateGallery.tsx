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
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
        <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 0 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a23.838 23.838 0 0 0-1.012 5.434c0 .03.005.06.01.09a49.39 49.39 0 0 1 8.744 4.033 49.393 49.393 0 0 1 8.745-4.032c.004-.031.01-.062.01-.091a23.836 23.836 0 0 0-1.012-5.434m-15.485 0A23.94 23.94 0 0 1 12 3.197a23.94 23.94 0 0 1 7.74 6.95M12 3.197V1.5m0 1.697a23.94 23.94 0 0 0-7.74 6.95" /></svg>
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
