'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Asset } from '@/lib/types/forge'

interface Props {
  assets: Asset[]
  onClose: () => void
  isMobile: boolean
}

export default function FinancesOverlay({ assets, onClose, isMobile }: Props) {
  // Get all assets with finances data
  const assetsWithFinances = useMemo(() => {
    return assets.filter(a => a.finances && a.finances.transactions.length > 0)
  }, [assets])

  // Calculate monthly stats for each asset and totals
  const { monthlyStats, totals } = useMemo(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    const stats = assetsWithFinances.map(asset => {
      const txs = asset.finances!.transactions.filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear
      })

      const revenue = txs.filter(t => t.type === 'revenue').reduce((s, t) => s + t.amount, 0)
      const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

      return {
        asset,
        revenue,
        expenses,
        net: revenue - expenses,
      }
    })

    const totalRevenue = stats.reduce((s, st) => s + st.revenue, 0)
    const totalExpenses = stats.reduce((s, st) => s + st.expenses, 0)

    return {
      monthlyStats: stats,
      totals: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        net: totalRevenue - totalExpenses,
      },
    }
  }, [assetsWithFinances])

  // Calculate last 3 months for sparkline
  const sparklineData = useMemo(() => {
    const data: number[] = []
    const now = new Date()

    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = d.getMonth()
      const year = d.getFullYear()

      let revenue = 0
      let expenses = 0

      assetsWithFinances.forEach(asset => {
        asset.finances!.transactions.forEach(t => {
          const txDate = new Date(t.date)
          if (txDate.getMonth() === month && txDate.getFullYear() === year) {
            if (t.type === 'revenue') revenue += t.amount
            else expenses += t.amount
          }
        })
      })

      data.push(revenue - expenses)
    }

    return data
  }, [assetsWithFinances])

  const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(n)
  }

  // Simple sparkline SVG
  const Sparkline = ({ data }: { data: number[] }) => {
    if (data.length < 2) return null

    const min = Math.min(...data, 0)
    const max = Math.max(...data, 0)
    const range = max - min || 1

    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - ((v - min) / range) * 100
      return `${x},${y}`
    })

    const color = data[data.length - 1] >= 0 ? '#22c55e' : '#ef4444'

    return (
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: '100%', height: 40, opacity: 0.6 }}
      >
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(6,6,14,0.95)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        padding: isMobile ? '16px' : '24px 32px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '0.5px solid #1A1A24',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 9,
              color: '#444440',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              margin: '0 0 4px',
            }}
          >
            Finances Overview
          </p>
          <p
            style={{
              fontFamily: 'var(--font-syne)',
              fontSize: isMobile ? 18 : 22,
              fontWeight: 700,
              color: '#F5F5F0',
              margin: 0,
            }}
          >
            This Month
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 10,
            color: '#444440',
            background: 'none',
            border: '0.5px solid #1A1A24',
            borderRadius: 4,
            padding: '8px 14px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>

      {/* Totals */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <TotalBox
          label="Total Revenue"
          value={formatCurrency(totals.revenue)}
          color="#22c55e"
          isMobile={isMobile}
        />
        <TotalBox
          label="Total Expenses"
          value={formatCurrency(totals.expenses)}
          color="#ef4444"
          isMobile={isMobile}
        />
        {!isMobile && (
          <TotalBox
            label="Net"
            value={formatCurrency(totals.net)}
            color={totals.net >= 0 ? '#E8FF47' : '#ef4444'}
            isMobile={isMobile}
            large
          />
        )}
      </div>

      {isMobile && (
        <TotalBox
          label="Net"
          value={formatCurrency(totals.net)}
          color={totals.net >= 0 ? '#E8FF47' : '#ef4444'}
          isMobile={isMobile}
          large
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Sparkline */}
      {sparklineData.some(d => d !== 0) && (
        <div
          style={{
            background: '#0D0D0D',
            border: '0.5px solid #1A1A24',
            borderRadius: 6,
            padding: '12px 16px',
            marginBottom: 24,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 8,
              color: '#444440',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              margin: '0 0 8px',
            }}
          >
            Last 3 Months Trend
          </p>
          <Sparkline data={sparklineData} />
        </div>
      )}

      {/* Per-asset breakdown */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <p
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 8,
            color: '#444440',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: '0 0 12px',
          }}
        >
          By Asset
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {monthlyStats.map(({ asset, revenue, expenses, net }) => (
            <div
              key={asset.id}
              style={{
                background: '#0D0D0D',
                border: '0.5px solid #1A1A24',
                borderRadius: 5,
                padding: isMobile ? '12px 14px' : '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background:
                    asset.assetClass === 'A'
                      ? '#E8FF47'
                      : asset.assetClass === 'B'
                        ? '#EF9F27'
                        : '#444440',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#F5F5F0',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {asset.name}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 8,
                    color: '#444440',
                    margin: '2px 0 0',
                  }}
                >
                  Class {asset.assetClass} · {asset.finances!.transactions.length} transactions
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 11,
                    color: net >= 0 ? '#22c55e' : '#ef4444',
                    margin: 0,
                  }}
                >
                  {net >= 0 ? '+' : ''}
                  {formatCurrency(net)}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 7,
                    color: '#333330',
                    margin: '2px 0 0',
                  }}
                >
                  {formatCurrency(revenue)} / {formatCurrency(expenses)}
                </p>
              </div>
            </div>
          ))}

          {monthlyStats.length === 0 && (
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 13,
                color: '#333330',
                textAlign: 'center',
                padding: '40px 0',
                fontStyle: 'italic',
              }}
            >
              No financial data yet. Add transactions in asset details.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function TotalBox({
  label,
  value,
  color,
  isMobile,
  large,
  style,
}: {
  label: string
  value: string
  color: string
  isMobile: boolean
  large?: boolean
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        background: '#0D0D0D',
        border: '0.5px solid #1A1A24',
        borderRadius: 6,
        padding: isMobile ? '14px 16px' : '12px 16px',
        ...style,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: 8,
          color: '#444440',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: '0 0 6px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: large ? (isMobile ? 18 : 22) : isMobile ? 14 : 16,
          color,
          margin: 0,
          fontWeight: large ? 700 : 500,
        }}
      >
        {value}
      </p>
    </div>
  )
}
