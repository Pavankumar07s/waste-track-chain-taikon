import { ScrollText } from '../molecules/ScrollText';
import { PlantIcon } from '../atoms/PlantIcon';

export interface ILogoProps {}

export const Logo = ({}: ILogoProps) => {
  return (
    <div className="relative flex items-center gap-3 p-2 bg-white/80 rounded-lg shadow-md m-auto">
      <PlantIcon  />

      <div className="text-xl font-semibold text-gray-800">
        <div>Waste Track Chain</div>
        <div className="text-xs text-gray-500">Sustainable Tracking Solutions</div>
      </div>

      <div className="absolute top-1/2 left-full transform -translate-y-1/2 pl-3">
        <ScrollText
          items={[
            'Web3',
            'Dapp',
            'On-chain',
          ]}
          className="px-3 py-1 text-xs font-semibold text-gray-800 border border-gray-300 rounded shadow-lg bg-white/50 backdrop-blur-sm whitespace-nowrap m-auto"
        />
      </div>
    </div>
  );
};
