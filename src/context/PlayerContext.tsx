import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Array<Episode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlayerState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isLooping: boolean;
  toggleLoop: () => void;
  isShuffling: boolean;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }
  
  function toggleLoop() {
    setIsLooping(!isLooping)
  }
  
  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function setPlayerState(state: boolean) {
    setIsPlaying(state)
  }

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
  const hasPrevious = currentEpisodeIndex > 0

  function playNext() {
    if(isShuffling){
      const nextRandom = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandom)
    } else if(hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    } else {
      setCurrentEpisodeIndex
    }
  }
  
  function playPrevious() {
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      isPlaying,
      togglePlay,
      setPlayerState,
      playList,
      playNext,
      playPrevious, 
      hasNext, 
      hasPrevious,
      isLooping,
      toggleLoop,
      isShuffling,
      toggleShuffle,
      clearPlayerState
    }}
    >
      {children}
    </PlayerContext.Provider>

  )

}

export const usePlayer = () => {
  return useContext(PlayerContext)
}