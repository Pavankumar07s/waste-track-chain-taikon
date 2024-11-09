import { useAccount } from '@recycle-chain/util/src/hooks/ether';
import { BaseComponent } from '@recycle-chain/util/src/types';
import Image from 'next/image';
import clsx from 'clsx';

export const UserInfo = ({ className, children }: BaseComponent) => {
  const { account, balance, isOwner } = useAccount();

  return (
    <div className={clsx("p-4 rounded-lg shadow-lg bg-white/80", className)}>
      <div className="flex items-center  gap-4">
        <Image
          src="/user-pattern.jpg"
          width={300}
          height={300}
          alt="User Avatar"
          className="rounded-full w-16 h-16 border-2 border-blue-200 shadow-sm"
        />

        <div className="flex flex-col">
          <span className="text-gray-700 text-sm sm:text-base font-semibold break-all">
            {account}
          </span>
          {isOwner && (
            <span className="mt-1 inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-full shadow-md">
              Contract Owner
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-br w-auto from-gray-50 to-gray-100 p-4 rounded-lg shadow-inner text-center">
        <div className="text-sm font-semibold text-gray-600">Balance</div>
        <p className="text-blue-600 font-bold text-2xl">
          {Number(balance).toFixed(4)} POL
        </p>
      </div>
    </div>
  );
};
