// SFX constants removed as they are unused
// const SFX_HOVER = 'data:audio/wav;base64,...';
// const SFX_TYPE = 'data:audio/mp3;base64,...';
/* const SFX = {
    HOVER: '',
    CLICK: '',
    ERROR: '',
    SUCCESS: '',
    TYPE: '',
    ACCESS: '',
}; */

export const useGameSounds = () => {
    // Return empty functions so app doesn't crash but no error is logged
    const playHover = () => { };
    const playClick = () => { };
    const playError = () => { };
    const playSuccess = () => { };
    const playType = () => { };
    const playAccess = () => { };

    // Prevent unused variable lint errors by using them in a dummy way if needed, or just commenting out.
    // For now, let's just export them or comment them out to satisfy linter.
    // console.log(SFX_HOVER, SFX_TYPE); 

    return { playHover, playClick, playError, playSuccess, playType, playAccess };
};
