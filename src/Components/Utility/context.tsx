import { createContext, useContext } from 'react'
import { Utility } from './utility'

// An App-wide context you can use to provide commonly used helper functions throughout your classes
const UtilityContext = createContext<Utility>({} as Utility)

const useUtility = () => {
    const firebase = useContext(UtilityContext)
    return firebase
}
export { UtilityContext, useUtility }
