import React from 'react'
// import { Chessboard } from 'react-chessboard'

interface ChessBoardProps {
    fen: string
    orientation: 'white' | 'black'
    onMove: (move: { from: string, to: string, promotion?: string }) => void
    disabled?: boolean
    lastMove?: { from: string, to: string } | null
}

export const ChessBoard: React.FC<ChessBoardProps> = () => {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', color: 'white' }}>
            <p>Chess feature temporarily disabled for deployment</p>
        </div>
    )
}

/* Temporarily disabled for deployment
    function onPieceDrop({ sourceSquare, targetSquare }: { sourceSquare: string, targetSquare: string | null }): boolean {
        if (disabled || !targetSquare) return false
        try {
            onMove({ from: sourceSquare, to: targetSquare, promotion: 'q' }) // Always promote to queen for simplicity
            return true
        } catch (e) {
            return false
        }
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Chessboard
                options={{
                    position: fen,
                    boardOrientation: orientation,
                    onPieceDrop: onPieceDrop,
                    allowDragging: !disabled, // arePiecesDraggable -> allowDragging
                    boardStyle: {
                        borderRadius: '4px',
                    },
                    squareStyles: lastMove ? {
                        [lastMove.from]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
                        [lastMove.to]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
                    } : undefined
                }}
            />
        </div>
    )
*/

