import React, { ReactNode, useContext } from 'react'
import { AppContext } from '../../AppContext'

type Props = {
    children?: ReactNode
    onClose?: () => void
    title?: string | null
    subtitle?: string | null
    style?: React.CSSProperties
}

export default function Modal({ children, onClose, title, subtitle, style }: Props) {
    const { darkMode } = useContext(AppContext)

    return (
        <div className="modal__wrapper">
            <div className={`modal__container${darkMode ? '--dark' : ''}`} style={style}>
                <div className="modal__header">
                    <div className="modal__titles">
                        <h1 className="modal__title">{title}</h1>
                        <h2 className="modal__subtitle">{subtitle}</h2>
                    </div>
                    <button className={`modal__close${darkMode ? '--dark' : ''}`} onClick={onClose}>X</button>
                </div>
                <div className="modal__content">
                    {children}
                </div>
            </div>
        </div>
    )
}