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

  it('creates a local default profile only when the browser profile vault is empty', async () => {
    render(<App />)

    expect(await screen.findByText('Main Expedition')).toBeInTheDocument()
    expect(window.localStorage.getItem('dwarf-mountain-companion:profiles:v1')).toContain('Main Expedition')
  })
})
