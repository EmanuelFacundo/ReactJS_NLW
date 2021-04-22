import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { GetStaticProps } from "next"
import Link from "next/link"
import Image from "next/image"
import { useContext } from "react"

import { api } from "../service/api"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"
import { PlayerContext } from "../context/PlayerContext"

import styles from "./home.module.scss"

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  published_at: string;
}

type HomeProps = {
  latesEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>
}

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {
  
  const { play } = useContext(PlayerContext)

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latesEpisodes.map(episodes => {
            return (
              <li key={episodes.id}>
                <Image
                  width={192}
                  height={192}
                  src={episodes.thumbnail}
                  alt={episodes.title}
                  objectFit="cover" />

                <div className={styles.episodesDetails}>
                  <Link href={`/episodes/${episodes.id}`}>
                    <a>{episodes.title}</a>
                  </Link>
                  <p>{episodes.members}</p>
                  <span>{episodes.published_at}</span>
                  <span>{episodes.durationAsString}</span>
                </div>
                <button type="button" onClick={() => play(episodes)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                     <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.published_at}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api('episodes', {
    params: {
      _limit: 12,
      _order: 'desc',
      _sort: 'published_at'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })

  const latesEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latesEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }

}
