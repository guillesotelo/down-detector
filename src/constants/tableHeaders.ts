export const systemHeaders = [
    {
        name: 'UPDATED',
        value: 'updatedAt'
    },
    {
        name: 'NAME',
        value: 'name'
    },
    {
        name: 'URL',
        value: 'url'
    },
    {
        name: 'TYPE',
        value: 'type'
    },
    // {
    //     name: 'DESCRIPTION',
    //     value: 'description'
    // },
    {
        name: 'TIMEOUT',
        value: 'timeout'
    },
    {
        name: 'INTERVAL',
        value: 'interval'
    },
    // {
    //     name: 'CREATED BY',
    //     value: 'createdBy'
    // },
    {
        name: 'MODIFIED BY',
        value: 'updatedBy'
    },
    {
        name: 'IS ACTIVE',
        value: 'active'
    },
]

export const downtimeHeaders = [
    {
        name: 'START',
        value: 'start'
    },
    {
        name: 'END',
        value: 'end'
    },
    {
        name: 'UPDATED BY',
        value: 'updatedBy'
    },
    {
        name: 'NOTE',
        value: 'note'
    },
]

export const timeoutDefaultOptions = [
    {
        name: '10 seconds',
        value: 10000
    }
]

export const intervalDefaultOptions = [
    {
        name: 'Unspecified',
        value: 600000
    },
    {
        name: '1 minute',
        value: 60000
    },
    {
        name: '5 minutes',
        value: 300000
    },
    {
        name: '10 minutes',
        value: 600000
    },
    {
        name: '30 minutes',
        value: 1800000
    },
    {
        name: '1 hour',
        value: 3600000
    },
]