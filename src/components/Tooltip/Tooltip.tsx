import React, { useEffect, useRef, useState } from 'react'

type Props = {
    tooltip?: string
    children?: React.ReactNode
    inline?: boolean
    style?: React.CSSProperties
    boxStyle?: React.CSSProperties
}

export default function Tooltip({ tooltip, children, inline, style, boxStyle }: Props) {
    const [showTooltip, setShowTooltip] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [childrenWidth, setChildrenWidth] = useState(0)
    const [childrenHeight, setChildrenHeight] = useState(0)

    useEffect(() => {
        const updateClientSize = () => {
            if (containerRef.current) {
                setChildrenWidth(containerRef.current.getBoundingClientRect().width)
                setChildrenHeight(containerRef.current.getBoundingClientRect().height)
            }
        }
        updateClientSize()
        window.addEventListener('resize', updateClientSize)
        return () => {
            window.removeEventListener('resize', updateClientSize)
        }
    }, [children])

    return (
        <div
            className="tooltip__container"
            style={{ ...style, placeContent: inline ? '' : 'center' }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            ref={containerRef}>
            {children}
            <div className={inline ? 'tooltip__box-inline' : 'tooltip__box'} style={{
                display: showTooltip ? 'block' : 'none',
                marginLeft: inline ? childrenWidth * 1.1 : '',
                top: !inline ? childrenHeight * -2.5 : '',
                marginTop: inline ? childrenHeight / 10 : '',
                ...boxStyle
            }}>
                <p className={inline ? 'tooltip__text-inline' : 'tooltip__text'} >
                    {tooltip}
                </p>
            </div>
        </div>
    )
}
