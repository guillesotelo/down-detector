import React from "react"
import { sortArray } from "../../helpers"
import { dataObj } from "../../types"

type Props = {
    label?: string
    arrData?: dataObj[]
    colors?: { key: string; color: string }[]
    objKey?: string
    percentageFor?: { key: string; value: any }
    style?: React.CSSProperties
}

export default function ProgressBar({ label, arrData, colors, objKey, percentageFor, style }: Props) {

    const getColor = (item: dataObj) => {
        let bg = ""
        if (colors) {
            colors.forEach(c => {
                if (objKey && item[objKey] && item[objKey] === c.key) {
                    bg = c.color
                }
            })
        }
        return bg
    }

    const getPercentage = () => {
        if (colors && colors.length === 2 && arrData && arrData.length && percentageFor) {
            const matchLength = arrData.filter(d => d[percentageFor.key] === percentageFor.value).length
            const result = parseFloat(`${(matchLength * 100 / arrData.length)}`).toFixed(1)
            return (result.split('.')[1] === "0" ? result.split('.')[0] : result) + '%'
        }
        return ''
    }

    return (
        <div className="progressbar__container" style={style}>
            <div className="progressbar__row">
                <p className="progressbar__label">{label || ''}</p>
                {percentageFor ?
                    <p className="progressbar__percentage">{getPercentage()}</p>
                    : ''}
            </div>
            <div className="progressbar__bar">
                {sortArray((arrData || []), objKey || '', true)?.map((d, i) =>
                    <div
                        key={i}
                        style={{
                            background: getColor(d),
                            width: `calc(100% / ${arrData?.length})`
                        }}
                        className="progressbar__step"
                    />
                )}
            </div>
        </div>
    )
}