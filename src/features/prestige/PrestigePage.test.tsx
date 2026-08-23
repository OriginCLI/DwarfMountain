import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { createEmptyProfile } from '../../domain/profile'
import { PrestigePage } from './PrestigePage'

function renderPlanner() {
  const profile = createEmptyProfile({
    id: 'test',
    name: 'Test Expedition',
    gameDataVersion: 'build 24333424',
    now: '2026-08-23T00:00:00.000Z',
  })
  const updates: typeof profile[] = []
  function Harness() {
    const [currentProfile, setCurrentProfile] = useState(profile)
    return (
      <PrestigePage
        profile={currentProfile}
        onProfileChange={(next) => {
          updates.push(next)
          setCurrentProfile(next)
        }}
      />
    )
  }
  render(<Harness />)
  return { profile, updates }
}

describe('PrestigePage', () => {
  it('renders all six tiers and all 102 current-build nodes', () => {
    renderPlanner()

    expect(screen.getAllByRole('heading', { name: /Tier \d/ })).toHaveLength(6)
    expect(screen.getAllByRole('button', { name: /Rank \d/ })).toHaveLength(102)
  })

  it('increments, shift-increments, caps, and decrements ranks', () => {
    const { updates } = renderPlanner()
    const swiftStart = screen.getByRole('button', { name: /Swift Start.*Rank 0 of 3/ })

    fireEvent.click(swiftStart)
    expect(updates.at(-1)?.prestigeRanks.p_start_runners).toBe(1)

    fireEvent.click(swiftStart, { shiftKey: true })
    expect(updates.at(-1)?.prestigeRanks.p_start_runners).toBe(3)

    fireEvent.contextMenu(swiftStart)
    expect(updates.at(-1)?.prestigeRanks.p_start_runners).toBe(2)

    fireEvent.click(screen.getByRole('button', { name: 'Decrease Swift Start rank' }))
    expect(updates.at(-1)?.prestigeRanks.p_start_runners).toBe(1)
    expect(screen.getByRole('tooltip')).toHaveTextContent('Start the game with 1 runners.')
  })

  it('fills a row left-to-right with Ctrl+Shift+click', () => {
    const { updates } = renderPlanner()
    fireEvent.click(screen.getByRole('button', { name: /Swift Start.*Rank 0 of 3/ }), {
      ctrlKey: true,
      shiftKey: true,
    })

    const ranks = updates.at(-1)?.prestigeRanks ?? {}
    expect(ranks.p_start_runners).toBe(3)
    expect(ranks.p_start_gold_per_tier).toBe(1)
  })

  it('updates available PP and exposes exact tooltip data on focus', () => {
    const { updates } = renderPlanner()
    fireEvent.change(screen.getByLabelText('Available Prestige Points'), { target: { value: '28' } })
    expect(updates.at(-1)?.meta.availablePrestigePoints).toBe(28)

    fireEvent.focus(screen.getByRole('button', { name: /Swift Start.*Rank 0 of 3/ }))
    expect(screen.getByRole('tooltip')).toHaveTextContent('Start the game with 1/2/3 runners.')
    expect(screen.getByRole('tooltip')).toHaveTextContent('Next rank cost 1 PP')
    expect(screen.getByRole('tooltip')).toHaveTextContent('Installed build 24333424')
  })

  it('locks tiers until their exact spent thresholds are met', () => {
    renderPlanner()

    const lockedNode = screen.getByRole('button', { name: /Cyberdwarf.*Locked.*12 PP spent/ })
    expect(lockedNode).toHaveAttribute('aria-disabled', 'true')
    fireEvent.focus(lockedNode)
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tier 2 unlocks at 12 PP spent')
    expect(screen.getByText('Tier 2 unlocks at 12 PP spent')).toBeInTheDocument()
  })

  it('shows Ascension-scaled purchase caps from installed effect data', () => {
    const { updates } = renderPlanner()
    fireEvent.change(screen.getByLabelText('Ascension Rank'), { target: { value: '2' } })
    expect(updates.at(-1)?.meta.ascensionRank).toBe(2)

    fireEvent.focus(screen.getByRole('button', { name: /Endless Invocations.*Rank 0 of 2/ }))
    expect(screen.getByRole('tooltip')).toHaveTextContent('Rank 0 / 2')
    expect(screen.getByRole('tooltip')).toHaveTextContent('Purchase limit: 1 per Ascension Rank, 15 maximum.')
  })
})
