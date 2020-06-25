import TimeAgo from 'javascript-time-ago'
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)

class Utility {
    timeAgo: TimeAgo
    constructor() {
        this.timeAgo = new TimeAgo('en-US')

    }

    getTimeText = (seconds: number) => {
        const dateForm = new Date(seconds)
        return this.timeAgo.format(dateForm)
    }
}

export { Utility }
