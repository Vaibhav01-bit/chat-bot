import { AVATAR_PRESETS } from '../constants/avatars';

interface AvatarSelectionGridProps {
    selectedAvatar: string | null;
    onSelect: (url: string) => void;
}

export const AvatarSelectionGrid = ({ selectedAvatar, onSelect }: AvatarSelectionGridProps) => {
    return (
        <div className="grid grid-cols-4 gap-3 py-2">
            {AVATAR_PRESETS.map((url) => (
                <button
                    key={url}
                    onClick={() => onSelect(url)}
                    className={`
                        relative w-full aspect-square rounded-full overflow-hidden 
                        border-2 transition-all duration-200
                        ${selectedAvatar === url
                            ? 'border-blue-500 scale-110 shadow-lg ring-2 ring-blue-500/20'
                            : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 hover:scale-105'}
                    `}
                >
                    <img
                        src={url}
                        alt="Avatar preset"
                        loading="lazy"
                        className="w-full h-full object-cover bg-zinc-100 dark:bg-zinc-800"
                    />

                    {/* Selected Checkmark overlay */}
                    {selectedAvatar === url && (
                        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                            {/* Optional checkmark could go here, but the ring is enough */}
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
};
