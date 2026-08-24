import { useEffect, useState } from 'react'
import { createEmptyProfile, type PlayerProfile } from '../domain/profile'
import { prestigeDatabase } from '../data/prestige/installed-build'
import { PrestigePage } from '../features/prestige/PrestigePage'
import { ProfileStore } from '../storage/profileStore'

const pages = [
  { id: 'dashboard', label: 'Dashboard', heading: 'Dwarf Eats Mountain Companion' },
  { id: 'prestige', label: 'Prestige', heading: 'Prestige Planner' },
  { id: 'run-planner', label: 'Run Planner', heading: 'Run Planner' },
  { id: 'current-run', label: 'Current Run', heading: 'Current Run' },
  { id: 'artifacts', label: 'Artifacts', heading: 'Artifact Gallery' },
  { id: 'buildings', label: 'Buildings', heading: 'Building Upgrades' },
  { id: 'progression', label: 'Progression', heading: 'Progression Path' },
  { id: 'database', label: 'Database', heading: 'Game Database' },
  { id: 'settings', label: 'Settings', heading: 'Settings' },
] as const

type RouteId = (typeof pages)[number]['id']

function parseRoute(hash: string): RouteId {
  const candidate = hash.replace(/^#/, '')
  return pages.some((page) => page.id === candidate) ? (candidate as RouteId) : 'dashboard'
}

function useHashRoute(): RouteId {
  const [route, setRoute] = useState<RouteId>(() => parseRoute(window.location.hash))

  useEffect(() => {
    const syncRoute = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', syncRoute)

    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  return route
}

export function App() {
  const route = useHashRoute()
  const [profile, updateProfile] = useActiveProfile()
  const currentPage = pages.find((page) => page.id === route) ?? pages[0]

  return (
    <main className="app-shell">
      <header className="masthead">
        <a className="brand" href="#dashboard" aria-label="Dwarf Eats Mountain Companion home">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>
            <span className="brand-kicker">THE MOUNTAIN EATER'S</span>
            <strong>Dwarf Eats Mountain Companion</strong>
          </span>
        </a>
        <p className="build-stamp">DATA: BUILD {prestigeDatabase.game.steamBuildId} · ORDER CHECKED 24 AUG 2026</p>
      </header>

      <div className={`app-frame ${route === 'prestige' ? 'app-frame--prestige' : ''}`}>
        <nav className="rail" aria-label="Companion navigation">
          <p className="rail-label">EXPEDITION BOARD</p>
          <ul>
            {pages.map((page) => {
              const isCurrent = page.id === route
              return (
                <li key={page.id}>
                  <a href={`#${page.id}`} aria-current={isCurrent ? 'page' : undefined}>
                    <span aria-hidden="true">{page.id === 'prestige' ? '◆' : '·'}</span>
                    {page.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {route === 'dashboard' ? (
          <Dashboard profileName={profile?.name ?? 'Opening profile vault…'} />
        ) : route === 'prestige' && profile !== null ? (
          <PrestigePage profile={profile} onProfileChange={updateProfile} />
        ) : (
          <PlaceholderPage page={currentPage} />
        )}
      </div>
    </main>
  )
}

function useActiveProfile(): [PlayerProfile | null, (profile: PlayerProfile) => void] {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)

  useEffect(() => {
    const store = new ProfileStore(window.localStorage)
    const activeProfile = store.ensureDefault(
      createEmptyProfile({
        id: 'local-main',
        name: 'Main Expedition',
        gameDataVersion: 'build 24333424',
        now: new Date().toISOString(),
      }),
    )

    setProfile(activeProfile)
  }, [])

  const updateProfile = (nextProfile: PlayerProfile) => {
    new ProfileStore(window.localStorage).upsert(nextProfile)
    setProfile(nextProfile)
  }

  return [profile, updateProfile]
}

function Dashboard({ profileName }: { profileName: string }) {
  return (
    <section className="command-deck" id="dashboard" aria-labelledby="companion-title">
      <div className="rune-line" aria-hidden="true" />
      <p className="eyebrow">LOCAL-FIRST BUILD PLANNER</p>
      <h1 id="companion-title">Dwarf Eats Mountain Companion</h1>
      <p className="deck-copy">
        A source-aware notebook for your permanent upgrades, live run decisions, and first-Ascension route.
      </p>

      <div className="readiness-grid" aria-label="Current companion readiness">
        <article>
          <span className="status-gem status-gem--green" aria-hidden="true" />
          <p>PRESTIGE DATA</p>
          <strong>102 installed-build upgrades</strong>
          <small>Ranks, costs, gates, and effects verified; live display order verified for Tiers 1–5. Tier 6 awaits unlock.</small>
        </article>
        <article>
          <span className="status-gem status-gem--green" aria-hidden="true" />
          <p>PROFILE VAULT</p>
          <strong>{profileName}</strong>
          <small>Versioned local persistence keeps this companion independent of any server.</small>
        </article>
      </div>

      <a className="primary-route" href="#prestige">
        <span aria-hidden="true">◆</span>
        Open Prestige planner
      </a>
    </section>
  )
}

function PlaceholderPage({ page }: { page: (typeof pages)[number] }) {
  const isPrestige = page.id === 'prestige'

  return (
    <section className="command-deck route-panel" id={page.id} aria-labelledby="route-title">
      <div className="rune-line" aria-hidden="true" />
      <p className="eyebrow">{isPrestige ? 'PERMANENT UPGRADE LEDGER' : 'COMPANION MODULE'}</p>
      <h1 id="route-title">{page.heading}</h1>
      <p className="deck-copy">
        {isPrestige
          ? 'The complete build-specific tree will appear here after current ranks, costs, requirements, and positions are verified.'
          : 'This route is reserved in the foundation so its future data and interactions can remain independent from the Prestige planner.'}
      </p>
      <a className="primary-route" href="#dashboard">Return to dashboard</a>
    </section>
  )
}
