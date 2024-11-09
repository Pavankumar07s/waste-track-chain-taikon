import { IconLeaf } from '@tabler/icons-react';

export const PlantIcon = () => {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg cursor-pointer bg-gradient-to-br from-green-400 via-green-200 to-green-50 shadow-green-400/30">
      <IconLeaf size={24} className="text-green-600" />
    </div>
  );
}
