import React, { useContext } from 'react'
import { AppContext } from '../../AppContext'
import { APP_COLORS } from '../../constants/app'

type Props = {
    label?: string
    className?: string
    bgColor?: string
    textColor?: string
    handleClick: () => any
    disabled?: boolean
    svg?: string
    style?: { [key: string | number]: any }
}

export default function Button({ label, handleClick, className, bgColor, textColor, disabled, svg, style }: Props) {
    const { darkMode } = useContext(AppContext)
   
    return svg ?
        <div
            className="button__default"
            onClick={handleClick}
            style={{
                ...style,
                backgroundColor: bgColor || APP_COLORS.BLUE_ONE,
                color: textColor || 'black',
                opacity: disabled ? '.3' : '',
                padding: '.2vw',
                cursor: disabled ? 'not-allowed' : '',
                display: 'flex',
                flexDirection: 'row',
                minHeight: '2rem',
                alignItems: 'center',
                gap: '.5rem',
                paddingInline: '.5rem'
            }}
        >
            <img src={svg} alt="Button" className='button__svg' />
            {label || ''}
        </div>
        :
        <button
            className={className || 'button__default'}
            onClick={handleClick}
            style={{
                ...style,
                backgroundColor: bgColor || APP_COLORS.BLUE_ONE,
                color:  !textColor && darkMode ? 'lightgray' : textColor || 'black',
                opacity: disabled ? '.3' : '',
                cursor: disabled ? 'not-allowed' : ''
            }}
            disabled={disabled}
        >
            {label || ''}
        </button>

}