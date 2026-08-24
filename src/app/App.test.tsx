import { fireEvent, render, screen } from '@testing-library/react'
import { App } from './App'

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '#dashboard'
    window.localStorage.clear()
  })

  it('renders the companion title and Prestige navigation target', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Dwarf Eats Mountain Companion' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Prestige' })).toBeInTheDocument()
  })

  it('updates the current page when the hash route changes to Prestige', () => {
    render(<App />)

    window.location.hash = '#prestige'
    fireEvent(window, new HashChangeEvent('hashchange'))

    expect(screen.getByRole('heading', { name: 'Prestige Planner' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Prestige' })).toHaveAttribute('aria-current', 'page')
  })

  it('keeps the original interface as the default and switches previews without changing routes', () => {
    window.location.hash = '#prestige'
    render(<App />)

    const shell = screen.getByRole('main')
    expect(shell).toHaveAttribute('data-visual-mode', 'original')
    expect(screen.getByRole('button', { name: 'Original interface' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByText('Standalone companion preview')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Game-inspired preview' }))

    expect(shell).toHaveAttribute('data-visual-mode', 'game-inspired')
    expect(screen.getByRole('button', { name: 'Game-inspired preview' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Standalone companion preview')).toBeInTheDocument()
    expect(screen.getByText('Selected upgrade details')).toBeInTheDocument()
    expect(screen.getByText('Scroll routes')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Prestige Planner' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Prestige' })).toHaveAttribute('aria-current', 'page')

    fireEvent.click(screen.getByRole('button', { name: 'Original interface' }))

    expect(shell).toHaveAttribute('data-visual-mode', 'original')
    expect(screen.queryByText('Standalone companion preview')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Prestige Planner' })).toBeInTheDocument()
  })

  it('creates a local default profile only when the browser profile vault is empty', async () => {
    render(<App />)

    expect(await screen.findByText('Main Expedition')).toBeInTheDocument()
    expect(window.localStorage.getItem('dwarf-mountain-companion:profiles:v1')).toContain('Main Expedition')
  })

  it('persists Prestige rank edits across a remount', async () => {
    window.location.hash = '#prestige'
    const firstRender = render(<App />)
    const swiftStart = await screen.findByRole('button', { name: /Swift Start.*Rank 0 of 3/ })
    fireEvent.click(swiftStart)
    expect(screen.getByRole('button', { name: /Swift Start.*Rank 1 of 3/ })).toBeInTheDocument()

    firstRender.unmount()
    render(<App />)
    expect(await screen.findByRole('button', { name: /Swift Start.*Rank 1 of 3/ })).toBeInTheDocument()
  })
})
