import React, { ReactNode } from 'react'

type Props = {
    children?: ReactNode
    onClose?: () => void
    title?: string
    subtitle?: string
}

export default function Modal({ children, onClose, title, subtitle }: Props) {
    return (
        <div className="modal__wrapper">
            <div className="modal__container">
                <div className="modal__header">
                    <div className="modal__titles">
                        <h1 className="modal__title">{title}</h1>
                        <h2 className="modal__subtitle">{subtitle}</h2>
                    </div>
                    <button className="modal__close" onClick={onClose}>X</button>
                </div>
                <div className="modal__content">
                    {children}
                </div>
            </div>
        </div>
    )
}