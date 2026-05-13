'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Asset, ATIClient, ATIProject, Transaction } from '@/lib/types/forge'

interface Props {
  asset: Asset
  onUpdate: (id: string, patch: Partial<Asset>) => void
  isMobile: boolean
}

// ATI Color Palette — Rich, vibrant, distinct from monochrome Forge
const ATI_COLORS = {
  // Priority colors
  high: { bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)', text: '#fff', glow: 'rgba(255,107,107,0.4)' },
  medium: { bg: 'linear-gradient(135deg, #feca57 0%, #ff9f43 100%)', text: '#1a1a2e', glow: 'rgba(254,202,87,0.4)' },
  low: { bg: 'linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)', text: '#fff', glow: 'rgba(72,219,251,0.4)' },
  
  // Client status colors
  active: '#1dd1a1',
  paused: '#feca57',
  negotiating: '#4169e1',
  completed: '#54a0ff',
  
  // Project status colors
  'in-progress': '#54a0ff',
  delivered: '#5f27cd',
  cancelled: '#576574',
  
  // Type colors
  'one-time': '#ff9ff3',
  retainer: '#f368e0',
  
  // Accents - Royal Blue to Deep Purple theme
  cardBg: 'linear-gradient(145deg, #0a1628 0%, #0d1b2a 100%)',
  headerBg: 'linear-gradient(135deg, #0038a8 0%, #002a7f 50%, #1a0a3e 100%)',
  income: '#00d2d3',
  projected: '#ff9f43',
  surface: '#2d3436',
  border: 'rgba(255,255,255,0.08)',
}

const PRIORITY_LABELS = { high: 'High Priority', medium: 'Medium Priority', low: 'Low Priority' }
const STATUS_LABELS = { negotiating: 'Negotiating', 'in-progress': 'In Progress', delivered: 'Delivered', completed: 'Completed', cancelled: 'Cancelled' }
const TYPE_LABELS = { 'one-time': 'One-Time', retainer: 'Retainer' }

export default function ATIOperations({ asset, onUpdate, isMobile }: Props) {
  const [activeTab, setActiveTab] = useState<'clients' | 'pipeline' | 'transactions'>('clients')
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAddProject, setShowAddProject] = useState<string | null>(null)
  const [showCompleteModal, setShowCompleteModal] = useState<{ clientId: string; projectId: string } | null>(null)
  
  // Form states
  const [newClient, setNewClient] = useState<Partial<ATIClient>>({
    name: '',
    priority: 'medium',
    requirements: '',
    status: 'negotiating',
  })
  const [newProject, setNewProject] = useState<Partial<ATIProject>>({
    name: '',
    description: '',
    projectedIncome: 0,
    type: 'one-time',
    status: 'negotiating',
  })
  const [completionAmount, setCompletionAmount] = useState('')

  const ati = asset.ati || { clients: [] }
  const finances = asset.finances || { transactions: [] }

  // Stats
  const stats = useMemo(() => {
    let totalProjected = 0
    let totalActual = 0
    let activeClients = 0
    let inProgressProjects = 0
    
    ati.clients.forEach(client => {
      if (client.status === 'active') activeClients++
      client.projects.forEach(project => {
        totalProjected += project.projectedIncome
        totalActual += project.actualIncome
        if (project.status === 'in-progress') inProgressProjects++
      })
    })
    
    return { totalProjected, totalActual, activeClients, inProgressProjects }
  }, [ati])

  const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(n)
  }

  // Actions
  const addClient = () => {
    if (!newClient.name) return
    const client: ATIClient = {
      id: `client-${Date.now()}`,
      name: newClient.name!,
      priority: newClient.priority as ATIClient['priority'],
      requirements: newClient.requirements || '',
      status: newClient.status as ATIClient['status'],
      projects: [],
      createdAt: new Date().toISOString(),
    }
    onUpdate(asset.id, { ati: { clients: [...ati.clients, client] } })
    setShowAddClient(false)
    setNewClient({ name: '', priority: 'medium', requirements: '', status: 'negotiating' })
  }

  const addProject = (clientId: string) => {
    if (!newProject.name) return
    const project: ATIProject = {
      id: `project-${Date.now()}`,
      name: newProject.name!,
      description: newProject.description,
      projectedIncome: newProject.projectedIncome || 0,
      actualIncome: 0,
      status: newProject.status as ATIProject['status'],
      type: newProject.type as ATIProject['type'],
      startDate: new Date().toISOString().split('T')[0],
    }
    
    const updatedClients = ati.clients.map(c => 
      c.id === clientId 
        ? { ...c, projects: [...c.projects, project] }
        : c
    )
    onUpdate(asset.id, { ati: { clients: updatedClients } })
    setShowAddProject(null)
    setNewProject({ name: '', description: '', projectedIncome: 0, type: 'one-time', status: 'negotiating' })
  }

  const updateProjectStatus = (clientId: string, projectId: string, newStatus: ATIProject['status']) => {
    if (newStatus === 'completed') {
      setShowCompleteModal({ clientId, projectId })
      return
    }
    
    const updatedClients = ati.clients.map(c => 
      c.id === clientId 
        ? { ...c, projects: c.projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p) }
        : c
    )
    onUpdate(asset.id, { ati: { clients: updatedClients } })
  }

  const completeProject = () => {
    if (!showCompleteModal || !completionAmount) return
    const amount = parseFloat(completionAmount)
    
    // Update project with actual income
    const updatedClients = ati.clients.map(c => 
      c.id === showCompleteModal.clientId 
        ? { 
            ...c, 
            projects: c.projects.map(p => 
              p.id === showCompleteModal.projectId 
                ? { ...p, status: 'completed' as const, actualIncome: amount }
                : p
            )
          }
        : c
    )
    
    // Add transaction
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'revenue',
      amount,
      description: `Payment for project completion`,
      date: new Date().toISOString().split('T')[0],
    }
    
    onUpdate(asset.id, { 
      ati: { clients: updatedClients },
      finances: { transactions: [transaction, ...finances.transactions] }
    })
    
    setShowCompleteModal(null)
    setCompletionAmount('')
  }

  const deleteClient = (clientId: string) => {
    onUpdate(asset.id, { ati: { clients: ati.clients.filter(c => c.id !== clientId) } })
  }

  const deleteProject = (clientId: string, projectId: string) => {
    const updatedClients = ati.clients.map(c => 
      c.id === clientId 
        ? { ...c, projects: c.projects.filter(p => p.id !== projectId) }
        : c
    )
    onUpdate(asset.id, { ati: { clients: updatedClients } })
  }

  return (
    <div style={{ marginTop: 8 }}>
      {/* Header Stats */}
      <div style={{
        background: ATI_COLORS.headerBg,
        borderRadius: 12,
        padding: isMobile ? '16px' : '20px',
        marginBottom: 16,
        boxShadow: '0 8px 32px rgba(102,126,234,0.3)',
      }}>
        <p style={{
          fontFamily: 'var(--font-syne)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.7)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          margin: '0 0 12px',
        }}>
          Applied Technology Integration
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: 12,
        }}>
          <StatPill 
            label="Pipeline" 
            value={formatCurrency(stats.totalProjected)} 
            color={ATI_COLORS.projected}
            isMobile={isMobile}
          />
          <StatPill 
            label="Collected" 
            value={formatCurrency(stats.totalActual)} 
            color={ATI_COLORS.income}
            isMobile={isMobile}
          />
          <StatPill 
            label="Active Clients" 
            value={stats.activeClients.toString()} 
            color="#fff"
            isMobile={isMobile}
          />
          <StatPill 
            label="In Progress" 
            value={stats.inProgressProjects.toString()} 
            color={ATI_COLORS['in-progress']}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
        borderBottom: `1px solid ${ATI_COLORS.border}`,
        paddingBottom: 8,
      }}>
        {(['clients', 'pipeline', 'transactions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === tab ? 'rgba(0,56,168,0.25)' : 'transparent',
              color: activeTab === tab ? '#4169e1' : '#888',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              margin: 0,
            }}>
              Client Portfolio
            </p>
            <button
              onClick={() => setShowAddClient(true)}
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 9,
                color: '#fff',
                background: 'linear-gradient(135deg, #0038a8 0%, #002a7f 100%)',
                border: 'none',
                borderRadius: 6,
                padding: '8px 14px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,56,168,0.4)',
              }}
            >
              + New Client
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {ati.clients.map(client => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    background: ATI_COLORS.cardBg,
                    borderRadius: 12,
                    border: `1px solid ${ATI_COLORS.border}`,
                    overflow: 'hidden',
                  }}
                >
                  {/* Client Header */}
                  <div
                    onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                    style={{
                      padding: isMobile ? '14px 16px' : '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: ATI_COLORS[client.priority].bg,
                      boxShadow: `0 0 12px ${ATI_COLORS[client.priority].glow}`,
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontFamily: 'var(--font-syne)',
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#fff',
                        margin: '0 0 4px',
                      }}>
                        {client.name}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-jetbrains-mono)',
                        fontSize: 8,
                        color: '#888',
                        margin: 0,
                      }}>
                        {client.projects.length} projects · {PRIORITY_LABELS[client.priority]}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-jetbrains-mono)',
                      fontSize: 8,
                      padding: '4px 10px',
                      borderRadius: 4,
                      background: ATI_COLORS[client.status],
                      color: '#fff',
                      textTransform: 'uppercase',
                    }}>
                      {client.status}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-jetbrains-mono)',
                      fontSize: 10,
                      color: '#4169e1',
                      transform: expandedClient === client.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>
                      ▼
                    </span>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedClient === client.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{
                          padding: isMobile ? '0 16px 16px' : '0 20px 20px',
                          borderTop: `1px solid ${ATI_COLORS.border}`,
                        }}
                      >
                        {/* Requirements */}
                        <div style={{ padding: '12px 0' }}>
                          <p style={{
                            fontFamily: 'var(--font-jetbrains-mono)',
                            fontSize: 7,
                            color: '#888',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            margin: '0 0 6px',
                          }}>
                            Requirements
                          </p>
                          <p style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: 12,
                            color: '#ccc',
                            margin: 0,
                            lineHeight: 1.5,
                          }}>
                            {client.requirements || 'No requirements documented'}
                          </p>
                        </div>

                        {/* Projects */}
                        <div style={{ marginTop: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <p style={{
                              fontFamily: 'var(--font-jetbrains-mono)',
                              fontSize: 8,
                              color: '#888',
                              textTransform: 'uppercase',
                              margin: 0,
                            }}>
                              Projects
                            </p>
                            <button
                              onClick={() => setShowAddProject(client.id)}
                              style={{
                                fontFamily: 'var(--font-jetbrains-mono)',
                                fontSize: 8,
                                color: '#4169e1',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              + Add Project
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {client.projects.map(project => (
                              <div
                                key={project.id}
                                style={{
                                  background: 'rgba(0,0,0,0.2)',
                                  borderRadius: 8,
                                  padding: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <p style={{
                                    fontFamily: 'var(--font-syne)',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: '#fff',
                                    margin: '0 0 4px',
                                  }}>
                                    {project.name}
                                  </p>
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span style={{
                                      fontFamily: 'var(--font-jetbrains-mono)',
                                      fontSize: 7,
                                      padding: '2px 6px',
                                      borderRadius: 3,
                                      background: ATI_COLORS[project.type],
                                      color: '#fff',
                                    }}>
                                      {TYPE_LABELS[project.type]}
                                    </span>
                                    <span style={{
                                      fontFamily: 'var(--font-jetbrains-mono)',
                                      fontSize: 9,
                                      color: ATI_COLORS.projected,
                                    }}>
                                      Projected: {formatCurrency(project.projectedIncome)}
                                    </span>
                                    {project.actualIncome > 0 && (
                                      <span style={{
                                        fontFamily: 'var(--font-jetbrains-mono)',
                                        fontSize: 9,
                                        color: ATI_COLORS.income,
                                      }}>
                                        Collected: {formatCurrency(project.actualIncome)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <select
                                  value={project.status}
                                  onChange={(e) => updateProjectStatus(client.id, project.id, e.target.value as ATIProject['status'])}
                                  style={{
                                    fontFamily: 'var(--font-jetbrains-mono)',
                                    fontSize: 8,
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    border: 'none',
                                    background: ATI_COLORS[project.status],
                                    color: '#fff',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {Object.keys(STATUS_LABELS).map(s => (
                                    <option key={s} value={s}>{STATUS_LABELS[s as keyof typeof STATUS_LABELS]}</option>
                                  ))}
                                </select>
                                
                                <button
                                  onClick={() => deleteProject(client.id, project.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#666',
                                    fontSize: 16,
                                    cursor: 'pointer',
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            
                            {client.projects.length === 0 && (
                              <p style={{
                                fontFamily: 'var(--font-dm-sans)',
                                fontSize: 12,
                                color: '#666',
                                fontStyle: 'italic',
                                textAlign: 'center',
                                padding: '20px',
                              }}>
                                No projects yet. Add one to start tracking.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Delete Client */}
                        <button
                          onClick={() => deleteClient(client.id)}
                          style={{
                            marginTop: 16,
                            fontFamily: 'var(--font-jetbrains-mono)',
                            fontSize: 8,
                            color: '#ff6b6b',
                            background: 'none',
                            border: '1px solid rgba(255,107,107,0.3)',
                            borderRadius: 4,
                            padding: '6px 12px',
                            cursor: 'pointer',
                          }}
                        >
                          Delete Client
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {ati.clients.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 14,
                  color: '#666',
                  margin: '0 0 16px',
                }}>
                  No clients yet. Start building your portfolio.
                </p>
                <button
                  onClick={() => setShowAddClient(true)}
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 10,
                    color: '#4169e1',
                    background: 'none',
                    border: '1px solid rgba(65,105,225,0.4)',
                    borderRadius: 6,
                    padding: '10px 20px',
                    cursor: 'pointer',
                  }}
                >
                  Add Your First Client
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div>
          <p style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 14,
            fontWeight: 600,
            color: '#fff',
            margin: '0 0 16px',
          }}>
            Income Pipeline
          </p>
          
          <div style={{
            background: ATI_COLORS.cardBg,
            borderRadius: 12,
            padding: 20,
            border: `1px solid ${ATI_COLORS.border}`,
          }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 8,
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 8px',
              }}>
                Total Projected Income
              </p>
              <p style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 32,
                fontWeight: 700,
                color: ATI_COLORS.projected,
                margin: 0,
              }}>
                {formatCurrency(stats.totalProjected)}
              </p>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <p style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 8,
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 8px',
              }}>
                Total Collected
              </p>
              <p style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 32,
                fontWeight: 700,
                color: ATI_COLORS.income,
                margin: 0,
              }}>
                {formatCurrency(stats.totalActual)}
              </p>
            </div>
            
            <div>
              <p style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 8,
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 8px',
              }}>
                Outstanding Pipeline
              </p>
              <p style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 24,
                fontWeight: 600,
                color: stats.totalProjected - stats.totalActual > 0 ? '#fff' : '#666',
                margin: 0,
              }}>
                {formatCurrency(stats.totalProjected - stats.totalActual)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div>
          <p style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 14,
            fontWeight: 600,
            color: '#fff',
            margin: '0 0 16px',
          }}>
            Transaction History
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {finances.transactions.map(tx => (
              <div
                key={tx.id}
                style={{
                  background: ATI_COLORS.cardBg,
                  borderRadius: 8,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: `1px solid ${ATI_COLORS.border}`,
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: tx.type === 'revenue' ? ATI_COLORS.income : '#ff6b6b',
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: 13,
                    color: '#fff',
                    margin: 0,
                  }}>
                    {tx.description}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 8,
                    color: '#888',
                    margin: '2px 0 0',
                  }}>
                    {tx.date}
                  </p>
                </div>
                <p style={{
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: tx.type === 'revenue' ? ATI_COLORS.income : '#ff6b6b',
                  margin: 0,
                }}>
                  {tx.type === 'revenue' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
            
            {finances.transactions.length === 0 && (
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 13,
                color: '#666',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '30px',
              }}>
                No transactions yet. Complete a project to record payments.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddClient && (
          <Modal onClose={() => setShowAddClient(false)} isMobile={isMobile}>
            <p style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 18,
              fontWeight: 600,
              color: '#fff',
              margin: '0 0 20px',
            }}>
              New Client
            </p>
            
            <Input
              label="Client Name"
              value={newClient.name || ''}
              onChange={v => setNewClient({ ...newClient, name: v })}
              placeholder="e.g., Acme Corporation"
            />
            
            <Select
              label="Priority"
              value={newClient.priority}
              onChange={v => setNewClient({ ...newClient, priority: v as ATIClient['priority'] })}
              options={[
                { value: 'high', label: 'High Priority' },
                { value: 'medium', label: 'Medium Priority' },
                { value: 'low', label: 'Low Priority' },
              ]}
            />
            
            <Select
              label="Status"
              value={newClient.status}
              onChange={v => setNewClient({ ...newClient, status: v as ATIClient['status'] })}
              options={[
                { value: 'negotiating', label: 'Negotiating' },
                { value: 'active', label: 'Active' },
                { value: 'paused', label: 'Paused' },
              ]}
            />
            
            <TextArea
              label="Requirements"
              value={newClient.requirements || ''}
              onChange={v => setNewClient({ ...newClient, requirements: v })}
              placeholder="What does this client need?"
            />
            
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowAddClient(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: `1px solid ${ATI_COLORS.border}`,
                  borderRadius: 6,
                  color: '#888',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={addClient}
                disabled={!newClient.name}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: !newClient.name ? 'rgba(0,56,168,0.2)' : 'linear-gradient(135deg, #0038a8 0%, #002a7f 100%)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 10,
                  cursor: !newClient.name ? 'default' : 'pointer',
                  boxShadow: !newClient.name ? 'none' : '0 4px 15px rgba(0,56,168,0.4)',
                }}
              >
                Add Client
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddProject && (
          <Modal onClose={() => setShowAddProject(null)} isMobile={isMobile}>
            <p style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 18,
              fontWeight: 600,
              color: '#fff',
              margin: '0 0 20px',
            }}>
              New Project
            </p>
            
            <Input
              label="Project Name"
              value={newProject.name || ''}
              onChange={v => setNewProject({ ...newProject, name: v })}
              placeholder="e.g., Website Redesign"
            />
            
            <TextArea
              label="Description"
              value={newProject.description || ''}
              onChange={v => setNewProject({ ...newProject, description: v })}
              placeholder="Brief description of the project"
            />
            
            <Input
              label="Projected Income (₦)"
              type="number"
              value={newProject.projectedIncome?.toString() || ''}
              onChange={v => setNewProject({ ...newProject, projectedIncome: parseFloat(v) || 0 })}
              placeholder="500000"
            />
            
            <Select
              label="Type"
              value={newProject.type}
              onChange={v => setNewProject({ ...newProject, type: v as ATIProject['type'] })}
              options={[
                { value: 'one-time', label: 'One-Time Project' },
                { value: 'retainer', label: 'Monthly Retainer' },
              ]}
            />
            
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowAddProject(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: `1px solid ${ATI_COLORS.border}`,
                  borderRadius: 6,
                  color: '#888',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => addProject(showAddProject)}
                disabled={!newProject.name}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: !newProject.name ? 'rgba(0,56,168,0.2)' : 'linear-gradient(135deg, #0038a8 0%, #002a7f 100%)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 10,
                  cursor: !newProject.name ? 'default' : 'pointer',
                  boxShadow: !newProject.name ? 'none' : '0 4px 15px rgba(0,56,168,0.4)',
                }}
              >
                Add Project
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Complete Project Modal */}
      <AnimatePresence>
        {showCompleteModal && (
          <Modal onClose={() => setShowCompleteModal(null)} isMobile={isMobile}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 24,
              }}>
                ✓
              </div>
              <p style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 18,
                fontWeight: 600,
                color: '#fff',
                margin: '0 0 8px',
              }}>
                Project Completed!
              </p>
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 13,
                color: '#888',
                margin: 0,
              }}>
                Record the actual payment received
              </p>
            </div>
            
            <Input
              label="Payment Amount (₦)"
              type="number"
              value={completionAmount}
              onChange={setCompletionAmount}
              placeholder="Enter amount received"
              autoFocus
            />
            
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowCompleteModal(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: `1px solid ${ATI_COLORS.border}`,
                  borderRadius: 6,
                  color: '#888',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                Skip
              </button>
              <button
                onClick={completeProject}
                disabled={!completionAmount}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: !completionAmount ? 'rgba(29,209,161,0.2)' : 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 10,
                  cursor: !completionAmount ? 'default' : 'pointer',
                  boxShadow: !completionAmount ? 'none' : '0 4px 15px rgba(29,209,161,0.3)',
                }}
              >
                Record Payment
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// Sub-components
function StatPill({ label, value, color, isMobile }: { label: string; value: string; color: string; isMobile: boolean }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
      padding: isMobile ? '10px' : '12px',
    }}>
      <p style={{
        fontFamily: 'var(--font-jetbrains-mono)',
        fontSize: 7,
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        margin: '0 0 4px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-jetbrains-mono)',
        fontSize: isMobile ? 11 : 13,
        fontWeight: 600,
        color,
        margin: 0,
      }}>
        {value}
      </p>
    </div>
  )
}

function Modal({ children, onClose, isMobile }: { children: React.ReactNode; onClose: () => void; isMobile: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 16 : 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: ATI_COLORS.cardBg,
          borderRadius: 16,
          padding: isMobile ? '24px 20px' : '32px 28px',
          width: '100%',
          maxWidth: 400,
          border: `1px solid ${ATI_COLORS.border}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text', autoFocus }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  autoFocus?: boolean
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-jetbrains-mono)',
        fontSize: 8,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 6,
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%',
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid ${ATI_COLORS.border}`,
          borderRadius: 6,
          padding: '10px 12px',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: 14,
          color: '#fff',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

function Select({ label, value, onChange, options }: {
  label: string
  value?: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-jetbrains-mono)',
        fontSize: 8,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 6,
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid ${ATI_COLORS.border}`,
          borderRadius: 6,
          padding: '10px 12px',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: 14,
          color: '#fff',
          outline: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-jetbrains-mono)',
        fontSize: 8,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 6,
      }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          width: '100%',
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid ${ATI_COLORS.border}`,
          borderRadius: 6,
          padding: '10px 12px',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: 14,
          color: '#fff',
          outline: 'none',
          resize: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}