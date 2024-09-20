import { useContext, useEffect, useState } from 'react'
import { deleteSubscription, getAllSubscriptions } from '../../services'
import { SubscriptionType } from '../../types'
import Button from '../../components/Button/Button'
import { AppContext } from '../../AppContext'
import { APP_COLORS } from '../../constants/app'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

type Props = {}

export default function Unsubscribe({ }: Props) {
    const [loading, setLoading] = useState(false)
    const [systemName, setSystemName] = useState('')
    const [email, setEmail] = useState('')
    const [systemId, setSystemId] = useState('')
    const [subscriberId, setSubscriberId] = useState('')
    const [subs, setSubs] = useState<SubscriptionType[]>([])
    const { darkMode } = useContext(AppContext)
    const history = useHistory()

    useEffect(() => {
        const system = new URLSearchParams(document.location.search).get('system')
        const subEmail = new URLSearchParams(document.location.search).get('subEmail')
        const subId = new URLSearchParams(document.location.search).get('subId')
        const sId = new URLSearchParams(document.location.search).get('sId')

        if (!system || !subEmail || !subId) return history.push('/')

        setSystemName(system || '')
        setEmail(subEmail || '')
        setSubscriberId(subId || '')
        setSystemId(sId || '')

        const getSubs = async () => {
            const _subs = await getAllSubscriptions()
            if (_subs && Array.isArray(_subs)) {
                setSubs(_subs)
            }
        }

        getSubs()
    }, [])

    const unsubscribe = async () => {
        try {
            setLoading(true)
            const unsubscibed = await deleteSubscription({ _id: subscriberId, systemId })
            // const unsubscibed = await deleteSubscription({ _id: '66ed731733229d8230fff406', systemId: '66ed72fc33229d8230fff3a5' })
            if (unsubscibed) {
                setLoading(false)
                toast.success('You are now unsubscribed.')
                setTimeout(() => history.push('/'), 2000)
            } else {
                setLoading(false)
                return toast.error('An error occurred. Please try again.')
            }
        } catch (error) {
            setLoading(false)
            console.error(error)
            toast.error('An error occurred. Please try again.')
        }
    }

    return (
        <div className='unsubscribe__container'>
            <h1>Hi, {email.split('@')[0]}</h1>
            <div className="home__modal-issue-col">
                <h2>You are about to unsubscribe from {systemName}</h2>
            </div>
            {subs.map((s: any) => {
                return <div style={{ border: '1px solid gray', padding: '1rem', borderRadius: '1rem', margin: '.5rem' }}>
                    {Object.keys(s).map(key => key !== 'navigator' && <p><strong>{key}:</strong> {String(s[key])}</p>)}
                </div>
            })
            }
            <div className='unsubscribe__buttons'>
                <Button
                    label='Cancel'
                    handleClick={() => history.push('/')}
                    bgColor={darkMode ? APP_COLORS.GRAY_ONE : APP_COLORS.GRAY_ONE}
                    textColor='white'
                    disabled={loading}
                    style={{ width: '50%' }}
                />
                <Button
                    label='Confirm unsubscription'
                    handleClick={unsubscribe}
                    disabled={loading}
                    bgColor={APP_COLORS.BLUE_TWO}
                    textColor='white'
                    style={{ width: '50%' }}
                />
            </div>
        </div>
    )
}